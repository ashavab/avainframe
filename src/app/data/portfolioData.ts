// Portfolio entries. Images are served LIVE from Immich (backup.avainframe.com)
// via the /api/portfolio-covers proxy + direct Immich asset URLs (no local
// image files, no Vercel/Cloudflare bandwidth cost).
//
// Exactly 4 cards, one per Immich folder:
//   - Events / Portraits / Website Family (Family) / Pets
//   - Events      -> Events album
//   - Portraits   -> Portraits album
//   - Website Family (shown as "Family") -> Website Family album
// To change which album a card pulls from, edit albumId/shareKey below.

export type PortfolioEntry = {
  title: string;
  category: string;
  date: string;
  description: string;
  galleryLink?: string;
  albumId: string;
  shareKey: string;
};

export const portfolioEntries: PortfolioEntry[] = [
  {
    title: "Events",
    category: "Events",
    date: "",
    description: "Coverage for parties and celebrations across Toronto and beyond.",
    galleryLink: "/galleries/events/",
    albumId: "947c8145-8f27-416f-9286-5abdf4aa8df3",
    shareKey: "Jqq3wKmF-XhOq38DGKwgblcqX7_9USMnbBO4g-750ZrHUqMO1U8GgKqR4b7NuzygLkk",
  },
  {
    title: "Portraits",
    category: "Portraits",
    date: "",
    description: "Professional outdoor and studio portrait sessions.",
    galleryLink: "/galleries/portraits/",
    albumId: "739b8c11-2a73-477a-8029-97b83e1a9ed5",
    shareKey: "qYe334YQwzxNCp_nyS3_bDXMTsUFq8qDf7MvjLQxbqMqV5NYKjlc0uu6M1cWIKA5_50",
  },
  {
    title: "Family",
    category: "Website Family",
    date: "",
    description: "Warm, authentic lifestyle photography celebrating family connections.",
    galleryLink: "/galleries/family/",
    albumId: "154e07a8-48c1-403c-8d14-f9332ed541ac",
    shareKey: "GAyAjlEkY1sP4vBh_lUQxC86vpAFkV1cV6E-cihzsYs6FXYkgaSsWmRWGvKxCHKjG-w",
  },

  {
    title: "Pets",
    category: "Pets",
    date: "",
    description: "Fun, character-driven portraits of pets and their people.",
    galleryLink: "/galleries/pets/",
    albumId: "28701ec3-020c-4c54-b752-decfd5a77a5f",
    shareKey: "j7UfMgT3lVfL_u5BXSOxvEfeFvc9A8IkMdKLGunTmum2sNdNXfO1MkNA512b8fE_Xbk",
  },
];
