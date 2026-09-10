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

  /** The Applications Open banner, shown on Home and For Students. */
  apply: {
    title: 'Applications Open',
    paragraphs: [
      'Fall Quarter is right around the corner and we are taking applicants! Start by filling out our interest form.',
      'Remember, any major and any skill level can join! We’d love to see your application.',
    ],
    primary: 'Apply',
    secondary: 'Learn more',
  },

  /** The newsletter sign-up, shown on Home and For Students. */
  newsletter: {
    title: 'Join Our Newsletter',
    subtitle:
      'All UCLA students (including non-fellows) can tune into our monthly newsletter exploring recent product news and career guidance.',
    submit: 'Subscribe',
  },

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
