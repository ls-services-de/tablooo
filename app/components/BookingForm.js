// components/BookingForm.js
'use client'; // Specify that this is a client component

import React, { useState, useEffect } from 'react';
import sanityClient from '@sanity/client';
import { format } from 'date-fns';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'; // Import CSS for the DatePicker

const client = sanityClient({
  projectId: 'ptblhmuq', // Your Sanity project ID
  dataset: 'production', // Your dataset name
  useCdn: true,
  apiVersion: '2023-11-21', // Use a recent API version
  token: 'skqwFLOApVJQigVaZ9ufYOPlSn9ktBOX4EMUCPh2RyhrFOoiAcrPrvg9ZraTH8jUkxecSKjv3SJMzk71V8gCwW3fl1YEnglzylQFUGSYMxLAZEGahhYJtk3IwkD8Y5qLjQB3EKoN4O3qAsJQodT2nhgY72zrrE99Z8QzxKI008iA9X37UkUh', // Replace with your Sanity token
});

// Function to save a booking
const saveBooking = async (bookingData) => {
  console.log("Booking data to be saved:", bookingData);
  try {
    await client.create({
      _type: 'booking', // Ensure this matches your Sanity schema
      ...bookingData,
    });
    console.log("Booking saved successfully:", bookingData);
  } catch (error) {
    console.error("Error saving booking:", error);
  }
};

// Function to fetch existing bookings for a specific date
const fetchExistingBookings = async (date) => {
  const formattedDate = format(new Date(date), 'yyyy-MM-dd');
  
  // Create the start and end date for the query
  const startDate = new Date(formattedDate);
  startDate.setHours(0, 0, 0, 0); // Start of the day
  const endDate = new Date(formattedDate);
  endDate.setHours(23, 59, 59, 999); // End of the day
  
  const query = `*[_type == "booking" && date >= $startDate && date <= $endDate]{
    date,
    customerName,
    customerEmail
  }`;
  
  try {
    const bookings = await client.fetch(query, { startDate, endDate });
    console.log("Fetched Bookings:", bookings);
    return bookings.map(booking => format(new Date(booking.date), 'yyyy-MM-dd HH:mm'));
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return [];
  }
};

