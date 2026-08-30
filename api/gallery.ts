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
    let albumDesc = "";

    // 1. Try to resolve as a slug first (e.g. "beth")
    try {
      const slugRes = await fetch(`${immichUrl}/api/shared-links/me?slug=${token}`);
      if (slugRes.ok) {
        const slugData = await slugRes.json();
        if (slugData.key && slugData.album?.id) {
          resolvedKey = slugData.key;
          albumId = slugData.album.id;
          albumName = slugData.album.albumName || albumName;
          albumDesc = slugData.album.description || albumDesc;
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
      albumDesc = sharedLink.album?.description || albumDesc;
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

    // 2b. Fetch the album itself to get its authoritative description (used for
    //     the "." watermark-unlock). Search/metadata responses don't include it.
    try {
      const albumRes = await fetch(
        `${immichUrl}/api/albums/${albumId}`,
        { headers: { "x-immich-share-key": resolvedKey } }
      );
      if (albumRes.ok) {
        const albumObj: any = await albumRes.json();
        if (typeof albumObj?.description === "string") {
          albumDesc = albumObj.description;
        }
        if (typeof albumObj?.albumName === "string" && albumObj.albumName) {
          albumName = albumObj.albumName;
        }
      }
    } catch (albumErr) {
      console.warn("Failed to fetch album metadata:", albumErr);
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

    // /api/search/metadata does NOT return per-asset `description`, which the
    // frontend uses for per-photo watermark unlock (a "." in the description).
    // Pull descriptions from the album's asset list instead and merge by id.
    try {
      const assetsRes = await fetch(
        `${immichUrl}/api/albums/${albumId}/assets`,
        { headers: { "x-immich-share-key": resolvedKey } }
      );
      if (assetsRes.ok) {
        const albumAssets: any[] = await assetsRes.json();
        const descById = new Map<string, string>();
        for (const a of albumAssets) {
          if (a?.id && typeof a.description === "string") {
            descById.set(a.id, a.description);
          }
        }
        for (const asset of allAssets) {
          if (asset?.id && descById.has(asset.id)) {
            asset.description = descById.get(asset.id)!;
          }
        }
      }
    } catch (descErr) {
      console.warn("Failed to fetch per-asset descriptions:", descErr);
    }

    return new Response(
      JSON.stringify({
        albumName: albumData.albumName || albumName,
        albumDescription: albumData.description || albumDesc || "",
        assets: allAssets,
        shareKey: resolvedKey, // return resolved key so the frontend can request images
      }),
      {
        status: 200,
        headers: {
          "content-type": "application/json",
          // No caching: the client gallery polls this every few seconds for
          // real-time updates, so the browser/edge must re-fetch each time.
          "Cache-Control": "no-store, must-revalidate",
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

// (deploy nudge)
