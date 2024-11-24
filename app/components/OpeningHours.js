'use client'

import React, { useEffect, useState } from 'react'
import { createClient } from '@sanity/client'
import { Pen } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';

const client = createClient({
  projectId: 'ptblhmuq',
  dataset: 'production',
  useCdn: true,
  apiVersion: '2023-11-21',
  token: 'skqwFLOApVJQigVaZ9ufYOPlSn9ktBOX4EMUCPh2RyhrFOoiAcrPrvg9ZraTH8jUkxecSKjv3SJMzk71V8gCwW3fl1YEnglzylQFUGSYMxLAZEGahhYJtk3IwkD8Y5qLjQB3EKoN4O3qAsJQodT2nhgY72zrrE99Z8QzxKI008iA9X37UkUh',
})

export default function OpeningHours() {
  const [openingHours, setOpeningHours] = useState([])
  const [loading, setLoading] = useState(true)
  const [newOpeningHour, setNewOpeningHour] = useState({
    day: '',
    openTime: '',
    closeTime: '',
    hasBreak: false,
    breakStart: '',
    breakEnd: '',
  })
  const [isEditing, setIsEditing] = useState(false)
  const [editId, setEditId] = useState(null)

  const companyData = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || '{}') : {}
  const companyId = companyData.companyId

  useEffect(() => {
    const fetchOpeningHours = async () => {
      if (!companyId) {
        console.error('No company ID found in local storage.')
        return
      }

      try {
        const response = await client.fetch(`*[_type == "openingHours" && company._ref == $companyId]`, { companyId })
        setOpeningHours(response)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching opening hours:', error)
        setLoading(false)
      }
    }

    fetchOpeningHours()
  }, [companyId])

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setNewOpeningHour({ ...newOpeningHour, [e.target.name]: value })
  }

  const validateTimes = () => {
    const { openTime, closeTime, breakStart, breakEnd } = newOpeningHour

    if (closeTime <= openTime) {
      alert('Die Schließzeit muss später sein als die Öffnungszeit.')
      return false
    }

    if (newOpeningHour.hasBreak) {
      if (breakStart <= openTime || breakEnd >= closeTime) {
        alert('Die Pause muss innerhalb der Öffnungszeiten liegen.')
        return false
      }
    }

    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!isEditing && !newOpeningHour.day) {
      alert('Bitte einen Tag auswählen.')
      return
    }

    if (!validateTimes()) {
      return
    }

    try {
      if (isEditing) {
        await client.patch(editId).set({
          openTime: newOpeningHour.openTime,
          closeTime: newOpeningHour.closeTime,
          breakStart: newOpeningHour.hasBreak ? newOpeningHour.breakStart : undefined,
          breakEnd: newOpeningHour.hasBreak ? newOpeningHour.breakEnd : undefined,
        }).commit()
        alert('Öffnungszeiten erfolgreich bearbeitet!')
      } else {
        await client.create({
          _type: 'openingHours',
          day: newOpeningHour.day,
          openTime: newOpeningHour.openTime,
          closeTime: newOpeningHour.closeTime,
          breakStart: newOpeningHour.hasBreak ? newOpeningHour.breakStart : undefined,
          breakEnd: newOpeningHour.hasBreak ? newOpeningHour.breakEnd : undefined,
          company: {
            _type: 'reference',
            _ref: companyId,
          },
        })
        alert('Öffnungszeiten erfolgreich hinzugefügt!')
      }

      setNewOpeningHour({
        day: '',
        openTime: '',
        closeTime: '',
        hasBreak: false,
        breakStart: '',
        breakEnd: '',
      })
      const updatedHours = await client.fetch(`*[_type == "openingHours" && company._ref == $companyId]`, { companyId })
      setOpeningHours(updatedHours)
      setIsEditing(false)
      setEditId(null)
    } catch (error) {
      console.error('Error adding/editing opening hour:', error)
      alert('Fehler beim Hinzufügen/Bearbeiten der Öffnungszeiten.')
    }
  }

  const handleEdit = (hour) => {
    setNewOpeningHour({
      day: hour.day, // Set the day for editing
      openTime: hour.openTime,
      closeTime: hour.closeTime,
      hasBreak: !!hour.breakStart,
      breakStart: hour.breakStart || '',
      breakEnd: hour.breakEnd || '',
    })
    setIsEditing(true)
    setEditId(hour._id)
  }

  if (loading) return <p className="text-center py-4">Lädt...</p>

  const groupedHours = {
    Montag: [],
    Dienstag: [],
    Mittwoch: [],
    Donnerstag: [],
    Freitag: [],
    Samstag: [],
    Sonntag: [],
  }

  openingHours.forEach((hour) => {
    if (groupedHours[hour.day]) {
      groupedHours[hour.day].push(hour)
    }
  })

  const calculateAverageOpeningTime = () => {
    let totalMinutes = 0;
    let dayCount = 0;
  
    openingHours.forEach(hour => {
      const openTime = new Date(`1970-01-01T${hour.openTime}:00`);
      const closeTime = new Date(`1970-01-01T${hour.closeTime}:00`);
      const minutesOpen = (closeTime - openTime) / (1000 * 60);
  
      totalMinutes += minutesOpen;
      dayCount++;
    });
  
    const averageMinutesPerDay = dayCount > 0 ? totalMinutes / dayCount : 0;
    const hours = parseFloat((averageMinutesPerDay / 60).toFixed(2)); // Hours rounded to 2 decimal places
    const minutes = parseFloat((averageMinutesPerDay % 60).toFixed(2)); // Minutes rounded to 2 decimal places
    const averageTimePerWeek = parseFloat((totalMinutes / 60).toFixed(2)); // Total hours in the week rounded to 2 decimal places
  
    return { hours, minutes, averageTimePerWeek };
  };
  
  const { hours, minutes, averageTimePerWeek } = calculateAverageOpeningTime();
  

  const calculateScore = () => {
    const targetHours = 5; // Perfekte Öffnungszeit pro Tag in Stunden
    const totalMinutesOpen = hours * 60 + minutes; // Gesamtöffnungszeit in Minuten
    const targetMinutes = targetHours * 60; // Zielöffnungszeit in Minuten
  
    // Berechnung des Abweichungsprozentwertes
    const deviation = ((totalMinutesOpen - targetMinutes) / targetMinutes) * 100;
    
    // Score basierend auf der Abweichung
    if (deviation <= 20) return 100; // Perfekter Score bei max. 20% Abweichung
    if (deviation <= 40) return 80; // 80% bei 21-40% Abweichung
    if (deviation <= 60) return 60; // 60% bei 41-60% Abweichung
    return 0; // 0% bei mehr als 60% Abweichung
  };

  
  const score = calculateScore();
