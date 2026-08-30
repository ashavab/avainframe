export const config = {
  runtime: "edge",
};

// Maps a free-text album-name query to a shared-link key. Used by the client
// gallery's "search by name" so clients can type the album name (or slug)
// instead of pasting the raw share code. Returns a short list of matches.
export default async function handler(req: Request) {
  const url = new URL(req.url);
  const query = (url.searchParams.get("q") || "").trim();

  if (!query) {
    return new Response(JSON.stringify({ error: "Missing query parameter" }), {
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
      { status: 500, headers: { "content-type": "application/json" } }
    );
  }

  try {
    const linksRes = await fetch(`${immichUrl}/api/shared-links`, {
      headers: { "x-api-key": apiKey },
    });
    if (!linksRes.ok) {
      return new Response(
        JSON.stringify({ error: `Immich shared-links fetch failed: Status ${linksRes.status}` }),
        { status: linksRes.status, headers: { "content-type": "application/json" } }
      );
    }

    const links: any[] = await linksRes.json();
    const q = query.toLowerCase();

    // De-dup: a single album is usually exposed by TWO shared links — a raw
    // key AND a slug — which would otherwise show the same album twice in the
    // picker ("double albums"). Collapse to one entry per album.id, preferring
    // the link that carries a slug (cleaner for clients to read/type).
    const albumMap = new Map<string, any>();
    for (const l of links) {
      if (l.type !== "ALBUM" || !l.album?.id || !l.key) continue;
      const existing = albumMap.get(l.album.id);
      if (!existing || (!existing.slug && l.slug)) albumMap.set(l.album.id, l);
    }

    const matches = Array.from(albumMap.values())
      .map((l) => ({
        key: l.key as string,
        name: (l.album.albumName || "") as string,
        slug: (l.slug || "") as string,
      }))
      // Rank: exact slug > exact name > slug startsWith > name startsWith > substring.
      .map((m) => {
        const nameL = m.name.toLowerCase();
        const slugL = m.slug.toLowerCase();
        let score = -1;
        if (slugL === q) score = 4;
        else if (nameL === q) score = 3;
        else if (slugL.startsWith(q)) score = 2;
        else if (nameL.startsWith(q)) score = 1;
        else if (nameL.includes(q) || slugL.includes(q)) score = 0;
        return { ...m, score };
      })
      .filter((m) => m.score >= 0)
      .sort((a, b) => b.score - a.score || a.name.localeCompare(b.name))
      .slice(0, 8)
      .map(({ score, ...rest }) => rest);

    return new Response(JSON.stringify({ query, matches }), {
      status: 200,
      headers: {
        "content-type": "application/json",
        // Always fresh: this is a lookup, never cache.
        "Cache-Control": "no-store, must-revalidate",
      },
    });
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message || "Internal Server Error" }),
      { status: 500, headers: { "content-type": "application/json" } }
    );
  }
}
