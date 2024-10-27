export default {
    name: 'openingHours',
    title: 'Opening Hours',
    type: 'document',
    fields: [
      {
        name: 'day',
        title: 'Day',
        type: 'string',
      },
      {
        name: 'openTime',
        title: 'Open Time',
        type: 'string',
      },
      {
        name: 'closeTime',
        title: 'Close Time',
        type: 'string',
      },
      {
        name: 'breakStart',
        title: 'Break Start Time',
        type: 'string',
      },
      {
        name: 'breakEnd',
        title: 'Break End Time',
        type: 'string',
      },
      {
        name: 'company',
        title: 'Company',
        type: 'reference',
        to: [{ type: 'company' }],
      },
    ],
  };
  