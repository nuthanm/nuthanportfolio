import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import { FiArrowRight, FiLinkedin, FiStar } from 'react-icons/fi'
import { testimonials as curatedTestimonials } from '../data'
import { apiEndpoint } from '../apiBase'
import { sampleTestimonials } from '../sampleTestimonials'
import { Reveal, SectionHeader } from './ui'

// Local preview only: open the dev server with ?samples (all placeholder quotes)
// or ?samples=3 (first three) to see the layout with different amounts of data.
const sampleParam =
  import.meta.env.DEV && typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('samples') : null
const usingSamples = sampleParam !== null
const baseTestimonials = usingSamples
  ? sampleTestimonials.slice(0, Number(sampleParam) || undefined)
  : curatedTestimonials

// Auto-scroll settings for the testimonial row (only moves when cards overflow).
const SCROLL_DIRECTION = 'right' // 'right' = cards travel left → right, 'left' = right → left
const SCROLL_SPEED_PX_PER_SEC = 35

const relationshipTone = {
  Client: 'bg-accent/10 text-accent',
  'Trainee / Student': 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400',
  Colleague: 'bg-violet-500/10 text-violet-700 dark:text-violet-400',
  Mentee: 'bg-amber-500/10 text-amber-700 dark:text-amber-400',
}

function initialsOf(name) {
  return name.split(/\s+/).map((w) => w[0]).join('').slice(0, 2).toUpperCase()
}

function Stars({ rating }) {
  if (!rating) return null
  return (
    <div className="flex gap-0.5" aria-label={`Rated ${rating} out of 5`}>
      {Array.from({ length: 5 }, (_, i) => (
        <FiStar key={i} size={14} className={i < rating ? 'text-amber-400 fill-amber-400' : 'text-line'} />
      ))}
    </div>
  )
}

export function Person({ t, large }) {
  return (
    <figcaption className="flex items-center gap-3">
      <span className={`shrink-0 rounded-full bg-subtle border border-line grid place-items-center font-semibold text-fg-2 ${large ? 'h-12 w-12' : 'h-10 w-10 text-sm'}`}>
        {initialsOf(t.name)}
      </span>
      <span className="min-w-0">
        <span className="flex items-center gap-1.5 font-semibold text-fg">
          {t.name}
          {t.linkedin && (
            <a href={t.linkedin} target="_blank" rel="noopener noreferrer" aria-label={`${t.name} on LinkedIn`} className="text-fg-3 hover:text-accent">
              <FiLinkedin size={13} />
            </a>
          )}
        </span>
        <span className="block text-sm text-fg-3 truncate">
          {[t.role, t.company].filter(Boolean).join(' · ')}
        </span>
      </span>
    </figcaption>
  )
}

export function Meta({ t }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className={`whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium ${relationshipTone[t.relationship] ?? 'bg-subtle text-fg-2'}`}>
        {t.relationship}
      </span>
      <div className="flex items-center gap-2">
        {t.sample && (
          <span className="rounded border border-dashed border-fg-3/50 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-fg-3">
            Sample
          </span>
        )}
        <Stars rating={t.rating} />
      </div>
    </div>
  )
}

function QuoteCard({ t, hidden = false }) {
  return (
    <figure
      className="card w-[19rem] sm:w-[22rem] shrink-0 p-6 flex flex-col gap-5"
      aria-hidden={hidden || undefined}
      {...(hidden ? { inert: '' } : {})}
    >
      <Meta t={t} />
      <blockquote className="text-fg-2 leading-relaxed">&ldquo;{t.quote}&rdquo;</blockquote>
      <div className="mt-auto">
        <Person t={t} />
      </div>
    </figure>
  )
}

