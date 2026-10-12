import { useMemo, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { FiExternalLink, FiCode, FiTool } from 'react-icons/fi'
import { portfolio } from '../data'

const categories = ['All', ...Array.from(new Set(portfolio.map((p) => p.category)))]

const categoryStyles = {
  Financial: {
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    frame: 'from-emerald-100 to-teal-100',
  },
  'Interview Evaluation': {
    badge: 'bg-sky-50 text-sky-700 border-sky-200',
    frame: 'from-sky-100 to-blue-100',
  },
  Educational: {
    badge: 'bg-amber-50 text-amber-700 border-amber-200',
    frame: 'from-amber-100 to-orange-100',
  },
  'Web App': {
    badge: 'bg-blue-50 text-blue-700 border-blue-200',
    frame: 'from-blue-100 to-cyan-100',
  },
  'Browser Extension': {
    badge: 'bg-violet-50 text-violet-700 border-violet-200',
    frame: 'from-violet-100 to-purple-100',
  },
  'Job Search': {
    badge: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    frame: 'from-indigo-100 to-blue-100',
  },
  'Developer Tools': {
    badge: 'bg-slate-100 text-slate-700 border-slate-200',
    frame: 'from-slate-100 to-blue-100',
  },
  'Expense Management': {
    badge: 'bg-teal-50 text-teal-700 border-teal-200',
    frame: 'from-teal-100 to-emerald-100',
  },
  Productivity: {
    badge: 'bg-rose-50 text-rose-700 border-rose-200',
    frame: 'from-rose-100 to-orange-100',
  },
  Mail: {
    badge: 'bg-cyan-50 text-cyan-700 border-cyan-200',
    frame: 'from-cyan-100 to-sky-100',
  },
}

function isMaintenance(app) {
  return String(app?.status || 'live').toLowerCase() === 'maintenance'
}

function sortPortfolio(apps) {
  return [...apps].sort((a, b) => {
    const aMaint = isMaintenance(a) ? 1 : 0
    const bMaint = isMaintenance(b) ? 1 : 0
    if (aMaint !== bMaint) return aMaint - bMaint
    return Number(a.id) - Number(b.id)
  })
}

function AppCard({ app, index }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const [imgFailed, setImgFailed] = useState(false)
  const maintenance = isMaintenance(app)

  const initials = app.name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)

  const tone = categoryStyles[app.category] ?? categoryStyles['Web App']

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.07 }}
      className={`glass-card overflow-hidden flex flex-col transition-all duration-300 group ${
        maintenance
          ? 'border-amber-200/80 opacity-[0.92]'
          : 'hover:border-blue-300 hover:-translate-y-1'
      }`}
    >
      {/* App preview / thumbnail */}
      <div className={`relative h-48 bg-gradient-to-br ${tone.frame} p-3 border-b border-slate-200`}>
        <div className="h-full rounded-xl border border-white/70 bg-white/70 backdrop-blur-sm overflow-hidden shadow-sm relative">
          {app.image && !imgFailed ? (
            <img
              src={app.image}
              alt={app.name}
              loading="lazy"
              onError={() => setImgFailed(true)}
              className={`w-full h-full object-cover object-top transition-transform duration-500 ${
                maintenance ? 'grayscale-[35%] scale-100' : 'group-hover:scale-[1.03]'
              }`}
            />
          ) : (
            <div className="h-full flex flex-col items-center justify-center gap-2 opacity-75 group-hover:opacity-95 transition-opacity">
              <div className="w-16 h-16 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent font-bold text-2xl">
                {initials}
              </div>
            </div>
          )}

          {maintenance && (
            <div className="absolute inset-0 bg-slate-900/45 backdrop-blur-[1px] flex items-center justify-center px-4">
              <div className="flex items-center gap-2 rounded-xl bg-white/95 border border-amber-200 px-3 py-2 text-amber-800 shadow-sm">
                <FiTool size={14} />
                <span className="text-xs font-semibold tracking-wide uppercase">Under Maintenance</span>
              </div>
            </div>
          )}
        </div>
        {/* Category badge */}
        <span className={`absolute top-5 right-5 text-xs px-2.5 py-1 rounded-full border font-medium ${tone.badge}`}>
          {app.category}
        </span>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-3 mb-2">
          <h3 className={`font-bold text-xl leading-tight transition-colors ${
            maintenance ? 'text-slate-700' : 'text-text-main group-hover:text-accent'
          }`}>
            {app.name}
          </h3>
          {maintenance && (
            <span className="shrink-0 text-[10px] uppercase tracking-wide px-2 py-1 rounded-md bg-amber-50 text-amber-700 border border-amber-200 font-semibold">
              Offline
            </span>
          )}
        </div>
        <p className="text-text-secondary text-sm leading-relaxed flex-1">{app.description}</p>

        {/* Tech chips */}
        <div className="flex flex-wrap gap-2 mt-4">
          {app.tech.map((t) => (
            <span
              key={t}
              className="flex items-center gap-1 text-xs px-2.5 py-1 bg-slate-50 rounded-lg text-slate-600 border border-slate-200"
            >
              <FiCode size={10} />
              {t}
            </span>
          ))}
        </div>

        {/* Launch / maintenance action */}
        {maintenance ? (
          <div
            role="status"
            aria-label={`${app.name} is under maintenance`}
            className="mt-5 flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-50 text-amber-800 border border-amber-200 rounded-xl text-sm font-semibold cursor-not-allowed"
          >
            <FiTool size={14} />
            Under Maintenance
          </div>
        ) : (
          <a
            href={app.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 flex items-center justify-center gap-2 px-4 py-2.5 bg-accent/10 hover:bg-accent text-accent hover:text-white border border-accent/20 hover:border-accent rounded-xl text-sm font-semibold transition-all duration-200"
          >
            <FiExternalLink size={14} />
            Launch App
          </a>
        )}
      </div>
    </motion.div>
  )
}

