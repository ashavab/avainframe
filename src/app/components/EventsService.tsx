import React from "react";
import { CalendarDays, Music, Camera, Heart } from "lucide-react";
import { serviceReviews } from "./serviceReviews";
import RemoteGallery from "./ServiceGalleryRemote";

const ALBUM_ID = "947c8145-8f27-416f-9286-5abdf4aa8df3";
const SHARE_KEY = "Jqq3wKmF-XhOq38DGKwgblcqX7_9USMnbBO4g-750ZrHUqMO1U8GgKqR4b7NuzygLkk";

export function EventsService() {
  return (
    <div className="bg-white text-gray-900 dark:bg-[#18181b] dark:text-white">
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://avainframe.com" },
            { "@type": "ListItem", position: 2, name: "Event Photography", item: "https://avainframe.com/events" },
          ],
        })}
      </script>
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Service",
          name: "Event Photography",
          description: "Candid event and celebration photography in Toronto.",
          provider: { "@type": "LocalBusiness", name: "Ava in Frame", url: "https://avainframe.com", telephone: "+1-647-710-4734", email: "hello@avainframe.com" },
          areaServed: [
            { "@type": "AdministrativeArea", name: "Toronto" },
            { "@type": "AdministrativeArea", name: "Greater Toronto Area" },
          ],
          priceRange: "$",
          url: "https://avainframe.com/events",
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
              <h1 className="text-4xl md:text-5xl font-serif mb-4">Toronto Event Photography</h1>
              <p className="text-xl text-gray-600 mb-6">
                Candid, story-driven coverage of your celebrations as they unfold.
              </p>
            </header>

            <RemoteGallery albumId={ALBUM_ID} albumName="Events" shareKey={SHARE_KEY} />

            <div className="grid md:grid-cols-2 gap-8 my-8">
              <div className="space-y-4">
                <div className="flex gap-4">
                  <CalendarDays className="w-6 h-6 text-[#819184] flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-serif text-xl mb-2">Any Occasion</h3>
                    <p className="text-gray-600">Birthdays, anniversaries, graduations, corporate events and more.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Music className="w-6 h-6 text-[#819184] flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-serif text-xl mb-2">Candid Storytelling</h3>
                    <p className="text-gray-600">We capture the moments between the moments — the laughter, the connections.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Camera className="w-6 h-6 text-[#819184] flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-serif text-xl mb-2">Unobtrusive Coverage</h3>
                    <p className="text-gray-600">Documentary style that lets your event breathe while we quietly tell the story.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Heart className="w-6 h-6 text-[#819184] flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-serif text-xl mb-2">Delivered With Care</h3>
                    <p className="text-gray-600">A curated gallery of edited highlights, ready to relive and share.</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-[#f8f7f4] to-[#e8e5dc] rounded-2xl p-8 flex flex-col justify-center">
                <h3 className="font-serif text-2xl mb-4">Coverage Options</h3>
                <ul className="space-y-3 text-gray-700 mb-8">
                  <li className="flex items-start gap-3"><span className="text-[#819184] font-bold mt-1">•</span><span>2-6 hour event coverage</span></li>
                  <li className="flex items-start gap-3"><span className="text-[#819184] font-bold mt-1">•</span><span>Second shooter available</span></li>
                  <li className="flex items-start gap-3"><span className="text-[#819184] font-bold mt-1">•</span><span>100-400 edited photos included</span></li>
                </ul>
                <button
                  onClick={() => (window.location.href = "https://photos.avainframe.com")}
                  className="w-full rounded-xl bg-[#819184] text-white py-3 font-medium hover:opacity-90"
                >
                  Book Your Event
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
                <button onClick={() => (window.location.hash = "/#/portraits")} className="text-left p-4 border rounded-lg hover:bg-gray-50">
                  <strong>Portrait Photography</strong>
                  <p className="text-sm text-gray-600">Timeless personal and lifestyle portraits</p>
                </button>
              </div>
            </div>
          </article>
        </div>
      </main>
    </div>
  );
}

export default EventsService;
