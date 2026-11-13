import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { FiArrowUpRight, FiChevronDown, FiTool } from 'react-icons/fi'
import { portfolio } from '../data'
import { Reveal, SectionHeader } from './ui'

function isMaintenance(app) {
  return String(app?.status || 'live').toLowerCase() === 'maintenance'
}

// Live projects keep the order they have in data.js; the first one is featured.
const liveApps = portfolio.filter((app) => !isMaintenance(app))
const archivedApps = portfolio.filter(isMaintenance)

function initialsOf(name) {
  return name
    .replace(/[^A-Za-z ]/g, '')
    .split(' ')
    .filter(Boolean)
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

function Thumbnail({ app, featured }) {
  const [failed, setFailed] = useState(false)
  return (
    <div
      className={`relative overflow-hidden rounded-xl border border-line bg-subtle ${
        featured ? 'aspect-[16/10] lg:aspect-auto lg:flex-1 lg:min-h-[20rem]' : 'aspect-[16/10]'
      }`}
    >
      {app.image && !failed ? (
        <img
          src={app.image}
          alt={`Screenshot of ${app.name}`}
          loading="lazy"
          width="1200"
          height="750"
          onError={() => setFailed(true)}
          className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]"
        />
      ) : (
        <div className="absolute inset-0 grid place-items-center bg-gradient-to-br from-accent/15 via-subtle to-subtle">
          <span className="text-4xl font-semibold text-accent/70">{initialsOf(app.name)}</span>
        </div>
      )}
    </div>
  )
}

function ProjectCard({ app, featured = false, index }) {
  return (
    <Reveal
      delay={Math.min(index * 0.06, 0.3)}
      className={featured ? 'md:col-span-2 lg:row-span-2' : ''}
    >
      <a
        href={app.liveUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="card group h-full p-3 flex flex-col hover:border-fg-3/50 hover:shadow-lift transition-all duration-300"
      >
        <Thumbnail app={app} featured={featured} />
        <div className={`px-3 pt-5 pb-3 flex flex-col ${featured ? 'md:px-5' : ''}`}>
          <div className="flex items-center gap-2 text-xs text-fg-3">
            {featured && (
              <span className="rounded-full bg-accent/10 text-accent px-2 py-0.5 font-medium">Featured</span>
            )}
            <span className="font-mono uppercase tracking-[0.14em]">{app.category}</span>
          </div>
          <div className="mt-2 flex items-start justify-between gap-3">
            <h3 className={`font-semibold text-fg leading-tight ${featured ? 'text-2xl md:text-3xl' : 'text-lg'}`}>
              {app.name}
            </h3>
            <span className="shrink-0 h-8 w-8 rounded-full border border-line grid place-items-center text-fg-3 group-hover:bg-fg group-hover:text-bg group-hover:border-fg transition-colors">
              <FiArrowUpRight size={15} />
            </span>
          </div>
          <p className={`mt-2 text-fg-2 leading-relaxed ${featured ? 'text-base max-w-xl' : 'text-sm line-clamp-3'}`}>
            {app.description}
          </p>
          <div className="mt-4 flex flex-wrap gap-1.5">
            {app.tech.map((t) => (
              <span key={t} className="chip">{t}</span>
            ))}
          </div>
        </div>
      </a>
    </Reveal>
  )
}

function ArchiveRow({ app }) {
  return (
    <li className="grid grid-cols-12 gap-3 items-baseline py-4 border-t border-line first:border-t-0">
      <span className="col-span-12 sm:col-span-3 font-medium text-fg">{app.name}</span>
      <span className="col-span-12 sm:col-span-6 text-sm text-fg-3 leading-relaxed">{app.description}</span>
      <span className="col-span-12 sm:col-span-3 flex sm:justify-end items-center gap-2 text-xs text-fg-3">
        <span className="font-mono uppercase tracking-[0.12em]">{app.category}</span>
        <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-amber-700 dark:text-amber-400">
          <FiTool size={10} /> Offline
        </span>
      </span>
    </li>
  )
}

export default function Portfolio() {
  const [showArchive, setShowArchive] = useState(false)

  return (
    <section id="portfolio" className="section-padding bg-subtle border-y border-line scroll-mt-20">
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          index="03"
          eyebrow="Work"
          title="Things I've shipped."
          description="Side products I design, build and run end to end, mostly finance, productivity and developer tools."
        >
          <p className="text-sm text-fg-3 md:text-right">
            <span className="text-fg font-semibold">{liveApps.length}</span> live products
            <br className="hidden md:block" />
            <span className="md:hidden"> · </span>
            <span className="text-fg font-semibold">{archivedApps.length}</span> in the archive
          </p>
        </SectionHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {liveApps.map((app, i) => (
            <ProjectCard key={app.id} app={app} featured={i === 0} index={i} />
          ))}
        </div>

        {archivedApps.length > 0 && (
          <div className="mt-10">
            <button
              type="button"
              onClick={() => setShowArchive((v) => !v)}
              aria-expanded={showArchive}
              aria-controls="project-archive"
              className="btn-ghost"
            >
              {showArchive ? 'Hide' : 'Show'} archived projects ({archivedApps.length})
              <FiChevronDown size={15} className={`transition-transform ${showArchive ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence initial={false}>
              {showArchive && (
                <motion.div
                  id="project-archive"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  className="overflow-hidden"
                >
                  <div className="card mt-4 px-5 md:px-6 py-2">
                    <p className="pt-4 pb-2 text-xs text-fg-3">
                      These projects are offline for maintenance or being rebuilt. Launch links return once they're back.
                    </p>
                    <ul>
                      {archivedApps.map((app) => (
                        <ArchiveRow key={app.id} app={app} />
                      ))}
                    </ul>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </section>
  )
}
