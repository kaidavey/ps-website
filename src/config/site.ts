/**
 * Site-wide configuration.
 *
 * Navigation lives here rather than inside <Header> so that the same source
 * drives the menu, the footer, and any future sitemap. If navigation later
 * becomes CMS-managed, this is the only file that changes.
 */
export type NavItem = {
  label: string
  /** Internal route path. */
  to: string
}

export type SocialLink = {
  label: string
  href: string
}

export const siteConfig = {
  name: 'Product Space at UCLA',
  shortName: 'product space',
  affiliation: 'University of California, Los Angeles',
  description:
    'We provide a year-long fellowship for aspiring product managers, product ' +
    'designers, and product marketers to learn from mentors and grow from ' +
    'industry-focused client projects.',
  /** Shown in the footer. Update when the site content changes. */
  lastUpdated: '9.13.2026',
} as const

export const primaryNav: readonly NavItem[] = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'For Students', to: '/students' },
  { label: 'For Companies', to: '/companies' },
]

/** The design lists the same four routes in the footer. */
export const footerNav: readonly NavItem[] = primaryNav

export const socialLinks: readonly SocialLink[] = [
  { label: 'Instagram', href: 'https://www.instagram.com/productspaceucla/' },
  { label: 'Luma', href: 'https://lu.ma/' },
]
