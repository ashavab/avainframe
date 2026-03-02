import { Menu, X } from "lucide-react";
import { useState } from "react";

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsOpen(false);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm z-50 border-b border-gray-100 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo Section */}
          <div className="flex items-center cursor-pointer" onClick={() => scrollToSection("home")}>
            <img 
            src="/logo.png" 
            alt="Ava In Frame" 
            className="h-14 w-auto [filter:brightness(1.1)_contrast(1.1)_multiply]"
            style={{ mixBlendMode: 'multiply' }}
          />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8 text-sm uppercase tracking-widest text-gray-600">
            <button onClick={() => scrollToSection("home")} className="hover:text-[#7a8d7d] transition-colors">Home</button>
            <button onClick={() => scrollToSection("about")} className="hover:text-[#7a8d7d] transition-colors">About</button>
            <button onClick={() => scrollToSection("portfolio")} className="hover:text-[#7a8d7d] transition-colors">Portfolio</button>
            <button onClick={() => scrollToSection("contact")} className="bg-[#7a8d7d] text-white px-8 py-2.5 rounded-full hover:opacity-90 transition-opacity">
              Contact
            </button>
          </div>

          <button className="md:hidden text-[#7a8d7d]" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-6 py-8 space-y-6 text-center uppercase tracking-widest text-sm">
          <button onClick={() => scrollToSection("home")} className="block w-full">Home</button>
          <button onClick={() => scrollToSection("about")} className="block w-full">About</button>
          <button onClick={() => scrollToSection("portfolio")} className="block w-full">Portfolio</button>
          <button onClick={() => scrollToSection("contact")} className="block w-full bg-[#7a8d7d] text-white py-4 rounded-full">Contact</button>
        </div>
      )}
    </nav>
  );
}