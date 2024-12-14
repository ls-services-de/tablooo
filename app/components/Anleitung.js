import React from 'react'

export default function Anleitung() {
  return (
    // Kasten für die Anleitung
    <div className="bg-gray-50 p-4 rounded-lg shadow-md">
      <ul className="space-y-2">
        <li>1. Registrierung abschließen</li>
        <li>2. Öffnungszeiten einrichten</li>
        <li>3. Buchungsseite und Einstellungen anpassen</li>
        <li>4. Persönlichen Link auf Ihrer Website teilen.</li>
      </ul>
      <p className="mt-4">Link: https://tablooo.vercel.app/company/[Firmenname einfügen]</p>
    </div>
  )
}
