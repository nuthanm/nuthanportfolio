import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { FiCloud, FiCode, FiCompass, FiDatabase, FiServer, FiTool } from 'react-icons/fi'
import { skills } from '../data'

const categoryMeta = {
  Frontend: { icon: FiCode },
  Backend: { icon: FiServer },
  'Cloud & DevOps': { icon: FiCloud },
  ORM: { icon: FiDatabase },
  'Cloud Based Infrastructure': { icon: FiCloud },
  Database: { icon: FiDatabase },
  'Tools & Others': { icon: FiTool },
  Interests: { icon: FiCompass },
}

function SkillRow({ group, index, isLast }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const Icon = categoryMeta[group.category]?.icon ?? FiTool

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className={`py-4 ${isLast ? '' : 'border-b border-slate-200'}`}
    >
      <div className="flex flex-col md:flex-row md:items-start gap-3 md:gap-4">
        <div className="flex items-start gap-3 md:w-48 lg:w-52 flex-shrink-0">
          <div className="h-9 w-9 rounded-md bg-accent/10 border border-accent/20 text-accent flex items-center justify-center">
            <Icon size={17} />
          </div>
          <div>
            <h3 className="text-base font-bold text-text-main leading-tight">{group.category}</h3>
            <p className="text-xs text-accent/80 mt-1">{group.items.length} competencies</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 md:flex-1">
          {group.items.map((skill) => (
            <span
              key={skill}
              className="text-xs font-medium px-3 py-1.5 rounded-md border border-slate-200 bg-slate-50 text-slate-700"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

export default function Skills() {
  const headerRef = useRef(null)
  const headerInView = useInView(headerRef, { once: true })
  const technicalSkills = skills.filter((group) => group.category !== 'Interests')
  const interestSkills = skills.find((group) => group.category === 'Interests')?.items ?? []

  return (
    <section id="skills" className="scroll-mt-28 section-padding section-atmosphere bg-slate-50">

      <div className="max-w-6xl mx-auto">
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 20 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12 md:mb-14"
        >
          <div className="inline-flex items-center gap-2 rounded-md border border-accent/20 bg-accent/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-accent">
            Technical Competencies
          </div>
          <h2 className="mt-4 text-3xl md:text-4xl font-extrabold text-text-main tracking-tight">
            Technical Skill
            <span className="text-accent"> Matrix</span>
          </h2>
          <p className="mt-3 text-slate-600 max-w-3xl">
            Core technical capabilities organized by domain, reflecting practical delivery experience across architecture, implementation, and operations.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={headerInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="lg:col-span-4 rounded-2xl border border-slate-200 bg-white p-6 md:p-7"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent/80">Architecture Profile</p>
            <h3 className="mt-3 text-2xl font-extrabold text-text-main leading-tight">From core Microsoft stack to modern product engineering.</h3>
            <p className="mt-4 text-sm text-slate-600 leading-relaxed">
              I combine enterprise backend rigor with modern frontend delivery, cloud operations, and practical tooling that keeps teams fast and stable in production.
            </p>

            <div className="mt-6 space-y-3">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-600">Primary Stack</p>
                <p className="mt-1 text-sm font-bold text-slate-900">.NET, C#, SQL Server, Azure, Web API</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-600">Delivery Strength</p>
                <p className="mt-1 text-sm font-bold text-slate-900">Scalable APIs, architecture decisions, production reliability</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-600">Modern Layer</p>
                <p className="mt-1 text-sm font-bold text-slate-900">React, Blazor, TypeScript, Tailwind CSS, AI-assisted workflows</p>
              </div>
            </div>
          </motion.aside>

          <div className="lg:col-span-8 rounded-2xl border border-slate-200 bg-white p-6 md:p-7">
            {technicalSkills.map((group, i) => (
              <SkillRow key={group.category} group={group} index={i} isLast={i === technicalSkills.length - 1} />
            ))}

            {interestSkills.length > 0 && (
              <p className="mt-5 pt-4 border-t border-slate-200 text-sm text-slate-500">
                Additional interests: {interestSkills.join(', ')}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
