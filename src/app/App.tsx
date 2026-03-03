import { ThemeScroller } from "./components/ThemeScroller";
import { ScrollProgress } from "./components/ScrollProgress";
import { Navigation } from "./components/Navigation";
import { Hero } from "./components/Hero";
import { Marquee } from "./components/Marquee";
import { StaggerReveal } from "./components/StaggerReveal";
import { About } from "./components/About";
import { Services } from "./components/Services";
import { FAQ } from "./components/FAQ";
import { Contact } from "./components/Contact";
import { Footer } from "./components/Footer";

function Portfolio() {
  return (
    <section id="portfolio" className="py-20 bg-transparent">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <h2 className="text-4xl md:text-5xl font-serif mb-12 dark:text-white">Portfolio</h2>
        <div className="w-full overflow-hidden rounded-xl shadow-lg">
          <iframe 
            src="https://widgets.sociablekit.com/instagram-feed/iframe/25659098" 
            className="w-full border-0 h-[600px] md:h-[800px] bg-white"
            title="Instagram Feed"
          />
        </div>
      </div>
    </section>
  );
}

export default function App() {
  return (
    <div className="min-h-screen relative transition-colors duration-1000 dark:text-white text-gray-900">
      <ThemeScroller />
      <ScrollProgress />
      <Navigation />
      <Hero heroImage="/window.jpeg" />
      <Marquee />
      <div className="space-y-0 bg-transparent">
        <StaggerReveal><About aboutImage="/ashleigh.jpg" profileImage="/avana.jpg"/></StaggerReveal>
        <Services />
        <StaggerReveal><Portfolio /></StaggerReveal>
        <StaggerReveal><FAQ /></StaggerReveal>
        <Contact />
      </div>
      <Footer />
    </div>
  );
}