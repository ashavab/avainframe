import { useEffect, useState } from "react";
import { portfolioEntries } from "../data/portfolioData";

const IMMICH_URL = "https://backup.avainframe.com";

// Cover image is fetched live from Immich (served via the Vercel proxy
// /api/portfolio-covers to avoid CORS). The browser then loads the bytes
// directly from Immich as an <img> — same pattern as the client/family
// galleries. No local image files are used.
function immichThumb(id: string, key: string, size: "thumbnail" | "preview") {
  return `${IMMICH_URL}/api/assets/${id}/thumbnail?key=${key}&size=${size}`;
}

type Covers = Record<string, { id: string; key: string } | null>;

export function Portfolio() {
  // Map each entry's category to its cover id/key from the proxy.
  const [covers, setCovers] = useState<Covers | null>(null);

  useEffect(() => {
    let mounted = true;
    fetch("/api/portfolio-covers")
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d: any) => mounted && setCovers(d.covers ?? {}))
      .catch(() => mounted && setCovers({}));
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section id="portfolio" className="py-20 bg-transparent transition-colors duration-1000">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center">
          <h2 className="text-4xl md:text-5xl font-serif mb-4 dark:text-white transition-colors">Portfolio</h2>
          <p className="mx-auto mb-12 max-w-2xl text-base text-slate-600 dark:text-slate-300">
            A curated collection of candid moments, authentic connections, and milestone stories captured across Toronto and beyond.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {portfolioEntries.map((entry: any) => {
            const cover = covers?.[entry.category] ?? null;
            const imgSrc = cover
              ? immichThumb(cover.id, cover.key, "preview")
              : "";
            return (
              <article key={entry.title} className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-slate-700 dark:bg-slate-900">
              {cover ? (
              <img
                src={imgSrc}
                alt={entry.title}
                loading="lazy"
                className="h-56 w-full object-cover transition duration-500 hover:scale-105 md:h-72"
              />
              ) : (
                  <div className="flex h-72 w-full items-center justify-center bg-slate-100 text-sm text-slate-400 dark:bg-slate-800">
                    {covers ? "No photo in album yet" : "Loading…"}
                  </div>
                )}
                <div className="p-6">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex rounded-full bg-[#eef5eb] px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-[#4d644d] dark:bg-slate-800 dark:text-slate-200">
                      {entry.category}
                    </span>
                  </div>
                  <h3 className="mt-4 text-xl font-semibold text-slate-900 dark:text-white">{entry.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{entry.description}</p>
                  {entry.galleryLink ? (
                    <a
                      href={entry.galleryLink}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-6 inline-flex items-center rounded-full bg-[#556b53] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#3f523f]"
                    >
                      View shoot gallery
                    </a>
                  ) : null}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
