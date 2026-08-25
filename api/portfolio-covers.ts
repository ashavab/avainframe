export const config = { runtime: "edge" };

export default async function handler(req: Request) {
  return new Response(JSON.stringify({ ok: true, note: "minimal handler reached" }), {
    status: 200,
    headers: { "content-type": "application/json" },
  });
}
