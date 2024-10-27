export default {
    name: 'booking',
    title: 'Booking',
    type: 'document',
    fields: [
      {
        name: 'company',
        title: 'Company',
        type: 'reference',
        to: [{ type: 'company' }],
        options: {
          // Limit to selecting only one company
          filter: 'document.id != $currentDocumentId',
          filterParams: { currentDocumentId: 'company._ref' },
        },
      },
      {
        name: 'customerName',
        title: 'Customer Name',
        type: 'string',
        validation: Rule => Rule.required(),
      },
      {
        name: 'customerEmail',
        title: 'Customer Email',
        type: 'string',
        validation: Rule => Rule.required().email(),
      },
      {
        name: 'date',
        title: 'Booking Date and Time',
        type: 'datetime',
        validation: Rule => Rule.required(),
      },
      {
        name: 'duration',
        title: 'Duration (Hours)',
        type: 'number',
        validation: Rule => Rule.required().min(1).max(24), // Adjust as necessary
      },
    ],
  };
  