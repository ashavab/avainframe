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

  // Fallback to the configured Immich URL
  const immichUrl = process.env.VITE_IMMICH_URL || "https://photos.avainframe.com";

  try {
    // 1. Get shared link info to find the albumId
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
    const albumId = sharedLink.album?.id;
    if (!albumId) {
      return new Response(
        JSON.stringify({ error: "Shared link does not point to an album" }),
        {
          status: 404,
          headers: { "content-type": "application/json" },
        }
      );
    }

    // 2. Get album details containing the assets list
    const albumRes = await fetch(`${immichUrl}/api/albums/${albumId}`, {
      headers: { "x-immich-share-key": token },
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
    return new Response(
      JSON.stringify({
        albumName: albumData.albumName || "Client Gallery",
        assets: albumData.assets || [],
      }),
      {
        status: 200,
        headers: {
          "content-type": "application/json",
          "Cache-Control": "public, max-age=60, s-maxage=600", // cache link listings briefly
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
