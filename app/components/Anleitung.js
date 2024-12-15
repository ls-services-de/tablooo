import React, { useEffect, useState } from 'react';
import { createClient } from '@sanity/client';

const client = createClient({
  projectId: 'ptblhmuq', // Dein Sanity-Projekt-ID
  dataset: 'production',
  useCdn: true,
  apiVersion: '2023-11-21',
  token: 'skqwFLOApVJQigVaZ9ufYOPlSn9ktBOX4EMUCPh2RyhrFOoiAcrPrvg9ZraTH8jUkxecSKjv3SJMzk71V8gCwW3fl1YEnglzylQFUGSYMxLAZEGahhYJtk3IwkD8Y5qLjQB3EKoN4O3qAsJQodT2nhgY72zrrE99Z8QzxKI008iA9X37UkUh', // Dein API Token
});

export default function Anleitung() {
  const [companySlug, setCompanySlug] = useState(null);
  const [loading, setLoading] = useState(true); // Ladezustand
  const [error, setError] = useState(null); // Fehlerzustand

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        // Hole die Benutzerdaten aus dem localStorage
        const userData = JSON.parse(localStorage.getItem('user'));
        console.log('Benutzerdaten aus localStorage:', userData);

        if (!userData || !userData.username) {
          console.error('username nicht im localStorage gefunden.');
          setLoading(false);
          return;
        }

        const username = userData.username;  // Zugriff auf username, da du es als 'username' gespeichert hast
        console.log('Gefundener username:', username);

        // Sanity-Abfrage nach der Firma anhand des username
        const response = await client.fetch(
          `*[_type == "company" && ownerName == $username] {
            slug
          }`,
          { username }
        );

        console.log('Sanity Abfrage Antwort:', response);

        // Überprüfe die Antwortstruktur und extrahiere den slug
        if (response.length > 0 && response[0].slug) {
          setCompanySlug(response[0].slug); // Slug der Firma setzen
          console.log('Gefundener Slug:', response[0].slug);
        } else {
          setError('Firma nicht gefunden oder kein Slug vorhanden');
          console.error('Firma nicht gefunden oder kein Slug vorhanden');
        }

        setLoading(false);
      } catch (error) {
        console.error('Fehler beim Abrufen der Firma:', error);
        setError('Fehler beim Abrufen der Firma');
        setLoading(false);
      }
    };

    fetchCompany();
  }, []);

  // Funktion zum Kopieren des Links in die Zwischenablage
  const handleCopy = () => {
    const link = `https://tablooo.vercel.app/company/${companySlug}`;
    navigator.clipboard.writeText(link)
      .then(() => {
        console.log('Link kopiert:', link);
        alert('Link wurde in die Zwischenablage kopiert!');
      })
      .catch((error) => {
        console.error('Fehler beim Kopieren:', error);
        alert('Fehler beim Kopieren des Links');
      });
  };

  return (
    <div className="bg-gray-50 p-4 rounded-lg shadow-md w-[90%] ml-5">
      <ul className="space-y-2">
        <li>1. Registrierung abschließen</li>
        <li>2. Öffnungszeiten einrichten</li>
        <li>3. Buchungsseite und Einstellungen anpassen</li>
        <li>4. Persönlichen Link auf Ihrer Website teilen.</li>
      </ul>

      {loading ? (
        <p className="mt-4">Lade den Link...</p>
      ) : error ? (
        <p className="mt-4 text-red-500">{error}</p>
      ) : (
        <div>
          <p className="mt-4 max-w-10">
            {companySlug ? (
              `Link: https://tablooo.vercel.app/company/${companySlug}`
            ) : (
              'Slug nicht gefunden'
            )}
          </p>
          {companySlug && (
            <button
              onClick={handleCopy}
              className="mt-4 p-2 bg-orange-500 text-white rounded-lg"
            >
              Link kopieren
            </button>
          )}
        </div>
      )}
    </div>
  );
}
