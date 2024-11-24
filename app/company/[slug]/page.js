import React from 'react';
import sanityClient from '@sanity/client';
import BookingForm from '@/app/components/BookingForm';
import MapComponent from '@/app/components/MapComponent';
import { Phone, Mail, MapPin } from 'lucide-react'; // Importing Lucide icons
import Footer from '@/app/components/FooterSection';
import imageUrlBuilder from '@sanity/image-url';

const client = sanityClient({
  projectId: 'ptblhmuq',
  dataset: 'production',
  useCdn: true,
  apiVersion: '2023-11-21',
});

// Configure the image URL builder
const builder = imageUrlBuilder(client);
function urlFor(source) {
  return builder.image(source).url();
}

// Fetch the company data
const fetchCompanyData = async (slug) => {
  try {
    const query = `*[_type == "company" && slug == $slug][0]`;
    const company = await client.fetch(query, { slug });
    console.log('Fetched company:', company); // Log fetched company data
    return company;
  } catch (error) {
    console.error('Error fetching company data:', error); // Log any errors
    return null; // Return null on error
  }
};

// Fetch page settings
const fetchPageSettings = async (companyId) => {
  try {
    const query = `*[_type == "pageSettings" && company._ref == $companyId][0]`;
    const settings = await client.fetch(query, { companyId });
    console.log('Fetched page settings:', settings); // Log fetched settings data
    return settings;
  } catch (error) {
    console.error('Error fetching page settings:', error); // Log any errors
    return null; // Return null on error
  }
};

// Fetch opening hours for the company
const fetchOpeningHours = async (companyId) => {
  try {
    const query = `*[_type == "openingHours" && company._ref == $companyId]`;
    const openingHours = await client.fetch(query, { companyId });
    console.log('Fetched opening hours:', openingHours); // Log fetched opening hours
    return openingHours;
  } catch (error) {
    console.error('Error fetching opening hours:', error); // Log any errors
    return []; // Return empty array on error
  }
};

// Main Company Page Component
const CompanyPage = async ({ params }) => {
  const { slug } = params; // Get the slug from URL parameters
  console.log('Page slug:', slug); // Log the slug to check if it's correct
  
  const company = await fetchCompanyData(slug); // Fetch company data
  const openingHours = await fetchOpeningHours(company?._id); // Fetch opening hours
  const settings = await fetchPageSettings(company?._id); // Fetch page settings

  // Check if company data is fetched successfully
  if (!company) {
    return <div>Company not found</div>;
  }

  const mainColor = settings?.mainColor || '#FFA500'; // Default to orange if not found
  const pageImageUrl = settings?.pageImage ? urlFor(settings.pageImage) : company.imageUrl || 'path/to/fallback/image.jpg'; // Use page image or fallback
  const reservationDuration = settings?.reservationDuration || 2; // Set this to your desired duration

  // Define styles object
  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      padding: '20px',
      maxWidth: '1200px',
      margin: '0 auto',
      color: mainColor,
    },
    imageContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      marginBottom: '20px',
    },
    companyName: {
      textAlign: 'center',
      margin: '10px 0',
      color: mainColor,
    },
    address: {
      textAlign: 'center',
    },
    flexContainer: {
      display: 'flex',
      flexDirection: 'column',
      marginTop: '20px',
      gap: '20px',
      '@media (min-width: 768px)': { flexDirection: 'row' },
    },
    mapSection: {
      flex: 1,
      minWidth: '250px',
    },
    bookingSection: {
      flex: 1,
      minWidth: '250px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    contactInfo: {
      display: 'flex',
      alignItems: 'center',
      margin: '5px 0',
      justifyContent: 'center',
      color: '#000000',
    },
    icon: {
      marginRight: '8px',
      color: mainColor,
    },
    
  };

  return (
    <div style={styles.container}>
      <div style={styles.imageContainer}>
        {/* Company Image */}
        <img
          src={pageImageUrl}
          alt={company.companyName}
          style={{ width: '60%', maxWidth: '300px', height: 'auto', borderRadius: '8px' }}
        />
      </div>

      <h3 className="text-3xl font-semibold text-center text-orange-500" style={styles.companyName}>
        {company.companyName}
      </h3>

      <p style={styles.address} className="text-black">{company.address}</p>

      <div style={styles.flexContainer}>
        <div style={styles.mapSection} className="mx-auto">
          <MapComponent address={company.address} companyName={company.companyName} />
        </div>

        <div style={styles.bookingSection} className="text-left">
          <BookingForm company={company} openingHours={openingHours} mainColor={mainColor}   reservationDuration={reservationDuration} />
          <div style={{ marginTop: '20px' }}>
            <p style={styles.contactInfo}>
              <Phone size={20} style={styles.icon} />
              {company.phoneNumber}
            </p>
            <p style={styles.contactInfo}>
              <Mail size={20} style={styles.icon} />
              {company.email}
            </p>
            <p style={styles.contactInfo}>
              <MapPin size={20} style={styles.icon} />
              {company.address}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyPage;