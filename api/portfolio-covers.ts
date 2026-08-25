export const config = { runtime: "edge" };

// Returns one cover image per portfolio category, pulled LIVE from Immich
// (backup.avainframe.com, Windows desktop via Cloudflare tunnel). The browser
// cannot call Immich directly (CORS), so we resolve the album assets here on
// Vercel and hand back a tiny map: { title -> { id, key } }. The browser then
// loads the bytes directly from Immich as an <img> (not CORS-restricted, same
// pattern as /api/family-gallery and the client gallery).
//
// Album -> share key mapping mirrors src/app/data/portfolioData.ts.

const ALBUMS: Record<string, { albumId: string; shareKey: string }> = {
  websiteFamily: {
    albumId: "154e07a8-48c1-403c-8d14-f9332ed541ac",
    shareKey: "GAyAjlEkY1sP4vBh_lUQxC86vpAFkV1cV6E-cihzsYs6FXYkgaSsWmRWGvKxCHKjG-w",
  },
  events: {
    albumId: "947c8145-8f27-416f-9286-5abdf4aa8df3",
    shareKey: "Jqq3wKmF-XhOq38DGKwgblcqX7_9USMnbBO4g-750ZrHUqMO1U8GgKqR4b7NuzygLkk",
  },
  portraits: {
    albumId: "739b8c11-2a73-477a-8029-97b83e1a9ed5",
    shareKey: "qYe334YQwzxNCp_nyS3_bDXMTsUFq8qDf7MvjLQxbqMqV5NYKjlc0uu6M1cWIKA5_50",
  },
};

// Category -> which album supplies its cover.
const CATEGORY_ALBUM: Record<string, keyof typeof ALBUMS> = {
  "Wedding Photography": "websiteFamily",
  "Engagement Sessions": "websiteFamily",
  "Family & Portraits": "websiteFamily",
  "Professional Headshots": "portraits",
  "Boudoir Photography": "portraits",
  "Commercial & Pets": "websiteFamily",
  "Real Estate Photography": "websiteFamily",
  "Pet Photography": "websiteFamily",
  "Creative & Travel": "websiteFamily",
  "Travel & Destination": "websiteFamily",
  "Landscape Photography": "websiteFamily",
  "Toronto Photographer Area": "websiteFamily",
};

const IMMICH_URL = "https://backup.avainframe.com";

async function fetchAlbumAssets(albumId: string, shareKey: string, size = 50) {
  const res = await fetch(, {
    method: "POST",
    headers: { "x-immich-share-key": shareKey, "content-type": "application/json" },
    body: JSON.stringify({ albumIds: [albumId], size, page: 1 }),
  });
  if (!res.ok) return [] as Array<{ id: string }>;
  const data = await res.json();
  return (data?.assets?.items || []) as Array<{ id: string }>;
}

export default async function handler(req: Request) {
  try {
    // Group categories by album so we only hit Immich once per album.
    const byAlbum = new Map<keyof typeof ALBUMS, string[]>();
    for (const [cat, album] of Object.entries(CATEGORY_ALBUM)) {
      if (!byAlbum.has(album)) byAlbum.set(album, []);
      byAlbum.get(album)!.push(cat);
    }

    const covers: Record<string, { id: string; key: string } | null> = {};
    for (const [albumKey, cats] of byAlbum.entries()) {
      const { albumId, shareKey } = ALBUMS[albumKey];
      const assets = await fetchAlbumAssets(albumId, shareKey);
      cats.forEach((cat, i) => {
        const asset = assets[i % Math.max(assets.length, 1)] || assets[0];
        covers[cat] = asset ? { id: asset.id, key: shareKey } : null;
      });
    }

    return new Response(JSON.stringify({ covers }), {
      status: 200,
      headers: {
        "content-type": "application/json",
        "Cache-Control": "public, max-age=60, s-maxage=300",
      },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: String(err?.message || err), stack: String(err?.stack || "").slice(0,400) }), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }
}
