import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Layout } from '@/components/Layout'
import { ForCompaniesPage } from '@/pages/companies/ForCompaniesPage'
import { HomePage } from '@/pages/home/HomePage'
import { PlaceholderPage } from '@/pages/PlaceholderPage'
import { ForStudentsPage } from '@/pages/students/ForStudentsPage'

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/for-companies', element: <ForCompaniesPage /> },
      {
        path: '/about',
        element: <PlaceholderPage title="About" message="This page is on its way. Learn about us on the home page in the meantime." />,
      },
      { path: '/for-students', element: <ForStudentsPage /> },
      { path: '*', element: <PlaceholderPage title="Page not found" message="That link doesn’t go anywhere. Head back home." /> },
    ],
  },
])

export default function App() {
  return <RouterProvider router={router} />
}
