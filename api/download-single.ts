export const config = {
  runtime: "edge",
};

export default async function handler(req: Request) {
  const url = new URL(req.url);
  const assetId = url.searchParams.get("assetId");
  const shareKey = url.searchParams.get("shareKey") || "";
  const fileName = url.searchParams.get("fileName") || "image.jpg";

  if (!assetId) {
    return new Response(JSON.stringify({ error: "Missing assetId" }), {
      status: 400,
      headers: { "content-type": "application/json" },
    });
  }

  const immichUrl = process.env.VITE_IMMICH_URL || "https://photos.avainframe.com";

  try {
    const assetRes = await fetch(`${immichUrl}/api/assets/${assetId}/original`, {
      headers: {
        "x-immich-share-key": shareKey,
      },
    });

    if (!assetRes.ok) {
      const errText = await assetRes.text();
      return new Response(JSON.stringify({ error: `Failed to download asset: ${errText}` }), {
        status: assetRes.status,
        headers: { "content-type": "application/json" },
      });
    }

    const contentType = assetRes.headers.get("content-type") || "application/octet-stream";

    return new Response(assetRes.body, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${encodeURIComponent(fileName)}"`,
      },
    });

  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || "Internal Server Error" }), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }
}
