import React, { useState } from "react";
import { Contact } from "./Contact";
import { Instagram, Phone, MessageCircle } from "lucide-react";

export default function ConsultationModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  // Handler for overlay click
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Only close if the user clicked directly on the overlay, not inside the modal
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      onClick={handleOverlayClick}
    >
      <div className="bg-white dark:bg-black rounded-2xl shadow-xl max-w-2xl w-[98vw] sm:w-[600px] p-10 sm:p-12 relative max-h-[90vh] overflow-y-auto flex flex-col justify-center box-border">
        {/* Add a wrapper for inner content to ensure equal spacing */}
        <div className="flex flex-col gap-6 justify-center h-full w-full">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-black dark:hover:text-white text-2xl"
          aria-label="Close"
        >
          ×
        </button>
        <button
          onClick={onClose}
          className="absolute top-4 left-4 text-gray-400 hover:text-black dark:hover:text-white text-xl px-2 py-1 rounded-full border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-black/40"
          aria-label="Back"
        >
          ← Back
        </button>
        <h2 className="text-2xl font-serif mb-4 dark:text-white text-center">Book a Free Consultation</h2>
        <Contact />
        <div className="mt-6 flex flex-col gap-3">
          <a href="https://wa.me/16477104734" target="_blank" className="flex items-center gap-2 text-[#25D366] hover:underline">
            <MessageCircle className="w-5 h-5" /> WhatsApp: Chat with us
          </a>
          <a href="tel:+16477104734" className="flex items-center gap-2 text-black dark:text-white hover:underline">
            <Phone className="w-5 h-5" /> Call: +1 (647) 710-4734
          </a>
          <a href="https://instagram.com/ava_in_frame" target="_blank" className="flex items-center gap-2 text-pink-600 hover:underline">
            <Instagram className="w-5 h-5" /> Instagram: @ava_in_frame
          </a>
        </div>
        </div>
      </div>
    </div>
  );
}
