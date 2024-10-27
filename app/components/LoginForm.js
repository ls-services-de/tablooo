// src/components/LoginForm.js
'use client';
import React, { useState } from 'react';
import sanityClient from '@sanity/client';
import { useRouter } from 'next/navigation';

const client = sanityClient({
  projectId: 'ptblhmuq', 
  dataset: 'production', 
  useCdn: true,
  apiVersion: '2023-11-21',
  token: 'sk1AHHbQ4hcLEiIt9ZOXHW9gZz2lB132R1koYFA48R8EDFNC8ChOk5sHsL5g6SuJ4cFkhilxGqxWFbxlH1RZ5DZRkLC0QaOv7qolsD7JydBVmFX7dRNLZLcDfqlBCbbuFbWUePIokI1LGtVmAi1hdvq9LNEuPCAk8W3BUpj6VcnOGohlmuGD', // replace with your Sanity token
});
  
const LoginForm = () => {
  const [loginData, setLoginData] = useState({
    ownerName: '',
    email: '',
    password: ''
  });
  const router = useRouter();

  const handleChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const query = `*[_type == "company" && email == $email && password == $password && ownerName == $ownerName]`;
      const params = { 
        email: loginData.email, 
        password: loginData.password,
        ownerName: loginData.ownerName 
      };

      console.log("Query:", query);
      console.log("Params:", params);
      
      const result = await client.fetch(query, params);
      console.log("Result:", result); // Log the result of the query

      if (result.length > 0) {
        const user = result[0];
        console.log("Company ID:", user._id); // Log the company ID

        // Save to local storage
        localStorage.setItem('user', JSON.stringify({ 
          email: user.email,
          username: user.ownerName,
          companyId: user._id, // Save the company ID here
          isLoggedIn: true,
          expiration: Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
        }));
        
        alert("Login successful!");
        router.push('/admin-dashboard');
      } else {
        alert("Invalid owner name, email, or password!");
      }
    } catch (error) {
      console.error(error);
      alert("Error during login!");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Login</h1>
      <input name="ownerName" type="text" placeholder="Owner Name" onChange={handleChange} required />
      <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
      <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
      <button type="submit">Login</button>
      <div className="link">
        <p>Ich habe noch keinen Account</p>
        <a href="/registrierung">Registrierung</a>
      </div>
    </form>
  );
};

export default LoginForm;
