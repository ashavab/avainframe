import { FormEvent, useMemo, useState } from "react";

const IMMICH_URL = import.meta.env.VITE_IMMICH_URL || "";

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

export function ClientGalleryAccess() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [activeUrl, setActiveUrl] = useState("");

  const shareUrl = useMemo(() => toShareUrl(password), [password]);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    if (!IMMICH_URL) {
      setError("Gallery is not configured yet. Please contact us.");
      return;
    }

    if (!shareUrl) {
      setError("Enter a valid gallery link or share code.");
      return;
    }

    setError("");
    setActiveUrl(shareUrl);
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#ffffff,_#ece9e1_55%,_#ddd6c8)] text-neutral-900 px-6 py-12">
      <div className="mx-auto max-w-6xl pt-20">
        <button
          onClick={() => {
            window.location.href = "/";
          }}
          className="mb-8 rounded-full border border-black/15 px-4 py-2 text-sm hover:bg-black/5"
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
                placeholder="Example: test"
                className="w-full rounded-xl border border-black/20 px-4 py-3 bg-white"
                required
              />
            </div>

            <button
              type="submit"
              className="rounded-xl bg-[#7a8d7d] text-white px-8 py-3 font-medium hover:opacity-90"
            >
              View Gallery
            </button>
          </form>

          {error && <p className="text-sm text-red-600 mt-4">{error}</p>}

          {!!activeUrl && (
            <div className="mt-8">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm text-neutral-600">Gallery loaded</p>
                <a
                  href={activeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-black/20 px-4 py-2 text-sm hover:bg-black/5"
                >
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
        </div>
      </div>
    </main>
  );
}
