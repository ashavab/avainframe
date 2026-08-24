export const config = {
  runtime: "edge",
};

// Server-side proxy for the Ava in Frame *Family* service gallery.
//
// Why a proxy: the browser cannot call the Windows Immich API directly
// (CORS), so we resolve the shared-link album + its assets here on Vercel,
// then hand the browser a plain list + the public share key it uses to
// request the actual image bytes (a GET to /api/assets/<id>/thumbnail is an
// <img> request, which is NOT subject to CORS — same pattern the client
// gallery uses against photos.avainframe.com).
//
// The source album lives on the Windows desktop Immich (v2.7), exposed via
// the backup.avainframe.com Cloudflare tunnel. v2.7 lists an album's assets
// via POST /api/search/metadata (not GET /api/albums/<id>).

export default async function handler(req: Request) {
  const url = new URL(req.url);
  // ?albumId= overrides the default configured album (handy for future galleries).
  // The default album id is public (not a secret); only the share key must be set.
  const albumId =
    url.searchParams.get("albumId") ||
    process.env.FAMILY_ALBUM_ID ||
    "154e07a8-48c1-403c-8d14-f9332ed541ac";
  // Server-side reads the Vite-prefixed name too (Vercel exposes all project
  // env vars to edge functions). A committed fallback keeps prod working even
  // if the var isn't set in the dashboard — this is a *public* shared-link key.
  const shareKey =
    process.env.FAMILY_SHARE_KEY ||
    process.env.VITE_FAMILY_SHARE_KEY ||
    "GAyAjlEkY1sP4vBh_lUQxC86vpAFkV1cV6E-cihzsYs6FXYkgaSsWmRWGvKxCHKjG-w";
  const immichUrl = process.env.FAMILY_IMMICH_URL || "https://backup.avainframe.com";

  if (!shareKey) {
    return new Response(
      JSON.stringify({ error: "Family gallery not configured (missing share key)" }),
      { status: 500, headers: { "content-type": "application/json" } }
    );
  }

  try {
    // v2.7: POST /api/search/metadata returns { assets: { total, items: [...] } }
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

    // Resolve album name for the heading.
    let albumName = "Family";
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
        shareKey, // browser uses this to request image bytes
      }),
      {
        status: 200,
        headers: {
          "content-type": "application/json",
          "Cache-Control": "public, max-age=60, s-maxage=600",
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
