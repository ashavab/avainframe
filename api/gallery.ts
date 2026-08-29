export const config = {
  runtime: "edge",
};

export default async function handler(req: Request) {
  const url = new URL(req.url);
  const token = url.searchParams.get("token");

  if (!token) {
    return new Response(JSON.stringify({ error: "Missing token parameter" }), {
      status: 400,
      headers: { "content-type": "application/json" },
    });
  }

  const immichUrl = process.env.VITE_IMMICH_URL || "https://photos.avainframe.com";

  try {
    let resolvedKey = token;
    let albumId = "";
    let albumName = "Client Gallery";

    // 1. Try to resolve as a slug first (e.g. "beth")
    try {
      const slugRes = await fetch(`${immichUrl}/api/shared-links/me?slug=${token}`);
      if (slugRes.ok) {
        const slugData = await slugRes.json();
        if (slugData.key && slugData.album?.id) {
          resolvedKey = slugData.key;
          albumId = slugData.album.id;
          albumName = slugData.album.albumName || albumName;
        }
      }
    } catch (slugErr) {
      console.warn("Failed to resolve slug, proceeding as direct key:", slugErr);
    }

    // 2. If it wasn't a slug (or slug resolution failed), validate as direct key
    if (!albumId) {
      const meRes = await fetch(`${immichUrl}/api/shared-links/me`, {
        headers: { "x-immich-share-key": token },
      });

      if (!meRes.ok) {
        return new Response(
          JSON.stringify({ error: `Immich auth failed: Status ${meRes.status}` }),
          {
            status: meRes.status,
            headers: { "content-type": "application/json" },
          }
        );
      }

      const sharedLink = await meRes.json();
      albumId = sharedLink.album?.id;
      albumName = sharedLink.album?.albumName || albumName;
    }

    if (!albumId) {
      return new Response(
        JSON.stringify({ error: "Shared link does not point to an album" }),
        {
          status: 404,
          headers: { "content-type": "application/json" },
        }
      );
    }

    // 3. Fetch album assets via search/metadata (Immich v3 does NOT embed
    //    assets in /api/albums/{id}, so we use the search endpoint instead).
    const albumRes = await fetch(`${immichUrl}/api/search/metadata`, {
      method: "POST",
      headers: {
        "x-immich-share-key": resolvedKey,
        "content-type": "application/json",
      },
      body: JSON.stringify({ albumIds: [albumId], size: 500, page: 1 }),
    });

    if (!albumRes.ok) {
      return new Response(
        JSON.stringify({ error: `Immich album fetch failed: Status ${albumRes.status}` }),
        {
          status: albumRes.status,
          headers: { "content-type": "application/json" },
        }
      );
    }

    const albumData = await albumRes.json();
    const allAssets = (albumData.assets?.items || []).slice(0, 500);

    return new Response(
      JSON.stringify({
        albumName: albumData.albumName || albumName,
        albumDescription: albumData.description || "",
        assets: allAssets,
        shareKey: resolvedKey, // return resolved key so the frontend can request images
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
      JSON.stringify({ error: err.message || "Internal Server Error" }),
      {
        status: 500,
        headers: { "content-type": "application/json" },
      }
    );
  }
}
