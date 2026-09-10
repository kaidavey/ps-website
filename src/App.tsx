import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Layout } from '@/components/Layout'
import { AboutPage } from '@/pages/about/AboutPage'
import { ForCompaniesPage } from '@/pages/companies/ForCompaniesPage'
import { HomePage } from '@/pages/home/HomePage'
import { PlaceholderPage } from '@/pages/PlaceholderPage'

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/for-companies', element: <ForCompaniesPage /> },
      { path: '/about', element: <AboutPage /> },
      {
        path: '/for-students',
        element: (
          <PlaceholderPage title="For Students" message="This page is on its way. Applications open from the home page in the meantime." />
        ),
      },
      { path: '*', element: <PlaceholderPage title="Page not found" message="That link doesn’t go anywhere. Head back home." /> },
    ],
  },
])

export default function App() {
  return <RouterProvider router={router} />
}
