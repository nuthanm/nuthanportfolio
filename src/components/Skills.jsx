import { FiCloud, FiCode, FiCompass, FiDatabase, FiLayers, FiServer, FiTool } from 'react-icons/fi'
import { skills } from '../data'
import { Reveal, SectionHeader } from './ui'

const categoryMeta = {
  Frontend: { icon: FiCode },
  Backend: { icon: FiServer },
  'Cloud & DevOps': { icon: FiCloud },
  ORM: { icon: FiLayers },
  'Cloud Based Infrastructure': { icon: FiCloud },
  Database: { icon: FiDatabase },
  'Tools & Others': { icon: FiTool },
  Interests: { icon: FiCompass },
}

// Bento spans tuned so the 3-column desktop grid tiles without gaps.
const spanByCategory = {
  Backend: 'lg:col-span-2',
  'Cloud & DevOps': 'lg:col-span-2',
  'Tools & Others': 'md:col-span-2 lg:col-span-3',
}

const profile = [
  { label: 'Primary stack', value: '.NET, C#, SQL Server, Azure, Web API' },
  { label: 'Delivery strength', value: 'Scalable APIs, architecture decisions, production reliability' },
  { label: 'Modern layer', value: 'React, Blazor, TypeScript, Tailwind CSS, AI-assisted workflows' },
]

export default function Skills() {
  const technicalSkills = skills.filter((group) => group.category !== 'Interests')
  const interestSkills = skills.find((group) => group.category === 'Interests')?.items ?? []

  return (
    <section id="skills" className="section-padding scroll-mt-20">
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          index="02"
          eyebrow="Skills"
          title="Enterprise rigor, modern delivery."
          description="Core capabilities grouped by domain, from backend architecture to cloud operations and tooling."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 grid-flow-dense gap-3">
          <Reveal className="card p-6 md:p-7 bg-fg text-bg border-fg md:col-span-2 lg:col-span-1 lg:row-span-2 flex flex-col">
            <p className="font-mono text-xs uppercase tracking-[0.18em] opacity-60">Architecture profile</p>
            <h3 className="mt-4 text-2xl font-semibold leading-tight">
              From core Microsoft stack to modern product engineering.
            </h3>
            <dl className="mt-auto pt-8 space-y-5">
              {profile.map((row) => (
                <div key={row.label} className="border-t border-bg/15 pt-4">
                  <dt className="font-mono text-[11px] uppercase tracking-[0.16em] opacity-60">{row.label}</dt>
                  <dd className="mt-1 text-sm font-medium">{row.value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>

          {technicalSkills.map((group, i) => {
            const Icon = categoryMeta[group.category]?.icon ?? FiTool
            return (
              <Reveal key={group.category} delay={Math.min(i * 0.05, 0.25)} className={`card p-6 ${spanByCategory[group.category] ?? ''}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="h-9 w-9 rounded-lg bg-accent/10 text-accent grid place-items-center">
                      <Icon size={16} />
                    </span>
                    <h3 className="text-base font-semibold text-fg">{group.category}</h3>
                  </div>
                  <span className="font-mono text-xs text-fg-3">{String(group.items.length).padStart(2, '0')}</span>
                </div>
                <div className="mt-5 flex flex-wrap gap-1.5">
                  {group.items.map((skill) => (
                    <span key={skill} className="chip">{skill}</span>
                  ))}
                </div>
              </Reveal>
            )
          })}
        </div>

        {interestSkills.length > 0 && (
          <p className="mt-6 text-sm text-fg-3">
            <span className="text-fg-2 font-medium">Outside work:</span> {interestSkills.join(' · ')}
          </p>
        )}
      </div>
    </section>
  )
}
