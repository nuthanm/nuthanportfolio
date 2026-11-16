import { lazy, Suspense, useEffect, useState } from 'react'
import { MotionConfig } from 'framer-motion'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import ImportantInfo from './components/ImportantInfo'
import AiToolsStrip from './components/AiToolsStrip'
import Timeline from './components/Timeline'
import Skills from './components/Skills'
import Portfolio from './components/Portfolio'
import Testimonials from './components/Testimonials'
import Contact from './components/Contact'
import Footer from './components/Footer'
import PrivacyPolicyPage from './components/PrivacyPolicyPage'
import TermsAndConditionsPage from './components/TermsAndConditionsPage'
import FeedbackPage from './components/FeedbackPage'
import ReviewPage from './components/ReviewPage'
import { uiFlags } from './data'

// Dev-only: share-card renderer used to produce public/og-cover.jpg
const OgCard = import.meta.env.DEV ? lazy(() => import('./components/OgCard')) : null

export default function App() {
  const [routeHash, setRouteHash] = useState(() => window.location.hash || '')

  useEffect(() => {
    const onHashChange = () => setRouteHash(window.location.hash || '')
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  // Coming back from a #/page route to a section anchor (e.g. #testimonials):
  // the section only exists after this render, so scroll to it afterwards.
  useEffect(() => {
    if (!routeHash || routeHash.startsWith('#/')) return
    const target = document.getElementById(routeHash.slice(1))
    if (target) requestAnimationFrame(() => target.scrollIntoView())
  }, [routeHash])

  if (routeHash === '#/privacy-policy') {
    return <PrivacyPolicyPage />
  }

  if (routeHash === '#/terms-and-conditions') {
    return <TermsAndConditionsPage />
  }

  if (OgCard && routeHash === '#/og-card') {
    return (
      <Suspense fallback={null}>
        <OgCard />
      </Suspense>
    )
  }

  if (routeHash.startsWith('#/review')) {
    // Keyed by the URL so opening another review link in the same tab reloads it.
    return <ReviewPage key={routeHash} />
  }

  if (routeHash === '#/feedback') {
    return <FeedbackPage />
  }

  return (
    <MotionConfig reducedMotion="user">
    <div className="min-h-screen bg-bg">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[60] focus:px-4 focus:py-2 focus:rounded-full focus:bg-fg focus:text-bg focus:text-sm focus:font-semibold"
      >
        Skip to content
      </a>
      <Navbar />
      <main id="main">
        <Hero />
        {uiFlags.showImportantInfoSection && <ImportantInfo />}
        <AiToolsStrip />
        <Timeline />
        <Skills />
        <Portfolio />
        {uiFlags.showTestimonials && <Testimonials />}
        <Contact />
      </main>
      <Footer />
    </div>
    </MotionConfig>
  )
}
