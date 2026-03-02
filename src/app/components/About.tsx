interface AboutProps {
  aboutImage: string;   // /IMG-20221020-WA0044~2.jpg
  profileImage: string; // /DSC07060.jpg
}

export function About({ aboutImage, profileImage }: AboutProps) {
  return (
    <section id="about" className="py-20 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto space-y-24">
        {/* Original Ava Section */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <img src={aboutImage} alt="Ava" className="w-full h-[500px] object-cover rounded-lg shadow-xl" />
          <div>
            <h2 className="text-4xl md:text-5xl mb-6">About Ashleigh</h2>
            <div className="space-y-4 text-gray-700">
              <p>Hello! I'm Ashleigh, a passionate photographer based in the heart of creativity. With over 10 years of experience, I specialize in capturing authentic moments that tell your unique story.</p>
              <p>My approach is simple: I believe every person, every moment, and every celebration deserves to be captured with care, creativity, and attention to detail. Whether it's a wedding, portrait session, or special event, I'm here to preserve your memories beautifully.</p>
              <p>When I'm not behind the camera, you'll find me exploring new locations for shoots, experimenting with light, and continuously learning to bring you the best photography experience possible.</p>
            </div>
          </div>
        </div>

        {/* New Avana Section */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1">
            <h2 className="text-4xl md:text-5xl mb-6">About Avana</h2>
            <div className="space-y-4 text-gray-700">
              <p>As your dedicated point of contact, I ensure your experience is seamless and personalized. I handle the details so you can focus on enjoying the moment.</p>
              <p>I am here to guide you through the process, from our first inquiry to the final delivery of your gallery, making sure every need is met with professional care.</p>
            </div>
          </div>
          <img src={profileImage} alt="Avana" className="w-full h-[500px] object-cover rounded-lg shadow-xl order-1 md:order-2" />
        </div>
      </div>
    </section>
  );
}