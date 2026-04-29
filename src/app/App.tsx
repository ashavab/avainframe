import { ThemeScroller } from "./components/ThemeScroller";
import { ScrollProgress } from "./components/ScrollProgress";
import { Navigation } from "./components/Navigation";
import { Hero } from "./components/Hero";
import { Marquee } from "./components/Marquee";
import { StaggerReveal } from "./components/StaggerReveal";
import { About } from "./components/About";
import { Services } from "./components/Services";
import { FAQ } from "./components/FAQ";
import { Reviews } from "./components/Reviews";
import { BlogTips } from "./components/BlogTips";
import { Contact } from "./components/Contact";
import { Footer } from "./components/Footer";
import { ImmichAccess } from "./components/ImmichAccess";
import { ClientGalleryAccess } from "./components/ClientGalleryAccess";
import { WeddingsService } from "./components/WeddingsService";
import { EngagementsService } from "./components/EngagementsService";
import { FamilyService } from "./components/FamilyService";
import { TorontoPhotographerService } from "./components/TorontoPhotographerService";
import { SeoHead } from "./components/SeoHead";
import { HowToBookSchema } from "./components/HowToBookSchema";
import { useEffect, useState } from "react";

const IMMICH_HIDDEN_PATH = import.meta.env.VITE_IMMICH_HIDDEN_PATH || "/studio-vault";
const IMMICH_CLIENT_PATH = import.meta.env.VITE_IMMICH_CLIENT_PATH || "/clients";
const SERVICES_PATHS = {
  weddings: "/weddings",
  engagements: "/engagements",
  family: "/family",
  toronto: "/toronto-photographer"
};

function normalizePath(path: string) {
  return path.replace(/\/+$/, "") || "/";
}

function getRouteCandidates() {
  const path = normalizePath(window.location.pathname);
  const rawHash = window.location.hash.replace(/^#/, "");
  const hashPath = rawHash ? (rawHash.startsWith("/") ? rawHash : `/${rawHash}`) : "/";
  const hash = normalizePath(hashPath);
  return { path, hash };
}

function Portfolio() {
  return (
    <section id="portfolio" className="py-20 bg-transparent">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <h2 className="text-4xl md:text-5xl font-serif mb-12 dark:text-white">Portfolio</h2>
        <div className="w-full overflow-hidden rounded-xl shadow-lg">
          <iframe 
            src="https://widgets.sociablekit.com/instagram-feed/iframe/25659098" 
            className="w-full border-0 h-[600px] md:h-[800px] bg-white"
            title="Instagram Feed: Ava in Frame portfolio highlights"
            aria-label="Instagram Feed: Ava in Frame portfolio highlights"
          />
        </div>
        {/* ImageObject schema for portfolio highlights */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ImageObject",
          "contentUrl": "https://avainframe.com/DSC06596.jpg",
          "author": { "@type": "Person", "name": "Ashleigh Boudier" },
          "description": "Wedding photography portfolio highlight by Ava in Frame, Toronto photographer.",
          "license": "https://avainframe.com",
          "acquireLicensePage": "https://avainframe.com/contact"
        }) }} />
        {/* Example Event schema for mini-session promotion */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Event",
          "name": "Spring Mini Sessions",
          "startDate": "2026-05-15T10:00",
          "endDate": "2026-05-15T18:00",
          "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
          "eventStatus": "https://schema.org/EventScheduled",
          "location": {
            "@type": "Place",
            "name": "Toronto Botanical Garden",
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "Toronto",
              "addressRegion": "ON",
              "addressCountry": "CA"
            }
          },
          "image": ["https://avainframe.com/DSC06596.jpg"],
          "description": "Limited spring mini photography sessions in Toronto. Book your spot today!",
          "organizer": {
            "@type": "Organization",
            "name": "Ava in Frame",
            "url": "https://avainframe.com"
          }
        }) }} />
      </div>
    </section>
  );
}

