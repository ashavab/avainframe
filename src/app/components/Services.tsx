import { Heart, Users, Baby, Sparkles } from "lucide-react";
import { useState } from "react";

const peopleServices = [
  { icon: Users, title: "Portraits", desc: "Professional studio or outdoor sessions.", rate: 200, extra: 100, min: 1, max: 6, tiered: true },
  { icon: Baby, title: "Newborn", desc: "Gentle photography celebrating new life.", rate: 200, extra: 100, min: 1, max: 4, tiered: true },
  { icon: Heart, title: "Boudoir", desc: "Empowering, tasteful, and private sessions.", rate: 250, min: 2, max: 6, tiered: false },
  { icon: Users, title: "Headshots", desc: "Professional headshots for business or personal branding.", rate: 150, min: 1, max: 3, tiered: false },
];

const eventServices = [
  { icon: Heart, title: "Weddings", desc: "Capturing every magical moment. (free in person consultation)", rate: 250, min: 4, max: 12, tiered: false },
  { icon: Sparkles, title: "Events", desc: "Coverage for parties and celebrations. (free in person consultation)", rate: 200, min: 2, max: 10, tiered: false },
];

const commercialServices = [
  { icon: Sparkles, title: "Real Estate", desc: "Professional real estate photography for listings and rentals.", rate: 180, min: 1, max: 4, tiered: false },
  { icon: Sparkles, title: "Pets", desc: "Fun and creative pet photography sessions.", rate: 120, min: 1, max: 3, tiered: false },
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
        {/* Main service cards for most-checked services only */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-12">
          {/* People */}
          <div>
            <h3 className="text-xl font-semibold mb-5 text-[#819184] text-center">People</h3>
            <div className="flex flex-col gap-6">
              {/* Only show Portraits and Newborn as full cards */}
              {peopleServices.filter(s => ["Portraits", "Newborn"].includes(s.title)).map((s) => <ServiceCard key={s.title} service={s} />)}
            </div>
          </div>
          {/* Events */}
          <div>
            <h3 className="text-xl font-semibold mb-5 text-[#819184] text-center">Events</h3>
            <div className="flex flex-col gap-6">
              {/* Only show Weddings and Events as full cards */}
              {eventServices.map((s) => <ServiceCard key={s.title} service={s} />)}
            </div>
          </div>
        </div>

        {/* Link Tree Box for all services */}
        <div className="mt-8 rounded-2xl border border-gray-100 dark:border-white/10 bg-white/80 dark:bg-black/40 p-6 md:p-10 shadow-lg">
          <h3 className="font-serif text-2xl mb-3 dark:text-white text-center">All Services</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-7 text-center max-w-2xl mx-auto">
            Quick links to every service we offer. Explore more below!
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {/* People */}
            {peopleServices.map((s) => (
              <a
                key={s.title}
                href={`/#/${s.title.toLowerCase().replace(/\s+/g, "-")}`}
                className="inline-block rounded-full border border-[#819184]/30 px-5 py-2 text-sm font-medium text-[#819184] bg-white dark:bg-black/60 hover:bg-[#819184]/10 hover:text-black dark:hover:text-white transition"
              >
                {s.title}
              </a>
            ))}
            {/* Events */}
            {eventServices.map((s) => (
              <a
                key={s.title}
                href={`/#/${s.title.toLowerCase().replace(/\s+/g, "-")}`}
                className="inline-block rounded-full border border-[#819184]/30 px-5 py-2 text-sm font-medium text-[#819184] bg-white dark:bg-black/60 hover:bg-[#819184]/10 hover:text-black dark:hover:text-white transition"
              >
                {s.title}
              </a>
            ))}
            {/* Commercial */}
            {commercialServices.map((s) => (
              <a
                key={s.title}
                href={`/#/${s.title.toLowerCase().replace(/\s+/g, "-")}`}
                className="inline-block rounded-full border border-[#819184]/30 px-5 py-2 text-sm font-medium text-[#819184] bg-white dark:bg-black/60 hover:bg-[#819184]/10 hover:text-black dark:hover:text-white transition"
              >
                {s.title}
              </a>
            ))}
          </div>
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