const BookingForm = ({ company, openingHours }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [error, setError] = useState('');
  const [validTimes, setValidTimes] = useState([]);
  const [existingBookings, setExistingBookings] = useState([]);
  const [numberOfTables, setNumberOfTables] = useState(1);
  const [reservationDuration, setReservationDuration] = useState(1.5); // Default to 1.5 hours
  const [availableSlots, setAvailableSlots] = useState([]);

  useEffect(() => {
    const fetchSettings = async () => {
      const settings = await client.fetch(`*[_type == "pageSettings"][0]{
        numberOfTables,
        reservationDuration
      }`);
      if (settings) {
        setNumberOfTables(settings.numberOfTables || 1);
        setReservationDuration(parseFloat(settings.reservationDuration.replace(',', '.')) || 1.5);
      }
    };
    fetchSettings();
  }, []);

  // Mapping of English day names to German
  const dayNameMapping = {
    monday: 'montag',
    tuesday: 'dienstag',
    wednesday: 'mittwoch',
    thursday: 'donnerstag',
    friday: 'freitag',
    saturday: 'samstag',
    sunday: 'sonntag',
  };

  // Effect to fetch existing bookings whenever the selected date changes
  useEffect(() => {
    if (selectedDate) {
      const fetchBookings = async () => {
        const bookings = await fetchExistingBookings(selectedDate);
        setExistingBookings(bookings);
      };
      fetchBookings();
    }
  }, [selectedDate]);

  useEffect(() => {
    if (selectedDate && reservationDuration) {
      const bookingDate = new Date(selectedDate);
      const dayName = format(bookingDate, 'EEEE').toLowerCase();
      const germanDayName = dayNameMapping[dayName];
      const openingHour = openingHours.find((h) => h.day.toLowerCase() === germanDayName);
  
      if (openingHour) {
        const [openHour, openMinute] = openingHour.openTime.split(':').map(Number);
        const [closeHour, closeMinute] = openingHour.closeTime.split(':').map(Number);
        const start = new Date(bookingDate.setHours(openHour, openMinute, 0, 0));
        const end = new Date(bookingDate.setHours(closeHour, closeMinute, 0, 0));
  
        const breakStartTime = new Date(bookingDate.setHours(...openingHour.breakStart.split(':').map(Number), 0));
        const breakEndTime = new Date(bookingDate.setHours(...openingHour.breakEnd.split(':').map(Number), 0));
  
        const times = [];
        
        // First, handle slots before the break
        while (start < breakStartTime) {
          const formattedTime = format(new Date(start), 'yyyy-MM-dd HH:mm');
          const endTime = new Date(start.getTime() + reservationDuration * 60 * 60 * 1000);
          const bookedCount = existingBookings.filter(b => b === formattedTime).length;
  
          const availableSeats = numberOfTables - bookedCount;
  
          if (availableSeats > 0) {
            times.push({
              time: formattedTime,
              available: availableSeats,
            });
          }
  
          start.setHours(start.getHours() + reservationDuration); // Increment by reservation duration
        }
  
        // Now handle slots after the break
        start.setTime(breakEndTime.getTime()); // Set start to breakEndTime for the next part
        while (start < end) {
          const formattedTime = format(new Date(start), 'yyyy-MM-dd HH:mm');
          const endTime = new Date(start.getTime() + reservationDuration * 60 * 60 * 1000);
          const bookedCount = existingBookings.filter(b => b === formattedTime).length;
  
          const availableSeats = numberOfTables - bookedCount;
  
          // Only add time slots that are not during the break
          if (availableSeats > 0) {
            times.push({
              time: formattedTime,
              available: availableSeats,
            });
          }
  
          start.setHours(start.getHours() + reservationDuration); // Increment by reservation duration
        }
  
        setAvailableSlots(times);
      }
    }
  }, [selectedDate, openingHours, existingBookings, numberOfTables, reservationDuration]);
  
  

  // Function to handle booking submission
  const handleBooking = async (e) => {
    e.preventDefault();
    
    if (!customerName || !customerEmail || !selectedTime) {
      alert("Bitte fülle alle Felder aus!");
      return;
    }

    const bookingData = {
      company: { _ref: company._id },
      date: selectedTime,
      duration: reservationDuration,
      customerName,
      customerEmail,
    };

    try {
      await saveBooking(bookingData);
      alert("Buchung erfolgreich!");
      // Reset form fields
      setSelectedDate(null);
      setSelectedTime('');
      setCustomerName('');
      setCustomerEmail('');
      setAvailableSlots([]);
    } catch (error) {
      console.error("Fehler bei der Buchung:", error);
      alert("Fehler beim Speichern der Buchung. Bitte versuche es erneut.");
    }
  };

  return (
    <form onSubmit={handleBooking} className='text-black'>
      <h3>Datum auswählen:</h3>
      <DatePicker
        selected={selectedDate}
        onChange={date => setSelectedDate(date)}
        dateFormat="dd.MM.yyyy"
        placeholderText="Datum auswählen"
        required
      />
      <h3>Zeit auswählen:</h3>
      {availableSlots.length > 0 ? (
        availableSlots.map((slot, index) => (
          <button
            key={index}
            type="button"
            onClick={() => setSelectedTime(slot.time)}
            style={{
              margin: '5px',
              padding: '10px',
              backgroundColor: selectedTime === slot.time ? '#4CAF50' : '#008CBA',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
            }}
          >
            {slot.time} ({slot.available} Plätze verfügbar)
          </button>
        ))
      ) : (
        <p>Keine verfügbaren Zeitfenster</p>
      )}
      <div>
        <label>
          Name:
          <input
            type="text"
            value={customerName}
            onChange={e => setCustomerName(e.target.value)}
            required
          />
        </label>
      </div>
      <div>
        <label>
          E-Mail:
          <input
            type="email"
            value={customerEmail}
            onChange={e => setCustomerEmail(e.target.value)}
            required
          />
        </label>
      </div>
      <button
  className="bg-white text-black border-2 border-black hover:bg-black hover:text-white transition-colors duration-300 ease-in-out"
  type="submit"
>
  Buchung abschicken
</button>


      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
};

export default BookingForm;