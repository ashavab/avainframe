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
    // Reset state for new image
    setProcessedSrc(null);
    setCorsFailed(false);

    if (!shouldWatermark) {
      setLoading(false);
      return;
    }

    setLoading(true);

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = src;

    img.onload = () => {
      if (!isMounted.current) return;

      try {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          throw new Error("Could not get 2D context");
        }

        // Use natural dimensions of the image
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;

        // Draw original image
        ctx.drawImage(img, 0, 0);

        // Apply tiled diagonal watermark
        ctx.save();
        ctx.fillStyle = "rgba(255, 255, 255, 0.18)";
        ctx.strokeStyle = "rgba(0, 0, 0, 0.08)";
        ctx.lineWidth = 1;

        // Dynamic font size proportional to image size
        const fontSize = Math.max(18, Math.floor(canvas.width / 22));
        ctx.font = `600 ${fontSize}px "Space Grotesk", "Plus Jakarta Sans", sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        const textWidth = ctx.measureText(watermarkText).width;
        // Spacing based on text width and font size
        const xGap = textWidth * 1.6;
        const yGap = fontSize * 5;

        // Rotate context around the center for diagonal watermark
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(-35 * Math.PI / 180);
        ctx.translate(-canvas.width / 2, -canvas.height / 2);

        // Grid ranges larger than canvas to ensure full coverage when rotated
        const startX = -canvas.width * 0.5;
        const endX = canvas.width * 1.5;
        const startY = -canvas.height * 0.5;
        const endY = canvas.height * 1.5;

        for (let y = startY; y < endY; y += yGap) {
          let xOffset = (Math.floor(y / yGap) % 2) * (xGap / 2); // stagger rows
          for (let x = startX + xOffset; x < endX; x += xGap) {
            ctx.fillText(watermarkText, x, y);
            ctx.strokeText(watermarkText, x, y);
          }
        }

        ctx.restore();

        // Convert to high-quality JPEG data URL
        const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
        setProcessedSrc(dataUrl);
        setLoading(false);
      } catch (err) {
        console.warn("Canvas watermarking failed, falling back to CSS overlay:", err);
        setCorsFailed(true);
        setLoading(false);
      }
    };

    img.onerror = () => {
      if (!isMounted.current) return;
      console.warn("CORS check failed for canvas. Falling back to CSS watermark overlay.");
      setCorsFailed(true);
      setLoading(false);
    };
  }, [src, shouldWatermark, watermarkText]);

  // Disable dragging and context menu on the image wrapper to make saving a bit harder
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
      className="relative overflow-hidden select-none"
      onContextMenu={handlePrevent}
      onDragStart={handlePrevent}
    >
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-neutral-100 dark:bg-neutral-800 animate-pulse">
          <span className="text-xs text-neutral-400">Loading and securing...</span>
        </div>
      )}

      {corsFailed ? (
        // CSS Fallback rendering when CORS blocks canvas manipulation
        <div className="relative w-full h-full">
          <img
            src={src} // load without anonymous crossOrigin so it works even if CORS is blocked
            alt={alt}
            className={`${className} pointer-events-none`}
            loading="lazy"
          />
          {/* CSS Watermark Overlay */}
          <div className="absolute inset-0 pointer-events-none grid grid-cols-2 grid-rows-3 p-4 gap-4 overflow-hidden select-none opacity-20 rotate-[-15deg] scale-110">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center justify-center font-bold text-white text-xs md:text-sm font-sans tracking-wider whitespace-nowrap drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]"
              >
                {watermarkText}
              </div>
            ))}
          </div>
        </div>
      ) : (
        // Canvas processed secure image
        processedSrc && (
          <img
            src={processedSrc}
            alt={alt}
            className={`${className} transition-opacity duration-300`}
            loading="lazy"
          />
        )
      )}
    </div>
  );
}
