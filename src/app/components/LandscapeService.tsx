import { Image, Globe, Briefcase, Camera } from "lucide-react";
import { useState } from "react";
import ConsultationModal from "./ConsultationModal";

export default function LandscapeService() {
  const [modalOpen, setModalOpen] = useState(false);
  return (
    <div className="bg-white text-gray-900 dark:bg-[#18181b] dark:text-white">
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            {"@type": "ListItem", "position": 1, "name": "Home", "item": "https://avainframe.com"},
            {"@type": "ListItem", "position": 2, "name": "Landscape Photography", "item": "https://avainframe.com/landscape"}
          ]
        })}
      </script>
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Service",
          "name": "Landscape Photography",
          "description": "Fine art landscape photography and prints. Commission custom landscape images or license for editorial/commercial use.",
          "provider": {"@type": "LocalBusiness", "name": "Ava in Frame", "url": "https://avainframe.com", "telephone": "+1-647-710-4734", "email": "hello@avainframe.com"},
          "areaServed": [
            {"@type": "AdministrativeArea", "name": "Toronto"},
            {"@type": "Country", "name": "Canada"},
            {"@type": "Country", "name": "International"}
          ],
          "priceRange": "Custom",
          "url": "https://avainframe.com/landscape"
        })}
      </script>
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "Can I purchase landscape prints?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes, fine art landscape prints are available for purchase. Contact us for available images and sizes."
              }
            },
            {
              "@type": "Question",
              "name": "Do you offer custom landscape commissions?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "We accept select commissions for custom landscape photography projects."
              }
            },
            {
              "@type": "Question",
              "name": "Are landscape images available for licensing?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes, images can be licensed for editorial or commercial use. Please inquire for details."
              }
            }
          ]
        })}
      </script>
      <main className="min-h-screen bg-white text-gray-900 px-6 py-12">
        <button onClick={() => window.location.hash = '/'} className="mb-8 px-6 py-2 rounded-full bg-[#819184] text-white font-semibold hover:bg-[#6b7d6e] transition-all">← Back</button>
        <section className="max-w-4xl mx-auto mb-12">
          <h1 className="text-5xl font-serif mb-6 dark:text-black">Landscape Photography</h1>
          <h2 className="text-2xl font-semibold mb-4 text-[#819184]">Fine Art Prints, Commissions & Licensing</h2>
          <p className="mb-6 text-lg">Explore fine art landscape photography. Prints, commissions, and licensing available for collectors, businesses, and editorial projects worldwide.</p>
          <ul className="list-disc pl-6 mb-6 text-gray-700">
            <li>Fine art prints for home or office</li>
            <li>Custom landscape commissions</li>
            <li>Editorial and commercial licensing</li>
            <li>Worldwide shipping available</li>
          </ul>
          <h3 className="text-xl font-serif mb-2">Why Choose Ava in Frame?</h3>
          <ul className="list-disc pl-6 mb-6 text-gray-700">
            <li>Experienced landscape and travel photographer</li>
            <li>Unique, artistic vision</li>
            <li>Personalized service for collectors and businesses</li>
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
            <h1 className="text-4xl md:text-5xl font-serif mb-4">Landscape Photography</h1>
            <p className="text-xl text-gray-600 mb-6">
              Fine art landscape images for collectors, businesses, and editorial use—available worldwide.
            </p>
          </header>

          <div className="grid md:grid-cols-2 gap-8 my-8">
            <div className="space-y-4">
              <div className="flex gap-4">
                <Image className="w-6 h-6 text-[#819184] flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-serif text-xl mb-2">Fine Art Prints</h3>
                  <p className="text-gray-600">
                    Choose from a curated collection of landscape prints for your home or office.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <Globe className="w-6 h-6 text-[#819184] flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-serif text-xl mb-2">Worldwide Shipping</h3>
                  <p className="text-gray-600">
                    Prints and artwork shipped globally, ready to display or frame.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <Briefcase className="w-6 h-6 text-[#819184] flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-serif text-xl mb-2">Commissions & Licensing</h3>
                  <p className="text-gray-600">
                    Custom landscape projects and image licensing for editorial or commercial use.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <Camera className="w-6 h-6 text-[#819184] flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-serif text-xl mb-2">Artistic Vision</h3>
                  <p className="text-gray-600">
                    Unique, creative approach to every landscape image.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#f8f7f4] to-[#e8e5dc] rounded-2xl p-8 flex flex-col justify-center">
              <h3 className="font-serif text-2xl mb-4">Session Options</h3>
              <ul className="space-y-3 text-gray-700 mb-8">
                <li className="flex items-start gap-3">
                  <span className="text-[#819184] font-bold mt-1">•</span>
                  <span>Fine art print purchase</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#819184] font-bold mt-1">•</span>
                  <span>Custom landscape commissions</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#819184] font-bold mt-1">•</span>
                  <span>Editorial/commercial licensing</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#819184] font-bold mt-1">•</span>
                  <span>Worldwide shipping</span>
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
              <button onClick={() => (window.location.hash = "/#/travel")} className="text-left p-4 border rounded-lg hover:bg-gray-50">
                <strong>Travel Photography</strong>
                <p className="text-sm text-gray-600">Destination, adventure, and editorial sessions</p>
              </button>
              <button onClick={() => (window.location.hash = "/#/headshots")} className="text-left p-4 border rounded-lg hover:bg-gray-50">
                <strong>Headshots</strong>
                <p className="text-sm text-gray-600">Professional portraits for business and branding</p>
              </button>
            </div>
          </div>

          <section className="border-t pt-8">
            <h2 className="font-serif text-2xl mb-4">Great For</h2>
            <ul className="grid md:grid-cols-2 gap-4 text-gray-700">
              <li className="flex items-start gap-3">
                <span className="text-[#819184] font-bold">→</span>
                <span>Art collectors and enthusiasts</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#819184] font-bold">→</span>
                <span>Businesses and offices</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#819184] font-bold">→</span>
                <span>Editorial and commercial projects</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#819184] font-bold">→</span>
                <span>Custom commissions</span>
              </li>
            </ul>
          </section>

          <section className="bg-[#f8f7f4] rounded-2xl p-8">
            <h2 className="font-serif text-2xl mb-4">Ready for Fine Art?</h2>
            <p className="text-gray-700 mb-6">
              Contact us to purchase prints, discuss a custom commission, or license images for your project.
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
            <h2 className="font-serif text-2xl mb-4">Landscape Photography FAQs</h2>
            <div className="space-y-4 text-gray-700">
              <div>
                <h3 className="font-medium">Can I purchase landscape prints?</h3>
                <p>Yes, fine art landscape prints are available for purchase. Contact us for available images and sizes.</p>
              </div>
              <div>
                <h3 className="font-medium">Do you offer custom landscape commissions?</h3>
                <p>We accept select commissions for custom landscape photography projects.</p>
              </div>
              <div>
                <h3 className="font-medium">Are landscape images available for licensing?</h3>
                <p>Yes, images can be licensed for editorial or commercial use. Please inquire for details.</p>
              </div>
            </div>
          </section>
        </article>
      </div>
    </main>
    </div>
  );
}
