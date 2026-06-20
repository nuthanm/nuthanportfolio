import { useState, useEffect } from 'react'
import { Link } from 'react-scroll'
import { FiMenu, FiX } from 'react-icons/fi'
import { personalInfo, uiFlags } from '../data'

const navLinks = [
  { label: 'About', to: 'hero' },
  { label: 'Info', to: 'information' },
  { label: 'Timeline', to: 'timeline' },
  { label: 'Skills', to: 'skills' },
  { label: 'Portfolio', to: 'portfolio' },
  { label: 'Contact', to: 'contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('hero')
  const visibleLinks = navLinks.filter((link) =>
    link.to === 'information' ? uiFlags.showImportantInfoSection : true
  )

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      setScrolled(y > 40)

      // Keep Contact active near the page end where exact section alignment may not be possible.
      const atBottom = window.innerHeight + y >= document.documentElement.scrollHeight - 4
      if (atBottom) {
        setActiveSection(visibleLinks[visibleLinks.length - 1]?.to || 'hero')
        return
      }

      const probeY = y + 120
      let current = 'hero'

      for (const link of visibleLinks) {
        const section = document.getElementById(link.to)
        if (section && probeY >= section.offsetTop) {
          current = link.to
        }
      }

      setActiveSection(current)
    }

    onScroll()
    window.addEventListener('scroll', onScroll)
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [visibleLinks])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-primary/95 backdrop-blur-md shadow-sm border-b border-slate-200' : 'bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="hero"
          smooth
          duration={500}
          className="text-text-main font-bold text-xl cursor-pointer select-none"
        >
          NM<span className="text-accent">.</span>
        </Link>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-8">
          {visibleLinks.map((link) => (
            <li key={link.to}>
              <Link
                to={link.to}
                smooth
                duration={500}
                offset={-70}
                className={`text-sm font-medium tracking-wide cursor-pointer transition-colors duration-200 ${
                  activeSection === link.to ? 'text-accent' : 'text-text-secondary hover:text-accent'
                }`}
                onClick={() => setActiveSection(link.to)}
              >
                {link.label}
              </Link>
            </li>
          ))}
          <li>
            <a
              href={personalInfo.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 text-sm font-semibold border border-accent text-accent rounded-lg hover:bg-accent hover:text-white transition-all duration-200"
            >
              Resume
            </a>
          </li>
        </ul>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-text-main hover:text-accent transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-slate-200 px-6 py-4 flex flex-col gap-4">
          {visibleLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              smooth
              duration={500}
              offset={-70}
              className={`font-medium cursor-pointer transition-colors ${
                activeSection === link.to ? 'text-accent' : 'text-text-secondary hover:text-accent'
              }`}
              onClick={() => {
                setActiveSection(link.to)
                setMenuOpen(false)
              }}
            >
              {link.label}
            </Link>
          ))}
          <a
            href={personalInfo.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent font-semibold"
            onClick={() => setMenuOpen(false)}
          >
            Resume ↗
          </a>
        </div>
      )}
    </nav>
  )
}
