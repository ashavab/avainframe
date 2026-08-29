export const config = { runtime: "edge" };

// Returns one cover image per portfolio category, pulled LIVE from Immich
// (photos.avainframe.com, hosted on photoprison — no Cloudflare/Win dep). The
// browser cannot call Immich directly (CORS), so we resolve the album assets
// here on Vercel and hand back a tiny map: { category -> { id, key } }. The
// browser then loads the bytes directly from Immich as an <img> (not
// CORS-restricted, same pattern as /api/family-gallery and the client gallery).
//
// There are exactly 4 portfolio cards, one per Immich folder. The categories
// below must match the field in src/app/data/portfolioData.ts.

const ALBUMS: Record<string, { albumId: string; shareKey: string }> = {
  events: {
    albumId: "68229603-ffc3-42f1-812e-0039fdab17da",
    shareKey: "FYTRVVpjaSz6jvvkRsTQlVmMZA1xPwciLfgaXdmzrhOeQJb3au8z2CEo99dXpJUcJCU",
  },
  portraits: {
    albumId: "cf767bd8-cfa5-4be4-abf6-6752ec970b46",
    shareKey: "j0Re9rNpQfVkTZ1Q9jjBEqr-SvrzK30JutcgHkbw7iKYqc_SocMWs0VNOlO5xZE5CD0",
  },
  websiteFamily: {
    albumId: "9cbe82d0-02e3-400f-9cce-085fe4476488",
    shareKey: "xsGQ9607vat8nBVK83visn6PGt76xCKkvWMB61vU24Y1PuakQiWJgY2bzB0o6yRN-kc",
  },
  pets: {
    albumId: "f161ff64-5f4a-4290-88eb-7c46835a3901",
    shareKey: "vJV7GZIk7Xv3zI13HxF029WEBU5dx-PljKq88tFLkYxn3I4HTIC4s5iiobFYeLMWs5s",
  },
};

// Category (as used in portfolioData.ts) -> which album supplies its cover.
const CATEGORY_ALBUM: Record<string, keyof typeof ALBUMS> = {
  "Events": "events",
  "Portraits": "portraits",
  "Website Family": "websiteFamily",
  "Pets": "pets",
};

async function fetchAlbumAssets(albumId: string, shareKey: string, size = 50) {
  const res = await fetch("https://photos.avainframe.com/api/search/metadata", {
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
        "Cache-Control": "public, max-age=60, s-maxage=120",
      },
    });
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err?.message || "Internal Server Error" }),
      { status: 500, headers: { "content-type": "application/json" } }
    );
  }
}
