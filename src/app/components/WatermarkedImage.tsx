import { useEffect, useState, useRef } from "react";

interface WatermarkedImageProps {
  src: string;
  alt: string;
  shouldWatermark: boolean;
  className?: string;
  watermarkText?: string;
}

export function WatermarkedImage({
  src,
  alt,
  shouldWatermark,
  className = "",
  watermarkText = "Ava in Frame Photography",
}: WatermarkedImageProps) {
  const [processedSrc, setProcessedSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [corsFailed, setCorsFailed] = useState(false);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    setProcessedSrc(null);
    setCorsFailed(false);

    if (!shouldWatermark) {
      setLoading(false);
      return;
    }

    setLoading(true);

    const img = new Image();
    img.crossOrigin = "anonymous";

    const logoImg = new Image();

    let photoLoaded = false;
    let logoLoaded = false;
    let logoFailed = false;

    const processImages = () => {
      if (!isMounted.current) return;
      if (!photoLoaded || (!logoLoaded && !logoFailed)) return;

      try {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          throw new Error("Could not get 2D context");
        }

        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;

        // Draw original photo
        ctx.drawImage(img, 0, 0);

        ctx.save();

        if (logoLoaded && !logoFailed) {
          // Draw Centered Logo Watermark
          ctx.globalAlpha = 0.55; // 55% opacity is highly visible and secure

          // Scale logo to take up 55% of the image's width
          const scale = (canvas.width * 0.55) / logoImg.naturalWidth;
          const logoWidth = logoImg.naturalWidth * scale;
          const logoHeight = logoImg.naturalHeight * scale;

          const x = (canvas.width - logoWidth) / 2;
          const y = (canvas.height - logoHeight) / 2;

          ctx.drawImage(logoImg, x, y, logoWidth, logoHeight);
        } else {
          // Text Watermark Fallback if logo fails to load
          ctx.fillStyle = "rgba(255, 255, 255, 0.18)";
          ctx.strokeStyle = "rgba(0, 0, 0, 0.08)";
          ctx.lineWidth = 1;

          const fontSize = Math.max(18, Math.floor(canvas.width / 22));
          ctx.font = `600 ${fontSize}px "Space Grotesk", sans-serif`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";

          ctx.translate(canvas.width / 2, canvas.height / 2);
          ctx.rotate(-35 * Math.PI / 180);
          ctx.translate(-canvas.width / 2, -canvas.height / 2);

          const textWidth = ctx.measureText(watermarkText).width;
          const xGap = textWidth * 1.6;
          const yGap = fontSize * 5;

          const startX = -canvas.width * 0.5;
          const endX = canvas.width * 1.5;
          const startY = -canvas.height * 0.5;
          const endY = canvas.height * 1.5;

          for (let y = startY; y < endY; y += yGap) {
            let xOffset = (Math.floor(y / yGap) % 2) * (xGap / 2);
            for (let x = startX + xOffset; x < endX; x += xGap) {
              ctx.fillText(watermarkText, x, y);
              ctx.strokeText(watermarkText, x, y);
            }
          }
        }

        ctx.restore();

        const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
        setProcessedSrc(dataUrl);
        setLoading(false);
      } catch (err) {
        console.warn("Canvas watermarking failed, falling back to CSS overlay:", err);
        setCorsFailed(true);
        setLoading(false);
      }
    };

    img.onload = () => {
      photoLoaded = true;
      processImages();
    };

    img.onerror = () => {
      if (!isMounted.current) return;
      console.warn("CORS/load error on image. Falling back to CSS watermark overlay.");
      setCorsFailed(true);
      setLoading(false);
    };

    logoImg.onload = () => {
      logoLoaded = true;
      processImages();
    };

    logoImg.onerror = () => {
      console.warn("Watermark logo failed to load. Using text fallback.");
      logoFailed = true;
      processImages();
    };

    // Set src AFTER attaching handlers to prevent race conditions with cached images
    img.src = src;
    logoImg.src = "/logo_white-removebg-preview.png";
  }, [src, shouldWatermark, watermarkText]);

  const handlePrevent = (e: React.SyntheticEvent) => {
    e.preventDefault();
  };

  if (!shouldWatermark) {
    return (
      <img
        src={src}
        alt={alt}
        className={className}
        loading="lazy"
      />
    );
  }

  return (
    <div
      className="relative overflow-hidden select-none w-full h-full"
      onContextMenu={handlePrevent}
      onDragStart={handlePrevent}
    >
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-neutral-100 dark:bg-neutral-800 animate-pulse z-10">
          <span className="text-xs text-neutral-400">Loading and securing...</span>
        </div>
      )}

      {corsFailed ? (
        // CSS Fallback rendering when CORS blocks canvas manipulation
        <div className="relative w-full h-full">
          <img
            src={src}
            alt={alt}
            className={`${className} pointer-events-none w-full h-auto`}
            loading="lazy"
          />
          {/* CSS Logo Watermark Overlay */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center select-none bg-transparent">
            <img
              src="/logo_white-removebg-preview.png"
              alt="Watermark logo"
              className="w-1/2 select-none pointer-events-none object-contain"
              style={{ opacity: 0.55 }}
              onError={(e) => {
                // Fallback to text overlay if logo fails in CSS too
                (e.target as HTMLElement).style.display = "none";
              }}
            />
          </div>
        </div>
      ) : (
        // Canvas processed secure image
        processedSrc && (
          <img
            src={processedSrc}
            alt={alt}
            className={`${className} transition-opacity duration-300 w-full h-auto`}
            loading="lazy"
          />
        )
      )}
    </div>
  );
}
