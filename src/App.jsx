import { useEffect, useState } from 'react'
import { MotionConfig } from 'framer-motion'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import ImportantInfo from './components/ImportantInfo'
import AiToolsStrip from './components/AiToolsStrip'
import Timeline from './components/Timeline'
import Skills from './components/Skills'
import Portfolio from './components/Portfolio'
import Contact from './components/Contact'
import Footer from './components/Footer'
import PrivacyPolicyPage from './components/PrivacyPolicyPage'
import TermsAndConditionsPage from './components/TermsAndConditionsPage'
import { uiFlags } from './data'

export default function App() {
  const [routeHash, setRouteHash] = useState(() => window.location.hash || '')

  useEffect(() => {
    const onHashChange = () => setRouteHash(window.location.hash || '')
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  if (routeHash === '#/privacy-policy') {
    return <PrivacyPolicyPage />
  }

  if (routeHash === '#/terms-and-conditions') {
    return <TermsAndConditionsPage />
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
        <Contact />
      </main>
      <Footer />
    </div>
    </MotionConfig>
  )
}
