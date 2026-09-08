import type { RouteObject } from 'react-router'
import { SiteLayout } from '@/components/layout/SiteLayout'
import { ErrorPage } from '@/pages/ErrorPage'
import { HomePage } from '@/pages/HomePage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { PlaceholderPage } from '@/pages/PlaceholderPage'

/**
 * The route table — one flat, readable declaration of every URL the site has.
 *
 * Kept as data rather than nested JSX so routes stay greppable and so
 * CMS-driven sections can later be appended programmatically (mapping a
 * collection to `:slug` routes) without restructuring anything.
 */
export const routes: RouteObject[] = [
  {
    element: <SiteLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'about', element: <PlaceholderPage title="About" /> },
      { path: 'students', element: <PlaceholderPage title="For Students" /> },
      { path: 'companies', element: <PlaceholderPage title="For Companies" /> },
      { path: 'apply', element: <PlaceholderPage title="Apply" /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]
