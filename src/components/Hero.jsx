import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-scroll'
import { FiArrowRight, FiGithub, FiLinkedin, FiMail, FiMapPin, FiTwitter } from 'react-icons/fi'
import { SiCodementor, SiMedium } from 'react-icons/si'
import { githubStats, personalInfo, timeline } from '../data'

const coreStack = ['.NET 8', 'C#', 'ASP.NET Web API', 'Azure', 'SQL Server', 'React', 'TypeScript', 'Azure DevOps']

const GITHUB_STATS_CACHE_KEY = 'hero.githubStatsCache.v1'

function readCachedGithubStats() {
  if (typeof window === 'undefined') {
    return null
  }

  try {
    const raw = window.localStorage.getItem(GITHUB_STATS_CACHE_KEY)
    if (!raw) {
      return null
    }

    const parsed = JSON.parse(raw)
    const publicRepos = Number(parsed?.publicRepos)
    const contributionsCurrentYear = Number(parsed?.contributionsCurrentYear)
    const contributionsSoFar = Number(parsed?.contributionsSoFar)

    if (
      !Number.isFinite(publicRepos)
      || !Number.isFinite(contributionsCurrentYear)
      || !Number.isFinite(contributionsSoFar)
    ) {
      return null
    }

    return {
      publicRepos,
      contributionsCurrentYear,
      contributionsSoFar,
      isFallbackPrevious: true,
    }
  } catch (_error) {
    return null
  }
}

function writeCachedGithubStats(stats) {
  if (typeof window === 'undefined') {
    return
  }

  try {
    window.localStorage.setItem(
      GITHUB_STATS_CACHE_KEY,
      JSON.stringify({
        publicRepos: Number(stats?.publicRepos || 0),
        contributionsCurrentYear: Number(stats?.contributionsCurrentYear || 0),
        contributionsSoFar: Number(stats?.contributionsSoFar || 0),
      })
    )
  } catch (_error) {
    // Ignore storage errors and continue with in-memory values.
  }
}

function parseGithubUsername(value) {
  if (!value) return ''
  const trimmed = String(value).trim()

  if (!trimmed.includes('http')) {
    return trimmed.replace(/^@/, '')
  }

  try {
    const url = new URL(trimmed)
    const parts = url.pathname.split('/').filter(Boolean)
    return (parts[0] || '').replace(/^@/, '')
  } catch (_error) {
    return ''
  }
}

function getCompletedYears(startDateText) {
  const startDate = new Date(startDateText)
  if (Number.isNaN(startDate.getTime())) {
    return '0'
  }

  const now = new Date()
  const startYear = startDate.getFullYear()
  const startMonth = startDate.getMonth()
  const startDay = startDate.getDate()

  const currentYear = now.getFullYear()
  const currentMonth = now.getMonth()
  const currentDay = now.getDate()

  // Calculate complete years
  let years = currentYear - startYear

  // Calculate month and day difference
  let months = currentMonth - startMonth
  let days = currentDay - startDay

  // Adjust if day hasn't occurred yet in current month
  if (days < 0) {
    months -= 1
    days += 30
  }

  // Adjust if month hasn't occurred yet in current year
  if (months < 0) {
    years -= 1
    months += 12
  }

  // Convert months and days to decimal fraction
  const decimalYears = years + (months + days / 30) / 12
  return String(Math.max(0, Math.round(decimalYears * 10) / 10))
}

export default function Hero() {
  const [liveGitHubStats, setLiveGitHubStats] = useState(() => readCachedGithubStats())
  const [fallbackNotice, setFallbackNotice] = useState('')

  const configuredContactEndpoint = import.meta.env.VITE_CONTACT_ENDPOINT || '/api/contact'
  const isNonLocalhostPage =
    typeof window !== 'undefined'
    && window.location.hostname !== 'localhost'
    && window.location.hostname !== '127.0.0.1'
  const usesLocalhostApi =
    configuredContactEndpoint.includes('localhost')
    || configuredContactEndpoint.includes('127.0.0.1')
  // Production builds must never call a localhost API baked in from local .env
  const contactEndpoint =
    isNonLocalhostPage && usesLocalhostApi ? '/api/contact' : configuredContactEndpoint
  const configuredStatsEndpoint = import.meta.env.VITE_GITHUB_STATS_ENDPOINT
  const derivedStatsEndpoint = contactEndpoint.includes('/contact')
    ? contactEndpoint.replace('/contact', '/github-stats')
    : '/api/github-stats'
  const githubStatsEndpoint =
    configuredStatsEndpoint && !(isNonLocalhostPage && (configuredStatsEndpoint.includes('localhost') || configuredStatsEndpoint.includes('127.0.0.1')))
      ? configuredStatsEndpoint
      : derivedStatsEndpoint

  const githubUsername = useMemo(() => parseGithubUsername(personalInfo.social?.github), [])
  const completedYears = useMemo(
    () => getCompletedYears(personalInfo.itCareerStartDate || '2013-12-01'),
    []
  )

  const resolvedBio = useMemo(() => {
    return String(personalInfo.bio || '').replace('{yearsExperience}', String(completedYears))
  }, [completedYears])

  const resolvedStats = useMemo(() => {
    return githubStats.map((stat) => {
      if (stat.label === 'Public Repositories' && liveGitHubStats?.publicRepos != null) {
        const value = liveGitHubStats.isFallbackPrevious
          ? `${liveGitHubStats.publicRepos}*`
          : `${liveGitHubStats.publicRepos}`
        return { ...stat, value }
      }

      if (stat.label === 'Contributions (Current Year)' && liveGitHubStats?.contributionsCurrentYear != null) {
        const value = liveGitHubStats.isFallbackPrevious
          ? `${liveGitHubStats.contributionsCurrentYear}*`
          : `${liveGitHubStats.contributionsCurrentYear}`
        return { ...stat, value }
      }

      if (stat.label === 'Contributions (So Far)' && liveGitHubStats?.contributionsSoFar != null) {
        const value = liveGitHubStats.isFallbackPrevious
          ? `${liveGitHubStats.contributionsSoFar}*`
          : `${liveGitHubStats.contributionsSoFar}`
        return { ...stat, value }
      }

      if (stat.label === 'Years of IT Experience') {
        return { ...stat, value: `${completedYears}` }
      }

      return stat
    })
  }, [completedYears, liveGitHubStats])

  useEffect(() => {
    if (!githubUsername) {
      return
    }

    let isDisposed = false

    const loadStats = async () => {
      const setPreviousFallbackState = () => {
        const cachedStats = readCachedGithubStats()
        if (cachedStats) {
          setLiveGitHubStats(cachedStats)
          setFallbackNotice('Using previous GitHub stats as fallback. Values marked with * are from earlier data.')
        }
      }

      try {
        const endpoint = `${githubStatsEndpoint}?username=${encodeURIComponent(githubUsername)}`
        console.log(`[Hero] Fetching GitHub stats from: ${endpoint}`)
        
        const response = await fetch(endpoint, {
          method: 'GET',
          headers: { Accept: 'application/json' },
        })

        if (!response.ok) {
          console.warn(`[Hero] GitHub stats fetch failed with status: ${response.status}`)
          setPreviousFallbackState()
          return
        }

        const data = await response.json()
        if (!data?.ok) {
          console.warn('[Hero] GitHub stats API returned error:', data?.error)
          setPreviousFallbackState()
          return
        }
        
        if (isDisposed) {
          return
        }

        console.log('[Hero] GitHub stats fetched successfully:', {
          publicRepos: data.publicRepos,
          currentYear: data.contributionsCurrentYear,
          soFar: data.contributionsSoFar,
        })

        const freshStats = {
          publicRepos: Number(data.publicRepos || 0),
          contributionsCurrentYear: Number(data.contributionsCurrentYear || 0),
          contributionsSoFar: Number(data.contributionsSoFar || 0),
          isFallbackPrevious: false,
        }

        setLiveGitHubStats(freshStats)
        writeCachedGithubStats(freshStats)
        setFallbackNotice('')
      } catch (error) {
        console.warn('[Hero] Failed to fetch GitHub stats:', error instanceof Error ? error.message : String(error))
        setPreviousFallbackState()
      }
    }

    loadStats()
    return () => {
      isDisposed = true
    }
  }, [githubStatsEndpoint, githubUsername])

  const currentRole = timeline[0]
  const socials = [
    { icon: FiGithub, href: personalInfo.social.github, label: 'GitHub' },
    { icon: FiLinkedin, href: personalInfo.social.linkedin, label: 'LinkedIn' },
    { icon: FiTwitter, href: personalInfo.social.twitter, label: 'X (Twitter)' },
    { icon: SiMedium, href: personalInfo.social.medium, label: 'Medium' },
    { icon: SiCodementor, href: personalInfo.social.codementor, label: 'CodeMentor' },
    { icon: FiMail, href: `mailto:${personalInfo.email}`, label: 'Email' },
  ]

  const tile = (delay) => ({
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] },
  })

  return (
    <section id="hero" className="relative overflow-hidden px-5 md:px-10 lg:px-16 pt-28 md:pt-36 pb-20 md:pb-28">
      <div aria-hidden="true" className="hero-backdrop absolute inset-0 pointer-events-none" />

      <div className="relative max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Intro */}
        <motion.div {...tile(0)} className="card lg:col-span-8 p-7 md:p-10 flex flex-col justify-between gap-10">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-line bg-subtle px-3 py-1 text-xs font-medium text-fg-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-60 animate-ping" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              Open to full-time roles and contract projects
            </span>

            <h1 className="mt-6 text-5xl sm:text-6xl lg:text-7xl font-semibold text-fg leading-[0.95] tracking-[-0.04em]">
              {personalInfo.name.split(' ')[0]}
              <br />
              <span className="text-fg-3">{personalInfo.name.split(' ').slice(1).join(' ')}</span>
            </h1>

            <p className="mt-6 font-mono text-sm text-accent">
              {currentRole?.role} · .NET · Azure · API-first
            </p>
            <p className="mt-3 max-w-xl text-lg md:text-xl text-fg-2 leading-relaxed">
              {personalInfo.tagline}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-6">
            <div className="flex flex-wrap gap-3">
              <Link to="portfolio" smooth duration={600} offset={-80} href="#portfolio" className="btn-primary">
                View my work <FiArrowRight size={15} />
              </Link>
              <Link to="contact" smooth duration={600} offset={-80} href="#contact" className="btn-ghost">
                Get in touch
              </Link>
            </div>
            <div className="flex items-center gap-1">
              {socials.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith('mailto:') ? undefined : '_blank'}
                  rel="noopener noreferrer"
                  aria-label={label}
                  title={label}
                  className="h-9 w-9 inline-flex items-center justify-center rounded-full text-fg-3 hover:text-fg hover:bg-subtle transition-colors"
                >
                  <Icon size={17} />
                </a>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Photo */}
        <motion.div {...tile(0.08)} className="card relative overflow-hidden lg:col-span-4 lg:row-span-2 min-h-[22rem] group">
          <picture>
            {personalInfo.photo.endsWith('.jpg') && (
              <source srcSet={personalInfo.photo.replace(/\.jpg$/, '.webp')} type="image/webp" />
            )}
            <img
              src={personalInfo.photo}
              alt={`Portrait of ${personalInfo.name}`}
              width="800"
              height="800"
              fetchpriority="high"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover object-[50%_25%] transition-transform duration-700 group-hover:scale-[1.03]"
            />
          </picture>
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-5 text-white">
            <p className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-[0.16em] text-white/70">
              <FiMapPin size={12} /> Based in {personalInfo.location}
            </p>
            <p className="mt-2 text-lg font-semibold leading-tight">
              {currentRole?.role}
              <span className="text-white/70 font-normal"> @ {currentRole?.company}</span>
            </p>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div {...tile(0.16)} className="card lg:col-span-8 grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-line overflow-hidden">
          {resolvedStats.map((stat) => {
            const raw = String(stat.value || '')
            const cached = raw.endsWith('*')
            const value = cached ? raw.slice(0, -1) : raw
            return (
              <div key={stat.label} className="p-5 md:p-6" title={cached ? 'Last known value (live GitHub data unavailable)' : undefined}>
                <p className="text-3xl md:text-4xl font-semibold text-fg tabular-nums tracking-tight">
                  {value}
                  {stat.label.startsWith('Years') && <span className="text-accent">+</span>}
                </p>
                <p className="mt-1.5 text-xs text-fg-3 leading-snug">
                  {stat.label}
                  {cached && <span className="ml-1 text-fg-3/70">· cached</span>}
                </p>
              </div>
            )
          })}
        </motion.div>

        {/* About */}
        <motion.div {...tile(0.24)} className="card lg:col-span-7 p-7 md:p-8">
          <p className="eyebrow">About</p>
          <p className="mt-4 text-fg-2 leading-relaxed">{resolvedBio}</p>
        </motion.div>

        {/* Core stack */}
        <motion.div {...tile(0.3)} className="card lg:col-span-5 p-7 md:p-8 flex flex-col">
          <p className="eyebrow">Core stack</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {coreStack.map((item) => (
              <span key={item} className="chip !text-sm !px-3 !py-1.5">
                {item}
              </span>
            ))}
          </div>
          <Link
            to="skills"
            smooth
            duration={600}
            offset={-80}
            href="#skills"
            className="mt-auto pt-6 inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:gap-2.5 transition-all cursor-pointer"
          >
            Full skill matrix <FiArrowRight size={14} />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