let scoreColor;

if (score === 100) {
  scoreColor = "bg-green-500"; // Grün für perfekten Score
} else if (score >= 80) {
  scoreColor = "bg-yellow-500"; // Gelb für 80%
} else if (score >= 60) {
  scoreColor = "bg-orange-500"; // Orange für 60%
} else {
  scoreColor = "bg-red-500"; // Rot für 0%
}



const calculateHoursWithBreaks = () => {
  const days = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag'];
  const data = days.map(day => {
    const hoursForDay = openingHours.filter(hour => hour.day === day);
    const totalOpenMinutes = hoursForDay.reduce((acc, hour) => {
      const openTime = new Date(`1970-01-01T${hour.openTime}:00`);
      const closeTime = new Date(`1970-01-01T${hour.closeTime}:00`);
      return acc + ((closeTime - openTime) / (1000 * 60));
    }, 0);

    const totalBreakMinutes = hoursForDay.reduce((acc, hour) => {
      if (hour.breakStart && hour.breakEnd) {
        const breakStart = new Date(`1970-01-01T${hour.breakStart}:00`);
        const breakEnd = new Date(`1970-01-01T${hour.breakEnd}:00`);
        return acc + ((breakEnd - breakStart) / (1000 * 60));
      }
      return acc;
    }, 0);

    return {
      name: day,
      openingHours: totalOpenMinutes,
      breakHours: totalBreakMinutes,
    };
  });

  return data;
};


const calculateChartData = () => {
  const data = calculateHoursWithBreaks().map(dayData => ({
    name: dayData.name,
    Öffnungszeit: parseFloat((dayData.openingHours / 60).toFixed(2)), // Convert to hours and limit to 2 decimal places
    Pausenzeit: parseFloat((dayData.breakHours / 60).toFixed(2)), // Convert to hours and limit to 2 decimal places
  }));
  return data;
};


