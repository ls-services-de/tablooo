'use client'

import React, { useEffect, useState } from 'react'
import { createClient } from '@sanity/client'

const client = createClient({
  projectId: 'ptblhmuq', // Dein Sanity-Projekt-ID
  dataset: 'production',
  useCdn: true,
  apiVersion: '2023-11-21',
  token: 'skqwFLOApVJQigVaZ9ufYOPlSn9ktBOX4EMUCPh2RyhrFOoiAcrPrvg9ZraTH8jUkxecSKjv3SJMzk71V8gCwW3fl1YEnglzylQFUGSYMxLAZEGahhYJtk3IwkD8Y5qLjQB3EKoN4O3qAsJQodT2nhgY72zrrE99Z8QzxKI008iA9X37UkUh', // Dein API Token
})

export default function LastBookings() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  // Hole die nächsten Buchungen aus der Sanity-Datenbank, die in der Zukunft liegen
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const now = new Date().toISOString() // Aktuelles Datum im ISO-Format
        const response = await client.fetch(`
          *[_type == "booking" && date > "${now}"] | order(date asc) {
            _id,
            customerName,
            customerEmail,
            date,
            duration
          }
        `)
        setBookings(response)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching bookings:', error)
        setLoading(false)
      }
    }

    fetchBookings()
  }, [])

  if (loading) return <p className="text-center py-4">Lädt...</p>

  return (
    <div className="flex space-x-8 p-4 bg-white rounded-lg shadow-lg">
      {/* Kasten für die Buchungen */}
      <div className="w-1/2">
        <h2 className="text-xl font-semibold mb-4">Zukünftige Buchungen</h2>
        <div className="space-y-4">
          {bookings.length === 0 ? (
            <p className="text-center">Keine zukünftigen Buchungen gefunden.</p>
          ) : (
            bookings.map((booking) => (
              <div key={booking._id} className="bg-gray-100 text-black p-4 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold">{booking.customerName}</h3>
                <p className="text-gray-600">E-Mail: {booking.customerEmail}</p>
                <p className="text-gray-600">Buchungszeit: {new Date(booking.date).toLocaleString()}</p>
                <p className="text-gray-600">Dauer: {booking.duration} Stunden</p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Kasten für die Anleitung */}
      <div className="w-1/2 bg-gray-50 p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Anleitung</h2>
        <p className="text-gray-600">
          Hier findest du die nächsten Buchungen deines Unternehmens. Die Buchungen sind nach
          Datum sortiert, mit der nächsten Buchung oben. Wenn du eine detaillierte Übersicht
          zu einer bestimmten Buchung benötigst, klicke auf die entsprechende Buchung, um
          weitere Informationen zu sehen.
        </p>
        <p className="text-gray-600 mt-4">
          Für weitere Informationen oder Fragen, wende dich bitte an den Support.
        </p>
      </div>
    </div>
  )
}
