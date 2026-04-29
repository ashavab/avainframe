import React, { useState } from "react";
import ConsultationModal from "./ConsultationModal";
import { SeoHead } from "./SeoHead";
import { FAQ } from "./FAQ";
import { BreadcrumbListSchema, ServiceAreaSchema } from "./schemaUtils";

const faqs = [
  {
    question: "Can I purchase landscape prints?",
    answer: "Yes, fine art landscape prints are available for purchase. Contact us for available images and sizes."
  },
  {
    question: "Do you offer custom landscape commissions?",
    answer: "We accept select commissions for custom landscape photography projects."
  },
  {
    question: "Are landscape images available for licensing?",
    answer: "Yes, images can be licensed for editorial or commercial use. Please inquire for details."
  }
];

export default function LandscapeService() {
  const [modalOpen, setModalOpen] = useState(false);
  return (
    <div className="bg-white text-gray-900 dark:bg-[#18181b] dark:text-white">
      <SeoHead
        title="Landscape Photography | Avainframe Photography"
        description="Fine art landscape photography and prints. Commission custom landscape images or license for editorial/commercial use."
        canonical="/landscape"
      />
      <BreadcrumbListSchema page="Landscape" />
      <ServiceAreaSchema />
      <h1>Landscape Photography</h1>
      <p>
        Explore fine art landscape photography. Prints, commissions, and licensing available for collectors and businesses.
      </p>
      <button onClick={() => setModalOpen(true)} className="mt-6 mb-8 px-6 py-3 bg-[#819184] text-white rounded-full font-semibold hover:bg-[#6a7a6c] transition">Book Consultation</button>
      <FAQ faqs={faqs} />
      <ConsultationModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
