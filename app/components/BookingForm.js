// components/BookingForm.js
'use client'; // Specify that this is a client component

import React, { useState, useEffect } from 'react';
import sanityClient from '@sanity/client';
import { format } from 'date-fns';

const client = sanityClient({
  projectId: 'ptblhmuq', // Your Sanity project ID
  dataset: 'production', // Your dataset name
  useCdn: true,
  apiVersion: '2023-11-21', // Use a recent API version
  token: 'sk1AHHbQ4hcLEiIt9ZOXHW9gZz2lB132R1koYFA48R8EDFNC8ChOk5sHsL5g6SuJ4cFkhilxGqxWFbxlH1RZ5DZRkLC0QaOv7qolsD7JydBVmFX7dRNLZLcDfqlBCbbuFbWUePIokI1LGtVmAi1hdvq9LNEuPCAk8W3BUpj6VcnOGohlmuGD', // replace with your Sanity token
});

// Function to save a booking
const saveBooking = async (bookingData) => {
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
      
      // Log all fetched bookings
      console.log("Fetched Bookings:", bookings);
      
      // Return formatted dates
      return bookings.map(booking => format(new Date(booking.date), 'yyyy-MM-dd HH:mm')); // Format the date
    } catch (error) {
      console.error("Error fetching bookings:", error);
      return [];
    }
  };
  

const BookingForm = ({ company, openingHours }) => {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [error, setError] = useState('');
  const [validTimes, setValidTimes] = useState([]); // Store valid booking times
  const [existingBookings, setExistingBookings] = useState([]); // Store existing bookings

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

  // Effect to set valid booking times based on selected date
  useEffect(() => {
    if (selectedDate) {
      const fetchBookings = async () => {
        const bookings = await fetchExistingBookings(selectedDate);
        setExistingBookings(bookings);
        
        // Log existing bookings for selected date
        console.log("Existing Bookings for selected date:", bookings);
      };
      fetchBookings();
    }
  }, [selectedDate]);

  useEffect(() => {
    if (selectedDate) {
      const bookingDate = new Date(selectedDate);
      const dayName = format(bookingDate, 'EEEE').toLowerCase(); // Get the day name in English
      const germanDayName = dayNameMapping[dayName]; // Get the corresponding German day name
      const openingHour = openingHours.find((h) => h.day.toLowerCase() === germanDayName);

      console.log("Selected Date:", selectedDate);
      console.log("Day Name:", dayName);
      console.log("Opening Hours for", germanDayName, ":", openingHour);

      if (openingHour) {
        const [openHour, openMinute] = openingHour.openTime.split(':').map(Number);
        const [closeHour, closeMinute] = openingHour.closeTime.split(':').map(Number);

        // Initialize valid times array
        const times = [];
        const start = new Date(bookingDate.setHours(openHour, openMinute, 0, 0));
        const end = new Date(bookingDate.setHours(closeHour, closeMinute, 0, 0));

        console.log("Start Time for Valid Slots:", start);
        console.log("End Time for Valid Slots:", end);

        while (start < end) {
          const formattedTime = format(new Date(start), 'yyyy-MM-dd HH:mm'); // Format the time string
          
          // Check if this time is already booked
          if (!existingBookings.includes(formattedTime)) {
            times.push(formattedTime); // Only add if it's not booked
            console.log("Valid Time Slot Found:", formattedTime);
          } else {
            console.log("Time Slot Already Booked:", formattedTime);
          }
          
          start.setHours(start.getHours() + 2); // Increment by 2 hours for each time slot
        }

        setValidTimes(times); // Set the valid times for booking
        console.log("All Valid Time Slots for", selectedDate, ":", times);
      } else {
        console.log("No opening hours found for", germanDayName);
      }
    } else {
      setValidTimes([]); // Clear valid times if no date is selected
    }
  }, [selectedDate, openingHours, existingBookings]);

  // Function to handle booking submission
  const handleBooking = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior

    // Check if required fields are filled out
    if (!customerName || !customerEmail || !selectedTime) {
      alert("Please fill out all fields!");
      return;
    }

    const bookingData = {
      company: { _ref: company._id }, // Reference to the company
      date: selectedTime, // Date and time from the form
      duration: 2, // Fixed duration of 2 hours, can be adjusted
      customerName, // Customer's name from the form
      customerEmail, // Customer's email from the form
    };

    try {
      // Attempt to save the booking to Sanity
      await saveBooking(bookingData);
      alert("Booking successful!");
      
      // Optionally redirect to a different page or clear the form
      setSelectedDate('');
      setSelectedTime('');
      setCustomerName('');
      setCustomerEmail('');
      setValidTimes([]); // Clear valid times

      // Example redirect (you can adjust the route as needed)
      // router.push('/bookings'); // Uncomment if you have a router set up and want to navigate

    } catch (error) {
      console.error("Error during booking:", error);
      alert("Error saving booking. Please try again.");
    }
  };

  return (
    <div>
      <h2>Book a Time Slot</h2>
      <form onSubmit={handleBooking}>
        <label>
          Select Date:
          <input
            type="date"
            onChange={(e) => setSelectedDate(e.target.value)}
            required
          />
        </label>
        <div>
          <h3>Select Time:</h3>
          {validTimes.length > 0 ? (
            validTimes.map((time, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setSelectedTime(time)}
                style={{
                  margin: '5px',
                  padding: '10px',
                  backgroundColor: selectedTime === time ? '#4CAF50' : '#008CBA',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                }}
              >
                {time}
              </button>
            ))
          ) : (
            <p>No available time slots</p>
          )}
        </div>
        <input
          type="text"
          name="customerName"
          placeholder="Your Name"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          required
        />
        <input
          type="email"
          name="customerEmail"
          placeholder="Your Email"
          value={customerEmail}
          onChange={(e) => setCustomerEmail(e.target.value)}
          required
        />
        <button type="submit" disabled={!selectedTime}>Book</button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Display existing bookings for selected date */}
      {existingBookings.length > 0 && (
        <div>
          <h4>Already Booked Slots:</h4>
          <ul>
            {existingBookings.map((booking, index) => (
              <li key={index}>{booking}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default BookingForm;
