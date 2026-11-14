import { useEffect } from 'react'
import { FiArrowRight, FiMapPin } from 'react-icons/fi'
import { certifications, personalInfo, portfolio, timeline } from '../data'

// 1200x630 social share card that mirrors the landing hero.
// Dev-only route (#/og-card). To refresh public/og-cover.jpg: run `npm run dev`,
// screenshot http://localhost:5173/#/og-card in a headless Chrome/Edge at a
// 1200x630 window (2x scale), then downscale to 1200x630 and save as JPEG.
function yearsSince(dateText) {
  const ms = Date.now() - new Date(dateText).getTime()
  // Rounded the same way as the hero stat so both show the same number
  return Math.round(ms / (365.25 * 24 * 3600 * 1000))
}

export default function OgCard() {
  const role = timeline[0]
  const [first, ...rest] = personalInfo.name.split(' ')
  const stats = [
    { value: `${yearsSince(personalInfo.itCareerStartDate)}+`, label: 'Years in IT' },
    { value: portfolio.filter((p) => p.status !== 'maintenance').length, label: 'Live products' },
    { value: certifications.length, label: 'Certifications' },
  ]

  // The share image is always rendered in the light theme.
  useEffect(() => {
    document.documentElement.classList.remove('dark')
  }, [])

  return (
    <div style={{ width: 1200, height: 630 }}>
      <div className="relative h-full w-full overflow-hidden bg-bg p-10 flex gap-5">
        <div aria-hidden="true" className="hero-backdrop absolute inset-0" />

        {/* Intro card */}
        <div className="relative card flex-1 p-11 flex flex-col">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-2 rounded-full border border-line bg-subtle px-3.5 py-1.5 text-[15px] font-medium text-fg-2">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
              Open to full-time roles and contract projects
            </span>
            <span className="h-10 w-10 rounded-xl bg-fg text-bg grid place-items-center text-sm font-bold">NM</span>
          </div>

          <h1 className="mt-8 text-[88px] font-semibold text-fg leading-[0.92] tracking-[-0.045em]">
            {first}
            <br />
            <span className="text-fg-3">{rest.join(' ')}</span>
          </h1>

          <p className="mt-7 font-mono text-[19px] text-accent">
            {role.role} · .NET · Azure · API-first
          </p>

          <div className="mt-auto flex items-end justify-between gap-6">
            <div className="flex gap-9">
              {stats.map((s) => (
                <div key={s.label}>
                  <p className="text-[40px] font-semibold text-fg leading-none tabular-nums tracking-tight">{s.value}</p>
                  <p className="mt-2 text-[15px] text-fg-3">{s.label}</p>
                </div>
              ))}
            </div>
            <span className="inline-flex items-center gap-2 rounded-full bg-fg text-bg px-5 py-3 text-[17px] font-semibold">
              nuthanportfolio.vercel.app <FiArrowRight size={17} />
            </span>
          </div>
        </div>

        {/* Photo card */}
        <div className="relative card overflow-hidden w-[350px] shrink-0">
          <img src={personalInfo.photo} alt="" className="absolute inset-0 h-full w-full object-cover object-[50%_25%]" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/5 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-6 text-white">
            <p className="flex items-center gap-1.5 font-mono text-[13px] uppercase tracking-[0.16em] text-white/75">
              <FiMapPin size={13} /> Based in {personalInfo.location}
            </p>
            <p className="mt-2 text-[22px] font-semibold leading-tight">
              {role.role}
              <span className="font-normal text-white/75"> @ {role.company}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
