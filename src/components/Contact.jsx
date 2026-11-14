import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { FiDownload, FiSend, FiPhone, FiMapPin, FiRefreshCw } from 'react-icons/fi'
import { FaGithub, FaLinkedin, FaMedium } from 'react-icons/fa'
import { SiX, SiCodementor } from 'react-icons/si'
import { personalInfo } from '../data'
import { SectionHeader } from './ui'

function ContactInfo({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 rounded-xl bg-subtle border border-line grid place-items-center flex-shrink-0">
        <Icon size={16} className="text-fg-2" />
      </div>
      <div>
        <p className="text-xs text-fg-3">{label}</p>
        <p className="text-fg font-medium text-sm">{value}</p>
      </div>
    </div>
  )
}
const socialMeta = [
  { key: 'github', label: 'GitHub', icon: FaGithub },
  { key: 'linkedin', label: 'LinkedIn', icon: FaLinkedin },
  { key: 'twitter', label: 'X', icon: SiX },
  { key: 'medium', label: 'Medium', icon: FaMedium },
  { key: 'codementor', label: 'CodeMentor', icon: SiCodementor },
]

export default function Contact() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '', website: '' })
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [errors, setErrors] = useState({})
  const [captchaChallenge, setCaptchaChallenge] = useState('')
  const [captchaToken, setCaptchaToken] = useState('')
  const [captchaInput, setCaptchaInput] = useState('')
  const [consentChecked, setConsentChecked] = useState(false)

  const configuredFormsEndpoint = import.meta.env.VITE_CONTACT_ENDPOINT || '/api/contact'
  const isNonLocalhostPage = typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1'
  const usesLocalhostApi = configuredFormsEndpoint.includes('localhost') || configuredFormsEndpoint.includes('127.0.0.1')
  const formsEndpoint = isNonLocalhostPage && usesLocalhostApi ? '/api/contact' : configuredFormsEndpoint
  const configuredCaptchaEndpoint = import.meta.env.VITE_CONTACT_CAPTCHA_ENDPOINT
  const captchaEndpoint = configuredCaptchaEndpoint
    || (formsEndpoint.includes('/contact')
      ? formsEndpoint.replace('/contact', '/contact-captcha')
      : '/api/contact-captcha')

  const regenerateCaptcha = async () => {
    try {
      const response = await fetch(captchaEndpoint, {
        method: 'GET',
        headers: { Accept: 'application/json' },
      })

      if (!response.ok) {
        throw new Error('Unable to load captcha challenge.')
      }

      const data = await response.json()
      if (!data?.ok || !data?.challenge || !data?.token) {
        throw new Error('Captcha challenge is invalid.')
      }

      setCaptchaChallenge(String(data.challenge))
      setCaptchaToken(String(data.token))
      setCaptchaInput('')
      setErrors((prev) => ({ ...prev, captcha: '' }))
    } catch (_error) {
      setCaptchaChallenge('Unavailable')
      setCaptchaToken('')
      setErrors((prev) => ({
        ...prev,
        captcha: 'Captcha is unavailable right now. Please refresh and try again.',
      }))
    }
  }

  useEffect(() => {
    regenerateCaptcha()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const validateForm = () => {
    const nextErrors = {}

    if (!form.name.trim()) nextErrors.name = 'Name is required.'
    if (!form.email.trim()) {
      nextErrors.email = 'Email is required.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      nextErrors.email = 'Enter a valid email address.'
    }
    if (!form.subject.trim()) nextErrors.subject = 'Subject is required.'
    if (!form.message.trim()) nextErrors.message = 'Message is required.'
    if (!consentChecked) nextErrors.consent = 'Please accept Privacy Policy and Terms.'
    if (!captchaInput.trim()) {
      nextErrors.captcha = 'Captcha answer is required.'
    } else if (!captchaToken) {
      nextErrors.captcha = 'Captcha token is missing. Please refresh captcha.'
    } else {
      const captchaValue = Number(captchaInput)
      if (!Number.isFinite(captchaValue)) {
        nextErrors.captcha = 'Captcha answer must be a number.'
      }
    }

    return nextErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitError('')
    const nextErrors = validateForm()
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      if (nextErrors.captcha) regenerateCaptcha()
      return
    }

    // Honeypot trap for basic bots
    if (form.website.trim()) {
      setSubmitted(true)
      setForm({ name: '', email: '', subject: '', message: '', website: '' })
      setConsentChecked(false)
      regenerateCaptcha()
      return
    }

    setIsSubmitting(true)

    try {
      if (formsEndpoint) {
        const payload = {
          ...form,
          captchaToken,
          captchaAnswer: Number(captchaInput),
          consent: consentChecked,
        }

        const response = await fetch(formsEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify(payload),
        })

        if (!response.ok) {
          let apiError = 'Failed to submit form.'
          const contentType = response.headers.get('content-type') || ''

          if (contentType.includes('application/json')) {
            const data = await response.json().catch(() => null)
            if (data?.error) apiError = data.error
          } else {
            const text = await response.text().catch(() => '')
            if (text) apiError = text.slice(0, 200)
          }

          throw new Error(apiError)
        }
      } else {
        const subject = encodeURIComponent(`[Portfolio] ${form.subject}`)
        const body = encodeURIComponent(
          `Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`
        )
        window.location.href = `mailto:${personalInfo.email}?subject=${subject}&body=${body}`
      }

      setSubmitted(true)
      setForm({ name: '', email: '', subject: '', message: '', website: '' })
      setConsentChecked(false)
      regenerateCaptcha()
    } catch (error) {
      const message =
        error instanceof Error && error.message
          ? error.message
          : 'Unable to send right now. Please email me directly at inbox.nuthan@gmail.com.'
      setSubmitError(message)
      regenerateCaptcha()
    } finally {
      setIsSubmitting(false)
    }
  }

  const fieldClass = (key) =>
    `input ${errors[key] ? '!border-red-400 focus:!ring-red-400/20' : ''}`

  return (
    <section id="contact" className="section-padding scroll-mt-20">
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          index="05"
          eyebrow="Contact"
          title="Let's build something."
          description="Have a role, a project or an architecture problem in mind? Send a message or grab my resume."
        />

        <div ref={ref} className="grid lg:grid-cols-12 gap-4">
          {/* Left — direct contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="lg:col-span-5 flex flex-col gap-4"
          >
            <a
              href={`mailto:${personalInfo.email}`}
              className="card group p-7 hover:border-fg-3/50 transition-colors"
            >
              <p className="eyebrow">Email me directly</p>
              <p className="mt-3 text-xl md:text-2xl font-semibold text-fg break-all group-hover:text-accent transition-colors">
                {personalInfo.email}
              </p>
              <p className="mt-2 text-sm text-fg-3">I usually reply within a couple of days.</p>
            </a>

            <div className="card p-7 flex flex-col gap-5">
              <ContactInfo icon={FiMapPin} label="Location" value={personalInfo.location} />
              {personalInfo.phone && (
                <ContactInfo icon={FiPhone} label="Phone" value={personalInfo.phone} />
              )}
              <div className="pt-5 border-t border-line">
                <p className="eyebrow mb-3">Elsewhere</p>
                <div className="flex flex-wrap gap-2">
                  {socialMeta.map(({ key, label, icon: Icon }) => {
                    const href = personalInfo.social?.[key]
                    if (!href) return null
                    return (
                      <a
                        key={key}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-line bg-bg text-fg-2 hover:text-fg hover:border-fg-3/50 transition-colors"
                      >
                        <Icon size={13} />
                        <span className="text-xs font-medium">{label}</span>
                      </a>
                    )
                  })}
                </div>
              </div>
            </div>

            <div className="card p-7 bg-fg text-bg border-fg flex items-center justify-between gap-4">
              <div>
                <p className="font-semibold">Resume</p>
                <p className="text-sm opacity-60">Word document (.docx)</p>
              </div>
              <a
                href={personalInfo.resumeUrl}
                download
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-bg text-fg text-sm font-semibold hover:opacity-90 transition-opacity whitespace-nowrap"
              >
                <FiDownload size={15} />
                Download
              </a>
            </div>
          </motion.div>

          {/* Right — form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="card lg:col-span-7 p-7 md:p-8"
          >
            {submitted ? (
              <div className="flex flex-col items-center justify-center h-full min-h-[24rem] gap-4 text-center">
                <div className="w-14 h-14 rounded-full bg-emerald-500/10 grid place-items-center">
                  <FiSend size={22} className="text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="text-fg font-semibold text-xl">Message sent</h3>
                <p className="text-fg-2 text-sm">Thanks for reaching out. I'll get back to you soon.</p>
                <button onClick={() => setSubmitted(false)} className="text-accent text-sm hover:underline">
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
                <h3 className="text-lg font-semibold text-fg">Send a message</h3>
                <input
                  type="text"
                  name="website"
                  value={form.website}
                  onChange={handleChange}
                  autoComplete="off"
                  tabIndex={-1}
                  className="hidden"
                  aria-hidden="true"
                />
                <div className="grid sm:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-medium text-fg-2" htmlFor="name">Name</label>
                    <input id="name" name="name" type="text" autoComplete="name" value={form.name} onChange={handleChange}
                      placeholder="Your name" aria-invalid={Boolean(errors.name)} className={fieldClass('name')} />
                    {errors.name && <p className="text-xs text-red-600 dark:text-red-400">{errors.name}</p>}
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-medium text-fg-2" htmlFor="email">Email</label>
                    <input id="email" name="email" type="email" autoComplete="email" value={form.email} onChange={handleChange}
                      placeholder="you@email.com" aria-invalid={Boolean(errors.email)} className={fieldClass('email')} />
                    {errors.email && <p className="text-xs text-red-600 dark:text-red-400">{errors.email}</p>}
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-medium text-fg-2" htmlFor="subject">Subject</label>
                  <input id="subject" name="subject" type="text" value={form.subject} onChange={handleChange}
                    placeholder="What's this about?" aria-invalid={Boolean(errors.subject)} className={fieldClass('subject')} />
                  {errors.subject && <p className="text-xs text-red-600 dark:text-red-400">{errors.subject}</p>}
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-medium text-fg-2" htmlFor="message">Message</label>
                  <textarea id="message" name="message" rows={5} value={form.message} onChange={handleChange}
                    placeholder="Tell me about your project..." aria-invalid={Boolean(errors.message)}
                    className={`${fieldClass('message')} resize-none`} />
                  {errors.message && <p className="text-xs text-red-600 dark:text-red-400">{errors.message}</p>}
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-medium text-fg-2" htmlFor="captcha">Quick check</label>
                    <div className="flex items-center gap-2">
                      <span className="shrink-0 font-mono text-sm text-fg bg-subtle border border-line rounded-xl px-3 py-3">
                        {captchaChallenge || '…'} =
                      </span>
                      <input
                        id="captcha"
                        type="number"
                        inputMode="numeric"
                        value={captchaInput}
                        onChange={(e) => {
                          setCaptchaInput(e.target.value)
                          setErrors((prev) => ({ ...prev, captcha: '' }))
                        }}
                        placeholder="?"
                        aria-invalid={Boolean(errors.captcha)}
                        className={`${fieldClass('captcha')} min-w-0`}
                      />
                      <button
                        type="button"
                        onClick={regenerateCaptcha}
                        className="shrink-0 h-11 w-11 inline-flex items-center justify-center rounded-xl border border-line bg-bg text-fg-3 hover:text-fg transition-colors"
                        aria-label="New captcha question"
                      >
                        <FiRefreshCw size={14} />
                      </button>
                    </div>
                    {errors.captcha && <p className="text-xs text-red-600 dark:text-red-400">{errors.captcha}</p>}
                  </div>

                  <div className="flex flex-col justify-end gap-2">
                    <label className="flex items-start gap-2.5 text-xs text-fg-2 leading-relaxed" htmlFor="consent">
                      <input
                        id="consent"
                        type="checkbox"
                        checked={consentChecked}
                        onChange={(e) => {
                          setConsentChecked(e.target.checked)
                          setErrors((prev) => ({ ...prev, consent: '' }))
                        }}
                        className="mt-0.5 h-4 w-4 rounded accent-[rgb(var(--accent))]"
                      />
                      <span>
                        I agree to the{' '}
                        <a href="#/privacy-policy" className="text-fg underline underline-offset-2 hover:text-accent">Privacy Policy</a>{' '}
                        and{' '}
                        <a href="#/terms-and-conditions" className="text-fg underline underline-offset-2 hover:text-accent">Terms</a>.
                      </span>
                    </label>
                    {errors.consent && <p className="text-xs text-red-600 dark:text-red-400">{errors.consent}</p>}
                  </div>
                </div>

                <button type="submit" disabled={isSubmitting} className="btn-primary self-start !px-6 !py-3 disabled:opacity-60">
                  <FiSend size={15} />
                  {isSubmitting ? 'Sending…' : 'Send message'}
                </button>
                {submitError && <p className="text-xs text-red-600 dark:text-red-400" role="alert">{submitError}</p>}
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
