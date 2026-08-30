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
import { Portfolio } from "./components/Portfolio";
import { EngagementsService } from "./components/EngagementsService";
import { FamilyService } from "./components/FamilyService";
import { PortraitsService } from "./components/PortraitsService";
import { EventsService } from "./components/EventsService";
import { TorontoPhotographerService } from "./components/TorontoPhotographerService";
import RealEstateService from "./components/RealEstateService";
import HeadshotsService from "./components/HeadshotsService";
import PetsService from "./components/PetsService";
import BoudoirService from "./components/BoudoirService";
import TravelService from "./components/TravelService";
import LandscapeService from "./components/LandscapeService";
import { SeoHead } from "./components/SeoHead";
import { HowToBookSchema } from "./components/HowToBookSchema";
import { BlogPage } from "./components/BlogPage";
import { useEffect, useState } from "react";

const IMMICH_HIDDEN_PATH = import.meta.env.VITE_IMMICH_HIDDEN_PATH || "/studio-vault";
const IMMICH_CLIENT_PATH = import.meta.env.VITE_IMMICH_CLIENT_PATH || "/clients";
const SERVICES_PATHS = {
  weddings: "/weddings",
  engagements: "/engagements",
  family: "/family",
  toronto: "/toronto-photographer",
  realEstate: "/real-estate",
  headshots: "/headshots",
  pets: "/pets",
  boudoir: "/boudoir",
  travel: "/travel",
  landscape: "/landscape",
  portraits: "/portraits",
  events: "/events"
};

function normalizePath(path: string) {
  return path.replace(/\/+$/, "") || "/";
}

function getRouteCandidates() {
  const path = normalizePath(window.location.pathname);
  const rawHash = window.location.hash.replace(/^#/, "");
  // Split off any query string so #/clients?token=jasmine routes to /clients
  // (the token stays readable via window.location.hash's query portion).
  const hashNoQuery = rawHash.split("?")[0];
  const hashPath = hashNoQuery ? (hashNoQuery.startsWith("/") ? hashNoQuery : `/${hashNoQuery}`) : "/";
  const hash = normalizePath(hashPath);
  return { path, hash };
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
  const realEstatePath = normalizePath(SERVICES_PATHS.realEstate);
  const headshotsPath = normalizePath(SERVICES_PATHS.headshots);
  const petsPath = normalizePath(SERVICES_PATHS.pets);
  const boudoirPath = normalizePath(SERVICES_PATHS.boudoir);
  const travelPath = normalizePath(SERVICES_PATHS.travel);
  const landscapePath = normalizePath(SERVICES_PATHS.landscape);
  const portraitsPath = normalizePath(SERVICES_PATHS.portraits);
  const eventsPath = normalizePath(SERVICES_PATHS.events);

  const isImmichPath = path === hiddenPath || hash === hiddenPath;
  const isClientPath = path === clientPath || hash === clientPath;
  const isWeddingsPath = path === weddingsPath || hash === weddingsPath;
  const isEngagementsPath = path === engagementsPath || hash === engagementsPath;
  const isFamilyPath = path === familyPath || hash === familyPath;
  const isTorontoPath = path === torontoPath || hash === torontoPath;
  const isRealEstatePath = path === realEstatePath || hash === realEstatePath;
  const isHeadshotsPath = path === headshotsPath || hash === headshotsPath;
  const isPetsPath = path === petsPath || hash === petsPath;
  const isBoudoirPath = path === boudoirPath || hash === boudoirPath;
  const isTravelPath = path === travelPath || hash === travelPath;
  const isLandscapePath = path === landscapePath || hash === landscapePath;
  const isPortraitsPath = path === portraitsPath || hash === portraitsPath;
  const isEventsPath = path === eventsPath || hash === eventsPath;
  const isBlogPath = hash === "/blog";
    if (isRealEstatePath) {
      return <RealEstateService />;
    }
    if (isHeadshotsPath) {
      return <HeadshotsService />;
    }
    if (isPetsPath) {
      return <PetsService />;
    }
    if (isBoudoirPath) {
      return <BoudoirService />;
    }
    if (isTravelPath) {
      return <TravelService />;
    }
    if (isLandscapePath) {
      return <LandscapeService />;
    }
  if (isBlogPath) {
    return <BlogPage />;
  }

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

  if (isPortraitsPath) {
    return (
      <>
        <SeoHead
          title="Toronto Portrait Photographer | Ava in Frame"
          description="Timeless personal and lifestyle portraits in Toronto."
          canonicalPath="/portraits"
          type="article"
          keywords="Toronto portrait photographer, portrait photography GTA"
          imagePath="/IMG_0158.jpeg"
        />
        <PortraitsService />
      </>
    );
  }

  if (isEventsPath) {
    return (
      <>
        <SeoHead
          title="Toronto Event Photographer | Ava in Frame"
          description="Candid event and celebration photography in Toronto."
          canonicalPath="/events"
          type="article"
          keywords="Toronto event photographer, event photography GTA"
          imagePath="/IMG_0158.jpeg"
        />
        <EventsService />
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
        <StaggerReveal><Portfolio /></StaggerReveal>
        <Services />
        {/* <StaggerReveal><Reviews /></StaggerReveal> */}
        {/* <StaggerReveal><BlogTips /></StaggerReveal> */}
        <StaggerReveal><FAQ /></StaggerReveal>
        <Contact />
      </div>
      <Footer />
    </div>
  );
}