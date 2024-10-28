import React from 'react';
import sanityClient from '@sanity/client';
import BookingForm from '@/app/components/BookingForm';
import MapComponent from '@/app/components/MapComponent';
import { Phone, Mail, MapPin } from 'lucide-react'; // Importing Lucide icons

const client = sanityClient({
  projectId: 'ptblhmuq',
  dataset: 'production',
  useCdn: true,
  apiVersion: '2023-11-21',
});

// Fetch the company data
const fetchCompanyData = async (slug) => {
  const query = `*[_type == "company" && slug == $slug][0]`;
  const company = await client.fetch(query, { slug });
  return company;
};

// Fetch opening hours for the company
const fetchOpeningHours = async (companyId) => {
  const query = `*[_type == "openingHours" && company._ref == $companyId]`;
  const openingHours = await client.fetch(query, { companyId });
  return openingHours;
};

// Main Company Page Component
const CompanyPage = async ({ params }) => {
  const { slug } = params; // Get the slug from URL parameters
  const company = await fetchCompanyData(slug); // Fetch company data
  const openingHours = await fetchOpeningHours(company._id); // Fetch opening hours

  if (!company) {
    return <div>Company not found</div>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', padding: '20px', maxWidth: '1200px', margin: '0 auto' }} className='text-black'>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '20px' }}>
        {/* Company Image */}
        <img
          src={company.imageUrl}
          alt={company.companyName}
          style={{ width: '100%', height: 'auto', borderRadius: '8px' }}
        />
      </div>

      <h1 style={{ textAlign: 'center', margin: '10px 0' }} className='text-3xl font-semibold'>{company.companyName}</h1>
      <p style={{ textAlign: 'center' }} className='text-black'>{company.address}</p>

      <div style={{ display: 'flex', flexDirection: 'column', marginTop: '20px', gap: '20px' }}>
        {/* Flexbox Container */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', md: { flexDirection: 'row' } }}>
          {/* Left Section with Map */}
          <div style={{ flex: 1, minWidth: '250px' }} className='mx-auto'>
            <MapComponent address={company.address} companyName={company.companyName} />
          </div>

          {/* Right Section with Booking Form and Contact Info */}
          <div style={{ flex: 1, minWidth: '250px', textAlign: 'left' }}>
            <BookingForm company={company} openingHours={openingHours} />
            <div style={{ marginTop: '20px' }}>
              <p style={{ display: 'flex', alignItems: 'center', margin: '5px 0' }}>
                <Phone size={20} style={{ marginRight: '8px' }} />
                {company.phoneNumber}
              </p>
              <p style={{ display: 'flex', alignItems: 'center', margin: '5px 0' }}>
                <Mail size={20} style={{ marginRight: '8px' }} />
                {company.email}
              </p>
              <p style={{ display: 'flex', alignItems: 'center', margin: '5px 0' }}>
                <MapPin size={20} style={{ marginRight: '8px' }} />
                {company.address}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

  );
};

export default CompanyPage;
