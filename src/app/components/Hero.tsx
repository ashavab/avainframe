import { ArrowRight } from "lucide-react";

interface HeroProps {
  heroImage: string; // Use image_6.png here for proper contrast and negative space
}

export function Hero({ heroImage }: HeroProps) {
  const scrollToContact = () => {
    const element = document.getElementById("contact");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image Layer - Updated to use image_6.png with blur */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Ava In Frame Photography"
          className="w-full h-full object-cover scale-105"
        />
        {/* Lighter backdrop overlay with blur for separation */}
        <div className="absolute inset-0 bg-white/30 backdrop-blur-[2px]"></div>
      </div>
      
      <div className="relative z-10 text-center px-4">
        {/* Logo tinted with your specific sage green color: #819184 */}
        <div className="flex justify-center mb-12">
          <img 
            src="/logo.png" 
            alt="Ava In Frame Logo" 
            style={{ filter: "brightness(0) saturate(100%) invert(58%) sepia(9%) saturate(545%) hue-rotate(85deg) brightness(96%) contrast(85%)" }}
            className="h-48 md:h-72 w-auto object-contain transition-transform duration-700 hover:scale-105" 
          />
        </div>
        
        {/* Darker tagline for readability against the field background */}
        <p className="text-2xl md:text-3xl mb-12 max-w-2xl mx-auto tracking-wide text-gray-800 font-medium drop-shadow-sm">
          Capturing life's precious moments with artistry and passion
        </p>

        {/* Unified sage button with increased contrast */}
        <button 
          onClick={scrollToContact}
          className="bg-[#819184] text-white px-12 py-5 rounded-full hover:bg-[#6b7d6e] transition-all duration-300 inline-flex items-center gap-3 group text-base uppercase tracking-widest font-semibold shadow-lg hover:shadow-xl"
        >
          Book a Session
          <ArrowRight className="w-6 h-6 group-hover:translate-x-1.5 transition-transform" />
        </button>
      </div>
    </section>
  );
}