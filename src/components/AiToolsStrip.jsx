import { motion } from 'framer-motion'
import { SiAnthropic, SiGithubcopilot, SiOpenai } from 'react-icons/si'
import { aiTools } from '../data'

const iconMap = {
  openai: SiOpenai,
  anthropic: SiAnthropic,
  copilot: SiGithubcopilot,
}

export default function AiToolsStrip() {
  return (
    <section className="relative px-6 md:px-12 lg:px-24 py-12 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-40 [background-image:radial-gradient(#93c5fd_1px,transparent_1px)] [background-size:18px_18px]" />
      <div className="absolute -top-20 -left-10 w-64 h-64 rounded-full bg-blue-100/70 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 right-0 w-72 h-72 rounded-full bg-cyan-100/60 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="glass-card bg-white/95 border-blue-100 px-6 py-8"
        >
          <div className="text-center mb-6">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              AI workflow
            </span>
            <h3 className="mt-2 text-2xl md:text-3xl font-bold text-text-main">
              AI-Accelerated Engineering Workflow
            </h3>
            <p className="mt-2 text-sm text-text-secondary max-w-2xl mx-auto">
              I use AI tools to speed up architecture and development, automate repetitive tasks, and improve delivery quality while maintaining production-grade standards.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-stretch">
            {aiTools.map((tool) => {
              const Icon = tool.iconKey ? iconMap[tool.iconKey] : null
              return (
                <a
                  key={tool.name}
                  href={tool.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl border border-slate-200 bg-slate-50 hover:border-blue-300 hover:bg-white transition-all duration-200 px-4 py-3 flex items-center justify-center gap-2.5"
                  title={tool.usage}
                >
                  {Icon ? (
                    <Icon size={22} className="text-accent" />
                  ) : (
                    <img
                      src={tool.iconUrl ?? tool.logoImage}
                      alt={`${tool.name} logo`}
                      className="h-5 w-5 object-contain"
                    />
                  )}
                  <span className="text-sm font-semibold text-slate-700">{tool.name}</span>
                </a>
              )
            })}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
