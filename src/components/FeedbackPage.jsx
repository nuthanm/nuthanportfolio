import { useEffect, useState } from 'react'
import { FiArrowLeft, FiCheck, FiRefreshCw, FiSend, FiStar } from 'react-icons/fi'
import { personalInfo } from '../data'

// Public feedback form at #/feedback. Submissions are emailed through the
// existing /api/contact endpoint; nothing is published automatically.
// Approved entries are copied into `testimonials` in src/data.js by hand.

const relationships = ['Client', 'Trainee / Student', 'Colleague', 'Mentee', 'Other']
const MAX_OTHER = 60
const MAX_QUOTE = 600

function resolveEndpoints() {
  const configured = import.meta.env.VITE_CONTACT_ENDPOINT || '/api/contact'
  const isRemote =
    typeof window !== 'undefined' &&
    window.location.hostname !== 'localhost' &&
    window.location.hostname !== '127.0.0.1'
  const usesLocal = configured.includes('localhost') || configured.includes('127.0.0.1')
  const contact = isRemote && usesLocal ? '/api/contact' : configured
  const captcha =
    import.meta.env.VITE_CONTACT_CAPTCHA_ENDPOINT ||
    (contact.includes('/contact') ? contact.replace('/contact', '/contact-captcha') : '/api/contact-captcha')
  return { contact, captcha }
}

function Field({ label, hint, error, htmlFor, children }) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={htmlFor} className="text-xs font-medium text-fg-2">
        {label}
        {hint && <span className="ml-1 font-normal text-fg-3">{hint}</span>}
      </label>
      {children}
      {error && <p className="text-xs text-red-600 dark:text-red-400">{error}</p>}
    </div>
  )
}

