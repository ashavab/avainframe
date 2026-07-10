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
    const urlObj = new URL(req.url);
    const token = urlObj.searchParams.get("token");
    const gdprToken = urlObj.searchParams.get("gdprToken") || "GDPR";

    if (!token) {
      return new Response(
        JSON.stringify({ error: "Missing required query parameters (token)" }),
        {
          status: 400,
          headers: { "content-type": "application/json" },
        }
      );
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

    // 1. Resolve albumId of the central GDPR shared link using our admin API key and matching by slug
    const linksRes = await fetch(`${immichUrl}/api/shared-links`, {
      headers: { "x-api-key": apiKey },
    });
    if (!linksRes.ok) {
      return new Response(JSON.stringify({ error: "Failed to fetch shared links from Immich." }), {
        status: 500,
        headers: { "content-type": "application/json" },
      });
    }
    const sharedLinks = await linksRes.json();
    const gdprLink = sharedLinks.find((l: any) => l.slug && l.slug.toLowerCase() === gdprToken.toLowerCase());

    if (!gdprLink) {
      return new Response(
        JSON.stringify({ error: `No shared link found with slug "${gdprToken}".` }),
        {
          status: 404,
          headers: { "content-type": "application/json" },
        }
      );
    }

    const albumId = gdprLink.album ? gdprLink.album.id : null;

    if (!albumId) {
      return new Response(
        JSON.stringify({ error: "No album found associated with the GDPR shared link." }),
        {
          status: 404,
          headers: { "content-type": "application/json" },
        }
      );
    }

    // 2. Forward the multipart request body directly to Immich POST /api/assets
    const contentType = req.headers.get("content-type") || "";
    
    // Read body as arrayBuffer to forward correctly
    const bodyBuffer = await req.arrayBuffer();

    const uploadRes = await fetch(`${immichUrl}/api/assets`, {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "content-type": contentType,
      },
      body: bodyBuffer,
    });

    if (!uploadRes.ok) {
      const errText = await uploadRes.text();
      return new Response(
        JSON.stringify({ error: `Immich asset upload failed: ${errText}` }),
        {
          status: uploadRes.status,
          headers: { "content-type": "application/json" },
        }
      );
    }

    const uploadResult = await uploadRes.json();
    const assetId = uploadResult.id;

    if (!assetId) {
      return new Response(
        JSON.stringify({ error: "Failed to parse uploaded asset ID from Immich response." }),
        {
          status: 500,
          headers: { "content-type": "application/json" },
        }
      );
    }

    // 2. Link the uploaded asset to the client's album
    const addRes = await fetch(`${immichUrl}/api/albums/${albumId}/assets`, {
      method: "PUT",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
      },
      body: JSON.stringify({
        ids: [assetId],
      }),
    });

    if (!addRes.ok) {
      const errText = await addRes.text();
      return new Response(
        JSON.stringify({ error: `Failed to link uploaded GDPR form to Immich album: ${errText}` }),
        {
          status: addRes.status,
          headers: { "content-type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "GDPR Consent form image successfully uploaded to Immich and linked to the album.",
        assetId,
      }),
      {
        status: 200,
        headers: { "content-type": "application/json" },
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
