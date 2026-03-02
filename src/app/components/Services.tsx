import { Heart, Users, Baby, Sparkles } from "lucide-react";
import { useState } from "react";

const services = [
  { icon: Heart, title: "Weddings", desc: "Capturing every magical moment.", rate: 250, min: 4, max: 12 },
  { icon: Users, title: "Portraits", desc: "Professional studio or outdoor sessions.", rate: 200, min: 1, max: 6 },
  { icon: Baby, title: "Newborn", desc: "Gentle photography celebrating new life.", rate: 200, min: 1, max: 4 },
  { icon: Sparkles, title: "Events", desc: "Coverage for parties and celebrations.", rate: 200, min: 2, max: 10 }
];

function ServiceCard({ service }: { service: any }) {
  const [hours, setHours] = useState(service.min);

  return (
    <div className="bg-white p-8 rounded-2xl border border-gray-100 hover:border-black transition-all duration-300 group flex flex-col justify-between">
      <div>
        <div className="w-14 h-14 bg-gray-50 rounded-full flex items-center justify-center mb-6 group-hover:bg-black group-hover:text-white transition-colors">
          <service.icon className="w-6 h-6" />
        </div>
        <h3 className="text-2xl mb-3 font-serif italic">{service.title}</h3>
        <p className="text-gray-600 mb-6 text-sm leading-relaxed">{service.desc}</p>
      </div>
      <div className="mt-4 pt-4 border-t border-gray-100 space-y-4">
        <div className="flex justify-between items-baseline">
          <span className="text-sm font-medium">{hours} Hour{hours > 1 ? 's' : ''}</span>
          <div className="text-right">
            <span className="text-xl font-bold">${hours * service.rate}</span>
            <span className="text-xs text-gray-400 ml-1">+ travel</span>
          </div>
        </div>
        <input 
          type="range" min={service.min} max={service.max} value={hours} 
          onChange={(e) => setHours(Number(e.target.value))} 
          className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black"
        />
      </div>
    </div>
  );
}

export function Services() {
  return (
    <section id="services" className="py-20 px-4 bg-[#fdfcfb]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl mb-4 font-serif">Services</h2>
          <p className="text-gray-600 text-lg">Transparent pricing with real-time estimates</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((s, index) => <ServiceCard key={index} service={s} />)}
        </div>
      </div>
    </section>
  );
}