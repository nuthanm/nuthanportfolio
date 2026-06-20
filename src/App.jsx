import { useEffect, useState } from 'react'
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
    <div className="min-h-screen bg-primary">
      <Navbar />
      <main>
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
  )
}
