import React, { useState } from "react";
import ConsultationModal from "./ConsultationModal";
import SeoHead from "./SeoHead";
import FAQ from "./FAQ";
import { BreadcrumbListSchema, ServiceAreaSchema } from "./schemaUtils";

const faqs = [
  {
    question: "What is boudoir photography?",
    answer: "Boudoir photography is an empowering and intimate portrait session designed to celebrate your confidence and beauty."
  },
  {
    question: "Where do boudoir sessions take place?",
    answer: "Sessions can be held in-studio, at your home, or a private location of your choice."
  },
  {
    question: "Is privacy guaranteed?",
    answer: "Absolutely. All sessions are confidential and images are only shared with your explicit permission."
  }
];

export default function BoudoirService() {
  const [modalOpen, setModalOpen] = useState(false);
  return (
    <div>
      <SeoHead
        title="Boudoir Photography Toronto | Avainframe Photography"
        description="Empowering boudoir photography in Toronto. Celebrate your confidence with a private, professional session."
        canonical="/boudoir"
      />
      <BreadcrumbListSchema page="Boudoir" />
      <ServiceAreaSchema />
      <h1>Boudoir Photography</h1>
      <p>
        Celebrate your confidence and beauty with a private boudoir session. Professional, empowering, and always confidential.
      </p>
      <button onClick={() => setModalOpen(true)} className="mt-6 mb-8 px-6 py-3 bg-[#819184] text-white rounded-full font-semibold hover:bg-[#6a7a6c] transition">Book Consultation</button>
      <FAQ faqs={faqs} />
      <ConsultationModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
