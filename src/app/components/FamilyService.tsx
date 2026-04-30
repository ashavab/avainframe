import { Users, Smile, MapPin, Sun } from "lucide-react";
import { serviceReviews } from "./serviceReviews";

export function FamilyService() {
  return (
    <div className="bg-white text-gray-900 dark:bg-[#18181b] dark:text-white">
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            {"@type": "ListItem", "position": 1, "name": "Home", "item": "https://avainframe.com"},
            {"@type": "ListItem", "position": 2, "name": "Family Photography", "item": "https://avainframe.com/family"}
          ]
        })}
      </script>
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Service",
          "name": "Family & Portrait Photography",
          "description": "Timeless family moments and individual portraits in Toronto",
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
          "url": "https://avainframe.com/family",
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
              "name": "What should we wear for a family photo session?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Neutral, coordinated tones and comfortable outfits photograph best. We provide guidance before your Toronto family session."
              }
            },
            {
              "@type": "Question",
              "name": "Can grandparents and extended family join?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes. Multi-generational family portraits are welcome and can be planned within your session timing."
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
            <h1 className="text-4xl md:text-5xl font-serif mb-4">Toronto Family & Portrait Photography</h1>
            <p className="text-xl text-gray-600 mb-6">
              Capture timeless family moments and individual portraits in Toronto with a relaxed, documentary approach.
            </p>
          </header>

          <div className="grid md:grid-cols-2 gap-8 my-8">
            <div className="space-y-4">
              <div className="flex gap-4">
                <Users className="w-6 h-6 text-[#819184] flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-serif text-xl mb-2">All Ages Welcome</h3>
                  <p className="text-gray-600">
                    Newborns, children, teenagers, and multi-generational families—we capture everyone beautifully.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <Smile className="w-6 h-6 text-[#819184] flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-serif text-xl mb-2">Natural & Candid</h3>
                  <p className="text-gray-600">
                    We guide you through relaxed poses and capture genuine laughter and connection between loved ones.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <MapPin className="w-6 h-6 text-[#819184] flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-serif text-xl mb-2">Your Favourite Spots</h3>
                  <p className="text-gray-600">
                    Home, park, beach, or Distillery District—we come to you or meet at a location that feels right.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <Sun className="w-6 h-6 text-[#819184] flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-serif text-xl mb-2">Perfect Light</h3>
                  <p className="text-gray-600">
                    Golden hour sessions for the most flattering, warm, and beautiful natural light.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#f8f7f4] to-[#e8e5dc] rounded-2xl p-8 flex flex-col justify-center">
              <h3 className="font-serif text-2xl mb-4">Session Options</h3>
              <ul className="space-y-3 text-gray-700 mb-8">
                <li className="flex items-start gap-3">
                  <span className="text-[#819184] font-bold mt-1">•</span>
                  <span>1-2 hour family portrait sessions</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#819184] font-bold mt-1">•</span>
                  <span>Individual or sibling portraits</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#819184] font-bold mt-1">•</span>
                  <span>150-250 edited photos included</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#819184] font-bold mt-1">•</span>

                </li>
              </ul>

              <button
                onClick={() => (window.location.hash = "/#/clients")}
                className="w-full rounded-xl bg-[#819184] text-white py-3 font-medium hover:opacity-90"
              >
                Book Your Session
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
              <button onClick={() => (window.location.hash = "/#/engagements")} className="text-left p-4 border rounded-lg hover:bg-gray-50">
                <strong>Engagement Photography</strong>
                <p className="text-sm text-gray-600">2-3 hour sessions in iconic Toronto locations</p>
              </button>
            </div>
          </div>

          <section className="border-t pt-8">
            <h2 className="font-serif text-2xl mb-4">Great For</h2>
            <ul className="grid md:grid-cols-2 gap-4 text-gray-700">
              <li className="flex items-start gap-3">
                <span className="text-[#819184] font-bold">→</span>
                <span>Keeping family memories as children grow</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#819184] font-bold">→</span>
                <span>Holiday card photos</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#819184] font-bold">→</span>
                <span>Individual headshots and portraits</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#819184] font-bold">→</span>
                <span>Wall art or albums you'll treasure</span>
              </li>
            </ul>
          </section>

          <section className="bg-[#f8f7f4] rounded-2xl p-8">
            <h2 className="font-serif text-2xl mb-4">Ready to Create Memories?</h2>
            <p className="text-gray-700 mb-6">
              We'll help you feel comfortable and bring out the best in every family member. Let's capture moments that matter.
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
            <h2 className="font-serif text-2xl mb-4">Toronto Family Photography FAQs</h2>
            <div className="space-y-4 text-gray-700">
              <div>
                <h3 className="font-medium">What should we wear for family photos?</h3>
                <p>Coordinated neutrals and simple textures work best. We'll help you choose outfits before your session.</p>
              </div>
              <div>
                <h3 className="font-medium">Can extended family join the session?</h3>
                <p>Yes, we can include grandparents and multi-generational portraits with a clear shot list.</p>
              </div>
              <div>
                <h3 className="font-medium">How many edited photos do we receive?</h3>
                <p>Most Toronto family sessions receive 150-250 edited images delivered in a private online gallery.</p>
              </div>
            </div>
          </section>
        </article>
      </div>
    </main>
    </div>
  );
}
