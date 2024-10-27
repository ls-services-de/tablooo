// components/Footer.js

import Link from "next/link";


export default function Footer() {
    return (
        <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-2">Tablooo</h3>
              <p className="text-sm">Optimieren Sie Ihre Restaurantbuchungen</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Links</h3>
              <ul className="text-sm">
                <li><Link href="#features" className="hover:text-orange-500">Features</Link></li>
                <li><Link href="#pricing" className="hover:text-orange-500">Pricing</Link></li>
                <li><Link href="#about" className="hover:text-orange-500">About</Link></li>
                <li><Link href="#contact" className="hover:text-orange-500">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Rechtliches</h3>
              <ul className="text-sm">
                <li><Link href="#" className="hover:text-orange-500">Datenschutz</Link></li>
                <li><Link href="#" className="hover:text-orange-500">Nutzungsbedingungen</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Kontakt</h3>
              <p className="text-sm">info@tablooo.com</p>
              <p className="text-sm">+49 176 46042287</p>
            </div>
          </div>
          <div className="mt-8 text-center text-sm">
            <p>© 2024 Liam Schneider. Alle Rechte vorbehalten.</p>
          </div>
        </div>
      </footer>
    );
  }
  