// Portfolio entries. Images are served LIVE from Immich (backup.avainframe.com)
// via the /api/portfolio-covers proxy + direct Immich asset URLs (no local
// image files, no Vercel/Cloudflare bandwidth cost).
//
// Each entry maps to an Immich shared-link album. To change which album a
// card pulls from, edit albumId/shareKey below. Currently only the
// "Website Family" album has photos; Events & Portraits are empty in Immich,
// so every card points there for now. Swap a card to Events/Portraits once
// you've added photos to those albums.

export type PortfolioEntry = {
  title: string;
  category: string;
  date: string;
  description: string;
  galleryLink?: string;
  albumId: string;
  shareKey: string;
};

// Shared-link albums on backup.avainframe.com (Windows Immich).
const ALBUM_WEBSITE_FAMILY = {
  albumId: "154e07a8-48c1-403c-8d14-f9332ed541ac",
  shareKey: "GAyAjlEkY1sP4vBh_lUQxC86vpAFkV1cV6E-cihzsYs6FXYkgaSsWmRWGvKxCHKjG-w",
};
const ALBUM_EVENTS = {
  albumId: "947c8145-8f27-416f-9286-5abdf4aa8df3",
  shareKey: "Jqq3wKmF-XhOq38DGKwgblcqX7_9USMnbBO4g-750ZrHUqMO1U8GgKqR4b7NuzygLkk",
};
const ALBUM_PORTRAITS = {
  albumId: "739b8c11-2a73-477a-8029-97b83e1a9ed5",
  shareKey: "qYe334YQwzxNCp_nyS3_bDXMTsUFq8qDf7MvjLQxbqMqV5NYKjlc0uu6M1cWIKA5_50",
};

export const portfolioEntries: PortfolioEntry[] = [
  { title: "Golden Hour Wedding", category: "Wedding Photography", date: "April 2026", description: "Editorial wedding photography with a modern Toronto celebration feel.", galleryLink: "/galleries/weddings/", ...ALBUM_WEBSITE_FAMILY },
  { title: "City Engagement Session", category: "Engagement Sessions", date: "March 2026", description: "Natural engagement portraits at iconic Toronto locations.", galleryLink: "/galleries/engagements/", ...ALBUM_WEBSITE_FAMILY },
  { title: "Family & Portrait Session", category: "Family & Portraits", date: "February 2026", description: "Timeless family and portrait photography for modern Toronto families.", galleryLink: "/galleries/family/", ...ALBUM_WEBSITE_FAMILY },
  { title: "Professional Headshots", category: "Professional Headshots", date: "January 2026", description: "Clean corporate and personal branding headshots for your professional image.", galleryLink: "/galleries/headshots/", ...ALBUM_PORTRAITS },
  { title: "Empowering Boudoir", category: "Boudoir Photography", date: "January 2026", description: "Private boudoir sessions that celebrate confidence and intimate artistry.", galleryLink: "/galleries/boudoir/", ...ALBUM_PORTRAITS },
  { title: "Commercial & Pets", category: "Commercial & Pets", date: "May 2026", description: "Business and promotional photography paired with playful pet portraits.", galleryLink: "/galleries/commercial-pets/", ...ALBUM_WEBSITE_FAMILY },
  { title: "Real Estate Showcase", category: "Real Estate Photography", date: "May 2026", description: "Beautiful real estate photography designed to make listings stand out.", galleryLink: "/galleries/real-estate/", ...ALBUM_WEBSITE_FAMILY },
  { title: "Pet Portraits", category: "Pet Photography", date: "April 2026", description: "Fun, character-driven portraits of pets and their people.", galleryLink: "/galleries/pet-photography/", ...ALBUM_WEBSITE_FAMILY },
  { title: "Creative Travel Stories", category: "Creative & Travel", date: "April 2026", description: "Adventure-driven travel imagery with editorial styling and vibrant storytelling.", galleryLink: "/galleries/creative-travel/", ...ALBUM_WEBSITE_FAMILY },
  { title: "Destination Portfolio", category: "Travel & Destination", date: "March 2026", description: "Destination photography for couples, creatives, and adventurous brands.", galleryLink: "/galleries/travel-destination/", ...ALBUM_WEBSITE_FAMILY },
  { title: "Landscape Collection", category: "Landscape Photography", date: "March 2026", description: "Large-scale landscape photography for fine art and editorial use.", galleryLink: "/galleries/landscape/", ...ALBUM_WEBSITE_FAMILY },
  { title: "Toronto Photographer Area", category: "Toronto Photographer Area", date: "May 2026", description: "Local Toronto photography for weddings, portraits, and lifestyle imagery.", galleryLink: "/galleries/toronto/", ...ALBUM_WEBSITE_FAMILY },
];
