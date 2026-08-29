export const config = {
  runtime: "edge",
};

// Server-side proxy for the Ava in Frame *remote* service galleries (Family,
// Portraits, Events, ...). Each gallery maps to an album on the production
// Immich (photos.avainframe.com, hosted on photoprison — no Cloudflare/Win dep).
//
// Why a proxy: the browser cannot call the Windows Immich API directly (CORS),
// so we resolve the shared-link album + its assets here on Vercel and hand the
// browser a plain list + the public share key it uses to request the actual
// image bytes (a GET to /api/assets/<id>/thumbnail is an <img> request, which
// is NOT subject to CORS — same pattern the client gallery uses).
//
// v2.7 listing: POST /api/search/metadata returns { assets: { total, items } }.

export default async function handler(req: Request) {
  const url = new URL(req.url);
  const albumId =
    url.searchParams.get("albumId") ||
    process.env.FAMILY_ALBUM_ID ||
    "9cbe82d0-02e3-400f-9cce-085fe4476488";
  // Per-album share key may be passed (?key=...) so a single proxy serves any
  // shared album. Falls back to the configured Family key.
  const shareKey =
    url.searchParams.get("key") ||
    process.env.FAMILY_SHARE_KEY ||
    process.env.VITE_FAMILY_SHARE_KEY ||
    "xsGQ9607vat8nBVK83visn6PGt76xCKkvWMB61vU24Y1PuakQiWJgY2bzB0o6yRN-kc";
  const immichUrl = process.env.FAMILY_IMMICH_URL || "https://photos.avainframe.com";

  try {
    const searchRes = await fetch(`${immichUrl}/api/search/metadata`, {
      method: "POST",
      headers: {
        "x-immich-share-key": shareKey,
        "content-type": "application/json",
      },
      body: JSON.stringify({ albumIds: [albumId], size: 500, page: 1 }),
    });

    if (!searchRes.ok) {
      return new Response(
        JSON.stringify({ error: `Immich album fetch failed: Status ${searchRes.status}` }),
        { status: searchRes.status, headers: { "content-type": "application/json" } }
      );
    }

    const searchData = await searchRes.json();
    const items = (searchData?.assets?.items || []) as Array<{
      id: string;
      originalFileName: string;
      description?: string | null;
    }>;

    let albumName = "Gallery";
    try {
      const albumRes = await fetch(`${immichUrl}/api/albums/${albumId}`, {
        headers: { "x-immich-share-key": shareKey },
      });
      if (albumRes.ok) {
        const albumData = await albumRes.json();
        albumName = albumData?.albumName || albumName;
      }
    } catch {
      /* name is non-critical */
    }

    return new Response(
      JSON.stringify({
        albumName,
        assets: items.map((a) => ({
          id: a.id,
          originalFileName: a.originalFileName,
          description: a.description ?? null,
        })),
        shareKey,
      }),
      {
        status: 200,
        headers: {
          "content-type": "application/json",
          "Cache-Control": "public, max-age=60, s-maxage=120",
        },
      }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err?.message || "Internal Server Error" }),
      { status: 500, headers: { "content-type": "application/json" } }
    );
  }
}
