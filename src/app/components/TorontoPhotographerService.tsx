import { Camera, MapPin, Heart, Users } from "lucide-react";
import { serviceReviews } from "./serviceReviews";

export function TorontoPhotographerService() {
  return (
    <>
      {/* FAQPage Schema - keep for SEO, but outside JSX */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What types of photography do you offer in Toronto?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "We offer wedding photography, engagement sessions, family portraits, and lifestyle photography across Toronto and the GTA."
            }
          },
          {
            "@type": "Question",
            "name": "Do you travel across the GTA for sessions?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, we photograph sessions across Toronto, Markham, Vaughan, Richmond Hill, Mississauga, and nearby regions."
            }
          },
          {
            "@type": "Question",
            "name": "How quickly are edited photos delivered?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Portrait and engagement sessions are typically delivered in 2-3 weeks, while weddings are delivered in 6-8 weeks."
            }
          }
        ]
      }) }} />
      <main className="min-h-screen bg-white text-gray-900 px-6 py-12">
        <button onClick={() => window.location.hash = '/'} className="mb-8 px-6 py-2 rounded-full bg-[#819184] text-white font-semibold hover:bg-[#6b7d6e] transition-all">← Back</button>
        <section className="max-w-4xl mx-auto mb-12">
          <h1 className="text-5xl font-serif mb-6 dark:text-black">Toronto Photographer</h1>
          <h2 className="text-2xl font-semibold mb-4 text-[#819184]">Wedding, Engagement, Family & Lifestyle Photography in Toronto & GTA</h2>
          <p className="mb-6 text-lg">Ava in Frame offers a full range of photography services in Toronto, including weddings, engagements, family portraits, and lifestyle sessions. We blend candid moments with editorial artistry for timeless results.</p>
          <ul className="list-disc pl-6 mb-6 text-gray-700">
            <li><a href="/#/blog" className="text-[#819184] hover:underline">Photography tips for Toronto clients</a></li>
            <li>Experienced Toronto photographer for all occasions</li>
            <li>Flexible packages and transparent pricing</li>
            <li>All images professionally edited and delivered in a private online gallery</li>
          </ul>
          <h3 className="text-xl font-serif mb-2">Why Choose Ava in Frame?</h3>
          <ul className="list-disc pl-6 mb-6 text-gray-700">
            <li>10+ years of experience in Toronto photography</li>
            <li>Personalized approach for every client</li>
            <li>Fast turnaround and exceptional service</li>
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
              <h1 className="text-4xl md:text-5xl font-serif mb-4">Toronto Photographer for Weddings, Couples, and Families</h1>
              <p className="text-xl text-gray-600 mb-6">
                Ava in Frame captures candid, emotional, and timeless photography across Toronto and the GTA.
              </p>
            </header>

            <section className="grid md:grid-cols-2 gap-8">
              <div className="space-y-5">
                <div className="flex gap-4">
                  <Camera className="w-6 h-6 text-[#819184] flex-shrink-0 mt-1" />
                  <div>
                    <h2 className="font-serif text-2xl mb-2">Photography Style</h2>
                    <p className="text-gray-700">
                      Documentary-inspired storytelling with soft editorial direction, focused on natural expressions and real connection.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <MapPin className="w-6 h-6 text-[#819184] flex-shrink-0 mt-1" />
                  <div>
                    <h2 className="font-serif text-2xl mb-2">Toronto and GTA Coverage</h2>
                    <p className="text-gray-700">
                      Sessions available in Toronto, Markham, North York, Mississauga, and surrounding cities.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-[#f8f7f4] rounded-2xl p-8">
                <h2 className="font-serif text-2xl mb-4">Popular Services</h2>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start gap-3">
                    <Heart className="w-5 h-5 text-[#819184] mt-1" />
                    <span>Wedding photography with full-day storytelling</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Users className="w-5 h-5 text-[#819184] mt-1" />
                    <span>Engagement and couple sessions at iconic Toronto locations</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Users className="w-5 h-5 text-[#819184] mt-1" />
                    <span>Family portrait sessions with natural, relaxed posing</span>
                  </li>
                </ul>

                <div className="mt-6 grid gap-3">
                  <a href="/#/weddings" className="rounded-lg border border-black/10 px-4 py-3 text-sm hover:bg-black/5">Explore Toronto Wedding Photography</a>
                  <a href="/#/engagements" className="rounded-lg border border-black/10 px-4 py-3 text-sm hover:bg-black/5">Explore Toronto Engagement Photography</a>
                  <a href="/#/family" className="rounded-lg border border-black/10 px-4 py-3 text-sm hover:bg-black/5">Explore Toronto Family Photography</a>
                </div>
              </div>
            </section>

            <section className="border-t pt-8">
              <h2 className="font-serif text-2xl mb-4">Toronto Photographer FAQs</h2>
              <div className="space-y-4 text-gray-700">
                <div>
                  <h3 className="font-medium">What sessions can we book?</h3>
                  <p>Wedding, engagement, lifestyle, and family sessions are available year-round.</p>
                </div>
                <div>
                  <h3 className="font-medium">How far do you travel?</h3>
                  <p>We regularly travel throughout Toronto and the GTA, with destination options available upon request.</p>
                </div>
                <div>
                  <h3 className="font-medium">How do we get started?</h3>
                  <p>Reach out through the contact form to discuss your date, location ideas, and preferred style.</p>
                </div>
              </div>
            </section>
          </article>
        </div>
      </main>
    </>
  );
}