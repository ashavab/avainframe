export function Portfolio() {
  return (
    <section id="portfolio" className="py-20 bg-transparent transition-colors duration-1000">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <h2 className="text-4xl md:text-5xl font-serif mb-12 dark:text-white transition-colors">Portfolio</h2>
        
        {/* 'multiply' makes white transparent. 'isolate' prevents it from eating your background colors. */}
        <div className="w-full overflow-hidden rounded-xl bg-transparent isolate">
          <div className="mix-blend-multiply dark:invert dark:hue-rotate-180 dark:brightness-90 transition-all duration-700">
            <iframe 
              src="https://widgets.sociablekit.com/instagram-feed/iframe/25659098" 
              className="w-full border-0 h-[800px] bg-white"
              title="Instagram Feed"
            />
          </div>
        </div>
      </div>
    </section>
  );
}