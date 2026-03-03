import { ChevronDown, ChevronUp } from "lucide-react";
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
    <section id="faq" className="py-20 px-4 bg-white">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-4xl font-serif text-center mb-12">Common Questions</h2>
        <div className="space-y-4 border-t border-gray-100">
          {faqs.map((f, i) => (
            <div key={i} className="border-b border-gray-100">
              <button 
                onClick={() => setActive(active === i ? null : i)} 
                className="w-full flex justify-between items-center py-6 text-left font-medium text-lg hover:text-gray-600 transition-colors group"
              >
                <span>{f.q}</span>
                <div className="transition-transform duration-300">
                  {active === i ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </div>
              </button>
              {active === i && (
                <div className="pb-6 text-gray-600 leading-relaxed animate-in fade-in slide-in-from-top-2 duration-300">
                  {f.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}