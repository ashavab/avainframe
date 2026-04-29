import React, { useState } from "react";
import ConsultationModal from "./ConsultationModal";
import { SeoHead } from "./SeoHead";
import { FAQ } from "./FAQ";
import { BreadcrumbListSchema, ServiceAreaSchema } from "./schemaUtils";

const faqs = [
  {
    question: "What types of headshots do you offer?",
    answer: "We offer professional headshots for business, acting, social media, and personal branding."
  },
  {
    question: "Where do headshot sessions take place?",
    answer: "Sessions can be held in-studio, on-location, or at your office for groups."
  },
  {
    question: "How do I prepare for my headshot session?",
    answer: "We provide guidance on wardrobe, posing, and expression to ensure you look your best."
  }
];

export default function HeadshotsService() {
  const [modalOpen, setModalOpen] = useState(false);
  return (
    <div className="bg-white text-gray-900 dark:bg-[#18181b] dark:text-white">
      <SeoHead
        title="Professional Headshots Toronto | Avainframe Photography"
        description="Business, acting, and personal branding headshots in Toronto. Book your professional headshot session today."
        canonical="/headshots"
      />
      <BreadcrumbListSchema page="Headshots" />
      <ServiceAreaSchema />
      <h1>Headshots</h1>
      <p>
        Elevate your professional image with high-quality headshots. Perfect for business, acting, and personal branding.
      </p>
      <button onClick={() => setModalOpen(true)} className="mt-6 mb-8 px-6 py-3 bg-[#819184] text-white rounded-full font-semibold hover:bg-[#6a7a6c] transition">Book Consultation</button>
      <FAQ faqs={faqs} />
      <ConsultationModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
