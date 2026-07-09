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
    const { assetIds } = await req.json();

    if (!assetIds || !Array.isArray(assetIds) || assetIds.length === 0) {
      return new Response(JSON.stringify({ error: "Missing or invalid assetIds parameter" }), {
        status: 400,
        headers: { "content-type": "application/json" },
      });
    }

    const immichUrl = process.env.VITE_IMMICH_URL || "https://photos.avainframe.com";
    const apiKey = process.env.IMMICH_API_KEY;

    if (!apiKey) {
      return new Response(
        JSON.stringify({
          error: "API key not configured. Please add IMMICH_API_KEY to Vercel environment variables.",
        }),
        {
          status: 500,
          headers: { "content-type": "application/json" },
        }
      );
    }

    // Call Immich PUT /assets bulk update endpoint to update descriptions
    const updateRes = await fetch(`${immichUrl}/api/assets`, {
      method: "PUT",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
      },
      body: JSON.stringify({
        ids: assetIds,
        description: "Selected.", // Contains the dot "." to trigger auto-unwatermark
      }),
    });

    if (!updateRes.ok) {
      const errorText = await updateRes.text();
      return new Response(
        JSON.stringify({ error: `Failed to update descriptions in Immich: ${errorText}` }),
        {
          status: updateRes.status,
          headers: { "content-type": "application/json" },
        }
      );
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
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
