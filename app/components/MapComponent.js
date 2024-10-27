'use client';
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Define a custom marker icon
const customIcon = new L.Icon({
  iconUrl: 'https://img.icons8.com/color/48/marker--v1.png', // Replace with your icon URL
  iconSize: [30, 40], // Size of the icon
  iconAnchor: [15, 40], // Point of the icon which will correspond to marker's location
  popupAnchor: [0, -40] // Point from which the popup should open relative to the iconAnchor
});

const MapComponent = ({ address, companyName }) => {
  const [position, setPosition] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCoordinates = async () => {
      try {
        console.log(`Versuche, Koordinaten für die Firma: ${companyName} zu finden...`);
        const companyResponse = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(companyName)}`
        );
        const companyData = await companyResponse.json();

        console.log('Erhaltene Daten für den Firmennamen:', companyData);

        // Iteriere durch alle gefundenen Ergebnisse
        for (const location of companyData) {
          const { lat, lon, display_name } = location;
          console.log(`Gefundene Koordinaten: [${lat}, ${lon}] für ${display_name}`);

          // Überprüfe, ob die Adresse im Display-Name enthalten ist
          if (display_name.includes(address)) {
            setPosition([parseFloat(lat), parseFloat(lon)]);
            setError(''); // Fehler zurücksetzen
            console.log(`Verwende Koordinaten für ${companyName}: [${lat}, ${lon}]`);
            return; // Beende die Funktion, wenn die Adresse übereinstimmt
          }
        }

        // Wenn keine passenden Koordinaten gefunden wurden, gib eine Warnung aus
        console.warn(`Keine passenden Koordinaten für ${companyName} und Adresse ${address} gefunden.`);

        // Wenn keine Übereinstimmung gefunden wurde, versuche die Adresse direkt zu suchen
        const addressResponse = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`
        );
        const addressData = await addressResponse.json();

        console.log('Erhaltene Daten für die Adresse:', addressData);

        if (addressData.length > 0) {
          const { lat, lon } = addressData[0];
          console.log(`Verwende Koordinaten für die Adresse: [${lat}, ${lon}]`);
          setPosition([parseFloat(lat), parseFloat(lon)]);
          setError(''); // Fehler zurücksetzen
        } else {
          setError(`Keine Koordinaten für die Adresse ${address} gefunden.`);
          console.error(`Fehler: Keine Koordinaten gefunden.`);
        }
      } catch (error) {
        setError('Fehler beim Abrufen der Koordinaten: ' + error.message);
        console.error('Fehler:', error);
      }
    };

    fetchCoordinates();
  }, [address, companyName]);

  return (
    <>
      {error && <div style={{ color: 'red' }}>{error}</div>} {/* Fehleranzeige */}
      {position ? (
        <MapContainer className="map-container items-center" center={position} zoom={15} scrollWheelZoom={false}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker position={position} icon={customIcon}>
            <Popup>
              {companyName} <br /> {address}
            </Popup>
          </Marker>
        </MapContainer>
      ) : (
        <div>Map wird geladen...</div>
      )}
    </>
  );
};

export default MapComponent;
