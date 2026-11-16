import { useState, useEffect } from 'react'
import { Link } from 'react-scroll'
import { AnimatePresence, motion } from 'framer-motion'
import { FiMenu, FiMoon, FiSun, FiX, FiArrowUpRight } from 'react-icons/fi'
import { personalInfo, uiFlags } from '../data'
import { useTheme } from './ui'

const navLinks = [
  { label: 'About', to: 'hero' },
  { label: 'Info', to: 'information' },
  { label: 'Experience', to: 'timeline' },
  { label: 'Skills', to: 'skills' },
  { label: 'Work', to: 'portfolio' },
  { label: 'Testimonials', to: 'testimonials' },
  { label: 'Contact', to: 'contact' },
]

const visibleLinks = navLinks.filter((link) => {
  if (link.to === 'information') return uiFlags.showImportantInfoSection
  if (link.to === 'testimonials') return uiFlags.showTestimonials
  return true
})

// Logo click: back to the plain main page URL (no #section or #/page) and the top.
function goHome(event) {
  event.preventDefault()
  const { pathname, hash, search } = window.location
  if (hash || search) {
    window.history.pushState(null, '', pathname || '/')
    // Let App re-read the URL (pushState doesn't fire hashchange on its own).
    window.dispatchEvent(new HashChangeEvent('hashchange'))
  }
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' })
}

function ThemeToggle() {
  const { theme, toggle } = useTheme()
  const isDark = theme === 'dark'
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      title={isDark ? 'Light mode' : 'Dark mode'}
      className="h-9 w-9 inline-flex items-center justify-center rounded-full border border-line bg-card text-fg-2 hover:text-fg transition-colors"
    >
      {isDark ? <FiSun size={16} /> : <FiMoon size={16} />}
    </button>
  )
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('hero')

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      setScrolled(y > 24)

      // Keep Contact active near the page end where exact section alignment may not be possible.
      const atBottom = window.innerHeight + y >= document.documentElement.scrollHeight - 4
      if (atBottom) {
        setActiveSection(visibleLinks[visibleLinks.length - 1]?.to || 'hero')
        return
      }

      const probeY = y + 140
      let current = 'hero'
      for (const link of visibleLinks) {
        const section = document.getElementById(link.to)
        if (section && probeY >= section.offsetTop) current = link.to
      }
      setActiveSection(current)
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return (
    <header className="fixed top-0 inset-x-0 z-50 px-3 pt-3 md:pt-4">
      <nav
        aria-label="Primary"
        className={`mx-auto max-w-5xl flex items-center justify-between gap-4 rounded-full border px-3 py-2 pl-5 transition-all duration-300 ${
          scrolled || menuOpen
            ? 'border-line bg-card/80 backdrop-blur-xl shadow-soft'
            : 'border-transparent bg-transparent'
        }`}
      >
        <a
          href="/"
          onClick={(event) => {
            goHome(event)
            setMenuOpen(false)
            setActiveSection('hero')
          }}
          aria-label={`${personalInfo.name}, back to top of main page`}
          className="flex items-center gap-2 text-fg font-semibold cursor-pointer select-none"
        >
          <span className="h-7 w-7 rounded-lg bg-fg text-bg grid place-items-center text-xs font-bold">NM</span>
          <span className="hidden sm:inline md:hidden lg:inline text-sm">{personalInfo.name}</span>
        </a>

        <ul className="hidden md:flex items-center gap-1">
          {visibleLinks.map((link) => {
            const active = activeSection === link.to
            return (
              <li key={link.to} className="relative">
                <Link
                  to={link.to}
                  smooth
                  duration={500}
                  offset={-80}
                  href={`#${link.to}`}
                  onClick={() => setActiveSection(link.to)}
                  className={`relative z-10 block px-3.5 py-1.5 text-sm font-medium rounded-full cursor-pointer transition-colors ${
                    active ? 'text-fg' : 'text-fg-3 hover:text-fg'
                  }`}
                >
                  {link.label}
                </Link>
                {active && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-full bg-subtle border border-line"
                    transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                  />
                )}
              </li>
            )
          })}
        </ul>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <a
            href={personalInfo.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:inline-flex btn-primary !py-2 !px-4"
          >
            Resume <FiArrowUpRight size={14} />
          </a>
          <button
            className="md:hidden h-9 w-9 inline-flex items-center justify-center rounded-full border border-line bg-card text-fg"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? <FiX size={18} /> : <FiMenu size={18} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="md:hidden mx-auto max-w-5xl mt-2 card p-2 flex flex-col"
          >
            {visibleLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                smooth
                duration={500}
                offset={-80}
                href={`#${link.to}`}
                className={`px-4 py-3 rounded-xl font-medium cursor-pointer transition-colors ${
                  activeSection === link.to ? 'bg-subtle text-fg' : 'text-fg-2 hover:text-fg'
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
              className="btn-primary m-2"
              onClick={() => setMenuOpen(false)}
            >
              Download resume <FiArrowUpRight size={14} />
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