export default function App() {
  const [routeVersion, setRouteVersion] = useState(0);

  useEffect(() => {
    const handleRouteChange = () => setRouteVersion((value) => value + 1);
    window.addEventListener("hashchange", handleRouteChange);
    window.addEventListener("popstate", handleRouteChange);

    return () => {
      window.removeEventListener("hashchange", handleRouteChange);
      window.removeEventListener("popstate", handleRouteChange);
    };
  }, []);

  // Read current location on every route-version change.
  void routeVersion;
  const { path, hash } = getRouteCandidates();
  const hiddenPath = normalizePath(IMMICH_HIDDEN_PATH);
  const clientPath = normalizePath(IMMICH_CLIENT_PATH);
  const weddingsPath = normalizePath(SERVICES_PATHS.weddings);
  const engagementsPath = normalizePath(SERVICES_PATHS.engagements);
  const familyPath = normalizePath(SERVICES_PATHS.family);
  const torontoPath = normalizePath(SERVICES_PATHS.toronto);

  const isImmichPath = path === hiddenPath || hash === hiddenPath;
  const isClientPath = path === clientPath || hash === clientPath;
  const isWeddingsPath = path === weddingsPath || hash === weddingsPath;
  const isEngagementsPath = path === engagementsPath || hash === engagementsPath;
  const isFamilyPath = path === familyPath || hash === familyPath;
  const isTorontoPath = path === torontoPath || hash === torontoPath;

  if (isImmichPath) {
    return (
      <>
        <SeoHead
          title="Private Studio Vault | Ava in Frame"
          description="Private gallery access page."
          canonicalPath="/studio-vault"
          robots="noindex, nofollow, noarchive"
        />
        <ImmichAccess />
      </>
    );
  }

  if (isClientPath) {
    return (
      <>
        <SeoHead
          title="Client Gallery Access | Ava in Frame"
          description="Private client gallery access for delivered photography sessions."
          canonicalPath="/clients"
          robots="noindex, nofollow, noarchive"
        />
        <ClientGalleryAccess />
      </>
    );
  }

  if (isWeddingsPath) {
    return (
      <>
        <SeoHead
          title="Toronto Wedding Photographer | Ava in Frame"
          description="Candid and editorial wedding photography in Toronto and across the GTA. Full-day wedding coverage with timeless storytelling."
          canonicalPath="/weddings"
          type="article"
          keywords="Toronto wedding photographer, GTA wedding photography, candid wedding photography"
          imagePath="/DSC06596.jpg"
        />
        <WeddingsService />
      </>
    );
  }

  if (isEngagementsPath) {
    return (
      <>
        <SeoHead
          title="Toronto Engagement Photographer | Ava in Frame"
          description="Natural engagement photography sessions in Toronto. Perfect for save-the-dates, pre-wedding memories, and candid couple portraits."
          canonicalPath="/engagements"
          type="article"
          keywords="Toronto engagement photographer, engagement photography Toronto, GTA couple photos"
          imagePath="/DSC07060.jpg"
        />
        <EngagementsService />
      </>
    );
  }

  if (isFamilyPath) {
    return (
      <>
        <SeoHead
          title="Toronto Family Photographer | Ava in Frame"
          description="Family and portrait photography in Toronto with a relaxed documentary style. Sessions for families, children, and personal portraits."
          canonicalPath="/family"
          type="article"
          keywords="Toronto family photographer, family photos Toronto, portrait photographer GTA"
          imagePath="/IMG_0158.jpeg"
        />
        <FamilyService />
      </>
    );
  }

  if (isTorontoPath) {
    return (
      <>
        <SeoHead
          title="Toronto Photographer | Ava in Frame"
          description="Toronto photographer for weddings, engagements, and family portraits. Candid storytelling sessions across Toronto and the GTA."
          canonicalPath="/toronto-photographer"
          type="article"
          keywords="Toronto photographer, photographer Toronto, GTA photographer, Toronto portrait photographer"
          imagePath="/DSC06596.jpg"
        />
        <TorontoPhotographerService />
      </>
    );
  }

  return (
    <div className="min-h-screen relative transition-colors duration-1000 dark:text-white text-gray-900">
      <SeoHead
        title="Ava in Frame | Toronto Lifestyle & Wedding Photographer"
        description="Candid wedding photography in Toronto and the GTA. Ava in Frame captures weddings, engagements, and portraits with an editorial documentary style."
        canonicalPath="/"
        keywords="Toronto wedding photographer, GTA photographer, candid wedding photography, engagement photography, portrait photography"
      />
      <ThemeScroller />
      {/* Awards and Memberships schema for SEO */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "Ava in Frame",
        "url": "https://avainframe.com",
        "award": [
          "Best Wedding Photographer Toronto 2025",
          "Top Family Photographer GTA 2026"
        ],
        "memberOf": [
          { "@type": "Organization", "name": "Professional Photographers of Canada" },
          { "@type": "Organization", "name": "Wedding & Portrait Photographers International" }
        ]
      }) }} />
      <HowToBookSchema />
      <ScrollProgress />
      <Navigation />
      <Hero heroImage="/window.jpeg" />
      <Marquee />
      <div className="space-y-0 bg-transparent">
        <StaggerReveal><About aboutImage="/ashleigh.jpg" profileImage="/avana.jpg"/></StaggerReveal>
        <Services />
        <StaggerReveal><Reviews /></StaggerReveal>
        <StaggerReveal><Portfolio /></StaggerReveal>
        <StaggerReveal><BlogTips /></StaggerReveal>
        <StaggerReveal><FAQ /></StaggerReveal>
        <Contact />
      </div>
      <Footer />
    </div>
  );
}