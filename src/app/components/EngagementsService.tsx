import { Sparkles, MapPin, Camera, Clock } from "lucide-react";
import { serviceReviews } from "./serviceReviews";

export function EngagementsService() {
  return (
    <>
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            {"@type": "ListItem", "position": 1, "name": "Home", "item": "https://avainframe.com"},
            {"@type": "ListItem", "position": 2, "name": "Engagement Photography", "item": "https://avainframe.com/engagements"}
          ]
        })}
      </script>
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Service",
          "name": "Engagement Photography",
          "description": "Intimate engagement sessions in Toronto's most beautiful locations",
          "provider": {"@type": "LocalBusiness", "name": "Ava in Frame", "url": "https://avainframe.com", "telephone": "+1-647-710-4734", "email": "hello@avainframe.com"},
          "areaServed": [
            {"@type": "AdministrativeArea", "name": "Toronto"},
            {"@type": "AdministrativeArea", "name": "Greater Toronto Area"},
            {"@type": "ServiceArea", "name": "Markham"},
            {"@type": "ServiceArea", "name": "Richmond Hill"},
            {"@type": "ServiceArea", "name": "Vaughan"},
            {"@type": "ServiceArea", "name": "Mississauga"}
          ],
          "priceRange": "$",
          "url": "https://avainframe.com/engagements",
          "review": serviceReviews.map(r => ({
            "@type": "Review",
            "author": r.author,
            "reviewBody": r.text,
            "reviewRating": { "@type": "Rating", "ratingValue": r.rating || 5 },
            ...(r.date ? { datePublished: r.date } : {})
          })),
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "5",
            "reviewCount": serviceReviews.length
          }
        })}
      </script>
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "Where can we do engagement photos in Toronto?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Popular options include Distillery District, High Park, Scarborough Bluffs, and meaningful personal locations around the GTA."
              }
            },
            {
              "@type": "Question",
              "name": "How long is an engagement session?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Most sessions run 2-3 hours, allowing time for outfit changes and one or more locations."
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
            <h1 className="text-4xl md:text-5xl font-serif mb-4">Toronto Engagement Photography</h1>
            <p className="text-xl text-gray-600 mb-6">
              Celebrate your love story with a candid engagement session in Toronto's most beautiful locations.
            </p>
          </header>

          <div className="grid md:grid-cols-2 gap-8 my-8">
            <div className="space-y-4">
              <div className="flex gap-4">
                <Sparkles className="w-6 h-6 text-[#819184] flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-serif text-xl mb-2">Intimate & Relaxed</h3>
                  <p className="text-gray-600">
                    Get to know our style in a comfortable, pressure-free environment before your big day.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <MapPin className="w-6 h-6 text-[#819184] flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-serif text-xl mb-2">Iconic Toronto Locations</h3>
                  <p className="text-gray-600">
                    Distillery District, High Park, Scarborough Bluffs, or anywhere that speaks to you in the GTA.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <Camera className="w-6 h-6 text-[#819184] flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-serif text-xl mb-2">Artistic Storytelling</h3>
                  <p className="text-gray-600">
                    Natural light, genuine emotions, and an editorial approach that captures your connection.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <Clock className="w-6 h-6 text-[#819184] flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-serif text-xl mb-2">2-3 Hour Sessions</h3>
                  <p className="text-gray-600">
                    Plenty of time to explore multiple locations and capture meaningful moments together.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#f8f7f4] to-[#e8e5dc] rounded-2xl p-8 flex flex-col justify-center">
              <h3 className="font-serif text-2xl mb-4">What You'll Get</h3>
              <ul className="space-y-3 text-gray-700 mb-8">
                <li className="flex items-start gap-3">
                  <span className="text-[#819184] font-bold mt-1">•</span>
                  <span>200-350 professionally edited photos</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#819184] font-bold mt-1">•</span>
                  <span>Private online gallery for download</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#819184] font-bold mt-1">•</span>

                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#819184] font-bold mt-1">•</span>
                  <span>Print release included</span>
                </li>
              </ul>

              <button
                onClick={() => (window.location.hash = "/#/clients")}
                className="w-full rounded-xl bg-[#819184] text-white py-3 font-medium hover:opacity-90"
              >
                Schedule Your Session
              </button>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t">
            <h3 className="font-serif text-lg mb-4">Other Services</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <button onClick={() => (window.location.hash = "/#/weddings")} className="text-left p-4 border rounded-lg hover:bg-gray-50">
                <strong>Wedding Photography</strong>
                <p className="text-sm text-gray-600">Full-day coverage for your big day</p>
              </button>
              <button onClick={() => (window.location.hash = "/#/family")} className="text-left p-4 border rounded-lg hover:bg-gray-50">
                <strong>Family & Portraits</strong>
                <p className="text-sm text-gray-600">Timeless family moments and individual portraits</p>
              </button>
            </div>
          </div>

          <section className="border-t pt-8">
            <h2 className="font-serif text-2xl mb-4">Perfect For</h2>
            <ul className="grid md:grid-cols-2 gap-4 text-gray-700">
              <li className="flex items-start gap-3">
                <span className="text-[#819184] font-bold">→</span>
                <span>Pre-wedding memories to display at your reception</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#819184] font-bold">→</span>
                <span>Save-the-date announcement photos</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#819184] font-bold">→</span>
                <span>Building confidence in front of the camera</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#819184] font-bold">→</span>
                <span>Couples who want professional photos before their wedding</span>
              </li>
            </ul>
          </section>

          <section className="bg-[#f8f7f4] rounded-2xl p-8">
            <h2 className="font-serif text-2xl mb-4">Let's Plan Your Session</h2>
            <p className="text-gray-700 mb-6">
              We'll work with you to choose the perfect time, location, and style for your engagement photos.
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
            <h2 className="font-serif text-2xl mb-4">Toronto Engagement Photography FAQs</h2>
            <div className="space-y-4 text-gray-700">
              <div>
                <h3 className="font-medium">Where should we shoot our engagement photos?</h3>
                <p>We can shoot at iconic Toronto spots or at a meaningful place that reflects your relationship.</p>
              </div>
              <div>
                <h3 className="font-medium">How long does a session take?</h3>
                <p>Most engagement sessions are 2-3 hours, giving us enough time for multiple looks and natural storytelling.</p>
              </div>
              <div>
                <h3 className="font-medium">When are the final photos delivered?</h3>
                <p>Final edited images are usually delivered in 2-3 weeks in a private online gallery.</p>
              </div>
            </div>
          </section>
        </article>
      </div>
    </main>
    </>
  );
}
