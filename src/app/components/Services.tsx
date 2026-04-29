import { Heart, Users, Baby, Sparkles } from "lucide-react";
import { useState } from "react";

const services = [
  { icon: Heart, title: "Weddings", desc: "Capturing every magical moment. (free in person consultation)", rate: 250, min: 4, max: 12, tiered: false },
  { icon: Users, title: "Portraits", desc: "Professional studio or outdoor sessions.", rate: 200, extra: 100, min: 1, max: 6, tiered: true },
  { icon: Baby, title: "Newborn", desc: "Gentle photography celebrating new life.", rate: 200, extra: 100, min: 1, max: 4, tiered: true },
  { icon: Sparkles, title: "Events", desc: "Coverage for parties and celebrations. (free in person consultation)", rate: 200, min: 2, max: 10, tiered: false }
];

function ServiceCard({ service }: { service: any }) {
  const [hours, setHours] = useState(service.min);
  const total = service.tiered && hours > 1 
    ? service.rate + (hours - 1) * service.extra 
    : hours * service.rate;

  return (
    <div className="bg-white/80 dark:bg-black/40 backdrop-blur-sm p-8 rounded-2xl border border-gray-100 dark:border-white/10 hover:border-[#819184] transition-all duration-300 group flex flex-col justify-between shadow-sm">
      <div>
        <div className="w-14 h-14 bg-gray-50 dark:bg-white/5 rounded-full flex items-center justify-center mb-6 group-hover:bg-[#819184] group-hover:text-white transition-colors">
          <service.icon className="w-6 h-6 dark:text-gray-300 group-hover:text-white" />
        </div>
        <h3 className="text-2xl mb-3 font-serif italic dark:text-white">{service.title}</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm leading-relaxed">{service.desc}</p>
      </div>
      <div className="mt-4 pt-4 border-t border-gray-100 dark:border-white/10 space-y-4">
        <div className="flex justify-between items-baseline">
          <span className="text-sm font-medium dark:text-gray-300">{hours} Hour{hours > 1 ? 's' : ''}</span>
          <div className="text-right">
            <span className="text-xl font-bold dark:text-white">${total}</span>
            <span className="text-[10px] text-gray-400 ml-1 uppercase">CAD + travel</span>
          </div>
        </div>
        <input 
          type="range" min={service.min} max={service.max} value={hours} 
          onChange={(e) => setHours(Number(e.target.value))} 
          className="w-full h-1.5 bg-gray-200 dark:bg-white/20 rounded-lg appearance-none cursor-pointer accent-[#819184]"
        />
      </div>
    </div>
  );
}

export function Services() {
  return (
    <section id="services" className="py-20 px-4 bg-transparent">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl mb-4 font-serif dark:text-white">Services</h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg">Transparent pricing with real-time estimates</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((s, index) => <ServiceCard key={index} service={s} />)}
        </div>
        <div className="mt-12 rounded-2xl border border-gray-100 dark:border-white/10 bg-white/70 dark:bg-black/30 p-6 md:p-8">
          <h3 className="font-serif text-2xl mb-3 dark:text-white">Explore Service Guides</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-5">
            Browse dedicated pages for Toronto wedding photography, engagement sessions, and family portrait photography.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
            <a href="/#/weddings" className="rounded-lg border border-black/10 px-4 py-3 text-sm hover:bg-black/5 dark:border-white/15 dark:hover:bg-white/10">
              Toronto Wedding Photography Packages
            </a>
            <a href="/#/engagements" className="rounded-lg border border-black/10 px-4 py-3 text-sm hover:bg-black/5 dark:border-white/15 dark:hover:bg-white/10">
              Toronto Engagement Photography Sessions
            </a>
            <a href="/#/family" className="rounded-lg border border-black/10 px-4 py-3 text-sm hover:bg-black/5 dark:border-white/15 dark:hover:bg-white/10">
              Toronto Family and Portrait Photography
            </a>
            <a href="/#/toronto-photographer" className="rounded-lg border border-black/10 px-4 py-3 text-sm hover:bg-black/5 dark:border-white/15 dark:hover:bg-white/10">
              Toronto Photographer Service Area
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}