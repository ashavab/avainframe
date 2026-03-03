export function Marquee() {
  const items = ["Weddings", "Portraits", "Newborn", "Events", "Ava in Frame", "Toronto & GTA"];
  return (
    <div className="bg-[#98a38d] dark:bg-[#2d362d] py-4 overflow-hidden border-y border-black/5 dark:border-white/5 transition-colors duration-1000">
      <div className="flex whitespace-nowrap animate-marquee">
        {[...items, ...items].map((item, i) => (
          <span key={i} className="text-[#3a3d38] dark:text-[#a3ae9e] mx-8 text-sm uppercase tracking-[0.3em] font-medium">
            {item}
          </span>
        ))}
      </div>
      <style>{`
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .animate-marquee { animation: marquee 30s linear infinite; }
      `}</style>
    </div>
  );
}