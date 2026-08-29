export const config = {
  runtime: "edge",
};

// Server-side image proxy: the browser fetches gallery bytes from avainframe.com
// (never photos.avainframe.com directly). Path mirrors Immich's asset endpoints:
//   /api/immich-image/assets/<id>/thumbnail?key=<shareKey>&size=<thumbnail|preview>
//   /api/immich-image/assets/<id}/original?key=<shareKey>
export default async function handler(req: Request) {
  const url = new URL(req.url);
  const key = url.searchParams.get("key");
  const size = url.searchParams.get("size") || "thumbnail";
  const path = url.pathname.replace(/^\/api\/immich-image/, "");

  if (!key) {
    return new Response(JSON.stringify({ error: "Missing key parameter" }), {
      status: 400,
      headers: { "content-type": "application/json" },
    });
  }

  const immichUrl = process.env.VITE_IMMICH_URL || "https://photos.avainframe.com";
  // path is like /assets/<id>/thumbnail after stripping /api/immich-image; Immich
  // expects /api/assets/..., so prepend /api.
  const target = `${immichUrl}/api${path}?key=${encodeURIComponent(key)}&size=${encodeURIComponent(size)}`;

  try {
    const upstream = await fetch(target, { headers: { "x-immich-share-key": key } });
    if (!upstream.ok) {
      return new Response("Image fetch failed", { status: upstream.status });
    }
    const body = await upstream.arrayBuffer();
    return new Response(body, {
      status: 200,
      headers: {
        "content-type": upstream.headers.get("content-type") || "application/octet-stream",
        "Cache-Control": "public, max-age=3600, s-maxage=86400",
        "access-control-allow-origin": "*",
      },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || "Image proxy error" }), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }
}
