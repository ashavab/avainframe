import { Globe, Camera, MapPin, Heart } from "lucide-react";
import { useState } from "react";
import ConsultationModal from "./ConsultationModal";

export default function TravelService() {
  const [modalOpen, setModalOpen] = useState(false);
  return (
    <div className="bg-white text-gray-900 dark:bg-[#18181b] dark:text-white">
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            {"@type": "ListItem", "position": 1, "name": "Home", "item": "https://avainframe.com"},
            {"@type": "ListItem", "position": 2, "name": "Travel Photography", "item": "https://avainframe.com/travel"}
          ]
        })}
      </script>
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Service",
          "name": "Travel & Destination Photography",
          "description": "Available for destination weddings, elopements, and travel photography worldwide.",
          "provider": {"@type": "LocalBusiness", "name": "Ava in Frame", "url": "https://avainframe.com", "telephone": "+1-647-710-4734", "email": "hello@avainframe.com"},
          "areaServed": [
            {"@type": "AdministrativeArea", "name": "Toronto"},
            {"@type": "AdministrativeArea", "name": "Greater Toronto Area"},
            {"@type": "Country", "name": "Canada"},
            {"@type": "Country", "name": "International"}
          ],
          "priceRange": "Custom",
          "url": "https://avainframe.com/travel"
        })}
      </script>
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "Do you offer destination photography?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes! We are available for travel and destination photography worldwide."
              }
            },
            {
              "@type": "Question",
              "name": "How does travel pricing work?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Travel fees are based on location and session type. Contact us for a custom quote."
              }
            },
            {
              "@type": "Question",
              "name": "What destinations have you photographed?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "We have photographed weddings, portraits, and landscapes across Canada and internationally."
              }
            }
          ]
        })}
      </script>
      <main className="min-h-screen bg-white text-gray-900 px-6 py-12">
        <button onClick={() => window.location.hash = '/'} className="mb-8 px-6 py-2 rounded-full bg-[#819184] text-white font-semibold hover:bg-[#6b7d6e] transition-all">← Back</button>
        <section className="max-w-4xl mx-auto mb-12">
          <h1 className="text-5xl font-serif mb-6 dark:text-black">Travel & Destination Photography</h1>
          <h2 className="text-2xl font-semibold mb-4 text-[#819184]">Worldwide Weddings, Elopements & Adventures</h2>
          <p className="mb-6 text-lg">Capture your adventures and special moments anywhere in the world. We offer destination wedding, elopement, and travel photography with custom packages for every journey.</p>
          <ul className="list-disc pl-6 mb-6 text-gray-700">
            <li>Destination weddings and elopements</li>
            <li>Travel, adventure, and landscape photography</li>
            <li>Flexible packages and custom quotes</li>
            <li>All images professionally edited and delivered online</li>
          </ul>
          <h3 className="text-xl font-serif mb-2">Why Choose Ava in Frame?</h3>
          <ul className="list-disc pl-6 mb-6 text-gray-700">
            <li>Experienced travel and wedding photographer</li>
            <li>Creative, documentary approach</li>
            <li>Personalized service for every client</li>
          </ul>
        </section>
        <div className="mx-auto max-w-4xl pt-20">
        <button
          onClick={() => (window.location.hash = "/")}
          className="mb-8 rounded-full border border-black/15 px-4 py-2 text-sm hover:bg-black/5"
        >
          Back to home
        </button>

        <article className="space-y-8">
          <header>
            <h1 className="text-4xl md:text-5xl font-serif mb-4">Travel & Destination Photography</h1>
            <p className="text-xl text-gray-600 mb-6">
              Available for weddings, elopements, and adventures worldwide—let's capture your story wherever it unfolds.
            </p>
          </header>

          <div className="grid md:grid-cols-2 gap-8 my-8">
            <div className="space-y-4">
              <div className="flex gap-4">
                <Globe className="w-6 h-6 text-[#819184] flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-serif text-xl mb-2">Worldwide Coverage</h3>
                  <p className="text-gray-600">
                    From Toronto to Tuscany, we travel anywhere to document your special moments.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <Camera className="w-6 h-6 text-[#819184] flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-serif text-xl mb-2">Creative Storytelling</h3>
                  <p className="text-gray-600">
                    Documentary style with an eye for adventure, emotion, and beautiful landscapes.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <MapPin className="w-6 h-6 text-[#819184] flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-serif text-xl mb-2">Custom Packages</h3>
                  <p className="text-gray-600">
                    Every journey is unique—get a custom quote for your destination or adventure.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <Heart className="w-6 h-6 text-[#819184] flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-serif text-xl mb-2">Personal Approach</h3>
                  <p className="text-gray-600">
                    We get to know you and your story to create images that truly reflect your experience.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#f8f7f4] to-[#e8e5dc] rounded-2xl p-8 flex flex-col justify-center">
              <h3 className="font-serif text-2xl mb-4">Session Options</h3>
              <ul className="space-y-3 text-gray-700 mb-8">
                <li className="flex items-start gap-3">
                  <span className="text-[#819184] font-bold mt-1">•</span>
                  <span>Destination weddings & elopements</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#819184] font-bold mt-1">•</span>
                  <span>Adventure & travel sessions</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#819184] font-bold mt-1">•</span>
                  <span>Landscape & editorial photography</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#819184] font-bold mt-1">•</span>
                  <span>Custom packages & quotes</span>
                </li>
              </ul>

              <button
                onClick={() => setModalOpen(true)}
                className="w-full rounded-xl bg-[#819184] text-white py-3 font-medium hover:opacity-90"
              >
                Book Your Session
              </button>
              <ConsultationModal open={modalOpen} onClose={() => setModalOpen(false)} />
            </div>
          </div>

          <div className="mt-12 pt-8 border-t">
            <h3 className="font-serif text-lg mb-4">Other Services</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <button onClick={() => (window.location.hash = "/#/weddings")} className="text-left p-4 border rounded-lg hover:bg-gray-50">
                <strong>Wedding Photography</strong>
                <p className="text-sm text-gray-600">Full-day coverage for your big day</p>
              </button>
              <button onClick={() => (window.location.hash = "/#/landscape")} className="text-left p-4 border rounded-lg hover:bg-gray-50">
                <strong>Landscape Photography</strong>
                <p className="text-sm text-gray-600">Fine art prints and custom commissions</p>
              </button>
            </div>
          </div>

          <section className="border-t pt-8">
            <h2 className="font-serif text-2xl mb-4">Great For</h2>
            <ul className="grid md:grid-cols-2 gap-4 text-gray-700">
              <li className="flex items-start gap-3">
                <span className="text-[#819184] font-bold">→</span>
                <span>Destination weddings & elopements</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#819184] font-bold">→</span>
                <span>Travel and adventure lovers</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#819184] font-bold">→</span>
                <span>Landscape and editorial projects</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#819184] font-bold">→</span>
                <span>Capturing memories worldwide</span>
              </li>
            </ul>
          </section>

          <section className="bg-[#f8f7f4] rounded-2xl p-8">
            <h2 className="font-serif text-2xl mb-4">Ready for an Adventure?</h2>
            <p className="text-gray-700 mb-6">
              Contact us to plan your destination wedding, elopement, or travel session—let's make memories anywhere in the world.
            </p>
            <div className="space-y-2">
              <p className="text-gray-600">
                <strong>Email:</strong> hello@avainframe.com
              </p>
              <p className="text-gray-600">
                <strong>Phone:</strong> +1 (647) 710-4734
              </p>
              <p className="text-gray-600">
                <strong>WhatsApp:</strong> Message us directly at +1 (647) 710-4734
              </p>
            </div>
          </section>

          <section className="border-t pt-8">
            <h2 className="font-serif text-2xl mb-4">Travel Photography FAQs</h2>
            <div className="space-y-4 text-gray-700">
              <div>
                <h3 className="font-medium">Do you offer destination photography?</h3>
                <p>Yes! We are available for travel and destination photography worldwide.</p>
              </div>
              <div>
                <h3 className="font-medium">How does travel pricing work?</h3>
                <p>Travel fees are based on location and session type. Contact us for a custom quote.</p>
              </div>
              <div>
                <h3 className="font-medium">What destinations have you photographed?</h3>
                <p>We have photographed weddings, portraits, and landscapes across Canada and internationally.</p>
              </div>
            </div>
          </section>
        </article>
      </div>
    </main>
    </div>
  );
}
