interface AboutProps {
  aboutImage: string;
  profileImage: string;
}

export function About({ aboutImage, profileImage }: AboutProps) {
  return (
    <section id="about" className="py-20 px-4 bg-transparent transition-colors duration-1000">
      <div className="max-w-6xl mx-auto space-y-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="relative group">
            <img src={aboutImage} alt="Portrait of Ashleigh, lead photographer" loading="lazy" className="w-full h-[500px] object-cover rounded-2xl shadow-lg transition-transform duration-700 group-hover:scale-[1.02]" />
            <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-black/5 dark:ring-white/10" />
          </div>
          <div>
            <h2 className="text-4xl md:text-5xl mb-6 font-serif dark:text-white">About Ashleigh</h2>
            <div className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed">
              <p>Hello! I'm Ashleigh, a passionate photographer based in the heart of creativity. With over 10 years of experience, I specialize in capturing authentic moments that tell your unique story.</p>
              <p>My approach is simple: I believe every person, every moment, and every celebration deserves to be captured with care and attention to detail.</p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1 text-right md:text-left">
            <h2 className="text-4xl md:text-5xl mb-6 font-serif dark:text-white">About Avana</h2>
            <div className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed">
              <p>As your dedicated point of contact, I ensure your experience is seamless and personalized. I handle the details so you can focus on enjoying the moment.</p>
              <p>I am here to guide you through the process, from our first inquiry to the final delivery of your gallery, making sure every need is met with professional care.</p>
            </div>
          </div>
          <div className="relative group order-1 md:order-2">
            <img src={profileImage} alt="Portrait of Avana, client coordinator" loading="lazy" className="w-full h-[500px] object-cover rounded-2xl shadow-lg transition-transform duration-700 group-hover:scale-[1.02]" />
            <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-black/5 dark:ring-white/10" />
          </div>
        </div>
      </div>
    </section>
  );
}