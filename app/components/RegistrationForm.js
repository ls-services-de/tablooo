'use client';
import React, { useState } from 'react';
import sanityClient from '@sanity/client';
import { useRouter } from 'next/navigation'; // Use Next.js's useRouter

const client = sanityClient({
  projectId: 'ptblhmuq', 
  dataset: 'production', 
  useCdn: true,
  apiVersion: '2023-11-21',
  token: 'sk1AHHbQ4hcLEiIt9ZOXHW9gZz2lB132R1koYFA48R8EDFNC8ChOk5sHsL5g6SuJ4cFkhilxGqxWFbxlH1RZ5DZRkLC0QaOv7qolsD7JydBVmFX7dRNLZLcDfqlBCbbuFbWUePIokI1LGtVmAi1hdvq9LNEuPCAk8W3BUpj6VcnOGohlmuGD', // replace with your Sanity token
});

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    companyName: '',
    website: '',
    ownerName: '',
    address: '',
    phoneNumber: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const router = useRouter(); // Initialize useRouter for redirection

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9 -]/g, '') // Entferne Sonderzeichen
      .replace(/\s+/g, '-') // Ersetze Leerzeichen durch Bindestriche
      .slice(0, 96); // Maximal 96 Zeichen
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const slug = generateSlug(formData.companyName); // Generiere den Slug

    try {
      await client.create({
        _type: 'company',
        companyName: formData.companyName,
        website: formData.website,
        ownerName: formData.ownerName,
        address: formData.address,
        phoneNumber: formData.phoneNumber,
        email: formData.email,
        password: formData.password,
        slug: slug, // Der Slug wird hier als String hinzugefügt
      });
      alert("Registration successful!");
      router.push('/admin-dashboard'); // Redirect to admin dashboard after successful registration
    } catch (error) {
      console.error(error);
      alert("Error during registration!");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Registrierung</h1>
      <input name="companyName" type="text" placeholder="Company Name" onChange={handleChange} required />
      <input name="website" type="url" placeholder="Website" onChange={handleChange} required />
      <input name="ownerName" type="text" placeholder="Owner Name" onChange={handleChange} required />
      <input name="address" type="text" placeholder="Address" onChange={handleChange} required />
      <input name="phoneNumber" type="tel" placeholder="Phone Number" onChange={handleChange} required />
      <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
      <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
      <input name="confirmPassword" type="password" placeholder="Confirm Password" onChange={handleChange} required />
      <button type="submit">Register</button>
      <div className="link">
        <p>Ich habe bereits einen Account</p>
        <a href="/login">Login</a>
      </div>
    </form>
  );
};

export default RegistrationForm;
