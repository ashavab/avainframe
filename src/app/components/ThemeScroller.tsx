"use client";
import { useEffect, useState } from "react";

export function ThemeScroller() {
  const [theme, setTheme] = useState("bg-[#fdfcfb]");

  useEffect(() => {
    const handleScroll = () => {
      const isDark = document.documentElement.classList.contains("dark");
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollHeight > 0 ? window.scrollY / scrollHeight : 0;

      if (isDark) {
        if (progress < 0.3) setTheme("bg-[#1a1c1a]");
        else if (progress < 0.7) setTheme("bg-[#242924]");
        else setTheme("bg-[#2d362d]");
      } else {
        if (progress < 0.3) setTheme("bg-[#fdfcfb]");
        else if (progress < 0.7) setTheme("bg-[#f2f4f1]");
        else setTheme("bg-[#e4e9e4]");
      }
    };

    const observer = new MutationObserver(handleScroll);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      observer.disconnect();
    };
  }, []);

  return <div className={`fixed inset-0 -z-10 transition-colors duration-1000 ${theme}`} />;
}