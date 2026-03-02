import { Mail, Phone, MapPin, Instagram, Facebook, MessageSquare, Globe, MessageCircle } from "lucide-react";
import { useState } from "react";
import emailjs from '@emailjs/browser';

export function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const templateParams = {
      name: formData.name,
      from_email: formData.email,
      phone: formData.phone,
      message: formData.message,
      title: "New Photography Inquiry",
      reply_to: 'avainframe@proton.me'
    };
    
    emailjs.send(import.meta.env.VITE_EMAILJS_SERVICE_ID, import.meta.env.VITE_EMAILJS_INFORM, templateParams, import.meta.env.VITE_EMAILJS_PUBLIC_KEY);
    emailjs.send(import.meta.env.VITE_EMAILJS_SERVICE_ID, import.meta.env.VITE_EMAILJS_TEMPLATE_ID, templateParams, import.meta.env.VITE_EMAILJS_PUBLIC_KEY)
      .then(() => {
        alert("Message sent! Ashleigh & Avana will get back to you soon.");
        setFormData({ name: "", email: "", phone: "", message: "" });
      });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <section id="contact" className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl mb-4 font-serif">Get in Touch</h2>
          <p className="text-gray-600 text-lg">Let's create something beautiful together</p>
        </div>
        <div className="grid md:grid-cols-2 gap-12">
          <form onSubmit={handleSubmit} className="space-y-6">
            <input type="text" name="name" placeholder="Name *" required value={formData.name} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black outline-none" />
            <input type="email" name="email" placeholder="Email *" required value={formData.email} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black outline-none" />
            <input type="tel" name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black outline-none" />
            <textarea name="message" placeholder="Message *" required rows={5} value={formData.message} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black outline-none resize-none"></textarea>
            <button type="submit" className="w-full bg-black text-white py-4 rounded-full hover:bg-gray-800 transition-colors">Send Message</button>
          </form>
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-4"><Mail className="w-5 h-5" /> <p>hello@avainframe</p></div>
              <div className="flex items-center gap-4"><Phone className="w-5 h-5" /> <p>+1 (647) 710-4734</p></div>
              <div className="flex items-center gap-4"><MapPin className="w-5 h-5" /> <p>Markham, ON</p></div>
            </div>
            <div className="flex flex-col gap-4">
              <a href="https://wa.me/16477104734" target="_blank" className="flex items-center gap-3 group">
                <div className="w-10 h-10 bg-[#25D366] text-white rounded-full flex items-center justify-center hover:opacity-90"><MessageCircle className="w-5 h-5" /></div>
                <span className="text-sm font-medium">WhatsApp: Chat with us</span>
              </a>
              <a href="https://instagram.com/ava_in_frame" target="_blank" className="flex items-center gap-3 group">
                <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center group-hover:bg-gray-800"><Instagram className="w-5 h-5" /></div>
                <span className="text-sm font-medium">Business: @ava_in_frame</span>
              </a>
              <a href="https://instagram.com/_boudier" target="_blank" className="flex items-center gap-3 group">
                <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center group-hover:bg-gray-800"><Instagram className="w-5 h-5" /></div>
                <span className="text-sm font-medium">Personal: @_boudier</span>
              </a>
              <a href="https://ashleighboudier.vercel.app" target="_blank" className="flex items-center gap-3 group">
                <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center group-hover:bg-gray-800"><Globe className="w-5 h-5" /></div>
                <span className="text-sm font-medium">Portfolio: ashleighboudier.vercel.app</span>
              </a>
            </div>
            <div className="bg-[#fdfcfb] border p-6 rounded-xl shadow-sm">
              <h4 className="text-xl font-serif flex items-center gap-2"><MessageSquare className="w-5 h-5" /> What's Next?</h4>
              <p className="text-gray-600 mt-2">We typically respond within 24-48 hours. Talk soon!</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}