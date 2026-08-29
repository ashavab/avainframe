import React from "react";
import { Users, Smile, MapPin, Sun } from "lucide-react";
import { serviceReviews } from "./serviceReviews";
import RemoteGallery from "./ServiceGalleryRemote";

const ALBUM_ID = "739b8c11-2a73-477a-8029-97b83e1a9ed5";
const SHARE_KEY = "qYe334YQwzxNCp_nyS3_bDXMTsUFq8qDf7MvjLQxbqMqV5NYKjlc0uu6M1cWIKA5_50";

export function PortraitsService() {
  return (
    <div className="bg-white text-gray-900 dark:bg-[#18181b] dark:text-white">
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://avainframe.com" },
            { "@type": "ListItem", position: 2, name: "Portrait Photography", item: "https://avainframe.com/portraits" },
          ],
        })}
      </script>
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Service",
          name: "Portrait Photography",
          description: "Timeless personal and lifestyle portraits in Toronto.",
          provider: { "@type": "LocalBusiness", name: "Ava in Frame", url: "https://avainframe.com", telephone: "+1-647-710-4734", email: "hello@avainframe.com" },
          areaServed: [
            { "@type": "AdministrativeArea", name: "Toronto" },
            { "@type": "AdministrativeArea", name: "Greater Toronto Area" },
          ],
          priceRange: "$",
          url: "https://avainframe.com/portraits",
          review: serviceReviews.map((r) => ({
            "@type": "Review",
            author: r.author,
            reviewBody: r.text,
            reviewRating: { "@type": "Rating", ratingValue: r.rating || 5 },
            ...(r.date ? { datePublished: r.date } : {}),
          })),
          aggregateRating: { "@type": "AggregateRating", ratingValue: "5", reviewCount: serviceReviews.length },
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
              <h1 className="text-4xl md:text-5xl font-serif mb-4">Toronto Portrait Photography</h1>
              <p className="text-xl text-gray-600 mb-6">
                Timeless personal and lifestyle portraits that capture authentic expression.
              </p>
            </header>

            <RemoteGallery albumId={ALBUM_ID} albumName="Portraits" shareKey={SHARE_KEY} />

            <div className="grid md:grid-cols-2 gap-8 my-8">
              <div className="space-y-4">
                <div className="flex gap-4">
                  <Users className="w-6 h-6 text-[#819184] flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-serif text-xl mb-2">Individual Portraits</h3>
                    <p className="text-gray-600">Personal sessions that bring out your natural confidence and character.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Smile className="w-6 h-6 text-[#819184] flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-serif text-xl mb-2">Relaxed & Candid</h3>
                    <p className="text-gray-600">Guided poses and genuine expression — no stiff, forced smiles.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <MapPin className="w-6 h-6 text-[#819184] flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-serif text-xl mb-2">Your Favourite Spots</h3>
                    <p className="text-gray-600">Studio, home, or iconic Toronto locations — wherever you feel most you.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Sun className="w-6 h-6 text-[#819184] flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-serif text-xl mb-2">Perfect Light</h3>
                    <p className="text-gray-600">Golden hour and soft natural light for the most flattering portraits.</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-[#f8f7f4] to-[#e8e5dc] rounded-2xl p-8 flex flex-col justify-center">
                <h3 className="font-serif text-2xl mb-4">Session Options</h3>
                <ul className="space-y-3 text-gray-700 mb-8">
                  <li className="flex items-start gap-3"><span className="text-[#819184] font-bold mt-1">•</span><span>1-2 hour portrait sessions</span></li>
                  <li className="flex items-start gap-3"><span className="text-[#819184] font-bold mt-1">•</span><span>Wardrobe & styling guidance</span></li>
                  <li className="flex items-start gap-3"><span className="text-[#819184] font-bold mt-1">•</span><span>150-250 edited photos included</span></li>
                </ul>
                <button
                  onClick={() => (window.location.href = "https://avainframe.com/#/clients")}
                  className="w-full rounded-xl bg-[#819184] text-white py-3 font-medium hover:opacity-90"
                >
                  Book Your Session
                </button>
              </div>
            </div>

            <div className="mt-12 pt-8 border-t">
              <h3 className="font-serif text-lg mb-4">Other Services</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <button onClick={() => (window.location.hash = "/#/family")} className="text-left p-4 border rounded-lg hover:bg-gray-50">
                  <strong>Family Photography</strong>
                  <p className="text-sm text-gray-600">Relaxed documentary sessions for families</p>
                </button>
                <button onClick={() => (window.location.hash = "/#/events")} className="text-left p-4 border rounded-lg hover:bg-gray-50">
                  <strong>Event Photography</strong>
                  <p className="text-sm text-gray-600">Capturing your celebrations as they happen</p>
                </button>
              </div>
            </div>
          </article>
        </div>
      </main>
    </div>
  );
}

export default PortraitsService;
