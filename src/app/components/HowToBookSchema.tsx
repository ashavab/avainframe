// HowTo schema for "How to Book a Session" for SEO
import React from "react";

export function HowToBookSchema() {
  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "How to Book a Photography Session with Ava in Frame",
    "description": "Step-by-step guide to booking your photography session in Toronto or the GTA.",
    "image": "https://avainframe.com/logo.png",
    "step": [
      {
        "@type": "HowToStep",
        "name": "Contact Ava in Frame",
        "text": "Fill out the contact form on the website or reach out via WhatsApp to check availability.",
        "url": "https://avainframe.com/#contact"
      },
      {
        "@type": "HowToStep",
        "name": "Discuss Your Needs",
        "text": "Share your vision, preferred dates, and any special requests. Receive a personalized quote.",
        "url": "https://avainframe.com/#services"
      },
      {
        "@type": "HowToStep",
        "name": "Confirm Your Booking",
        "text": "Secure your date with a signed agreement and deposit. Receive confirmation and next steps."
      },
      {
        "@type": "HowToStep",
        "name": "Enjoy Your Session!",
        "text": "Arrive ready to create beautiful memories. Your gallery will be delivered online after the session."
      }
    ]
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />;
}
