import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "Tablooo - Reservierungen für Restaurants",
  description: "Tablooo – Das kostenlose Online-Reservierungssystem für Restaurants! Ermöglichen Sie Ihren Gästen eine einfache und schnelle Tischreservierung rund um die Uhr. Ideal für Restaurantbesitzer, die ihren Buchungsprozess digitalisieren möchten – benutzerfreundlich und ohne Kosten.",
  openGraph: {
    title: "Tablooo - Reservierungen für Restaurants",
    description: "Tablooo – Das kostenlose Online-Reservierungssystem für Restaurants! Ermöglichen Sie Ihren Gästen eine einfache und schnelle Tischreservierung rund um die Uhr.",
    images: [
      {
        url: "/tablooo.png",  // Pfad zum Bild im 'public'-Ordner
        width: 1200,
        height: 630,
        alt: "Tablooo - Kostenloses Reservierungssystem",
      },
    ],
  },
};


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}