// Define chartData
const chartData = calculateChartData();




  

  return (
<div className="container mx-auto px-4 py-8">
  <div className="flex flex-col lg:flex-row lg:justify-center lg:gap-8 gap-4">

    {/* Card: Add New Opening Hours */}
    <div className="w-full max-w-lg bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Neue Öffnungszeiten hinzufügen</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="day" className="block text-sm font-medium text-gray-700">Tag</label>
          <select
            id="day"
            name="day"
            value={newOpeningHour.day}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring focus:ring-orange-200 focus:ring-opacity-50"
            required={!isEditing}
          >
            <option value="">Bitte wählen</option>
            {Object.keys(groupedHours).map((day) => (
              groupedHours[day].length === 0 ? (
                <option key={day} value={day}>{day}</option>
              ) : null
            ))}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="openTime" className="block text-sm font-medium text-gray-700">Offen von</label>
            <input
              type="time"
              id="openTime"
              name="openTime"
              value={newOpeningHour.openTime}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-300 focus:ring focus:ring-orange-200 focus:ring-opacity-50"
              required
            />
          </div>
          <div>
            <label htmlFor="closeTime" className="block text-sm font-medium text-gray-700">bis</label>
            <input
              type="time"
              id="closeTime"
              name="closeTime"
              value={newOpeningHour.closeTime}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-300 focus:ring focus:ring-orange-200 focus:ring-opacity-50"
              required
            />
          </div>
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="hasBreak"
            name="hasBreak"
            checked={newOpeningHour.hasBreak}
            onChange={handleChange}
            className="rounded border-gray-300 text-orange-500 shadow-sm focus:border-orange-300 focus:ring focus:ring-offset-0 focus:ring-orange-200 focus:ring-opacity-50"
          />
          <label htmlFor="hasBreak" className="ml-2 block text-sm text-gray-900">Pause</label>
        </div>
        {newOpeningHour.hasBreak && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="breakStart" className="block text-sm font-medium text-gray-700">Pause von</label>
              <input
                type="time"
                id="breakStart"
                name="breakStart"
                value={newOpeningHour.breakStart}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-300 focus:ring focus:ring-orange-200 focus:ring-opacity-50"
              />
            </div>
            <div>
              <label htmlFor="breakEnd" className="block text-sm font-medium text-gray-700">bis</label>
              <input
                type="time"
                id="breakEnd"
                name="breakEnd"
                value={newOpeningHour.breakEnd}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-300 focus:ring focus:ring-orange-200 focus:ring-opacity-50"
              />
            </div>
          </div>
        )}
        <button
          type="submit"
          className="w-full bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
        >
          {isEditing ? 'Speichern' : 'Hinzufügen'}
        </button>
      </form>
    </div>

    {/* Card: Existing Opening Hours */}
    <div className="w-full max-w-lg bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Vorhandene Öffnungszeiten</h2>
      <div className="space-y-4">
        {Object.keys(groupedHours).map((day) => (
          <div key={day}>
            <h3 className="text-lg font-medium text-gray-800">{day}</h3>
            {groupedHours[day].map((hour) => (
              <div key={hour._id} className="flex justify-between items-center p-4 bg-white rounded-md shadow-sm border border-gray-200">
                <div>
                  <p>Öffnungszeit: {hour.openTime} - {hour.closeTime}</p>
                  {hour.breakStart && hour.breakEnd && (
                    <p>Pause: {hour.breakStart} - {hour.breakEnd}</p>
                  )}
                </div>
                <Pen onClick={() => handleEdit(hour)} className="w-4 h-4 text-orange-500" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>

    {/* Card: Score and Chart */}
    <div className="w-full max-w-lg bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Öffnungszeiten Score</h2>
      <div className={`p-4 rounded-md text-white ${scoreColor}`}>
        <p className="text-lg font-bold">Score: {score.toFixed(2)}%</p>
        <p className="text-sm">Durchschnittliche Öffnungszeit pro Tag: {hours} Stunden, {minutes} Minuten</p>
      </div>
      <div className="my-8">
        <h3 className="text-xl font-semibold mb-4">Öffnungszeiten Diagramm</h3>
        <BarChart width={300} height={300} data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="Öffnungszeit" fill="#f59e0b" />
          <Bar dataKey="Pausenzeit" fill="#1e293b" />
        </BarChart>
      </div>
    </div>

  </div>
</div>

  )
}