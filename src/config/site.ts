/**
 * Site-wide configuration.
 *
 * Navigation lives here rather than inside <Header> so that the same source
 * drives the header, the footer, and any future sitemap. If navigation later
 * becomes CMS-managed, this is the only file that changes.
 */
export type NavItem = {
  label: string
  /** Internal route path. */
  to: string
}

export const siteConfig = {
  name: 'Product Space at UCLA',
  shortName: 'Product Space',
  description:
    'We connect tech companies with top product talent from UCLA to work on ' +
    'high-priority business goals across product management, design and marketing.',
} as const

export const primaryNav: readonly NavItem[] = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Careers', to: '/careers' },
  { label: 'For Students', to: '/students' },
  { label: 'For Companies', to: '/companies' },
]
