import { Building2, Camera, MapPin, Clock } from "lucide-react";
import { useState } from "react";
import ConsultationModal from "./ConsultationModal";
import { SeoHead } from "./SeoHead";
import { BreadcrumbListSchema, ServiceAreaSchema } from "./schemaUtils";

export default function RealEstateService() {
  const [modalOpen, setModalOpen] = useState(false);
  return (
    <div className="bg-white text-gray-900 dark:bg-[#18181b] dark:text-white">
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            {"@type": "ListItem", "position": 1, "name": "Home", "item": "https://avainframe.com"},
            {"@type": "ListItem", "position": 2, "name": "Real Estate Photography", "item": "https://avainframe.com/real-estate"}
          ]
        })}
      </script>
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Service",
          "name": "Real Estate Photography",
          "description": "Professional real estate photography for residential and commercial listings in Toronto.",
          "provider": {"@type": "LocalBusiness", "name": "Ava in Frame", "url": "https://avainframe.com", "telephone": "+1-647-710-4734", "email": "hello@avainframe.com"},
          "areaServed": [
            {"@type": "AdministrativeArea", "name": "Toronto"},
            {"@type": "AdministrativeArea", "name": "Greater Toronto Area"},
            {"@type": "ServiceArea", "name": "Mississauga"},
            {"@type": "ServiceArea", "name": "Markham"},
            {"@type": "ServiceArea", "name": "Richmond Hill"}
          ],
          "priceRange": "$$",
          "url": "https://avainframe.com/real-estate"
        })}
      </script>
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "What types of real estate photography do you offer?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "We provide interior, exterior, aerial, and twilight real estate photography for residential and commercial properties."
              }
            },
            {
              "@type": "Question",
              "name": "How do I book a real estate session?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Contact us through our website or email to schedule your session. We offer flexible timing to suit your listing needs."
              }
            },
            {
              "@type": "Question",
              "name": "Are edited images included?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes, all delivered images are professionally edited for optimal presentation."
              }
            }
          ]
        })}
      </script>
      <main className="min-h-screen bg-white text-gray-900 px-6 py-12">
        <div className="mx-auto max-w-4xl pt-20">
        <button
          onClick={() => (window.location.hash = "/")}
          className="mb-8 rounded-full border border-black/15 px-4 py-2 text-sm hover:bg-black/5"
        >
          Back to home
        </button>

        <article className="space-y-8">
          <header>
            <h1 className="text-4xl md:text-5xl font-serif mb-4">Toronto Real Estate Photography</h1>
            <p className="text-xl text-gray-600 mb-6">
              Professional photography for homes, condos, and commercial properties in Toronto and the GTA.
            </p>
          </header>

          <div className="grid md:grid-cols-2 gap-8 my-8">
            <div className="space-y-4">
              <div className="flex gap-4">
                <Building2 className="w-6 h-6 text-[#819184] flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-serif text-xl mb-2">Residential & Commercial</h3>
                  <p className="text-gray-600">
                    We photograph houses, condos, apartments, offices, and retail spaces to help your listing stand out.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <Camera className="w-6 h-6 text-[#819184] flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-serif text-xl mb-2">Aerial & Twilight Options</h3>
                  <p className="text-gray-600">
                    Add drone or twilight photography for dramatic, eye-catching images that impress buyers.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <MapPin className="w-6 h-6 text-[#819184] flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-serif text-xl mb-2">Flexible Locations</h3>
                  <p className="text-gray-600">
                    We travel across Toronto and the GTA to photograph your property at its best.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <Clock className="w-6 h-6 text-[#819184] flex-shrink-0 mt-1" />
                <div>

                  <p className="text-gray-600">
                    Receive your edited images within 24-48 hours of your session.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#f8f7f4] to-[#e8e5dc] rounded-2xl p-8 flex flex-col justify-center">
              <h3 className="font-serif text-2xl mb-4">Session Options</h3>
              <ul className="space-y-3 text-gray-700 mb-8">
                <li className="flex items-start gap-3">
                  <span className="text-[#819184] font-bold mt-1">•</span>
                  <span>Standard real estate session (interior & exterior)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#819184] font-bold mt-1">•</span>
                  <span>Aerial/drone add-on</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#819184] font-bold mt-1">•</span>
                  <span>Twilight session add-on</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#819184] font-bold mt-1">•</span>

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
                <span>Realtors and real estate agents</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#819184] font-bold">→</span>
                <span>Homeowners selling their property</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#819184] font-bold">→</span>
                <span>Commercial property listings</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#819184] font-bold">→</span>
                <span>Rental and Airbnb hosts</span>
              </li>
            </ul>
          </section>

          <section className="bg-[#f8f7f4] rounded-2xl p-8">
            <h2 className="font-serif text-2xl mb-4">Ready to Book?</h2>
            <p className="text-gray-700 mb-6">
              Contact us to schedule your real estate photography session and make your listing shine.
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
            <h2 className="font-serif text-2xl mb-4">Real Estate Photography FAQs</h2>
            <div className="space-y-4 text-gray-700">
              <div>
                <h3 className="font-medium">What types of real estate photography do you offer?</h3>
                <p>We provide interior, exterior, aerial, and twilight real estate photography for residential and commercial properties.</p>
              </div>
              <div>
                <h3 className="font-medium">How do I book a real estate session?</h3>
                <p>Contact us through our website or email to schedule your session. We offer flexible timing to suit your listing needs.</p>
              </div>
              <div>
                <h3 className="font-medium">Are edited images included?</h3>
                <p>Yes, all delivered images are professionally edited for optimal presentation.</p>
              </div>
            </div>
          </section>
        </article>
      </div>
    </main>
    </div>
  );
}
