import Navbar from './components/Navbar'
import Hero from './components/Hero'
import ImportantInfo from './components/ImportantInfo'
import AiToolsStrip from './components/AiToolsStrip'
import Timeline from './components/Timeline'
import Skills from './components/Skills'
import Portfolio from './components/Portfolio'
import Contact from './components/Contact'
import Footer from './components/Footer'
import { uiFlags } from './data'

export default function App() {
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
