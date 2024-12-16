// components/PricingSection.js
import { Check } from "lucide-react";
import Link from "next/link";

export default function PricingSection() {
  return (
    <section id="pricing" className="py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Preispläne</h2>
        <div className="flex flex-col md:flex-row justify-center items-center gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md flex flex-col">
            <h3 className="text-xl font-bold mb-2">Kostenloser Plan</h3>
            <p className="text-3xl font-bold mb-4">0.00€ <span className="text-sm font-normal">/ Monat</span></p>
            <ul className="mb-8 flex-grow">
              <li className="mb-2 flex items-center">
                <Check size={16} className="text-green-500 mr-2" />
                Unendliche Buchungen 
              </li>
              <li className="mb-2 flex items-center">
                <Check size={16} className="text-green-500 mr-2" />
                E-Mail-Support
              </li>
              <li className="mb-2 flex items-center">
                <Check size={16} className="text-green-500 mr-2" />
                Fortgeschrittene Analysen
              </li>
              <li className="mb-2 flex items-center">
                <Check size={16} className="text-green-500 mr-2" />
                Benutzerdefinierte Öffnungzeiten und Scores
              </li>
              <li className="mb-2 flex items-center">
                <Check size={16} className="text-green-500 mr-2" />
                Tischanzahl und Styling-Möglichkeiten
              </li>
            </ul>
            <button className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded transition-colors">
             <Link href="/registrierung"> Jetzt anmelden</Link>
            </button>
          </div>
          <div className="bg-gray-100 max-w-[66%] p-6 rounded-lg shadow-md flex flex-col text-center">
            <h3 className="text-xl font-bold mb-2">Kostenlos und unverbindlich!</h3>
            <p className="mb-4">

            Entdecken Sie unsere Services und genießen Sie eine Vielzahl an Funktionen – ohne jegliche Kosten! <br /> <br />Profitieren Sie von unseren umfangreichen Angeboten, die Ihnen zahlreiche Vorteile bieten und Ihren Alltag erleichtern. <br />

            Starten Sie noch heute und tauchen Sie ein in unsere Welt voller Möglichkeiten. <br /> Überzeugen Sie sich selbst von der Qualität und den nützlichen Funktionen, die wir Ihnen zur Verfügung stellen. Erleben Sie, wie einfach und angenehm es sein kann, unsere Dienstleistungen zu nutzen – alles kostenlos und mit nur einem Klick erreichbar!</p>
            <p className="text-sm text-gray-600">Starten Sie jetzt und erleben Sie, was wir zu bieten haben!</p>
          </div>
        </div>
      </div>
    </section>
  );
}
