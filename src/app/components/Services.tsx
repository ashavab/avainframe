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
        {/* Redesigned Service Guides Box */}
        <div className="mt-12 rounded-2xl border border-gray-100 dark:border-white/10 bg-gradient-to-br from-white/90 via-[#f6f8f6]/80 to-[#eaf1ea]/80 dark:from-black/70 dark:via-black/60 dark:to-[#1a1e1a]/80 p-6 md:p-12 shadow-2xl">
          <h3 className="font-serif text-3xl mb-6 dark:text-white text-center tracking-tight">Explore Our Service Guides</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-10 text-center max-w-2xl mx-auto text-lg">
            Find the perfect photography service for your needs. Browse our detailed guides by category below.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* People & Events */}
            <div className="bg-white/70 dark:bg-black/30 rounded-xl p-6 border border-gray-100 dark:border-white/10 shadow group hover:shadow-lg transition">
              <div className="flex items-center gap-3 mb-4">
                <Users className="w-6 h-6 text-[#819184] group-hover:scale-110 transition-transform" />
                <h4 className="font-semibold text-[#819184] text-lg">People & Events</h4>
              </div>
              <ul className="space-y-2">
                <li><a href="/#/weddings" className="block rounded-lg border border-black/10 px-4 py-3 text-sm hover:bg-[#819184]/10 dark:border-white/15 dark:hover:bg-white/10">Wedding Photography</a></li>
                <li><a href="/#/engagements" className="block rounded-lg border border-black/10 px-4 py-3 text-sm hover:bg-[#819184]/10 dark:border-white/15 dark:hover:bg-white/10">Engagement Sessions</a></li>
                <li><a href="/#/family" className="block rounded-lg border border-black/10 px-4 py-3 text-sm hover:bg-[#819184]/10 dark:border-white/15 dark:hover:bg-white/10">Family & Portraits</a></li>
                <li><a href="/#/headshots" className="block rounded-lg border border-black/10 px-4 py-3 text-sm hover:bg-[#819184]/10 dark:border-white/15 dark:hover:bg-white/10">Professional Headshots</a></li>
                <li><a href="/#/boudoir" className="block rounded-lg border border-black/10 px-4 py-3 text-sm hover:bg-[#819184]/10 dark:border-white/15 dark:hover:bg-white/10">Boudoir Photography</a></li>
              </ul>
            </div>
            {/* Commercial & Pets */}
            <div className="bg-white/70 dark:bg-black/30 rounded-xl p-6 border border-gray-100 dark:border-white/10 shadow group hover:shadow-lg transition">
              <div className="flex items-center gap-3 mb-4">
                <Sparkles className="w-6 h-6 text-[#819184] group-hover:scale-110 transition-transform" />
                <h4 className="font-semibold text-[#819184] text-lg">Commercial & Pets</h4>
              </div>
              <ul className="space-y-2">
                <li><a href="/#/real-estate" className="block rounded-lg border border-black/10 px-4 py-3 text-sm hover:bg-[#819184]/10 dark:border-white/15 dark:hover:bg-white/10">Real Estate Photography</a></li>
                <li><a href="/#/pets" className="block rounded-lg border border-black/10 px-4 py-3 text-sm hover:bg-[#819184]/10 dark:border-white/15 dark:hover:bg-white/10">Pet Photography</a></li>
              </ul>
            </div>
            {/* Creative & Travel */}
            <div className="bg-white/70 dark:bg-black/30 rounded-xl p-6 border border-gray-100 dark:border-white/10 shadow group hover:shadow-lg transition">
              <div className="flex items-center gap-3 mb-4">
                <Heart className="w-6 h-6 text-[#819184] group-hover:scale-110 transition-transform" />
                <h4 className="font-semibold text-[#819184] text-lg">Creative & Travel</h4>
              </div>
              <ul className="space-y-2">
                <li><a href="/#/travel" className="block rounded-lg border border-black/10 px-4 py-3 text-sm hover:bg-[#819184]/10 dark:border-white/15 dark:hover:bg-white/10">Travel & Destination</a></li>
                <li><a href="/#/landscape" className="block rounded-lg border border-black/10 px-4 py-3 text-sm hover:bg-[#819184]/10 dark:border-white/15 dark:hover:bg-white/10">Landscape Photography</a></li>
                <li><a href="/#/toronto-photographer" className="block rounded-lg border border-black/10 px-4 py-3 text-sm hover:bg-[#819184]/10 dark:border-white/15 dark:hover:bg-white/10">Toronto Photographer Area</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}