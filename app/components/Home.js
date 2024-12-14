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

  // Hole die nächsten Buchungen aus der Sanity-Datenbank
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const now = new Date().toISOString()
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

  // Hole die Firma aus Sanity anhand der companyId aus localStorage
 

  if (loading) return <p className="text-center py-4">Lädt...</p>

  return (
    <div className="p-4 bg-white rounded-lg shadow-lg space-y-8">
      {/* Kasten für die Buchungen */}
      <div>
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

      
    </div>
  )
}
