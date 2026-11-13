import { SiAnthropic, SiGithubcopilot, SiOpenai } from 'react-icons/si'
import { FiArrowUpRight } from 'react-icons/fi'
import { aiTools } from '../data'
import { Reveal } from './ui'

const iconMap = {
  openai: SiOpenai,
  anthropic: SiAnthropic,
  copilot: SiGithubcopilot,
}

export default function AiToolsStrip() {
  return (
    <section aria-labelledby="ai-workflow-title" className="px-5 md:px-10 lg:px-16 pb-20 md:pb-28">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-12 gap-8 items-start border-t border-line pt-12">
        <Reveal className="lg:col-span-4">
          <p className="eyebrow">AI workflow</p>
          <h2 id="ai-workflow-title" className="mt-3 text-2xl md:text-3xl font-semibold text-fg leading-tight">
            AI-accelerated engineering, production-grade standards.
          </h2>
          <p className="mt-3 text-sm text-fg-2 leading-relaxed">
            I use AI tools to explore architecture options faster, automate repetitive work and raise delivery quality, with human review on every change.
          </p>
        </Reveal>

        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {aiTools.map((tool, i) => {
            const Icon = tool.iconKey ? iconMap[tool.iconKey] : null
            return (
              <Reveal key={tool.name} delay={i * 0.06}>
                <a
                  href={tool.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="card group h-full p-5 flex items-start gap-4 hover:border-fg-3/50 transition-colors"
                >
                  <span className="h-10 w-10 shrink-0 rounded-xl bg-subtle border border-line grid place-items-center text-fg">
                    {Icon ? (
                      <Icon size={18} />
                    ) : (
                      <img src={tool.iconUrl ?? tool.logoImage} alt="" width="18" height="18" className="h-[18px] w-[18px] object-contain" />
                    )}
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="flex items-center justify-between gap-2 text-sm font-semibold text-fg">
                      {tool.name}
                      <FiArrowUpRight size={14} className="text-fg-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    </span>
                    <span className="mt-1 block text-sm text-fg-3 leading-snug">{tool.usage}</span>
                  </span>
                </a>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
