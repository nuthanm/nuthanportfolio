import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

// Shared building blocks for the redesigned sections.

export function SectionHeader({ index, eyebrow, title, description, align = 'left', children }) {
  const centered = align === 'center'
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={`mb-12 md:mb-16 flex flex-col gap-6 md:flex-row md:items-end md:justify-between ${
        centered ? 'items-center text-center md:flex-col md:items-center' : ''
      }`}
    >
      <div className={centered ? 'max-w-2xl' : 'max-w-2xl'}>
        <p className="eyebrow">
          {index && <span className="text-accent">{index}</span>}
          {index && <span className="mx-2 text-line">/</span>}
          {eyebrow}
        </p>
        <h2 className="mt-3 text-3xl md:text-5xl font-semibold text-fg leading-[1.05]">{title}</h2>
        {description && <p className="mt-4 text-fg-2 text-base md:text-lg leading-relaxed">{description}</p>}
      </div>
      {children}
    </motion.div>
  )
}

export function Reveal({ children, delay = 0, className = '', as = 'div' }) {
  const Component = motion[as] ?? motion.div
  return (
    <Component
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </Component>
  )
}

function readTheme() {
  if (typeof document === 'undefined') return 'light'
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light'
}

export function useTheme() {
  const [theme, setTheme] = useState(readTheme)

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', theme === 'dark')
  }, [theme])

  const toggle = () => {
    const next = readTheme() === 'dark' ? 'light' : 'dark'
    try {
      window.localStorage.setItem('theme', next)
    } catch (_error) {
      // Storage may be blocked; the theme still applies for this visit.
    }
    setTheme(next)
  }

  return { theme, toggle }
}
