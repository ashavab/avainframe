import React from "react";

export type Review = {
  author: string;
  text: string;
  rating?: number;
  date?: string;
};

const reviews: Review[] = [
  {
    author: "Jessica T.",
    text: "Ashleigh captured our wedding day so beautifully! Every photo tells a story. Highly recommend!",
    rating: 5,
    date: "2025-09-12"
  },
  {
    author: "Michael R.",
    text: "Professional, creative, and so easy to work with. Our family portraits are stunning.",
    rating: 5,
    date: "2026-02-18"
  },
  {
    author: "Priya S.",
    text: "The best photography experience we've ever had. Thank you for making our memories last!",
    rating: 5,
    date: "2026-03-05"
  }
];

export function Reviews() {
  return (
    <section id="reviews" className="py-20 px-4 bg-transparent transition-colors duration-1000">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl font-serif text-center mb-12 text-gray-900 dark:text-white">Client Reviews</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {reviews.map((r, i) => (
            <figure key={i} className="bg-white/80 dark:bg-black/40 p-8 rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm">
              <blockquote className="italic text-lg text-gray-700 dark:text-gray-300 mb-4">“{r.text}”</blockquote>
              <figcaption className="text-sm text-gray-500 dark:text-gray-400">— {r.author}</figcaption>
            </figure>
          ))}
        </div>
        {/* Schema.org markup for reviews */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Product",
          "name": "Ava in Frame Photography",
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "5",
            "reviewCount": reviews.length
          },
          "review": reviews.map(r => ({
            "@type": "Review",
            "author": r.author,
            "reviewBody": r.text,
            "reviewRating": { "@type": "Rating", "ratingValue": r.rating || 5 },
            ...(r.date ? { datePublished: r.date } : {})
          }))
        }) }} />
      </div>
    </section>
  );
}
