import { FormEvent, useMemo, useState, useEffect } from "react";
import { WatermarkedImage } from "./WatermarkedImage";
import {
  ChevronLeft,
  ChevronRight,
  X,
  Download,
  Lock,
  Unlock,
  ExternalLink,
  Loader2,
  AlertCircle
} from "lucide-react";

const IMMICH_URL = import.meta.env.VITE_IMMICH_URL || "";

interface ImmichAsset {
  id: string;
  originalFileName: string;
  description: string | null;
  exifInfo?: {
    description?: string;
  };
}

function toShareUrl(input: string) {
  const raw = input.trim();
  if (!raw || !IMMICH_URL) {
    return "";
  }

  try {
    const baseUrl = new URL(IMMICH_URL);
    const cleaned = raw.replace(/^\/+/, "");

    // Accept full links and extract only the share token segment.
    if (cleaned.startsWith("http://") || cleaned.startsWith("https://")) {
      const candidate = new URL(cleaned);
      if (candidate.origin !== baseUrl.origin) {
        return "";
      }

      const parts = candidate.pathname.split("/").filter(Boolean);
      const token = parts[1] || "";
      if (!token || (parts[0] !== "s" && parts[0] !== "share")) {
        return "";
      }
      return `${baseUrl.origin}/s/${token}`;
    }

    // Accept token-only input and always build the /s/<token> URL.
    const pathParts = cleaned.split("/").filter(Boolean);
    const token = pathParts.length >= 2 && (pathParts[0] === "s" || pathParts[0] === "share")
      ? pathParts[1]
      : pathParts[pathParts.length - 1];

    if (!token) {
      return "";
    }

    return `${baseUrl.origin}/s/${token}`;
  } catch {
    return "";
  }
}

function extractShareKey(input: string): string {
  const raw = input.trim();
  if (!raw) return "";

  if (raw.startsWith("http://") || raw.startsWith("https://")) {
    try {
      const url = new URL(raw);
      const parts = url.pathname.split("/").filter(Boolean);
      if ((parts[0] === "s" || parts[0] === "share") && parts[1]) {
        return parts[1];
      }
    } catch {
      return "";
    }
  }

  const pathParts = raw.split("/").filter(Boolean);
  return pathParts.length >= 2 && (pathParts[0] === "s" || pathParts[0] === "share")
    ? pathParts[1]
    : pathParts[pathParts.length - 1] || "";
}

