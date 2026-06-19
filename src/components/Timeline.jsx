import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { certifications, timeline } from '../data'

function TimelineItem({ item, index }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.45, delay: index * 0.08 }}
      className="relative pl-10"
    >
      <span className="absolute left-0 top-2.5 w-3.5 h-3.5 rounded-full bg-accent ring-4 ring-blue-100" />
      <div className="glass-card p-6 hover:border-blue-300 transition-colors">
        <span className="inline-block text-xs font-semibold text-accent bg-blue-50 border border-blue-200 px-3 py-1 rounded-full mb-3">
          {item.year}
        </span>
        <h3 className="text-text-main font-bold text-xl">{item.role}</h3>
        <p className="text-text-secondary text-sm font-semibold mt-1">{item.company}</p>
        <p className="text-text-secondary text-sm leading-relaxed mt-3">{item.description}</p>
        <div className="flex flex-wrap gap-2 mt-4">
          {item.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-2.5 py-1 bg-slate-50 rounded-lg text-slate-700 border border-slate-200"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

export default function Timeline() {
  return (
    <section id="timeline" className="section-padding section-atmosphere bg-surface">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <span className="text-accent text-sm font-semibold uppercase tracking-widest">Career</span>
          <h2 className="mt-2 text-3xl md:text-4xl font-bold text-text-main">Career Timeline</h2>
          <p className="mt-3 text-text-secondary max-w-2xl mx-auto">
            A clear snapshot of my journey from Microsoft stack development to modern full-stack products, mentoring, and technical content creation.
          </p>
        </div>

        <div className="relative border-l-2 border-blue-100 ml-3 md:ml-6 flex flex-col gap-6">
          {timeline.map((item, index) => (
            <TimelineItem key={item.id} item={item} index={index} />
          ))}
        </div>

        <div className="mt-14">
          <div className="text-center mb-8">
            <h3 className="text-2xl md:text-3xl font-bold text-text-main">Certifications</h3>
            <p className="mt-2 text-text-secondary text-sm">
              Professional certifications and credentials relevant to Microsoft, Azure, and enterprise engineering.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {certifications.map((cert) => (
              <a
                key={cert.id}
                href={cert.credentialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="glass-card p-5 hover:border-blue-300 transition-all duration-200 hover:-translate-y-1 group"
              >
                <div className="flex items-center gap-3 mb-3 min-h-12">
                  <div className="w-28 h-10 flex items-center justify-start rounded-md bg-white">
                    {cert.logoImage ? (
                      <img
                        src={cert.logoImage}
                        alt={`${cert.issuer} logo`}
                        className="max-h-10 w-auto object-contain"
                      />
                    ) : (
                      <span className="text-sm text-accent font-semibold">{cert.issuer}</span>
                    )}
                  </div>
                  <h4 className="text-base font-bold text-text-main leading-snug group-hover:text-accent transition-colors">
                    {cert.title}
                  </h4>
                </div>
                <p className="text-xs text-slate-500 mt-2">{cert.issuer}</p>
                <p className="text-xs text-slate-500 mt-1">
                  Issued {cert.issuedOn} • {cert.year}
                </p>
                <span className="inline-flex mt-4 px-3 py-1.5 rounded-md bg-blue-50 text-accent text-xs font-semibold border border-blue-200">
                  View Credential
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
