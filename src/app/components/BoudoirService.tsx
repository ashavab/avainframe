import { Heart, Lock, Home, Camera } from "lucide-react";
import { useState } from "react";
import ConsultationModal from "./ConsultationModal";

export default function BoudoirService() {
  const [modalOpen, setModalOpen] = useState(false);
  return (
    <div className="bg-white text-gray-900 dark:bg-[#18181b] dark:text-white">
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            {"@type": "ListItem", "position": 1, "name": "Home", "item": "https://avainframe.com"},
            {"@type": "ListItem", "position": 2, "name": "Boudoir Photography", "item": "https://avainframe.com/boudoir"}
          ]
        })}
      </script>
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Service",
          "name": "Boudoir Photography",
          "description": "Empowering boudoir photography in Toronto. Celebrate your confidence with a private, professional session.",
          "provider": {"@type": "LocalBusiness", "name": "Ava in Frame", "url": "https://avainframe.com", "telephone": "+1-647-710-4734", "email": "hello@avainframe.com"},
          "areaServed": [
            {"@type": "AdministrativeArea", "name": "Toronto"},
            {"@type": "AdministrativeArea", "name": "Greater Toronto Area"}
          ],
          "priceRange": "$$$",
          "url": "https://avainframe.com/boudoir"
        })}
      </script>
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "What is boudoir photography?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Boudoir photography is an empowering and intimate portrait session designed to celebrate your confidence and beauty."
              }
            },
            {
              "@type": "Question",
              "name": "Where do boudoir sessions take place?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Sessions can be held at your home or a private location of your choice."
              }
            },
            {
              "@type": "Question",
              "name": "Is privacy guaranteed?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Absolutely. All sessions are confidential and images are only shared with your explicit permission."
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
            <h1 className="text-4xl md:text-5xl font-serif mb-4">Boudoir Photography Toronto</h1>
            <p className="text-xl text-gray-600 mb-6">
              Intimate, empowering portrait sessions for every body and every story.
            </p>
          </header>

          <div className="grid md:grid-cols-2 gap-8 my-8">
            <div className="space-y-4">
              <div className="flex gap-4">
                <Heart className="w-6 h-6 text-[#819184] flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-serif text-xl mb-2">Empowering Experience</h3>
                  <p className="text-gray-600">
                    Celebrate your confidence and beauty in a safe, supportive environment.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <Lock className="w-6 h-6 text-[#819184] flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-serif text-xl mb-2">Privacy Guaranteed</h3>
                  <p className="text-gray-600">
                    All sessions are confidential and images are only shared with your explicit permission.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <Home className="w-6 h-6 text-[#819184] flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-serif text-xl mb-2">Home or Private Location</h3>
                  <p className="text-gray-600">
                    Choose your home or a private location for your session.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <Camera className="w-6 h-6 text-[#819184] flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-serif text-xl mb-2">Professional Results</h3>
                  <p className="text-gray-600">
                    All images are professionally edited and delivered in a private online gallery.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#f8f7f4] to-[#e8e5dc] rounded-2xl p-8 flex flex-col justify-center">
              <h3 className="font-serif text-2xl mb-4">Session Options</h3>
              <ul className="space-y-3 text-gray-700 mb-8">
                <li className="flex items-start gap-3">
                  <span className="text-[#819184] font-bold mt-1">•</span>
                  <span>Home or private location</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#819184] font-bold mt-1">•</span>
                  <span>Professional retouching included</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#819184] font-bold mt-1">•</span>
                  <span>All body types and identities welcome</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#819184] font-bold mt-1">•</span>
                  <span>Female photographer</span>
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
              <button onClick={() => (window.location.hash = "/#/headshots")} className="text-left p-4 border rounded-lg hover:bg-gray-50">
                <strong>Headshots</strong>
                <p className="text-sm text-gray-600">Professional portraits for business and branding</p>
              </button>
              <button onClick={() => (window.location.hash = "/#/family")} className="text-left p-4 border rounded-lg hover:bg-gray-50">
                <strong>Family Photography</strong>
                <p className="text-sm text-gray-600">Portraits for families, children, and individuals</p>
              </button>
            </div>
          </div>

          <section className="border-t pt-8">
            <h2 className="font-serif text-2xl mb-4">Great For</h2>
            <ul className="grid md:grid-cols-2 gap-4 text-gray-700">
              <li className="flex items-start gap-3">
                <span className="text-[#819184] font-bold">→</span>
                <span>Celebrating milestones</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#819184] font-bold">→</span>
                <span>Personal empowerment</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#819184] font-bold">→</span>
                <span>Gifts for partners</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#819184] font-bold">→</span>
                <span>Self-love and confidence</span>
              </li>
            </ul>
          </section>

          <section className="bg-[#f8f7f4] rounded-2xl p-8">
            <h2 className="font-serif text-2xl mb-4">Ready for a Boudoir Session?</h2>
            <p className="text-gray-700 mb-6">
              Book your empowering boudoir session and celebrate your unique beauty.
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
            <h2 className="font-serif text-2xl mb-4">Boudoir Photography FAQs</h2>
            <div className="space-y-4 text-gray-700">
              <div>
                <h3 className="font-medium">What is boudoir photography?</h3>
                <p>Boudoir photography is an empowering and intimate portrait session designed to celebrate your confidence and beauty.</p>
              </div>
              <div>
                <h3 className="font-medium">Where do boudoir sessions take place?</h3>
                <p>Sessions can be held at your home or a private location of your choice.</p>
              </div>
              <div>
                <h3 className="font-medium">Is privacy guaranteed?</h3>
                <p>Absolutely. All sessions are confidential and images are only shared with your explicit permission.</p>
              </div>
            </div>
          </section>
        </article>
      </div>
    </main>
    </div>
  );
}
