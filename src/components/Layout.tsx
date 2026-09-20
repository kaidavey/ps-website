import { Outlet, ScrollRestoration } from 'react-router-dom'
import { useScrollReveal } from '@/lib/useScrollReveal'
import { Footer } from './Footer'
import { Header } from './Header'

/** Shell shared by every route: header, routed page, footer. */
export function Layout() {
  const mainRef = useScrollReveal<HTMLElement>()

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Header />
      <main id="main" ref={mainRef}>
        <Outlet />
      </main>
      <Footer />
      <ScrollRestoration />
    </>
  )
}
