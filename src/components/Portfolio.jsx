import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { FiExternalLink, FiCode } from 'react-icons/fi'
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
}

function AppCard({ app, index }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const [imgFailed, setImgFailed] = useState(false)

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
      className="glass-card overflow-hidden flex flex-col hover:border-blue-300 transition-all duration-300 hover:-translate-y-1 group"
    >
      {/* App preview / thumbnail */}
      <div className={`relative h-48 bg-gradient-to-br ${tone.frame} p-3 border-b border-slate-200`}>
        <div className="h-full rounded-xl border border-white/70 bg-white/70 backdrop-blur-sm overflow-hidden shadow-sm">
          {app.image && !imgFailed ? (
            <img
              src={app.image}
              alt={app.name}
              onError={() => setImgFailed(true)}
              className="w-full h-full object-cover object-top group-hover:scale-[1.03] transition-transform duration-500"
            />
          ) : (
            <div className="h-full flex flex-col items-center justify-center gap-2 opacity-75 group-hover:opacity-95 transition-opacity">
              <div className="w-16 h-16 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent font-bold text-2xl">
                {initials}
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
        <h3 className="text-text-main font-bold text-xl leading-tight group-hover:text-accent transition-colors mb-2">
          {app.name}
        </h3>
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

        {/* Launch button */}
        <a
          href={app.liveUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 flex items-center justify-center gap-2 px-4 py-2.5 bg-accent/10 hover:bg-accent text-accent hover:text-white border border-accent/20 hover:border-accent rounded-xl text-sm font-semibold transition-all duration-200"
        >
          <FiExternalLink size={14} />
          Launch App
        </a>
      </div>
    </motion.div>
  )
}

export default function Portfolio() {
  const headerRef = useRef(null)
  const headerInView = useInView(headerRef, { once: true })
  const [activeCategory, setActiveCategory] = useState('All')

  const filtered =
    activeCategory === 'All'
      ? portfolio
      : portfolio.filter((p) => p.category === activeCategory)

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
            A collection of my published apps and projects. Click any card to launch it.
          </p>
        </motion.div>

        {/* Filter tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
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
