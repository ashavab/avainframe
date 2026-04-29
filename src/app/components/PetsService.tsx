import React, { useState } from "react";
import ConsultationModal from "./ConsultationModal";
import { SeoHead } from "./SeoHead";
import { FAQ } from "./FAQ";
import { BreadcrumbListSchema, ServiceAreaSchema } from "./schemaUtils";

const faqs = [
  {
    question: "What types of pet photography do you offer?",
    answer: "We photograph dogs, cats, and all beloved pets, capturing their unique personalities."
  },
  {
    question: "Where do pet sessions take place?",
    answer: "Sessions can be held outdoors, in your home, or at a favorite location for your pet."
  },
  {
    question: "Can I be in the photos with my pet?",
    answer: "Absolutely! We encourage owners to join their pets for memorable portraits."
  }
];

export default function PetsService() {
  const [modalOpen, setModalOpen] = useState(false);
  return (
    <div>
      <SeoHead
        title="Pet Photography Toronto | Avainframe Photography"
        description="Fun and professional pet photography in Toronto. Capture your pet's personality with a custom session."
        canonical="/pets"
      />
      <BreadcrumbListSchema page="Pets" />
      <ServiceAreaSchema />
      <h1>Pet Photography</h1>
      <p>
        Celebrate your furry friends with a pet photography session. We capture the joy and character of your pets in every photo.
      </p>
      <button onClick={() => setModalOpen(true)} className="mt-6 mb-8 px-6 py-3 bg-[#819184] text-white rounded-full font-semibold hover:bg-[#6a7a6c] transition">Book Consultation</button>
      <FAQ faqs={faqs} />
      <ConsultationModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
