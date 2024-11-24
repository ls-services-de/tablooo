import React, { useState, useEffect } from 'react';
import sanityClient from '@sanity/client';
import { HexColorPicker } from 'react-colorful';

const client = sanityClient({
  projectId: 'ptblhmuq', // Your Sanity project ID
  dataset: 'production', // Your dataset name
  useCdn: true,
  apiVersion: '2023-11-21', // Use a recent API version
  token: 'skqwFLOApVJQigVaZ9ufYOPlSn9ktBOX4EMUCPh2RyhrFOoiAcrPrvg9ZraTH8jUkxecSKjv3SJMzk71V8gCwW3fl1YEnglzylQFUGSYMxLAZEGahhYJtk3IwkD8Y5qLjQB3EKoN4O3qAsJQodT2nhgY72zrrE99Z8QzxKI008iA9X37UkUh', // replace with your Sanity token
});

const PageSettingsForm = () => {
  const [numberOfTables, setNumberOfTables] = useState(1);
  const [pageImage, setPageImage] = useState(null);
  const [mainColor, setMainColor] = useState('#04cefe');
  const [existingSettings, setExistingSettings] = useState(null);
  const [reservationDuration, setReservationDuration] = useState('30min'); // New state for reservation duration
  
  // Fetch company ID from local storage
  const companyId = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || '{}').companyId : null;

  useEffect(() => {
    const fetchSettings = async () => {
      if (companyId) {
        const query = `*[_type == "pageSettings" && company._ref == "${companyId}"][0]`;
        const settings = await client.fetch(query);
        if (settings) {
          setExistingSettings(settings);
          setNumberOfTables(settings.numberOfTables || 1);
          setMainColor(settings.mainColor || '#04cefe');
          setReservationDuration(settings.reservationDuration || '30min'); // Load existing reservation duration

          // Check if the pageImage exists and set it
          if (settings.pageImage && settings.pageImage.asset) {
            setPageImage(settings.pageImage.asset.url); // Set existing image URL for display
          }
        }
      }
    };
    fetchSettings();
  }, [companyId]);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setPageImage(file); // Set the file for upload
    }
  };

  const handleSave = async () => {
    const newSettings = {
      _id: `pageSettings-${companyId}`, // Unique ID using the company ID
      _type: 'pageSettings',
      company: {
        _type: 'reference',
        _ref: companyId,
      },
      numberOfTables,
      mainColor,
      reservationDuration, // Include reservation duration in settings
    };

    try {
      if (pageImage && typeof pageImage !== 'string') { // If it's a new image
        const imageAsset = await client.assets.upload('image', pageImage);
        newSettings.pageImage = {
          _type: 'image',
          asset: {
            _type: 'reference',
            _ref: imageAsset._id,
          },
        };
      }

      await client.createOrReplace(newSettings);
      alert('Settings saved successfully!');
    } catch (error) {
      console.error("Error saving settings:", error);
      alert("Failed to save settings. Please try again.");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Page Settings</h2>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Number of Tables:</label>
        <input
          type="number"
          value={numberOfTables}
          onChange={(e) => setNumberOfTables(parseInt(e.target.value))}
          min={1}
          max={100}
          className="block w-full p-2 border border-gray-300 rounded-md"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Page Image:</label>
        <input
          type="file"
          onChange={handleImageUpload}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
        />
        {pageImage && typeof pageImage === 'object' && (
          <div className="mt-2">
            <img src={URL.createObjectURL(pageImage)} alt="Preview" className="w-full h-auto rounded-md" />
          </div>
        )}
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Main Color:</label>
        <HexColorPicker color={mainColor} onChange={setMainColor} />
        <input
          type="text"
          value={mainColor}
          onChange={(e) => setMainColor(e.target.value)}
          placeholder="#04cefe"
          className="block w-full p-2 border border-gray-300 rounded-md mt-2"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Reservation Duration:</label>
        <select
          value={reservationDuration}
          onChange={(e) => setReservationDuration(e.target.value)}
          className="block w-full p-2 border border-gray-300 rounded-md"
        >
          <option value="30min">30 minutes</option>
          <option value="1h">1 hour</option>
          <option value="1.5h">1.5 hours</option>
          <option value="2h">2 hours</option>
          <option value="2.5h">2.5 hours</option>
          <option value="3h">3 hours</option>
          <option value="3.5h">3.5 hours</option>
        </select>
      </div>

      <button
        onClick={handleSave}
        className="w-full py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition duration-300"
      >
        Save Settings
      </button>

      {existingSettings && (
        <div className="mt-6">
          <h3 className="text-lg font-bold">Existing Settings</h3>
          <div className="mt-2">
            <p><strong>Number of Tables:</strong> {existingSettings.numberOfTables}</p>
            <p><strong>Main Color:</strong> {existingSettings.mainColor}</p>
            <p><strong>Reservation Duration:</strong> {existingSettings.reservationDuration}</p>
            
          </div>
        </div>
      )}
    </div>
  );
};

export default PageSettingsForm;
