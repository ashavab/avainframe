import { Navigation } from "./components/Navigation";
import { Hero } from "./components/Hero";
import { About } from "./components/About";
import { Services } from "./components/Services";
import { FAQ } from "./components/FAQ";
import { Contact } from "./components/Contact";
import { Footer } from "./components/Footer";

function Portfolio() {
  return (
    <section id="portfolio" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-serif text-gray-800 mb-12 text-center">Portfolio</h2>
        <div className="w-full overflow-hidden rounded-xl shadow-lg">
          <iframe 
            src="https://widgets.sociablekit.com/instagram-feed/iframe/25659098" 
            className="w-full border-0 h-[600px] md:h-[800px]"
            title="Instagram Feed"
          />
        </div>
      </div>
    </section>
  );
}

export default function App() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <Hero heroImage="/window.jpeg" />
      <About aboutImage="/ashleigh.jpg" profileImage="/avana.jpg"/>
      <Services />
      <Portfolio />
      <FAQ />
      <Contact />
      <Footer />
    </div>
  );
}