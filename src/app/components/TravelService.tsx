import React, { useState } from "react";
import ConsultationModal from "./ConsultationModal";
import SeoHead from "./SeoHead";
import FAQ from "./FAQ";
import { BreadcrumbListSchema, ServiceAreaSchema } from "./schemaUtils";

const faqs = [
  {
    question: "Do you offer destination photography?",
    answer: "Yes! We are available for travel and destination photography worldwide."
  },
  {
    question: "How does travel pricing work?",
    answer: "Travel fees are based on location and session type. Contact us for a custom quote."
  },
  {
    question: "What destinations have you photographed?",
    answer: "We have photographed weddings, portraits, and landscapes across Canada and internationally."
  }
];

export default function TravelService() {
  const [modalOpen, setModalOpen] = useState(false);
  return (
    <div>
      <SeoHead
        title="Travel & Destination Photography | Avainframe Photography"
        description="Available for destination weddings, elopements, and travel photography worldwide. Inquire for custom packages."
        canonical="/travel"
      />
      <BreadcrumbListSchema page="Travel" />
      <ServiceAreaSchema />
      <h1>Travel & Destination Photography</h1>
      <p>
        Capture your adventures and special moments anywhere in the world. We offer destination wedding, elopement, and travel photography.
      </p>
      <button onClick={() => setModalOpen(true)} className="mt-6 mb-8 px-6 py-3 bg-[#819184] text-white rounded-full font-semibold hover:bg-[#6a7a6c] transition">Book Consultation</button>
      <FAQ faqs={faqs} />
      <ConsultationModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
