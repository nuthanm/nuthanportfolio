import { motion } from 'framer-motion'
import { FiAlertTriangle, FiCheckCircle, FiImage, FiLock, FiShield } from 'react-icons/fi'
import { importantInfo, personalInfo } from '../data'

export default function ImportantInfo() {
  return (
    <section id="information" className="section-padding section-atmosphere bg-surface">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <span className="text-accent text-sm font-semibold uppercase tracking-widest">
            Important Information
          </span>
          <h2 className="mt-2 text-3xl md:text-4xl font-bold text-text-main">
            Ownership, Attribution, and Safety
          </h2>
          <p className="mt-3 text-text-secondary max-w-3xl mx-auto">
            This section clarifies content ownership, third-party references, and security expectations to reduce copyright or policy violation risks.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6 items-stretch">
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="glass-card p-6 lg:col-span-1"
          >
            <div className="rounded-2xl overflow-hidden border border-slate-200 bg-white">
              <img
                src={personalInfo.photo}
                alt={`${personalInfo.name} profile`}
                className="w-full h-56 object-cover"
              />
            </div>
            <div className="mt-4 flex items-start gap-3">
              <FiCheckCircle className="text-accent mt-0.5" size={18} />
              <p className="text-sm text-text-secondary leading-relaxed">
                Official profile identity for this portfolio: <span className="font-semibold text-text-main">{personalInfo.name}</span>.
              </p>
            </div>
            <div className="mt-3 flex items-start gap-3">
              <FiShield className="text-accent mt-0.5" size={18} />
              <p className="text-sm text-text-secondary leading-relaxed">
                {importantInfo.copyrightNotice}
              </p>
            </div>
          </motion.article>

          <motion.article
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="glass-card p-6 lg:col-span-2"
          >
            <h3 className="text-text-main font-bold text-xl mb-4">Attribution and Copyright Notes</h3>

            <div className="space-y-4">
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <div className="flex items-center gap-2 mb-2 text-text-main font-semibold">
                  <FiImage size={16} className="text-accent" />
                  External Image and Brand Usage
                </div>
                <ul className="text-sm text-text-secondary leading-relaxed list-disc pl-5 space-y-1">
                  {importantInfo.attributionItems.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <div className="flex items-center gap-2 mb-2 text-text-main font-semibold">
                  <FiLock size={16} className="text-accent" />
                  Violation Prevention and Safe Use
                </div>
                <ul className="text-sm text-text-secondary leading-relaxed list-disc pl-5 space-y-1">
                  {importantInfo.preventionItems.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                <div className="flex items-center gap-2 mb-2 text-amber-900 font-semibold">
                  <FiAlertTriangle size={16} />
                  Legal and Trademark Clarification
                </div>
                <p className="text-sm text-amber-900/90 leading-relaxed">
                  {importantInfo.legalDisclaimer}
                </p>
              </div>
            </div>
          </motion.article>
        </div>
      </div>
    </section>
  )
}
