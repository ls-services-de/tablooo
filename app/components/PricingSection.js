// components/PricingSection.js
import { Check } from "lucide-react";

export default function PricingSection() {
  return (
    <section id="pricing" className="py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Preispläne</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { name: "Starter", price: 4.99, features: ["Bis zu 50 Buchungen/Monat", "E-Mail-Support", "Grundlegende Analysen"] },
            { name: "Professional", price: 15.99, features: ["Unbegrenzte Buchungen", "24/7 Support", "Erweiterte Analysen", "Mehrere Benutzerkonten"] },
            { name: "Enterprise", price: 29.99, features: ["Alles aus Professional", "Angepasste Lösungen", "Dedizierter Account Manager", "API-Zugang"] }
          ].map((plan, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md flex flex-col">
              <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
              <p className="text-3xl font-bold mb-4">{plan.price}€ <span className="text-sm font-normal">/ Monat</span></p>
              <ul className="mb-8 flex-grow">
                {plan.features.map((feature, i) => (
                  <li key={i} className="mb-2 flex items-center">
                    <Check size={16} className="text-green-500 mr-2" />
                    {feature}
                  </li>
                ))}
              </ul>
              <button className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded transition-colors">
                Kaufen
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
