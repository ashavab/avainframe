import React, { useState } from "react";
import { Contact } from "./Contact";
import { Instagram, Phone, MessageCircle } from "lucide-react";

export default function ConsultationModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-white dark:bg-black rounded-2xl shadow-xl max-w-lg w-full p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-black dark:hover:text-white text-2xl"
          aria-label="Close"
        >
          ×
        </button>
        <h2 className="text-2xl font-serif mb-4 dark:text-white">Book a Free Consultation</h2>
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
  );
}
