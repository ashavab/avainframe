import { ChevronDown } from "lucide-react";
import { useState } from "react";

const faqs = [
  { q: "What is your turnaround time?", a: "Standard delivery is 2-3 weeks for portraits and 6-8 weeks for weddings." },
  { q: "Do you travel outside the GTA?", a: "Yes! Travel fees apply for locations outside my standard radius." },
  { q: "How many photos will I receive?", a: "You'll get all high-resolution edited images from our session via a private gallery." },
  { q: "How do I book a session?", a: "Use the contact form below or reach out via WhatsApp to secure your date." }
];

export function FAQ() {
  const [active, setActive] = useState<number | null>(null);

  return (
    <section id="faq" className="py-20 px-4 bg-transparent transition-colors duration-1000">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-4xl font-serif text-center mb-12 text-gray-900 dark:text-white">Common Questions</h2>
        <div className="space-y-2 border-t border-gray-100 dark:border-white/10">
          {faqs.map((f, i) => (
            <div key={i} className="border-b border-gray-100 dark:border-white/10">
              <button 
                onClick={() => setActive(active === i ? null : i)} 
                className="w-full flex justify-between items-center py-8 text-left font-serif text-xl hover:text-[#819184] transition-colors"
              >
                <span className={active === i ? "text-[#819184]" : "text-gray-800 dark:text-gray-200"}>{f.q}</span>
                <div className={`transition-transform duration-500 ${active === i ? "rotate-180 text-[#819184]" : "text-gray-400"}`}>
                  <ChevronDown className="w-5 h-5" />
                </div>
              </button>
              <div className={`overflow-hidden transition-all duration-500 ease-in-out ${active === i ? "max-h-40 pb-8 opacity-100" : "max-h-0 opacity-0"}`}>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed pl-4 italic border-l-2 border-[#819184]/30">{f.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}