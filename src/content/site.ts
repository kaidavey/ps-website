/** Site-wide content: navigation, links, and integration endpoints. */
export const site = {
  name: 'Product Space',
  tagline: 'Building the Next Generation of Tech Leaders',
  org: 'University of California, Los Angeles',
  description:
    'Product Space at UCLA is a year-long fellowship for aspiring product managers, designers, and marketers.',

  nav: [
    { label: 'Home', to: '/' },
    { label: 'About', to: '/about' },
    { label: 'For Students', to: '/for-students' },
    { label: 'For Companies', to: '/for-companies' },
  ],

  social: [
    // TODO: confirm the Luma calendar URL.
    { label: 'Instagram', href: 'https://www.instagram.com/productspaceucla/' },
    { label: 'Luma', href: 'https://lu.ma/' },
  ],

  links: {
    // TODO: link to the live application form.
    apply: 'https://forms.gle/',
  },

  /**
   * Form endpoints (e.g. Formspree, Netlify Forms, a Google Apps Script). Forms POST here as
   * plain HTML forms, so any endpoint that accepts x-www-form-urlencoded works. Empty = not wired.
   */
  forms: {
    newsletter: '',
    contact: '',
  },
} as const