export function ClientGalleryAccess() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  // API Gallery State
  const [assets, setAssets] = useState<ImmichAsset[]>([]);
  const [albumName, setAlbumName] = useState("");
  const [shareKey, setShareKey] = useState("");
  const [fallbackToIframe, setFallbackToIframe] = useState(false);
  const [activeUrl, setActiveUrl] = useState("");

  // Lightbox State
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const shareUrl = useMemo(() => toShareUrl(password), [password]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!IMMICH_URL) {
      setError("Gallery is not configured yet. Please contact us.");
      return;
    }

    const token = extractShareKey(password);
    if (!token) {
      setError("Enter a valid gallery link or share code.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      let albumData;
      let usedProxy = false;

      // Try fetching via Vercel Edge proxy API route first to bypass CORS
      try {
        const proxyRes = await fetch(`/api/gallery?token=${token}`);
        if (proxyRes.ok) {
          albumData = await proxyRes.json();
          usedProxy = true;
        } else {
          console.warn(`Proxy check returned status ${proxyRes.status}. Trying direct fetch.`);
        }
      } catch (proxyErr) {
        console.warn("Proxy check failed, falling back to direct browser fetch:", proxyErr);
      }

      if (!usedProxy) {
        // Step 1: Validate share key and retrieve shared link properties
        const meRes = await fetch(`${IMMICH_URL}/api/shared-links/me`, {
          headers: { "x-immich-share-key": token }
        });

        if (!meRes.ok) {
          throw new Error(`Failed to access link: Status ${meRes.status}`);
        }

        const sharedLink = await meRes.json();
        const albumId = sharedLink.album ? sharedLink.album.id : null;
        if (!albumId) {
          throw new Error("Shared link is not an album link.");
        }

        // Step 2: Fetch assets inside the album
        const albumRes = await fetch(`${IMMICH_URL}/api/albums/${albumId}`, {
          headers: { "x-immich-share-key": token }
        });

        if (!albumRes.ok) {
          throw new Error(`Failed to fetch album: Status ${albumRes.status}`);
        }

        albumData = await albumRes.json();
      }

      setAlbumName(albumData.albumName || "Your Gallery");
      setAssets(albumData.assets || []);
      setShareKey(token);
      setFallbackToIframe(false);
    } catch (err: any) {
      console.warn("Immich API direct fetch failed (likely CORS or network permissions). Falling back to iframe view.", err);
      
      if (shareUrl) {
        setShareKey(token);
        setFallbackToIframe(true);
        setActiveUrl(shareUrl);
      } else {
        setError("Could not access gallery. Please verify your password/link.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (lightboxIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxIndex(null);
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxIndex, assets]);

  const handlePrev = () => {
    setLightboxIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : assets.length - 1));
  };

  const handleNext = () => {
    setLightboxIndex((prev) => (prev !== null && prev < assets.length - 1 ? prev + 1 : 0));
  };

  const currentLightboxAsset = lightboxIndex !== null ? assets[lightboxIndex] : null;
  const isCurrentAssetClean = currentLightboxAsset 
    ? (currentLightboxAsset.description?.includes(".") || false)
    : false;

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#ffffff,_#ece9e1_55%,_#ddd6c8)] text-neutral-900 px-6 py-12">
      <div className="mx-auto max-w-6xl pt-20">
        <button
          onClick={() => {
            window.location.href = "/";
          }}
          className="mb-8 rounded-full border border-black/15 px-4 py-2 text-sm hover:bg-black/5 transition"
        >
          Back to main site
        </button>

        <div className="rounded-3xl bg-white/90 shadow-[0_20px_70px_-35px_rgba(0,0,0,0.35)] border border-black/10 p-8 md:p-10 backdrop-blur-sm">
          <p className="text-xs uppercase tracking-[0.25em] text-[#7a8d7d] mb-3">Client Gallery</p>
          <h1 className="text-3xl md:text-4xl font-serif mb-3">Your Photo Collection</h1>
          <p className="text-neutral-600 mb-8">
            Enter the gallery password we sent you. The password is the share code from your Immich link.
          </p>

          <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
            <div>
              <label htmlFor="gallery-password" className="block text-sm font-medium mb-2">
                Gallery password
              </label>
              <input
                id="gallery-password"
                type="text"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Example: edKOi5jYw..."
                className="w-full rounded-xl border border-black/20 px-4 py-3 bg-white"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-[#7a8d7d] text-white px-8 py-3 font-medium hover:opacity-90 disabled:opacity-50 flex items-center gap-2 justify-center transition"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Loading...
                </>
              ) : (
                "View Gallery"
              )}
            </button>
          </form>

          {error && <p className="text-sm text-red-600 mt-4">{error}</p>}

          {/* Render Fallback Iframe */}
          {fallbackToIframe && !!activeUrl && (
            <div className="mt-8">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-amber-50 border border-amber-200">
                <div className="flex items-center gap-2 text-amber-800 text-sm">
                  <AlertCircle className="h-5 w-5 flex-shrink-0" />
                  <span>Showing standard layout (CORS direct access disabled on server).</span>
                </div>
                <a
                  href={activeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-black/20 px-4 py-2 text-sm hover:bg-black/5 flex items-center gap-1.5 bg-white"
                >
                  <ExternalLink className="h-4 w-4" />
                  Open in new tab
                </a>
              </div>

              <iframe
                src={activeUrl}
                title="Client gallery"
                className="w-full min-h-[72vh] rounded-2xl border border-black/15 bg-white"
                allow="fullscreen; autoplay; clipboard-read; clipboard-write"
                allowFullScreen
              />
            </div>
          )}

          {/* Render Custom Dynamic Watermarked Gallery */}
          {!fallbackToIframe && assets.length > 0 && (
            <div className="mt-12">
              <div className="border-b border-neutral-200 pb-4 mb-8 flex justify-between items-end">
                <div>
                  <h2 className="text-2xl font-serif text-[#7a8d7d]">{albumName}</h2>
                  <p className="text-sm text-neutral-500 mt-1">{assets.length} photos loaded</p>
                </div>
                <div className="text-xs text-neutral-400 flex items-center gap-1">
                  <Lock className="h-3 w-3" /> Securing proof photos
                </div>
              </div>

              {/* Photos Grid */}
              <div className="columns-1 sm:columns-2 md:columns-3 gap-6 space-y-6">
                {assets.map((asset, index) => {
                  // Watermark unless description contains a dot '.'
                  const shouldWatermark = !asset.description || !asset.description.includes(".");
                  const thumbUrl = `${IMMICH_URL}/api/assets/${asset.id}/thumbnail?key=${shareKey}&size=preview`;

                  return (
                    <div
                      key={asset.id}
                      onClick={() => setLightboxIndex(index)}
                      className="break-inside-avoid relative overflow-hidden rounded-2xl border border-black/5 bg-neutral-100 shadow-sm cursor-zoom-in group transition duration-300 hover:shadow-md hover:border-black/10"
                    >
                      <WatermarkedImage
                        src={thumbUrl}
                        alt={asset.originalFileName}
                        shouldWatermark={shouldWatermark}
                        className="w-full h-auto object-cover rounded-2xl transition duration-500 group-hover:scale-[1.02]"
                      />
                      
                      {/* Hover Info Overlay */}
                      <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none flex items-end p-4 rounded-2xl">
                        <div className="text-white text-xs bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1.5">
                          {shouldWatermark ? (
                            <>
                              <Lock className="h-3 w-3" />
                              <span>Proof Copy</span>
                            </>
                          ) : (
                            <>
                              <Unlock className="h-3 w-3 text-emerald-400" />
                              <span className="text-emerald-400">Download Ready</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Review Section */}
              <div className="mt-16 p-8 rounded-3xl border border-[#7a8d7d]/20 bg-[#f8f8f5]/60 flex flex-col items-center">
                <h2 className="text-2xl font-serif mb-2 text-[#7a8d7d]">Enjoying your photos?</h2>
                <p className="mb-6 text-neutral-600 text-center max-w-lg">
                  We'd love to hear your feedback! Please consider leaving a review on your favorite platform:
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                  <a
                    href="https://g.page/r/CdJN4SgZHr5HEBM/review"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2.5 rounded-full bg-[#4285F4] text-white font-medium hover:bg-[#357ae8] transition shadow-sm"
                  >
                    Leave a Google Review
                  </a>
                  <a
                    href="https://www.facebook.com/profile.php?id=61589665170358&sk=reviews"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2.5 rounded-full bg-[#4267B2] text-white font-medium hover:bg-[#365899] transition shadow-sm"
                  >
                    Facebook
                  </a>
                  <a
                    href="https://www.yelp.ca/writeareview/biz/kl6StD-njEXc5PbUUhaiVA?return_url=%2Fbiz%2Fkl6StD-njEXc5PbUUhaiVA&review_origin=biz-details-war-button"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2.5 rounded-full bg-[#d32323] text-white font-medium hover:bg-[#b71c1c] transition shadow-sm"
                  >
                    Yelp
                  </a>
                </div>
                <p className="mt-6 text-xs text-neutral-400">Thank you for supporting Ava in Frame Photography!</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightboxIndex !== null && currentLightboxAsset && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/95 backdrop-blur-md text-white select-none">
          {/* Header Controls */}
          <div className="absolute top-0 left-0 right-0 p-6 flex items-center justify-between z-10 bg-gradient-to-b from-black/60 to-transparent">
            <div>
              <p className="text-sm font-medium tracking-wide text-neutral-300">
                {currentLightboxAsset.originalFileName}
              </p>
              <p className="text-xs text-neutral-400 mt-0.5">
                {lightboxIndex + 1} of {assets.length}
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              {!isCurrentAssetClean ? (
                <div className="text-xs text-amber-400 bg-amber-400/10 border border-amber-400/20 px-3 py-1.5 rounded-full flex items-center gap-1.5">
                  <Lock className="h-3 w-3" />
                  <span>Preview Copy (Watermarked)</span>
                </div>
              ) : (
                <a
                  href={`${IMMICH_URL}/api/assets/${currentLightboxAsset.id}/original?key=${shareKey}`}
                  download={currentLightboxAsset.originalFileName}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5 transition shadow-sm cursor-pointer"
                >
                  <Download className="h-3.5 w-3.5" />
                  Download High-Res Original
                </a>
              )}

              <button
                onClick={() => setLightboxIndex(null)}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition cursor-pointer"
                title="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Large Image Container */}
          <div className="w-full max-w-5xl max-h-[80vh] px-4 flex items-center justify-center relative">
            <WatermarkedImage
              src={`${IMMICH_URL}/api/assets/${currentLightboxAsset.id}/thumbnail?key=${shareKey}&size=preview`}
              alt={currentLightboxAsset.originalFileName}
              shouldWatermark={!isCurrentAssetClean}
              className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-2xl"
            />
          </div>

          {/* Navigation Controls */}
          <button
            onClick={handlePrev}
            className="absolute left-6 p-3 rounded-full bg-white/5 hover:bg-white/15 transition cursor-pointer"
            title="Previous Photo"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          
          <button
            onClick={handleNext}
            className="absolute right-6 p-3 rounded-full bg-white/5 hover:bg-white/15 transition cursor-pointer"
            title="Next Photo"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
      )}
    </main>
  );
}

