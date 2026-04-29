import React, { useState } from "react";
import ConsultationModal from "./ConsultationModal";
import SeoHead from "./SeoHead";
import FAQ from "./FAQ";
import { BreadcrumbListSchema, ServiceAreaSchema } from "./schemaUtils";

const faqs = [
  {
    question: "What types of real estate photography do you offer?",
    answer: "We provide interior, exterior, aerial, and twilight real estate photography for residential and commercial properties."
  },
  {
    question: "How do I book a real estate session?",
    answer: "Contact us through our website or email to schedule your session. We offer flexible timing to suit your listing needs."
  },
  {
    question: "Are edited images included?",
    answer: "Yes, all delivered images are professionally edited for optimal presentation."
  }
];

export default function RealEstateService() {
  const [modalOpen, setModalOpen] = useState(false);
  return (
    <div>
      <SeoHead
        title="Real Estate Photography Toronto | Avainframe Photography"
        description="Professional real estate photography in Toronto for residential and commercial listings. Book your session today."
        canonical="/real-estate"
      />
      <BreadcrumbListSchema page="Real Estate" />
      <ServiceAreaSchema />
      <h1>Real Estate Photography</h1>
      <p>
        Showcase your property with stunning real estate photography. We capture interiors, exteriors, and unique features to help your listing stand out.
      </p>
      <button onClick={() => setModalOpen(true)} className="mt-6 mb-8 px-6 py-3 bg-[#819184] text-white rounded-full font-semibold hover:bg-[#6a7a6c] transition">Book Consultation</button>
      <FAQ faqs={faqs} />
      <ConsultationModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
