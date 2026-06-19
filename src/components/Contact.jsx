import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { FiDownload, FiSend, FiMail, FiPhone, FiMapPin, FiRefreshCw } from 'react-icons/fi'
import { FaGithub, FaLinkedin, FaMedium } from 'react-icons/fa'
import { SiX, SiCodementor } from 'react-icons/si'
import { personalInfo } from '../data'

function ContactInfo({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-4">
      <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center flex-shrink-0">
        <Icon size={18} className="text-accent" />
      </div>
      <div>
        <p className="text-xs text-muted uppercase tracking-wider mb-0.5">{label}</p>
        <p className="text-text-main font-medium text-sm">{value}</p>
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
  const [captchaA, setCaptchaA] = useState(() => Math.floor(Math.random() * 8) + 2)
  const [captchaB, setCaptchaB] = useState(() => Math.floor(Math.random() * 8) + 2)
  const [captchaInput, setCaptchaInput] = useState('')

  const formsEndpoint = import.meta.env.VITE_CONTACT_ENDPOINT || '/api/contact'

  const regenerateCaptcha = () => {
    setCaptchaA(Math.floor(Math.random() * 8) + 2)
    setCaptchaB(Math.floor(Math.random() * 8) + 2)
    setCaptchaInput('')
  }

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
    if (!captchaInput.trim()) {
      nextErrors.captcha = 'Captcha answer is required.'
    } else {
      const captchaValue = Number(captchaInput)
      if (!Number.isFinite(captchaValue) || captchaValue !== captchaA + captchaB) {
        nextErrors.captcha = 'Captcha verification failed. Please solve again.'
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
      regenerateCaptcha()
      return
    }

    setIsSubmitting(true)

    try {
      if (formsEndpoint) {
        const payload = {
          ...form,
          captchaA,
          captchaB,
          captchaAnswer: Number(captchaInput),
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

  return (
    <section id="contact" className="section-padding section-atmosphere">
      <div className="max-w-6xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-accent text-sm font-semibold uppercase tracking-widest">
            Let's connect
          </span>
          <h2 className="mt-2 text-3xl md:text-4xl font-bold text-text-main">Resume & Contact</h2>
          <p className="mt-3 text-text-secondary max-w-xl mx-auto">
            Download my resume or drop me a message. I'm always open to interesting projects.
          </p>
        </motion.div>

        {/* Resume card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="glass-card p-8 flex flex-col sm:flex-row items-center justify-between gap-6 mb-10 border-accent/10"
        >
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center flex-shrink-0">
              <FiDownload size={24} className="text-accent" />
            </div>
            <div>
              <h3 className="text-text-main font-bold text-lg">My Resume</h3>
              <p className="text-text-secondary text-sm">
                Updated {new Date().getFullYear()}
              </p>
            </div>
          </div>
          <a
            href={personalInfo.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            download
            className="flex items-center gap-2 px-6 py-3 bg-accent hover:bg-accent-light text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-accent/25 hover:-translate-y-0.5 whitespace-nowrap"
          >
            <FiDownload size={16} />
            Download Resume
          </a>
        </motion.div>

        {/* Grid: contact info + form */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Left — contact info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="glass-card p-8 flex flex-col gap-8"
          >
            <div>
              <h3 className="text-text-main font-bold text-xl mb-2">Get in Touch</h3>
              <p className="text-text-secondary text-sm leading-relaxed">
                Have a project in mind or want to collaborate? Fill in the form or reach me directly
                through the details below.
              </p>
            </div>

            <div className="flex flex-col gap-6">
              <ContactInfo icon={FiMail} label="Email" value={personalInfo.email} />
              <ContactInfo icon={FiPhone} label="Phone" value={personalInfo.phone} />
              <ContactInfo icon={FiMapPin} label="Location" value={personalInfo.location} />
            </div>

            <div className="pt-2 border-t border-slate-200">
              <p className="text-xs text-muted uppercase tracking-wider mb-3">Social</p>
              <div className="flex flex-wrap gap-2.5">
                {socialMeta.map(({ key, label, icon: Icon }) => {
                  const href = personalInfo.social?.[key]
                  if (!href) return null

                  return (
                    <a
                      key={key}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-700 hover:border-accent/40 hover:text-accent transition-colors"
                    >
                      <Icon size={14} />
                      <span className="text-xs font-medium">{label}</span>
                    </a>
                  )
                })}
              </div>
            </div>
          </motion.div>

          {/* Right — form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="glass-card p-8"
          >
            {submitted ? (
              <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                <div className="w-16 h-16 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center">
                  <FiSend size={28} className="text-accent" />
                </div>
                <h3 className="text-text-main font-bold text-xl">Message Sent!</h3>
                <p className="text-text-secondary text-sm">
                  Thanks for reaching out. I'll get back to you soon.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="text-accent text-sm hover:underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
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
                    <label className="text-xs text-muted uppercase tracking-wider" htmlFor="name">
                      Name
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Your name"
                      aria-invalid={Boolean(errors.name)}
                      className={`bg-white border rounded-xl px-4 py-3 text-text-main text-sm placeholder:text-muted focus:outline-none transition-colors ${
                        errors.name ? 'border-red-300 focus:border-red-400' : 'border-slate-200 focus:border-accent/60'
                      }`}
                    />
                    {errors.name && <p className="text-xs text-red-600">{errors.name}</p>}
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs text-muted uppercase tracking-wider" htmlFor="email">
                      Email
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="you@email.com"
                      aria-invalid={Boolean(errors.email)}
                      className={`bg-white border rounded-xl px-4 py-3 text-text-main text-sm placeholder:text-muted focus:outline-none transition-colors ${
                        errors.email ? 'border-red-300 focus:border-red-400' : 'border-slate-200 focus:border-accent/60'
                      }`}
                    />
                    {errors.email && <p className="text-xs text-red-600">{errors.email}</p>}
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs text-muted uppercase tracking-wider" htmlFor="subject">
                    Subject
                  </label>
                  <input
                    id="subject"
                    name="subject"
                    type="text"
                    value={form.subject}
                    onChange={handleChange}
                    placeholder="What's this about?"
                    aria-invalid={Boolean(errors.subject)}
                    className={`bg-white border rounded-xl px-4 py-3 text-text-main text-sm placeholder:text-muted focus:outline-none transition-colors ${
                      errors.subject ? 'border-red-300 focus:border-red-400' : 'border-slate-200 focus:border-accent/60'
                    }`}
                  />
                  {errors.subject && <p className="text-xs text-red-600">{errors.subject}</p>}
                </div>
                <div className="flex flex-col gap-2">
                  <label
                    className="text-xs text-muted uppercase tracking-wider"
                    htmlFor="message"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Tell me about your project..."
                    aria-invalid={Boolean(errors.message)}
                    className={`bg-white border rounded-xl px-4 py-3 text-text-main text-sm placeholder:text-muted focus:outline-none transition-colors resize-none ${
                      errors.message ? 'border-red-300 focus:border-red-400' : 'border-slate-200 focus:border-accent/60'
                    }`}
                  />
                  {errors.message && <p className="text-xs text-red-600">{errors.message}</p>}
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <label className="text-xs text-muted uppercase tracking-wider" htmlFor="captcha">
                    Captcha
                  </label>
                  <div className="mt-2 flex items-center gap-3">
                    <div className="text-sm font-semibold text-slate-700 bg-white border border-slate-200 rounded-md px-3 py-2">
                      {captchaA} + {captchaB} = ?
                    </div>
                    <input
                      id="captcha"
                      type="number"
                      inputMode="numeric"
                      value={captchaInput}
                      onChange={(e) => {
                        setCaptchaInput(e.target.value)
                        setErrors((prev) => ({ ...prev, captcha: '' }))
                      }}
                      placeholder="Answer"
                      aria-invalid={Boolean(errors.captcha)}
                      className={`w-28 bg-white border rounded-md px-3 py-2 text-text-main text-sm focus:outline-none transition-colors ${
                        errors.captcha ? 'border-red-300 focus:border-red-400' : 'border-slate-200 focus:border-accent/60'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={regenerateCaptcha}
                      className="inline-flex items-center justify-center w-9 h-9 rounded-md border border-slate-200 bg-white text-slate-600 hover:text-accent hover:border-accent/40 transition-colors"
                      aria-label="Refresh captcha"
                    >
                      <FiRefreshCw size={14} />
                    </button>
                  </div>
                  {errors.captcha && <p className="text-xs text-red-600 mt-2">{errors.captcha}</p>}
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-accent hover:bg-accent-light text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-accent/25 hover:-translate-y-0.5"
                >
                  <FiSend size={16} />
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
                {submitError && <p className="text-xs text-red-600">{submitError}</p>}
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
