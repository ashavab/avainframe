export type PortfolioEntry = {
  title: string;
  category: string;
  date: string;
  description: string;
  imageUrl: string;
  galleryLink?: string;
};

export const portfolioEntries: PortfolioEntry[] = [
  {
    title: "Golden Hour Wedding",
    category: "Weddings",
    date: "April 2026",
    description: "A warm, editorial wedding gallery filmed at sunset for a modern Toronto couple.",
    imageUrl: "/DSC06596.jpg",
    galleryLink: "https://example.com/wedding-gallery"
  },
  {
    title: "Engagement Story",
    category: "Engagements",
    date: "March 2026",
    description: "A heartfelt engagement session featuring natural light, city charm, and candid moments.",
    imageUrl: "/DSC07060.jpg",
    galleryLink: "https://example.com/engagement-gallery"
  },
  {
    title: "Family Park Session",
    category: "Family",
    date: "February 2026",
    description: "Playful family portraits in a bright outdoor park setting with relaxed styling.",
    imageUrl: "/IMG_0158.jpeg",
    galleryLink: "https://example.com/family-gallery"
  },
  {
    title: "Studio Portraits",
    category: "Headshots",
    date: "January 2026",
    description: "Minimal studio portraits capturing professional confidence and personal style.",
    imageUrl: "/window.jpeg",
    galleryLink: "https://example.com/headshot-gallery"
  }
];