// A row of quote cards. If they fit the available width they sit still;
// if they overflow, the row scrolls continuously (pausing on hover/focus).
// Re-measures on resize, so it switches mode as the screen width changes.
function AutoScrollRow({ items }) {
  const viewportRef = useRef(null)
  const setRef = useRef(null)
  const [setWidth, setSetWidth] = useState(0)
  const [overflowing, setOverflowing] = useState(false)
  const [paused, setPaused] = useState(false)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    const viewport = viewportRef.current
    const set = setRef.current
    if (!viewport || !set) return undefined
    const measure = () => {
      // The set carries one trailing gap (pr-4 = 16px) used for the seamless loop.
      const contentWidth = set.scrollWidth - 16
      setSetWidth(set.scrollWidth)
      setOverflowing(contentWidth > viewport.clientWidth + 1)
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(viewport)
    observer.observe(set)
    return () => observer.disconnect()
  }, [items])

  const animate = overflowing && !reduceMotion
  const duration = Math.max(20, setWidth / SCROLL_SPEED_PX_PER_SEC)

  return (
    <div
      ref={viewportRef}
      className={`relative ${
        animate
          ? 'overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]'
          : overflowing
            ? 'overflow-x-auto snap-x snap-mandatory pb-2'
            : ''
      }`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div
        className="flex w-max"
        style={
          animate
            ? {
                animation: `marquee-${SCROLL_DIRECTION} ${duration}s linear infinite`,
                animationPlayState: paused ? 'paused' : 'running',
              }
            : undefined
        }
      >
        <div ref={setRef} className="flex gap-4 pr-4">
          {items.map((t) => (
            <div key={t.id} className={`flex ${overflowing && !animate ? 'snap-start' : ''}`}>
              <QuoteCard t={t} />
            </div>
          ))}
        </div>
        {animate && (
          <div className="flex gap-4 pr-4" aria-hidden="true">
            {items.map((t) => (
              <QuoteCard key={`dup-${t.id}`} t={t} hidden />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// Shown while there are no published testimonials yet.
function EmptyState() {
  return (
    <section id="testimonials" className="section-padding scroll-mt-20">
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          index="04"
          eyebrow="Kind words"
          title="Worked with me?"
          description="Clients, trainees and colleagues: your feedback helps others know what working together is like."
        />
        <Reveal className="card bg-fg text-bg border-fg p-7 md:p-10 grid md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-8">
            <p className="text-2xl md:text-3xl font-semibold leading-tight tracking-tight">
              Attended a session or shipped a project together? I'd love to hear how it went.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {Object.keys(relationshipTone).map((r) => (
                <span key={r} className="rounded-full border border-bg/20 px-3 py-1 text-xs opacity-80">
                  {r}
                </span>
              ))}
            </div>
          </div>
          <div className="md:col-span-4 flex flex-col md:items-end gap-3">
            <a
              href="#/feedback"
              className="inline-flex w-fit items-center gap-2 px-5 py-3 rounded-full bg-bg text-fg text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              Share feedback <FiArrowRight size={14} />
            </a>
            <p className="text-xs opacity-60 md:text-right">Takes about 2 minutes. Published only with your permission.</p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

// Quotes approved from email (served by /api/testimonials) are added after
// the ones curated in src/data.js.
function useApprovedTestimonials() {
  const [approved, setApproved] = useState([])
  useEffect(() => {
    if (usingSamples) return undefined
    let cancelled = false
    fetch(apiEndpoint('testimonials'), { headers: { Accept: 'application/json' } })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!cancelled && Array.isArray(data?.items)) setApproved(data.items)
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [])
  return approved
}

export default function Testimonials() {
  const approved = useApprovedTestimonials()
  const testimonials = [
    ...baseTestimonials,
    ...approved.filter((a) => !baseTestimonials.some((t) => String(t.id) === String(a.id))),
  ]
  if (!testimonials.length) return <EmptyState />

  const featured = testimonials.find((t) => t.featured) ?? testimonials[0]
  const rest = testimonials.filter((t) => t !== featured)

  return (
    <section id="testimonials" className="section-padding scroll-mt-20">
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          index="04"
          eyebrow="Kind words"
          title="What people say."
          description="Feedback from clients, trainees and colleagues I've worked with."
        >
          <a href="#/feedback" className="btn-ghost shrink-0">
            Leave feedback <FiArrowRight size={14} />
          </a>
        </SectionHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Featured quote */}
          <Reveal as="figure" className="card lg:col-span-2 p-7 md:p-10 flex flex-col gap-8 relative overflow-hidden">
            <span aria-hidden="true" className="absolute -bottom-20 right-6 text-[12rem] leading-none font-serif text-accent/10 select-none">
              &rdquo;
            </span>
            <Meta t={featured} />
            <blockquote className="relative text-xl md:text-2xl lg:text-[1.7rem] font-medium text-fg leading-snug tracking-tight">
              &ldquo;{featured.quote}&rdquo;
            </blockquote>
            <div className="mt-auto">
              <Person t={featured} large />
            </div>
          </Reveal>

          {/* Call to action */}
          <Reveal delay={0.1} className="card p-6 md:p-8 flex flex-col justify-between gap-6 bg-fg text-bg border-fg">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.18em] opacity-60">Worked with me?</p>
              <p className="mt-3 text-xl font-semibold leading-snug">
                Attended a session or shipped a project together? I'd love to hear how it went.
              </p>
            </div>
            <a href="#/feedback" className="inline-flex w-fit items-center gap-2 px-4 py-2 rounded-full bg-bg text-fg text-sm font-semibold hover:opacity-90 transition-opacity">
              Share feedback <FiArrowRight size={14} />
            </a>
          </Reveal>
        </div>

        {rest.length > 0 && (
          <Reveal delay={0.15} className="mt-4">
            <AutoScrollRow items={rest} />
          </Reveal>
        )}
      </div>
    </section>
  )
}
