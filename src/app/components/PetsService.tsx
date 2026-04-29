import { PawPrint, Smile, MapPin, Camera } from "lucide-react";
import { useState } from "react";
import ConsultationModal from "./ConsultationModal";

export default function PetsService() {
  const [modalOpen, setModalOpen] = useState(false);
  return (
    <div className="bg-white text-gray-900 dark:bg-[#18181b] dark:text-white">
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            {"@type": "ListItem", "position": 1, "name": "Home", "item": "https://avainframe.com"},
            {"@type": "ListItem", "position": 2, "name": "Pet Photography", "item": "https://avainframe.com/pets"}
          ]
        })}
      </script>
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Service",
          "name": "Pet Photography",
          "description": "Fun and professional pet photography in Toronto. Capture your pet's personality with a custom session.",
          "provider": {"@type": "LocalBusiness", "name": "Ava in Frame", "url": "https://avainframe.com", "telephone": "+1-647-710-4734", "email": "hello@avainframe.com"},
          "areaServed": [
            {"@type": "AdministrativeArea", "name": "Toronto"},
            {"@type": "AdministrativeArea", "name": "Greater Toronto Area"}
          ],
          "priceRange": "$",
          "url": "https://avainframe.com/pets"
        })}
      </script>
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "What types of pet photography do you offer?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "We photograph dogs, cats, and all beloved pets, capturing their unique personalities."
              }
            },
            {
              "@type": "Question",
              "name": "Where do pet sessions take place?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Sessions can be held outdoors, in your home, or at a favorite location for your pet."
              }
            },
            {
              "@type": "Question",
              "name": "Can I be in the photos with my pet?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Absolutely! We encourage owners to join their pets for memorable portraits."
              }
            }
          ]
        })}
      </script>
      <main className="min-h-screen bg-white text-gray-900 px-6 py-12">
        <button onClick={() => window.location.hash = '/'} className="mb-8 px-6 py-2 rounded-full bg-[#819184] text-white font-semibold hover:bg-[#6b7d6e] transition-all">← Back</button>
        <section className="max-w-4xl mx-auto mb-12">
          <h1 className="text-5xl font-serif mb-6 dark:text-black">Pet Photography Toronto</h1>
          <h2 className="text-2xl font-semibold mb-4 text-[#819184]">Fun, Candid Portraits for Pets & Owners</h2>
          <p className="mb-6 text-lg">Celebrate your furry friends with a pet photography session. We capture the joy and character of your pets in every photo—dogs, cats, and all beloved animals welcome!</p>
          <ul className="list-disc pl-6 mb-6 text-gray-700">
            <li>Outdoor, in-home, or favorite location sessions</li>
            <li>Owners and families welcome in portraits</li>
            <li>All images professionally edited and delivered in a private gallery</li>
            <li>Flexible scheduling for your pet's comfort</li>
          </ul>
          <h3 className="text-xl font-serif mb-2">Why Choose Ava in Frame?</h3>
          <ul className="list-disc pl-6 mb-6 text-gray-700">
            <li>Patient, animal-loving photographer</li>
            <li>Experience with pets of all sizes and temperaments</li>
            <li>Fun, relaxed sessions for natural results</li>
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
            <h1 className="text-4xl md:text-5xl font-serif mb-4">Pet Photography Toronto</h1>
            <p className="text-xl text-gray-600 mb-6">
              Capture your pet's unique personality with a fun, relaxed photo session in Toronto or the GTA.
            </p>
          </header>

          <div className="grid md:grid-cols-2 gap-8 my-8">
            <div className="space-y-4">
              <div className="flex gap-4">
                <PawPrint className="w-6 h-6 text-[#819184] flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-serif text-xl mb-2">All Pets Welcome</h3>
                  <p className="text-gray-600">
                    Dogs, cats, rabbits, and more—every pet is unique and celebrated.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <Smile className="w-6 h-6 text-[#819184] flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-serif text-xl mb-2">Candid & Playful</h3>
                  <p className="text-gray-600">
                    We capture genuine moments, play, and connection between pets and their people.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <MapPin className="w-6 h-6 text-[#819184] flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-serif text-xl mb-2">Favorite Locations</h3>
                  <p className="text-gray-600">
                    Parks, homes, or special spots—sessions are tailored to your pet's comfort.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <Camera className="w-6 h-6 text-[#819184] flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-serif text-xl mb-2">Professional Results</h3>
                  <p className="text-gray-600">
                    All images are edited and delivered in a private online gallery.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#f8f7f4] to-[#e8e5dc] rounded-2xl p-8 flex flex-col justify-center">
              <h3 className="font-serif text-2xl mb-4">Session Options</h3>
              <ul className="space-y-3 text-gray-700 mb-8">
                <li className="flex items-start gap-3">
                  <span className="text-[#819184] font-bold mt-1">•</span>
                  <span>Outdoor or in-home session</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#819184] font-bold mt-1">•</span>
                  <span>Owners and families included</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#819184] font-bold mt-1">•</span>
                  <span>All pets welcome</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#819184] font-bold mt-1">•</span>
                  <span>Fast turnaround</span>
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
              <button onClick={() => (window.location.hash = "/#/family")} className="text-left p-4 border rounded-lg hover:bg-gray-50">
                <strong>Family Photography</strong>
                <p className="text-sm text-gray-600">Portraits for families, children, and individuals</p>
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
                <span>Pet lovers and families</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#819184] font-bold">→</span>
                <span>Holiday cards and gifts</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#819184] font-bold">→</span>
                <span>Celebrating new pets</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#819184] font-bold">→</span>
                <span>Memorable keepsakes</span>
              </li>
            </ul>
          </section>

          <section className="bg-[#f8f7f4] rounded-2xl p-8">
            <h2 className="font-serif text-2xl mb-4">Ready for Pet Portraits?</h2>
            <p className="text-gray-700 mb-6">
              Book your pet photography session and create memories that last a lifetime.
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
            <h2 className="font-serif text-2xl mb-4">Pet Photography FAQs</h2>
            <div className="space-y-4 text-gray-700">
              <div>
                <h3 className="font-medium">What types of pet photography do you offer?</h3>
                <p>We photograph dogs, cats, and all beloved pets, capturing their unique personalities.</p>
              </div>
              <div>
                <h3 className="font-medium">Where do pet sessions take place?</h3>
                <p>Sessions can be held outdoors, in your home, or at a favorite location for your pet.</p>
              </div>
              <div>
                <h3 className="font-medium">Can I be in the photos with my pet?</h3>
                <p>Absolutely! We encourage owners to join their pets for memorable portraits.</p>
              </div>
            </div>
          </section>
        </article>
      </div>
    </main>
    </div>
  );
}
