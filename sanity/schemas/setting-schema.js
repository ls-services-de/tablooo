// schema.js or pageSettings.js
export default {
    name: 'pageSettings',
    title: 'Page Settings',
    type: 'document',
    fields: [
      {
        name: 'company',
        title: 'Company',
        type: 'reference',
        to: [{ type: 'company' }],
      },
      {
        name: 'numberOfTables',
        title: 'Number of Tables',
        type: 'number',
      },
      {
        name: 'mainColor',
        title: 'Main Color',
        type: 'string',
      },
      {
        name: 'reservationDuration',
        title: 'Reservation Duration',
        type: 'string', // Ensure this is a string type
      },
      {
        name: 'pageImage',
        title: 'Page Image',
        type: 'image',
        options: {
          hotspot: true,
        },
      },
    ],
  };
  