export default function Portfolio() {
  const headerRef = useRef(null)
  const headerInView = useInView(headerRef, { once: true })
  const [activeCategory, setActiveCategory] = useState('All')

  const filtered = useMemo(() => {
    const byCategory =
      activeCategory === 'All'
        ? portfolio
        : portfolio.filter((p) => p.category === activeCategory)

    return sortPortfolio(byCategory)
  }, [activeCategory])

  const liveCount = filtered.filter((app) => !isMaintenance(app)).length
  const maintenanceCount = filtered.length - liveCount

  return (
    <section id="portfolio" className="section-padding section-atmosphere bg-surface">
      <div className="max-w-6xl mx-auto">
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 20 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <span className="text-accent text-sm font-semibold uppercase tracking-widest">
            What I've built
          </span>
          <h2 className="mt-2 text-3xl md:text-4xl font-bold text-text-main">Portfolio</h2>
          <p className="mt-3 text-text-secondary max-w-xl mx-auto">
            A collection of my published apps and projects. Live apps appear first; apps under maintenance stay visible with launch disabled.
          </p>
        </motion.div>

        {/* Filter tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-6">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                activeCategory === cat
                  ? 'bg-accent text-white shadow-md'
                  : 'bg-white border border-slate-200 text-text-secondary hover:border-accent/40 hover:text-accent'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {(liveCount > 0 || maintenanceCount > 0) && (
          <div className="flex flex-wrap justify-center gap-3 mb-10 text-xs text-text-secondary">
            <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              {liveCount} live
            </span>
            <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
              {maintenanceCount} under maintenance
            </span>
          </div>
        )}

        {/* Grid */}
        <motion.div
          key={activeCategory}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filtered.map((app, i) => (
            <AppCard key={app.id} app={app} index={i} />
          ))}
        </motion.div>
      </div>
    </section>
  )
}
