import React, { useEffect, useState } from "react";

// Remote (live) service gallery — mirrors the client gallery's behaviour:
// images are served directly from the Ava in Frame Immich instance
// (the Windows desktop, exposed via backup.avainframe.com / Cloudflare tunnel)
// through a public *shared link*, so the source files are NOT stored in the
// site bundle. This is the same pattern the client "gallery" uses, just pointed
// at the website's Family album instead of a private client album.

const IMMICH_URL = import.meta.env.VITE_IMMICH_URL || "https://backup.avainframe.com";
const SHARE_KEY = import.meta.env.VITE_FAMILY_SHARE_KEY || "";
const ALBUM_NAME = import.meta.env.VITE_FAMILY_ALBUM_NAME || "Family";

type RemoteAsset = {
  id: string;
  originalFileName: string;
  description: string | null;
};

function thumbUrl(id: string, size: "thumbnail" | "preview") {
  return `${IMMICH_URL}/api/assets/${id}/thumbnail?key=${SHARE_KEY}&size=${size}`;
}

export function ServiceGalleryRemote() {
  const [assets, setAssets] = useState<RemoteAsset[] | null>(null);

  useEffect(() => {
    let mounted = true;
    if (!SHARE_KEY) {
      setAssets([]);
      return;
    }
    fetch(`${IMMICH_URL}/api/shared-links/me?key=${SHARE_KEY}`)
      .then((res) => {
        if (!res.ok) throw new Error("Shared link fetch failed");
        return res.json();
      })
      .then((data: any) => {
        if (!mounted) return;
        // Immich returns assets either nested under album.assets or top-level.
        const items: RemoteAsset[] =
          data?.album?.assets ?? data?.assets?.items ?? data?.assets ?? [];
        setAssets(items);
      })
      .catch(() => mounted && setAssets(null));
    return () => {
      mounted = false;
    };
  }, []);

  if (assets === null) {
    return (
      <div className="mt-8 mb-8">
        <p className="text-sm text-gray-600">Loading {ALBUM_NAME} gallery…</p>
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

  return (
    <section className="mt-8">
      <div className="rounded-2xl overflow-hidden shadow-lg mb-6">
        <img
          src={thumbUrl(assets[0].id, "preview")}
          alt={ALBUM_NAME}
          className="w-full h-[420px] object-cover"
          loading="eager"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {assets.map((img) => (
          <figure key={img.id} className="group overflow-hidden rounded-xl bg-white">
            <img
              src={thumbUrl(img.id, "thumbnail")}
              alt={img.originalFileName}
              loading="lazy"
              className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <figcaption className="p-3 text-sm text-gray-700">
              {img.originalFileName}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

export default ServiceGalleryRemote;
