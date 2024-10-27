// components/AboutSection.js
import Image from "next/image";

export default function AboutSection() {
  return (
    <section id="about" className="py-20 bg-gray-100">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl w-[100%] font-bold text-center mb-8">Über Tablooo</h2>
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-8">
          <div className="md:w-1/2">
            <Image
              src="/about.jpg"
              alt="Tablooo Team"
              width={500}
              height={300}
              objectFit="cover"
              className="rounded-lg shadow-md"
            />
          </div>
          <div className="md:w-1/2">
            <p>Tabloo ist ein Onlinebuchungssystem für Restaurants, das es Gästen ermöglicht, einfach und bequem Tische zu reservieren. Restaurants können mit Tabloo ihre Verfügbarkeit in Echtzeit verwalten, wodurch Doppelbuchungen vermieden werden. Das System bietet eine benutzerfreundliche Oberfläche für Gäste und eine effiziente Verwaltung für das Restaurantpersonal. Funktionen wie automatische Bestätigungen und Erinnerungen sorgen dafür, dass Reservierungen reibungslos ablaufen. Mit Tabloo können Restaurants zudem wertvolle Daten über ihre Gäste sammeln, um den Service kontinuierlich zu verbessern.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
