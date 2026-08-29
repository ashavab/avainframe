import React, { useEffect, useState, useCallback } from "react";

// Remote (live) service gallery backed by an Immich shared-link album on the
// production Immich (photos.avainframe.com, hosted on photoprison). The
// browser fetches the asset list from our Vercel proxy (/api/family-gallery) —
// a direct call to Immich is blocked by CORS — then requests each image's
// bytes directly from Immich as an <img> (not CORS-restricted, same as the
// client gallery).

const IMMICH_URL = "https://photos.avainframe.com";

// Each thumbnail is a real <button> (always clickable, keyboard accessible)
// and there is an explicit "View Gallery" button that opens the lightbox.

type RemoteAsset = {
  id: string;
  originalFileName: string;
  description: string | null;
};

function thumbUrl(id: string, key: string, size: "thumbnail" | "preview") {
  return `${IMMICH_URL}/api/assets/${id}/thumbnail?key=${key}&size=${size}`;
}

export function RemoteGallery({
  albumId,
  albumName = "Gallery",
  shareKey,
}: {
  albumId?: string;
  albumName?: string;
  shareKey?: string;
}) {
  const [assets, setAssets] = useState<RemoteAsset[] | null>(null);
  const [key, setKey] = useState<string>(shareKey || "");
  const [name, setName] = useState<string>(albumName);
  const [lightbox, setLightbox] = useState<number | null>(null);

  useEffect(() => {
    let mounted = true;
    const qs = new URLSearchParams();
    if (albumId) qs.set("albumId", albumId);
    if (shareKey) qs.set("key", shareKey);
    fetch(`/api/family-gallery?${qs.toString()}`)
      .then((res) => {
        if (!res.ok) throw new Error("Gallery fetch failed");
        return res.json();
      })
      .then((data: any) => {
        if (!mounted) return;
        setAssets(data.assets ?? []);
        setKey(data.shareKey ?? shareKey ?? "");
        setName(data.albumName ?? albumName);
      })
      .catch(() => mounted && setAssets(null));
    return () => {
      mounted = false;
    };
  }, [albumId, shareKey]);

  const close = useCallback(() => setLightbox(null), []);
  const go = useCallback(
    (dir: number) =>
      setLightbox((i) =>
        i === null || !assets ? i : (i + dir + assets.length) % assets.length
      ),
    [assets]
  );

  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox, close, go]);

  if (assets === null) {
    return (
      <div className="mt-8 mb-8">
        <p className="text-sm text-gray-600">Loading {name} gallery…</p>
      </div>
    );
  }

  if (assets.length === 0) {
    return (
      <div className="mt-8 mb-8">
        <p className="text-sm text-gray-600">No photos in this gallery yet.</p>
      </div>
    );
  }

  const open = (i: number) => setLightbox(i);

  return (
    <section className="mt-8">
      <button
        type="button"
        onClick={() => open(0)}
        className="block w-full rounded-2xl overflow-hidden shadow-lg mb-6 group focus:outline-none focus:ring-2 focus:ring-[#819184]"
        aria-label={`Open ${name} gallery`}
      >
        <img
          src={thumbUrl(assets[0].id, key, "preview")}
          alt={name}
          className="w-full h-[420px] object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          loading="eager"
        />
      </button>

      <div className="flex justify-center mb-6">
        <button
          type="button"
          onClick={() => open(0)}
          className="rounded-xl bg-[#819184] text-white px-6 py-3 font-medium hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[#819184]"
        >
          View Gallery ({assets.length})
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {assets.map((img, i) => (
          <button
            key={img.id}
            type="button"
            onClick={() => open(i)}
            className="group overflow-hidden rounded-xl bg-white text-left focus:outline-none focus:ring-2 focus:ring-[#819184]"
            aria-label={`View ${img.originalFileName}`}
          >
            <img
              src={thumbUrl(img.id, key, "thumbnail")}
              alt={img.originalFileName}
              loading="lazy"
              className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </button>
        ))}
      </div>

      {lightbox !== null && assets[lightbox] && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={close}
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            className="absolute top-4 right-5 text-white/90 text-4xl leading-none hover:text-white focus:outline-none"
            onClick={close}
            aria-label="Close"
          >
            ×
          </button>
          <button
            type="button"
            className="absolute left-4 md:left-10 text-white/80 text-5xl leading-none hover:text-white focus:outline-none"
            onClick={(e) => {
              e.stopPropagation();
              go(-1);
            }}
            aria-label="Previous"
          >
            ‹
          </button>
          <img
            src={thumbUrl(assets[lightbox].id, key, "preview")}
            alt={assets[lightbox].originalFileName}
            className="max-h-[88vh] max-w-[90vw] object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            type="button"
            className="absolute right-12 md:right-16 text-white/80 text-5xl leading-none hover:text-white focus:outline-none"
            onClick={(e) => {
              e.stopPropagation();
              go(1);
            }}
            aria-label="Next"
          >
            ›
          </button>
          <div className="absolute bottom-4 left-0 right-0 text-center text-white/80 text-sm">
            {assets[lightbox].originalFileName} ({lightbox + 1}/{assets.length})
          </div>
        </div>
      )}
    </section>
  );
}

// Family wrapper so existing FamilyService keeps working.
export function ServiceGalleryRemote() {
  return <RemoteGallery albumName="Family" />;
}

export default RemoteGallery;
