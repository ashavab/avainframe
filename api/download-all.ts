export const config = {
  runtime: "edge",
};

export default async function handler(req: Request) {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "content-type": "application/json" },
    });
  }

  try {
    const { assetIds, shareKey } = await req.json();

    if (!assetIds || !Array.isArray(assetIds) || assetIds.length === 0) {
      return new Response(JSON.stringify({ error: "Missing or invalid assetIds" }), {
        status: 400,
        headers: { "content-type": "application/json" },
      });
    }

    const immichUrl = process.env.VITE_IMMICH_URL || "https://photos.avainframe.com";

    // 1. Prepare download archive info in Immich
    const infoRes = await fetch(`${immichUrl}/api/download/info`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-immich-share-key": shareKey || "",
      },
      body: JSON.stringify({
        assetIds: assetIds,
      }),
    });

    if (!infoRes.ok) {
      const errText = await infoRes.text();
      return new Response(JSON.stringify({ error: `Failed to prepare download: ${errText}` }), {
        status: infoRes.status,
        headers: { "content-type": "application/json" },
      });
    }

    // 2. Download the archive zip stream from Immich
    const archiveRes = await fetch(`${immichUrl}/api/download/archive`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-immich-share-key": shareKey || "",
      },
      body: JSON.stringify({
        assetIds: assetIds,
      }),
    });

    if (!archiveRes.ok) {
      const errText = await archiveRes.text();
      return new Response(JSON.stringify({ error: `Failed to get download archive: ${errText}` }), {
        status: archiveRes.status,
        headers: { "content-type": "application/json" },
      });
    }

    // Stream the zip back to the client
    return new Response(archiveRes.body, {
      status: 200,
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="photos.zip"`,
      },
    });

  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || "Internal Server Error" }), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }
}
