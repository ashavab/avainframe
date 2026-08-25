import { portfolioEntries as manualEntries } from "../data/portfolioData";
import { generatedEntries } from "../data/portfolioGenerated";

export function Portfolio() {
  const entries = (manualEntries && manualEntries.length > 0) ? manualEntries : generatedEntries;

  return (
    <section id="portfolio" className="py-20 bg-transparent transition-colors duration-1000">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center">
          <h2 className="text-4xl md:text-5xl font-serif mb-4 dark:text-white transition-colors">Portfolio</h2>
          <p className="mx-auto mb-12 max-w-2xl text-base text-slate-600 dark:text-slate-300">
            A curated collection of candid moments, authentic connections, and milestone stories captured across Toronto and beyond.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {entries.map((entry: any) => (
            <article key={entry.title} className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-slate-700 dark:bg-slate-900">
              <img
                src={entry.imageUrl}
                alt={entry.title}
                loading="lazy"
                className="h-72 w-full object-cover transition duration-500 hover:scale-105"
              />
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
          ))}
        </div>
      </div>
    </section>
  );
}
