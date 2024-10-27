// components/HeroSection.js
import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center text-white">
      <Image
        src="/interior.jpg"
        alt="Restaurant interior"
        layout="fill"
        objectFit="cover"
        priority
      />
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold mb-4 text-white">Optimieren Sie Ihre Restaurantbuchungen mit Tablooo</h1>
        <p className="text-lg md:text-xl mb-8">Unser fortschrittliches Buchungssystem hilft Ihnen, Ihre Tischreservierungen effizient zu verwalten und Ihren Umsatz zu steigern.</p>
        <div className="space-x-4">
          <button className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded transition-colors">
            Jetzt starten
          </button>
          <button className="bg-transparent hover:bg-white hover:text-orange-500 text-white font-bold py-2 px-4 rounded border border-white transition-colors">
            Demo anfordern
          </button>
        </div>
      </div>
    </section>
  );
}
