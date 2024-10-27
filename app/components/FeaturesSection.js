// components/FeaturesSection.js
import { Calendar, BarChart2, Users } from "lucide-react";

export default function FeaturesSection() {
  return (
    <section id="features" className="py-20 bg-gray-100">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Hauptfunktionen</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { icon: <Calendar size={48} />, title: "Einfache Buchungen", description: "Intuitive Benutzeroberfläche für schnelle und einfache Reservierungen." },
            { icon: <BarChart2 size={48} />, title: "Detaillierte Analysen", description: "Umfassende Einblicke in Ihre Buchungsdaten und Geschäftsleistung." },
            { icon: <Users size={48} />, title: "Kundenverwaltung", description: "Verwalten Sie Ihre Kundenbeziehungen und -präferenzen effektiv." },
          ].map((feature, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-4xl text-orange-500 mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
