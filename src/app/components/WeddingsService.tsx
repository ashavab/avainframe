import { Heart, MapPin, Calendar, Images } from "lucide-react";

export function WeddingsService() {
  return (
    <>
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            {"@type": "ListItem", "position": 1, "name": "Home", "item": "https://avainframe.com"},
            {"@type": "ListItem", "position": 2, "name": "Wedding Photography", "item": "https://avainframe.com/weddings"}
          ]
        })}
      </script>
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Service",
          "name": "Wedding Photography",
          "description": "Candid, editorial-style wedding photography in Toronto and the GTA",
          "provider": {"@type": "LocalBusiness", "name": "Ava in Frame", "url": "https://avainframe.com", "telephone": "+1-647-710-4734", "email": "hello@avainframe.com"},
          "areaServed": [{"@type": "AdministrativeArea", "name": "Toronto"}, {"@type": "AdministrativeArea", "name": "Greater Toronto Area"}],
          "priceRange": "$",
          "url": "https://avainframe.com/weddings"
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
            <h1 className="text-4xl md:text-5xl font-serif mb-4">Toronto Wedding Photography</h1>
            <p className="text-xl text-gray-600 mb-6">
              Candid, editorial-style wedding photography capturing your most precious moments in Toronto and the GTA.
            </p>
          </header>

          <div className="grid md:grid-cols-2 gap-8 my-8">
            <div className="space-y-4">
              <div className="flex gap-4">
                <Heart className="w-6 h-6 text-[#819184] flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-serif text-xl mb-2">Full-Day Coverage</h3>
                  <p className="text-gray-600">
                    From getting ready through to the reception, every authentic moment is captured with an artistic eye.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <MapPin className="w-6 h-6 text-[#819184] flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-serif text-xl mb-2">Greater Toronto Area</h3>
                  <p className="text-gray-600">
                    We serve Toronto, Markham, Vaughan, Mississauga, and across the GTA. Travel outside the region is welcome with fees applied.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <Calendar className="w-6 h-6 text-[#819184] flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-serif text-xl mb-2">Flexible Timing</h3>
                  <p className="text-gray-600">
                    Engagement sessions, rehearsal dinners, and multi-day events are all part of our services.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <Images className="w-6 h-6 text-[#819184] flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-serif text-xl mb-2">Complete Gallery</h3>
                  <p className="text-gray-600">
                    All high-resolution edited images delivered via private gallery within 6-8 weeks.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#f8f7f4] to-[#e8e5dc] rounded-2xl p-8 flex flex-col justify-center">
              <h3 className="font-serif text-2xl mb-4">Why Choose Ava in Frame?</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-[#819184] font-bold mt-1">•</span>
                  <span>Documentary style focused on genuine emotion and connection</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#819184] font-bold mt-1">•</span>
                  <span>Artistic, timeless editing that lets your memories shine</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#819184] font-bold mt-1">•</span>
                  <span>Over a decade of experience capturing Toronto weddings</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#819184] font-bold mt-1">•</span>
                  <span>Easy communication via WhatsApp, email, or phone</span>
                </li>
              </ul>

              <button
                onClick={() => (window.location.hash = "/#/clients")}
                className="mt-8 w-full rounded-xl bg-[#819184] text-white py-3 font-medium hover:opacity-90"
              >
                Book a Consultation
              </button>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t">
            <h3 className="font-serif text-lg mb-4">Other Services</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <button onClick={() => (window.location.hash = "/#/engagements")} className="text-left p-4 border rounded-lg hover:bg-gray-50">
                <strong>Engagement Photography</strong>
                <p className="text-sm text-gray-600">2-3 hour sessions in iconic Toronto locations</p>
              </button>
              <button onClick={() => (window.location.hash = "/#/family")} className="text-left p-4 border rounded-lg hover:bg-gray-50">
                <strong>Family & Portraits</strong>
                <p className="text-sm text-gray-600">Timeless family moments and individual portraits</p>
              </button>
            </div>
          </div>

          <section className="border-t pt-8">
            <h2 className="font-serif text-2xl mb-4">What's Included</h2>
            <ul className="grid md:grid-cols-2 gap-4 text-gray-700">
              <li className="flex items-start gap-3">
                <span className="text-[#819184] font-bold">✓</span>
                <span>Pre-wedding consultation and timeline planning</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#819184] font-bold">✓</span>
                <span>Engagement session (optional)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#819184] font-bold">✓</span>
                <span>Full event coverage as agreed</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#819184] font-bold">✓</span>
                <span>Professional editing and retouching</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#819184] font-bold">✓</span>
                <span>Private online gallery for download</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#819184] font-bold">✓</span>
                <span>Print release included</span>
              </li>
            </ul>
          </section>

          <section className="bg-[#f8f7f4] rounded-2xl p-8">
            <h2 className="font-serif text-2xl mb-4">Ready to Book?</h2>
            <p className="text-gray-700 mb-6">
              Let's discuss your vision and create a photography plan tailored to your wedding day.
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
        </article>
      </div>
    </main>
    </>
  );
}
