export const config = { runtime: "edge" };

// Returns one cover image per portfolio category, pulled LIVE from Immich
// (backup.avainframe.com, Windows desktop via Cloudflare tunnel). The browser
// cannot call Immich directly (CORS), so we resolve the album assets here on
// Vercel and hand back a tiny map: { category -> { id, key } }. The browser
// then loads the bytes directly from Immich as an <img> (not CORS-restricted,
// same pattern as /api/family-gallery and the client gallery).
//
// There are exactly 3 portfolio cards, one per Immich folder. The categories
// below must match the  field in src/app/data/portfolioData.ts.

const ALBUMS: Record<string, { albumId: string; shareKey: string }> = {
  events: {
    albumId: "947c8145-8f27-416f-9286-5abdf4aa8df3",
    shareKey: "Jqq3wKmF-XhOq38DGKwgblcqX7_9USMnbBO4g-750ZrHUqMO1U8GgKqR4b7NuzygLkk",
  },
  portraits: {
    albumId: "739b8c11-2a73-477a-8029-97b83e1a9ed5",
    shareKey: "qYe334YQwzxNCp_nyS3_bDXMTsUFq8qDf7MvjLQxbqMqV5NYKjlc0uu6M1cWIKA5_50",
  },
  websiteFamily: {
    albumId: "154e07a8-48c1-403c-8d14-f9332ed541ac",
    shareKey: "GAyAjlEkY1sP4vBh_lUQxC86vpAFkV1cV6E-cihzsYs6FXYkgaSsWmRWGvKxCHKjG-w",
  },
};

// Category (as used in portfolioData.ts) -> which album supplies its cover.
const CATEGORY_ALBUM: Record<string, keyof typeof ALBUMS> = {
  "Events": "events",
  "Portraits": "portraits",
  "Website Family": "websiteFamily",
};

async function fetchAlbumAssets(albumId: string, shareKey: string, size = 50) {
  const res = await fetch("https://backup.avainframe.com/api/search/metadata", {
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
    const covers: Record<string, { id: string; key: string } | null> = {};
    for (const [category, albumKey] of Object.entries(CATEGORY_ALBUM)) {
      const { albumId, shareKey } = ALBUMS[albumKey];
      const assets = await fetchAlbumAssets(albumId, shareKey);
      const asset = assets[0];
      covers[category] = asset ? { id: asset.id, key: shareKey } : null;
    }

    return new Response(JSON.stringify({ covers }), {
      status: 200,
      headers: {
        "content-type": "application/json",
        "Cache-Control": "public, max-age=60, s-maxage=300",
      },
    });
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err?.message || "Internal Server Error" }),
      { status: 500, headers: { "content-type": "application/json" } }
    );
  }
}
