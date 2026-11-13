import { FiArrowUpRight, FiAward } from 'react-icons/fi'
import { certifications, timeline } from '../data'
import { Reveal, SectionHeader } from './ui'

// Merge consecutive roles at the same company so promotions read as one journey.
function groupByCompany(items) {
  return items.reduce((groups, item) => {
    const last = groups[groups.length - 1]
    if (last && last.company === item.company) {
      last.roles.push(item)
    } else {
      groups.push({ company: item.company, roles: [item] })
    }
    return groups
  }, [])
}

function spanOf(roles) {
  const newest = roles[0].year.split('–')[1]?.trim() ?? ''
  const oldest = roles[roles.length - 1].year.split('–')[0]?.trim() ?? ''
  return `${oldest} – ${newest}`
}

function CompanyBlock({ group, index }) {
  const isCurrent = /present/i.test(group.roles[0].year)
  return (
    <Reveal delay={Math.min(index * 0.05, 0.2)} className="grid md:grid-cols-12 gap-4 md:gap-8 py-10 border-t border-line first:border-t-0 first:pt-0">
      <div className="md:col-span-4">
        <div className="md:sticky md:top-28">
          <div className="flex items-center gap-3">
            <span className="h-10 w-10 rounded-xl bg-subtle border border-line grid place-items-center text-sm font-semibold text-fg">
              {group.company.replace(/\(.*\)/, '').trim().split(/\s+/).map((w) => w[0]).join('').slice(0, 2)}
            </span>
            <div>
              <h3 className="text-lg font-semibold text-fg leading-tight">{group.company}</h3>
              <p className="text-xs text-fg-3 font-mono mt-0.5">{spanOf(group.roles)}</p>
            </div>
          </div>
          {group.roles.length > 1 && (
            <p className="mt-3 text-xs text-fg-3">
              {group.roles.length} roles · {group.roles.length - 1} promotion{group.roles.length > 2 ? 's' : ''}
            </p>
          )}
          {isCurrent && (
            <span className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-700 dark:text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Current
            </span>
          )}
        </div>
      </div>

      <ol className="md:col-span-8 relative">
        {group.roles.map((role, i) => (
          <li key={role.id} className="relative pl-7 pb-8 last:pb-0">
            {i < group.roles.length - 1 && (
              <span aria-hidden="true" className="absolute left-[5px] top-3 bottom-0 w-px bg-line" />
            )}
            <span
              aria-hidden="true"
              className={`absolute left-0 top-1.5 h-[11px] w-[11px] rounded-full border-2 ${
                i === 0 ? 'border-accent bg-accent' : 'border-line bg-bg'
              }`}
            />
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <h4 className="text-base md:text-lg font-semibold text-fg">{role.role}</h4>
              <span className="text-xs font-mono text-fg-3">{role.year}</span>
            </div>
            <p className="mt-2 text-sm text-fg-2 leading-relaxed">{role.description}</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {role.tags.map((tag) => (
                <span key={tag} className="chip">{tag}</span>
              ))}
            </div>
          </li>
        ))}
      </ol>
    </Reveal>
  )
}

export default function Timeline() {
  const groups = groupByCompany(timeline)

  return (
    <section id="timeline" className="section-padding bg-subtle border-y border-line scroll-mt-20">
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          index="01"
          eyebrow="Experience"
          title="From engineer to architect."
          description="More than a decade on the Microsoft stack, from media and banking platforms to leading enterprise architecture at KANINI."
        />

        <div>
          {groups.map((group, i) => (
            <CompanyBlock key={`${group.company}-${i}`} group={group} index={i} />
          ))}
        </div>

        <div id="certifications" className="mt-20 scroll-mt-28">
          <div className="flex items-end justify-between gap-4 mb-6">
            <div>
              <p className="eyebrow">Credentials</p>
              <h3 className="mt-2 text-2xl md:text-3xl font-semibold text-fg">Certifications</h3>
            </div>
            <span className="hidden sm:inline text-sm text-fg-3">{certifications.length} credentials</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {certifications.map((cert, i) => (
              <Reveal key={cert.id} delay={Math.min(i * 0.04, 0.2)}>
                <a
                  href={cert.credentialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="card group h-full p-5 flex flex-col gap-4 hover:border-fg-3/50 hover:-translate-y-0.5 transition-all"
                >
                  <div className="flex items-center justify-between gap-3">
                    {cert.logoImage ? (
                      <img
                        src={cert.logoImage}
                        alt={`${cert.issuer} logo`}
                        height="28"
                        className="h-7 w-auto max-w-[9rem] object-contain object-left rounded"
                      />
                    ) : (
                      <FiAward className="text-accent" size={20} />
                    )}
                    <FiArrowUpRight size={16} className="text-fg-3 group-hover:text-fg transition-colors" />
                  </div>
                  <h4 className="text-sm font-semibold text-fg leading-snug">{cert.title}</h4>
                  <p className="mt-auto text-xs text-fg-3">
                    {cert.issuer} · {cert.issuedOn}
                  </p>
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
