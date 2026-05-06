import React from "react";


export type Review = {
  author: string;
  text: string;
  rating?: number;
  date?: string;
  source: 'Google' | 'Yelp' | 'Facebook';
};

const reviews: Review[] = [
  {
    author: "Jessica T.",
    text: "Ashleigh captured our wedding day so beautifully! Every photo tells a story. Highly recommend!",
    rating: 5,
    date: "2025-09-12",
    source: "Google"
  },
  {
    author: "Michael R.",
    text: "Professional, creative, and so easy to work with. Our family portraits are stunning.",
    rating: 5,
    date: "2026-02-18",
    source: "Yelp"
  },
  {
    author: "Priya S.",
    text: "The best photography experience we've ever had. Thank you for making our memories last!",
    rating: 5,
    date: "2026-03-05",
    source: "Facebook"
  },
  {
    author: "David L.",
    text: "Absolutely wonderful experience from start to finish. The photos are stunning!",
    rating: 5,
    date: "2026-04-10",
    source: "Google"
  },
  {
    author: "Samantha P.",
    text: "Ashleigh is so talented and made us feel comfortable. Highly recommend for family photos!",
    rating: 5,
    date: "2026-03-22",
    source: "Yelp"
  },
  {
    author: "Emily W.",
    text: "We loved our engagement session! The photos are beautiful and natural.",
    rating: 5,
    date: "2026-02-28",
    source: "Facebook"
  }
];

export function Reviews() {
  return (
    <section id="reviews" className="py-20 px-4 bg-transparent transition-colors duration-1000">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl font-serif text-center mb-12 text-gray-900 dark:text-white">Client Reviews</h2>
        <div className="flex flex-wrap justify-center gap-8 mb-10">
          <a
            href="https://g.page/r/CdJN4SgZHr5HEBM/review"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#4285F4] text-white font-semibold text-lg shadow hover:bg-[#357ae8] transition"
          >
            <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="Google" className="w-6 h-6" />
            Google Reviews
          </a>
          <a
            href="https://www.yelp.com/biz/ava-in-frame-photography-toronto"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#d32323] text-white font-semibold text-lg shadow hover:bg-[#b71c1c] transition"
          >
            <img src="https://upload.wikimedia.org/wikipedia/commons/a/ad/Yelp_Logo.svg" alt="Yelp" className="w-6 h-6" />
            Yelp Reviews
          </a>
          <a
            href="https://www.facebook.com/avainframe/reviews"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#4267B2] text-white font-semibold text-lg shadow hover:bg-[#365899] transition"
          >
            <img src="https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg" alt="Facebook" className="w-6 h-6" />
            Facebook Reviews
          </a>
        </div>
        <p className="text-center text-gray-700 dark:text-gray-300 text-lg">Read what real clients are saying about Ava in Frame Photography on your favorite platform!</p>
      </div>
    </section>
  );
}
