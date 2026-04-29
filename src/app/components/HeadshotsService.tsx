import { User, Briefcase, Camera, Smile } from "lucide-react";
import { useState } from "react";
import ConsultationModal from "./ConsultationModal";

export default function HeadshotsService() {
  const [modalOpen, setModalOpen] = useState(false);
  return (
    <div className="bg-white text-gray-900 dark:bg-[#18181b] dark:text-white">
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            {"@type": "ListItem", "position": 1, "name": "Home", "item": "https://avainframe.com"},
            {"@type": "ListItem", "position": 2, "name": "Headshots", "item": "https://avainframe.com/headshots"}
          ]
        })}
      </script>
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Service",
          "name": "Professional Headshots",
          "description": "Business, acting, and personal branding headshots in Toronto.",
          "provider": {"@type": "LocalBusiness", "name": "Ava in Frame", "url": "https://avainframe.com", "telephone": "+1-647-710-4734", "email": "hello@avainframe.com"},
          "areaServed": [
            {"@type": "AdministrativeArea", "name": "Toronto"},
            {"@type": "AdministrativeArea", "name": "Greater Toronto Area"}
          ],
          "priceRange": "$$",
          "url": "https://avainframe.com/headshots"
        })}
      </script>
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "What types of headshots do you offer?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "We offer professional headshots for business, acting, social media, and personal branding."
              }
            },
            {
              "@type": "Question",
              "name": "Where do headshot sessions take place?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Sessions can be held in-studio, on-location, or at your office for groups."
              }
            },
            {
              "@type": "Question",
              "name": "How do I prepare for my headshot session?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "We provide guidance on wardrobe, posing, and expression to ensure you look your best."
              }
            }
          ]
        })}
      </script>
      <main className="min-h-screen bg-white text-gray-900 px-6 py-12">
        <button onClick={() => window.location.hash = '/'} className="mb-8 px-6 py-2 rounded-full bg-[#819184] text-white font-semibold hover:bg-[#6b7d6e] transition-all">← Back</button>
        <section className="max-w-4xl mx-auto mb-12">
          <h1 className="text-5xl font-serif mb-6 dark:text-black">Professional Headshots Toronto</h1>
          <h2 className="text-2xl font-semibold mb-4 text-[#819184]">Business, Acting & Personal Branding Portraits</h2>
          <p className="mb-6 text-lg">Elevate your professional image with high-quality headshots. Perfect for business, acting, and personal branding. Sessions available in-studio, on-location, or at your office.</p>
          <ul className="list-disc pl-6 mb-6 text-gray-700">
            <li>Business, acting, and social media headshots</li>
            <li>Guidance on wardrobe, posing, and expression</li>
            <li>Fast turnaround and online gallery delivery</li>
            <li>Group and corporate sessions available</li>
          </ul>
          <h3 className="text-xl font-serif mb-2">Why Choose Ava in Frame?</h3>
          <ul className="list-disc pl-6 mb-6 text-gray-700">
            <li>Experienced portrait photographer</li>
            <li>Personalized approach for every client</li>
            <li>Professional retouching included</li>
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
            <h1 className="text-4xl md:text-5xl font-serif mb-4">Professional Headshots Toronto</h1>
            <p className="text-xl text-gray-600 mb-6">
              Headshots for business, acting, and personal branding. Studio, location, or office sessions available.
            </p>
          </header>

          <div className="grid md:grid-cols-2 gap-8 my-8">
            <div className="space-y-4">
              <div className="flex gap-4">
                <User className="w-6 h-6 text-[#819184] flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-serif text-xl mb-2">Business & Corporate</h3>
                  <p className="text-gray-600">
                    Professional headshots for LinkedIn, company websites, and business cards.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <Briefcase className="w-6 h-6 text-[#819184] flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-serif text-xl mb-2">Acting & Modeling</h3>
                  <p className="text-gray-600">
                    Headshots for actors, models, and performers to help you stand out at auditions.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <Camera className="w-6 h-6 text-[#819184] flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-serif text-xl mb-2">Personal Branding</h3>
                  <p className="text-gray-600">
                    Social media, websites, and marketing materials—look your best everywhere online.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <Smile className="w-6 h-6 text-[#819184] flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-serif text-xl mb-2">Friendly Guidance</h3>
                  <p className="text-gray-600">
                    We help you feel comfortable and confident in front of the camera.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#f8f7f4] to-[#e8e5dc] rounded-2xl p-8 flex flex-col justify-center">
              <h3 className="font-serif text-2xl mb-4">Session Options</h3>
              <ul className="space-y-3 text-gray-700 mb-8">
                <li className="flex items-start gap-3">
                  <span className="text-[#819184] font-bold mt-1">•</span>
                  <span>Studio or location session</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#819184] font-bold mt-1">•</span>
                  <span>Group/corporate headshots</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#819184] font-bold mt-1">•</span>
                  <span>Professional retouching included</span>
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
              <button onClick={() => (window.location.hash = "/#/boudoir")} className="text-left p-4 border rounded-lg hover:bg-gray-50">
                <strong>Boudoir Photography</strong>
                <p className="text-sm text-gray-600">Empowering, private portrait sessions</p>
              </button>
            </div>
          </div>

          <section className="border-t pt-8">
            <h2 className="font-serif text-2xl mb-4">Great For</h2>
            <ul className="grid md:grid-cols-2 gap-4 text-gray-700">
              <li className="flex items-start gap-3">
                <span className="text-[#819184] font-bold">→</span>
                <span>LinkedIn and business profiles</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#819184] font-bold">→</span>
                <span>Actors and performers</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#819184] font-bold">→</span>
                <span>Personal branding</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#819184] font-bold">→</span>
                <span>Corporate teams</span>
              </li>
            </ul>
          </section>

          <section className="bg-[#f8f7f4] rounded-2xl p-8">
            <h2 className="font-serif text-2xl mb-4">Ready for New Headshots?</h2>
            <p className="text-gray-700 mb-6">
              Book your session and put your best face forward—contact us today!
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
            <h2 className="font-serif text-2xl mb-4">Headshot FAQs</h2>
            <div className="space-y-4 text-gray-700">
              <div>
                <h3 className="font-medium">What types of headshots do you offer?</h3>
                <p>We offer professional headshots for business, acting, social media, and personal branding.</p>
              </div>
              <div>
                <h3 className="font-medium">Where do headshot sessions take place?</h3>
                <p>Sessions can be held in-studio, on-location, or at your office for groups.</p>
              </div>
              <div>
                <h3 className="font-medium">How do I prepare for my headshot session?</h3>
                <p>We provide guidance on wardrobe, posing, and expression to ensure you look your best.</p>
              </div>
            </div>
          </section>
        </article>
      </div>
    </main>
    </div>
  );
}
