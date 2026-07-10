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
    const { token, name, email, signature, choice, assetIds = [] } = await req.json();

    if (!token || !name || !email || !signature || !choice) {
      return new Response(
        JSON.stringify({ error: "Missing required parameters (token, name, email, signature, choice)" }),
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

    // 1. Resolve albumId using the share link token
    const meRes = await fetch(`${immichUrl}/api/shared-links/me`, {
      headers: { "x-immich-share-key": token },
    });

    if (!meRes.ok) {
      const errText = await meRes.text();
      return new Response(
        JSON.stringify({ error: `Failed to resolve share token: ${errText}` }),
        {
          status: meRes.status,
          headers: { "content-type": "application/json" },
        }
      );
    }

    const sharedLink = await meRes.json();
    const albumId = sharedLink.album ? sharedLink.album.id : null;

    if (!albumId) {
      return new Response(
        JSON.stringify({ error: "The provided share code does not belong to an album." }),
        {
          status: 400,
          headers: { "content-type": "application/json" },
        }
      );
    }

    // 2. Fetch the current album properties (to retrieve the existing description)
    const albumRes = await fetch(`${immichUrl}/api/albums/${albumId}`, {
      headers: { "x-immich-share-key": token },
    });

    if (!albumRes.ok) {
      const errText = await albumRes.text();
      return new Response(
        JSON.stringify({ error: `Failed to fetch album details: ${errText}` }),
        {
          status: albumRes.status,
          headers: { "content-type": "application/json" },
        }
      );
    }

    const album = await albumRes.json();
    const currentDescription = album.description || "";

    // 3. Format the new consent record entry (pipe-delimited)
    const timestamp = new Date().toLocaleDateString("en-CA"); // YYYY-MM-DD
    const assetIdsStr = Array.isArray(assetIds) && assetIds.length > 0 ? assetIds.join(",") : "";
    const newConsentRecord = `[GDPR_SIGN: ${name} | ${email} | ${signature} | ${timestamp} | ${choice}${assetIdsStr ? ` | ${assetIdsStr}` : ""}]`;

    // Append to description (avoiding duplicate logs for the same signature line)
    let updatedDescription = currentDescription.trim();
    if (!updatedDescription.includes(newConsentRecord)) {
      if (updatedDescription) {
        updatedDescription += `\n${newConsentRecord}`;
      } else {
        updatedDescription = newConsentRecord;
      }
    }

    // 4. Update the album description via PATCH /albums/{id}
    const updateRes = await fetch(`${immichUrl}/api/albums/${albumId}`, {
      method: "PATCH",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
      },
      body: JSON.stringify({
        description: updatedDescription,
      }),
    });

    if (!updateRes.ok) {
      const errText = await updateRes.text();
      return new Response(
        JSON.stringify({ error: `Failed to update album metadata on Immich: ${errText}` }),
        {
          status: updateRes.status,
          headers: { "content-type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Consent record saved successfully to Immich album description.",
        description: updatedDescription,
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