export default function FeedbackPage() {
  const { contact: endpoint, captcha: captchaEndpoint } = resolveEndpoints()
  const [form, setForm] = useState({
    name: '',
    email: '',
    role: '',
    company: '',
    relationship: '',
    relationshipOther: '',
    rating: 0,
    quote: '',
    linkedin: '',
    website: '',
  })
  const [allowPublish, setAllowPublish] = useState(false)
  const [consent, setConsent] = useState(false)
  const [captcha, setCaptcha] = useState({ challenge: '', token: '', input: '' })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | sending | sent
  const [submitError, setSubmitError] = useState('')

  const loadCaptcha = async () => {
    try {
      const res = await fetch(captchaEndpoint, { headers: { Accept: 'application/json' } })
      const data = await res.json()
      if (!res.ok || !data?.ok) throw new Error()
      setCaptcha({ challenge: String(data.challenge), token: String(data.token), input: '' })
    } catch (_error) {
      setCaptcha({ challenge: 'Unavailable', token: '', input: '' })
    }
  }

  useEffect(() => {
    window.scrollTo(0, 0)
    loadCaptcha()
  }, [])

  const set = (key) => (e) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }))
    setErrors((prev) => ({ ...prev, [key]: '' }))
  }

  const validate = () => {
    const next = {}
    if (!form.name.trim()) next.name = 'Please add your name.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = 'Enter a valid email (kept private).'
    if (!form.relationship) next.relationship = 'How do we know each other?'
    else if (form.relationship === 'Other' && !form.relationshipOther.trim()) next.relationshipOther = 'Tell me how we know each other.'
    if (form.quote.trim().length < 20) next.quote = 'A sentence or two (at least 20 characters) helps.'
    if (form.linkedin && !/^https?:\/\/(www\.)?linkedin\.com\//i.test(form.linkedin)) next.linkedin = 'Use a linkedin.com profile URL.'
    if (!consent) next.consent = 'Please accept the Privacy Policy.'
    if (!captcha.token || !Number.isFinite(Number(captcha.input)) || captcha.input === '') next.captcha = 'Answer the quick check.'
    return next
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitError('')
    const next = validate()
    setErrors(next)
    if (Object.keys(next).length) return

    const relationshipLabel =
      form.relationship === 'Other' ? `Other: ${form.relationshipOther.trim()}` : form.relationship

    const message = [
      `Relationship: ${relationshipLabel}`,
      `Role / title: ${form.role || '-'}`,
      `Company / batch: ${form.company || '-'}`,
      `Rating: ${form.rating ? `${form.rating}/5` : '-'}`,
      `LinkedIn: ${form.linkedin || '-'}`,
      `OK to publish on site: ${allowPublish ? 'YES' : 'NO (private feedback only)'}`,
      '',
      'Feedback:',
      form.quote.trim(),
    ].join('\n')

    setStatus('sending')
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          subject: `Testimonial from ${form.name} (${relationshipLabel})`,
          message,
          website: form.website,
          formType: 'testimonial',
          // Structured copy used for one-click approval (only stored when allowed).
          testimonial: {
            relationship: form.relationship,
            relationshipOther: form.relationshipOther,
            role: form.role,
            company: form.company,
            rating: form.rating || undefined,
            linkedin: form.linkedin,
            quote: form.quote.trim(),
            allowPublish,
          },
          consent: true,
          captchaToken: captcha.token,
          captchaAnswer: Number(captcha.input),
        }),
      })
      const data = await res.json().catch(() => null)
      if (!res.ok || !data?.ok) throw new Error(data?.error || 'Unable to send right now.')
      setStatus('sent')
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Unable to send right now.')
      setStatus('idle')
      loadCaptcha()
    }
  }

  const fieldClass = (key) => `input ${errors[key] ? '!border-red-400' : ''}`

  return (
    <div className="min-h-screen bg-subtle px-5 py-10 md:py-16">
      <div className="mx-auto max-w-2xl">
        <a href="#testimonials" className="inline-flex items-center gap-1.5 text-sm text-fg-3 hover:text-fg transition-colors">
          <FiArrowLeft size={14} /> Back to {personalInfo.name.split(' ')[0]}'s portfolio
        </a>

        <div className="mt-8 flex items-center gap-4">
          <img src={personalInfo.photo} alt="" width="56" height="56" className="h-14 w-14 rounded-full object-cover border border-line" />
          <div>
            <p className="eyebrow">Feedback</p>
            <h1 className="mt-1 text-3xl md:text-4xl font-semibold text-fg">How was working with me?</h1>
          </div>
        </div>
        <p className="mt-4 text-fg-2 leading-relaxed">
          Whether you were a client, attended one of my sessions, or worked alongside me, a few honest lines help a lot.
          I read every response and only publish the ones you allow.
        </p>

        <div className="card mt-8 p-6 md:p-8">
          {status === 'sent' ? (
            <div className="py-10 text-center flex flex-col items-center gap-4">
              <span className="h-14 w-14 rounded-full bg-emerald-500/10 grid place-items-center text-emerald-600 dark:text-emerald-400">
                <FiCheck size={24} />
              </span>
              <h2 className="text-xl font-semibold text-fg">Thank you, {form.name.split(' ')[0]}!</h2>
              <p className="text-sm text-fg-2 max-w-sm">
                Your feedback is with me. {allowPublish ? "If it's featured on the site, I'll let you know first." : 'It will stay private.'}
              </p>
              <a href="#hero" className="btn-ghost mt-2">Back to the portfolio</a>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
              <input type="text" name="website" value={form.website} onChange={set('website')} tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />

              <fieldset>
                <legend className="text-xs font-medium text-fg-2 mb-2">I know Nuthan as a…</legend>
                <div className="flex flex-wrap gap-2">
                  {relationships.map((r) => (
                    <button
                      key={r}
                      type="button"
                      aria-pressed={form.relationship === r}
                      onClick={() => {
                        setForm((p) => ({ ...p, relationship: r }))
                        setErrors((p) => ({ ...p, relationship: '' }))
                      }}
                      className={`px-4 py-2 rounded-full text-sm border transition-colors ${
                        form.relationship === r ? 'bg-fg text-bg border-fg' : 'border-line text-fg-2 hover:text-fg hover:border-fg-3/50'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
                {errors.relationship && <p className="mt-2 text-xs text-red-600 dark:text-red-400">{errors.relationship}</p>}
                {form.relationship === 'Other' && (
                  <div className="mt-3">
                    <label htmlFor="fb-relationship-other" className="sr-only">How do you know Nuthan?</label>
                    <input
                      id="fb-relationship-other"
                      autoFocus
                      maxLength={MAX_OTHER}
                      value={form.relationshipOther}
                      onChange={set('relationshipOther')}
                      className={fieldClass('relationshipOther')}
                      placeholder="e.g. Workshop attendee, Hackathon teammate, Recruiter"
                    />
                    {errors.relationshipOther && (
                      <p className="mt-2 text-xs text-red-600 dark:text-red-400">{errors.relationshipOther}</p>
                    )}
                  </div>
                )}
              </fieldset>

              <div className="grid sm:grid-cols-2 gap-5">
                <Field label="Your name" htmlFor="fb-name" error={errors.name}>
                  <input id="fb-name" autoComplete="name" value={form.name} onChange={set('name')} className={fieldClass('name')} placeholder="Full name" />
                </Field>
                <Field label="Email" hint="(never shown)" htmlFor="fb-email" error={errors.email}>
                  <input id="fb-email" type="email" autoComplete="email" value={form.email} onChange={set('email')} className={fieldClass('email')} placeholder="you@company.com" />
                </Field>
                <Field label="Role / title" hint="(optional)" htmlFor="fb-role">
                  <input id="fb-role" value={form.role} onChange={set('role')} className="input" placeholder="e.g. Engineering Manager" />
                </Field>
                <Field label="Company or batch" hint="(optional)" htmlFor="fb-company">
                  <input id="fb-company" value={form.company} onChange={set('company')} className="input" placeholder="e.g. Acme Corp / .NET Batch 2026" />
                </Field>
              </div>

              <Field label="Overall rating" hint="(optional)" htmlFor="fb-rating">
                <div id="fb-rating" role="radiogroup" aria-label="Rating out of 5" className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      role="radio"
                      aria-checked={form.rating === n}
                      aria-label={`${n} star${n > 1 ? 's' : ''}`}
                      onClick={() => setForm((p) => ({ ...p, rating: p.rating === n ? 0 : n }))}
                      className="p-1 text-amber-500"
                    >
                      <FiStar size={22} className={n <= form.rating ? 'fill-amber-400' : 'text-line'} />
                    </button>
                  ))}
                </div>
              </Field>

              <Field label="Your feedback" htmlFor="fb-quote" error={errors.quote}>
                <textarea
                  id="fb-quote"
                  rows={5}
                  maxLength={MAX_QUOTE}
                  value={form.quote}
                  onChange={set('quote')}
                  className={`${fieldClass('quote')} resize-none`}
                  placeholder="What did we work on, and what difference did it make?"
                />
                <span className="self-end text-[11px] text-fg-3 tabular-nums">{form.quote.length}/{MAX_QUOTE}</span>
              </Field>

              <Field label="LinkedIn profile" hint="(optional, shown as a link next to your name)" htmlFor="fb-linkedin" error={errors.linkedin}>
                <input id="fb-linkedin" type="url" value={form.linkedin} onChange={set('linkedin')} className={fieldClass('linkedin')} placeholder="https://www.linkedin.com/in/…" />
              </Field>

              <div className="rounded-xl border border-line bg-subtle p-4 flex flex-col gap-3">
                <label className="flex items-start gap-2.5 text-sm text-fg-2">
                  <input type="checkbox" checked={allowPublish} onChange={(e) => setAllowPublish(e.target.checked)} className="mt-1 h-4 w-4 accent-[rgb(var(--accent))]" />
                  <span>You may show my name, role and feedback on this website.</span>
                </label>
                <label className="flex items-start gap-2.5 text-sm text-fg-2">
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => {
                      setConsent(e.target.checked)
                      setErrors((p) => ({ ...p, consent: '' }))
                    }}
                    className="mt-1 h-4 w-4 accent-[rgb(var(--accent))]"
                  />
                  <span>
                    I agree to the <a href="#/privacy-policy" className="text-fg underline underline-offset-2">Privacy Policy</a>.
                  </span>
                </label>
                {errors.consent && <p className="text-xs text-red-600 dark:text-red-400">{errors.consent}</p>}
              </div>

              <div className="flex flex-wrap items-end justify-between gap-4">
                <Field label="Quick check" htmlFor="fb-captcha" error={errors.captcha}>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm text-fg bg-subtle border border-line rounded-xl px-3 py-3">{captcha.challenge || '…'} =</span>
                    <input
                      id="fb-captcha"
                      type="number"
                      inputMode="numeric"
                      value={captcha.input}
                      onChange={(e) => {
                        setCaptcha((c) => ({ ...c, input: e.target.value }))
                        setErrors((p) => ({ ...p, captcha: '' }))
                      }}
                      className={`${fieldClass('captcha')} !w-24`}
                      placeholder="?"
                    />
                    <button type="button" onClick={loadCaptcha} aria-label="New captcha question" className="h-11 w-11 grid place-items-center rounded-xl border border-line text-fg-3 hover:text-fg">
                      <FiRefreshCw size={14} />
                    </button>
                  </div>
                </Field>
                <button type="submit" disabled={status === 'sending'} className="btn-primary !px-6 !py-3 disabled:opacity-60">
                  <FiSend size={15} /> {status === 'sending' ? 'Sending…' : 'Send feedback'}
                </button>
              </div>
              {submitError && <p role="alert" className="text-xs text-red-600 dark:text-red-400">{submitError}</p>}
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
