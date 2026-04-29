import { Menu, X, Sun, Moon } from "lucide-react";
import { useState, useEffect } from "react";

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const clientPath = import.meta.env.VITE_IMMICH_CLIENT_PATH || "/clients";

  useEffect(() => {
    const root = window.document.documentElement;
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    
    const applyTheme = (isDarkSystem: boolean) => {
      const savedTheme = localStorage.getItem("theme");
      const shouldBeDark = savedTheme === "dark" || (!savedTheme && isDarkSystem);
      
      if (shouldBeDark) {
        root.classList.add("dark");
        setIsDark(true);
      } else {
        root.classList.remove("dark");
        setIsDark(false);
      }
    };

    applyTheme(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => applyTheme(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  const toggleDarkMode = () => {
    const root = window.document.documentElement;
    const newMode = !isDark;
    setIsDark(newMode);
    if (newMode) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsOpen(false);
    }
  };

  const goToClients = () => {
    const normalized = clientPath.startsWith("/") ? clientPath : `/${clientPath}`;
    window.location.hash = normalized;
    setIsOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/80 dark:bg-black/80 backdrop-blur-md z-50 border-b border-gray-100 dark:border-white/10 font-sans transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center cursor-pointer" onClick={() => scrollToSection("home")}>
            <img src="/logo.png" alt="Logo" className="h-12 w-auto dark:invert" />
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm uppercase tracking-widest text-gray-600 dark:text-gray-300">
            <button onClick={() => scrollToSection("home")} className="hover:text-[#7a8d7d]">Home</button>
            <button onClick={() => scrollToSection("about")} className="hover:text-[#7a8d7d]">About</button>
            <button onClick={() => scrollToSection("portfolio")} className="hover:text-[#7a8d7d]">Portfolio</button>
            <button onClick={goToClients} className="hover:text-[#7a8d7d]">Gallery</button>
            <button onClick={toggleDarkMode} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
              {isDark ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5" />}
            </button>
            <button onClick={() => scrollToSection("contact")} className="bg-[#7a8d7d] text-white px-8 py-2.5 rounded-full hover:opacity-90">
              Contact
            </button>
          </div>

          <div className="flex items-center gap-4 md:hidden">
            <button onClick={toggleDarkMode} className="p-2">{isDark ? <Sun className="w-6 h-6 text-yellow-400" /> : <Moon className="w-6 h-6" />}</button>
            <button className="text-[#7a8d7d]" onClick={() => setIsOpen(!isOpen)}>{isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}</button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white dark:bg-black border-t border-gray-100 dark:border-white/10 px-6 py-8 space-y-6 text-center uppercase tracking-widest text-sm dark:text-gray-200">
          <button onClick={() => scrollToSection("home")} className="block w-full">Home</button>
          <button onClick={() => scrollToSection("about")} className="block w-full">About</button>
          <button onClick={() => scrollToSection("portfolio")} className="block w-full">Portfolio</button>
          <button onClick={goToClients} className="block w-full">Gallery</button>
          <button onClick={() => scrollToSection("contact")} className="block w-full bg-[#7a8d7d] text-white py-4 rounded-full">Contact</button>
        </div>
      )}
    </nav>
  );
}