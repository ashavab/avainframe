// Portfolio entries. Images are served LIVE from Immich (photos.avainframe.com)
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
    galleryLink: "/#/events",
    albumId: "68229603-ffc3-42f1-812e-0039fdab17da",
    shareKey: "FYTRVVpjaSz6jvvkRsTQlVmMZA1xPwciLfgaXdmzrhOeQJb3au8z2CEo99dXpJUcJCU",
  },
  {
    title: "Portraits",
    category: "Portraits",
    date: "",
    description: "Professional outdoor and studio portrait sessions.",
    galleryLink: "/#/portraits",
    albumId: "cf767bd8-cfa5-4be4-abf6-6752ec970b46",
    shareKey: "j0Re9rNpQfVkTZ1Q9jjBEqr-SvrzK30JutcgHkbw7iKYqc_SocMWs0VNOlO5xZE5CD0",
  },
  {
    title: "Family",
    category: "Website Family",
    date: "",
    description: "Warm, authentic lifestyle photography celebrating family connections.",
    galleryLink: "/#/family",
    albumId: "9cbe82d0-02e3-400f-9cce-085fe4476488",
    shareKey: "xsGQ9607vat8nBVK83visn6PGt76xCKkvWMB61vU24Y1PuakQiWJgY2bzB0o6yRN-kc",
  },

  {
    title: "Pets",
    category: "Pets",
    date: "",
    description: "Fun, character-driven portraits of pets and their people.",
    galleryLink: "/#/pets",
    albumId: "f161ff64-5f4a-4290-88eb-7c46835a3901",
    shareKey: "vJV7GZIk7Xv3zI13HxF029WEBU5dx-PljKq88tFLkYxn3I4HTIC4s5iiobFYeLMWs5s",
  },
];
