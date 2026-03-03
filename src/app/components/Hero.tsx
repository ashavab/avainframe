"use client";
import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";

interface HeroProps {
  heroImage: string;
}

export function Hero({ heroImage }: HeroProps) {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => setOffset(window.scrollY * 0.4);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToContact = () => {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center scale-110"
        style={{ 
          backgroundImage: `url(${heroImage})`,
          transform: `translateY(${offset}px)` 
        }}
      >
        <div className="absolute inset-0 bg-white/40 dark:bg-black/50 backdrop-blur-[1px] transition-colors duration-1000" />
      </div>
      
      <div className="relative z-10 text-center px-4">
        <div className="flex justify-center mb-12">
          <div className="relative flex items-center justify-center p-16">
            <div className="absolute inset-0 rounded-full bg-[#819184]/25 blur-[80px] scale-150" />
            <img 
              src="/logo.png" 
              alt="Ava In Frame Logo" 
              className="relative h-48 md:h-72 w-auto object-contain transition-all duration-700 hover:scale-105 [filter:invert(61%)_sepia(12%)_saturate(405%)_hue-rotate(84deg)_brightness(94%)_contrast(82%)]" 
            />
          </div>
        </div>
        
        <p className="text-2xl md:text-3xl mb-12 max-w-2xl mx-auto tracking-wide text-gray-900 dark:text-white font-medium drop-shadow-md transition-colors">
          Capturing life's precious moments with artistry and passion
        </p>

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