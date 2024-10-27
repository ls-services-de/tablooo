export default {
  name: 'company',
  title: 'Company',
  type: 'document',
  fields: [
    {
      name: 'companyName',
      title: 'Company Name',
      type: 'string',
      validation: Rule => Rule.required().min(1).max(96),
    },
    {
      name: 'website',
      title: 'Website',
      type: 'url',
      validation: Rule => Rule.required().uri({ allowRelative: false }),
    },
    {
      name: 'ownerName',
      title: 'Owner Name',
      type: 'string',
      validation: Rule => Rule.required().min(1).max(96),
    },
    {
      name: 'address',
      title: 'Address',
      type: 'string',
      validation: Rule => Rule.required().min(1).max(150),
    },
    {
      name: 'phoneNumber',
      title: 'Phone Number',
      type: 'string',
      validation: Rule => Rule.required().min(1).max(15),
    },
    {
      name: 'email',
      title: 'Email',
      type: 'string',
      validation: Rule => Rule.required().email(),
    },
    {
      name: 'password',
      title: 'Password',
      type: 'string',
      validation: Rule => Rule.required(),
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'string',  // Slug als String
      validation: Rule => Rule.required(),
    }
    
  ],
};
