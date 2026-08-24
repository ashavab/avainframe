import React, { useEffect, useState } from "react";

// Remote (live) Family service gallery.
//
// Images are served from the Ava in Frame Windows Immich instance
// (backup.avainframe.com / Cloudflare tunnel) through a public *shared link*,
// so the source files are NOT stored in the site bundle. The browser asks our
// own Vercel proxy (/api/family-gallery) for the asset list — a direct call
// to Immich is blocked by CORS — then requests each image's bytes directly
// from Immich as an <img> (not CORS-restricted, same as the client gallery).

const FAMILY_API = "/api/family-gallery";

type RemoteAsset = {
  id: string;
  originalFileName: string;
  description: string | null;
};

function thumbUrl(id: string, shareKey: string, size: "thumbnail" | "preview") {
  return `https://backup.avainframe.com/api/assets/${id}/thumbnail?key=${shareKey}&size=${size}`;
}

export function ServiceGalleryRemote() {
  const [assets, setAssets] = useState<RemoteAsset[] | null>(null);
  const [shareKey, setShareKey] = useState<string>("");
  const [albumName, setAlbumName] = useState<string>("Family");

  useEffect(() => {
    let mounted = true;
    fetch(FAMILY_API)
      .then((res) => {
        if (!res.ok) throw new Error("Family gallery fetch failed");
        return res.json();
      })
      .then((data: any) => {
        if (!mounted) return;
        setAssets(data.assets ?? []);
        setShareKey(data.shareKey ?? "");
        setAlbumName(data.albumName ?? "Family");
      })
      .catch(() => mounted && setAssets(null));
    return () => {
      mounted = false;
    };
  }, []);

  if (assets === null) {
    return (
      <div className="mt-8 mb-8">
        <p className="text-sm text-gray-600">Loading {albumName} gallery…</p>
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
          src={thumbUrl(assets[0].id, shareKey, "preview")}
          alt={albumName}
          className="w-full h-[420px] object-cover"
          loading="eager"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {assets.map((img) => (
          <figure key={img.id} className="group overflow-hidden rounded-xl bg-white">
            <img
              src={thumbUrl(img.id, shareKey, "thumbnail")}
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
