/** Site-wide content: navigation, links, and integration endpoints. */
export const site = {
  name: "Product Space",
  tagline: "Building the Next Generation of Tech Leaders",
  org: "University of California, Los Angeles",
  description:
    "Product Space at UCLA is a year-long fellowship for aspiring product managers, designers, and marketers.",

  nav: [
    { label: "Home", to: "/" },
    { label: "About", to: "/about" },
    { label: "For Students", to: "/for-students" },
    { label: "For Companies", to: "/for-companies" },
  ],

  social: [
    {
      label: "Instagram",
      href: "https://www.instagram.com/productspaceatucla/",
    },
    { label: "Luma", href: "https://luma.com/productspaceucla" },
  ],

  /** The Applications Open banner, shown on Home and For Students. */
  apply: {
    title: "Applications Open",
    paragraphs: [
      "Fall Quarter is here and we're **actively taking applicants!** Apply now, and **fill out our interest form** to stay on top of recruitment events.",
      "Remember, **any major and any skill level** can join! We'd love to see your application.",
    ],
    primary: "Apply",
    secondary: "Interest form",
  },

  /** The newsletter sign-up, shown on Home and For Students. */
  newsletter: {
    title: "Join Our Newsletter",
    subtitle:
      "All UCLA students (including non-fellows) can tune into our monthly newsletter exploring recent product news and career guidance.",
    submit: "Subscribe",
  },

  events: {
    calendarUrl: "https://luma.com/productspaceucla",
    feedUrl: "/api/luma-calendar",
    embedUrl: "https://luma.com/embed/calendar/cal-TH7D6gDn85lzYyk/events",
  },

  links: {
    apply:
      "https://docs.google.com/forms/d/e/1FAIpQLSeFxgcWagqbIe5B-suR2Df052eMjwc-NtWpPU6jYDN2zbUaZQ/viewform?usp=header",
    interestForm:
      "https://docs.google.com/forms/d/e/1FAIpQLSfdoz5kdeW2nwDlF-KdBPubIu6Dm7n51Nn8MGu6qtlVt8k8DA/viewform?usp=header",
  },

  /**
   * Form endpoints (e.g. Formspree, Netlify Forms, a Google Apps Script). Forms POST here as
   * plain HTML forms, so any endpoint that accepts x-www-form-urlencoded works. Empty = not wired.
   */
  forms: {
    newsletter: "",
    contact: "",
  },
} as const;
