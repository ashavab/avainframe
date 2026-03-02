import { Heart, Users, Baby, Sparkles } from "lucide-react";

export function Services() {
  const services = [
    {
      icon: Heart,
      title: "Weddings",
      description: "Comprehensive wedding photography packages that capture every magical moment of your special day.",
      price: "Starting at $1000"
    },
    {
      icon: Users,
      title: "Portraits & Family",
      description: "Professional portrait sessions for individuals, couples, and families in studio or outdoor locations.",
      price: "Starting at $200"
    },
    {
      icon: Baby,
      title: "Newborn & Maternity",
      description: "Gentle and beautiful photography celebrating new life and the journey of motherhood.",
      price: "Starting at $200"
    },
    {
      icon: Sparkles,
      title: "Events",
      description: "Coverage for corporate events, parties, celebrations, and special occasions of all kinds.",
      price: "Starting at $400"
    }
  ];

  return (
    <section id="services" className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl mb-4">
            Services
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Professional photography services tailored to your needs
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <div key={index} className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
              <service.icon className="w-12 h-12 mb-4" />
              <h3 className="text-2xl mb-3">
                {service.title}
              </h3>
              <p className="text-gray-600 mb-4">
                {service.description}
              </p>
              <p className="text-sm">
                {service.price}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
