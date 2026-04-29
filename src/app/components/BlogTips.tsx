import React from "react";

const posts = [
  {
    title: "How to Prepare for Your Photo Session",
    date: "2026-04-15",
    excerpt: "Tips for getting the most out of your photography session, from outfits to locations.",
    url: "#"
  },
  {
    title: "Why Candid Photography Tells the Best Story",
    date: "2026-03-28",
    excerpt: "Discover the magic of candid moments and why they matter for your memories.",
    url: "#"
  },
  {
    title: "Top Toronto Locations for Engagement Photos",
    date: "2026-02-10",
    excerpt: "Explore the best spots in Toronto for unforgettable engagement sessions.",
    url: "#"
  }
];

export function BlogTips() {
  return (
    <section id="blog" className="py-20 px-4 bg-transparent transition-colors duration-1000">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl font-serif text-center mb-12 text-gray-900 dark:text-white">Photography Tips & Blog</h2>
        <div className="text-center mb-8">
          <a href="/#/weddings" className="text-[#819184] hover:underline mx-2">Wedding Photography</a>
          <a href="/#/engagements" className="text-[#819184] hover:underline mx-2">Engagements</a>
          <a href="/#/family" className="text-[#819184] hover:underline mx-2">Family Sessions</a>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {posts.map((post, i) => (
            <article key={i} className="bg-white/80 dark:bg-black/40 p-8 rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm">
              <header className="mb-4">
                <h3 className="text-xl font-serif mb-2 dark:text-white">{post.title}</h3>
                <time className="text-xs text-gray-400 dark:text-gray-500">{post.date}</time>
              </header>
              <p className="text-gray-700 dark:text-gray-300 text-sm mb-4">{post.excerpt}</p>
              <a href={post.url} className="text-[#819184] hover:underline text-sm font-medium">Read More</a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
