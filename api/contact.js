import nodemailer from 'nodemailer'

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const clean = (value) => String(value || '').trim()
const cleanSingleLine = (value) => clean(value).replace(/[\r\n]+/g, ' ')

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function renderMailHtml({ name, email, subject, message }) {
  const safeName = escapeHtml(name)
  const safeEmail = escapeHtml(email)
  const safeSubject = escapeHtml(subject)
  const safeMessage = escapeHtml(message)

  return `
  <div style="font-family:Segoe UI,Arial,sans-serif;background:#f8fafc;padding:16px;color:#0f172a">
    <div style="max-width:680px;margin:0 auto;background:#fff;border:1px solid #dbe2ea;border-radius:12px;overflow:hidden">
      <div style="padding:16px 20px;background:linear-gradient(135deg,#dbeafe,#eff6ff);border-bottom:1px solid #dbe2ea">
        <div style="font-weight:800;font-size:28px;line-height:1">NM<span style="color:#2563eb">.</span></div>
        <h2 style="margin:8px 0 0;font-size:22px">New Contact Form Submission</h2>
      </div>
      <div style="padding:18px 20px">
        <p style="margin:0 0 8px"><strong>Name:</strong> ${safeName}</p>
        <p style="margin:0 0 8px"><strong>Email:</strong> ${safeEmail}</p>
        <p style="margin:0 0 8px"><strong>Subject:</strong> ${safeSubject}</p>
        <p style="margin:12px 0 6px"><strong>Message:</strong></p>
        <div style="padding:12px;border:1px solid #dbe2ea;border-radius:8px;background:#f8fafc;white-space:pre-wrap">${safeMessage}</div>
      </div>
    </div>
  </div>`
}

function getClientIp(req) {
  const forwarded = req.headers['x-forwarded-for']
  if (typeof forwarded === 'string' && forwarded.length > 0) {
    return forwarded.split(',')[0].trim()
  }
  return req.socket?.remoteAddress || 'unknown'
}

function checkRateLimit(req) {
  const windowMs = Number(process.env.RATE_LIMIT_WINDOW_MS || 10 * 60 * 1000)
  const max = Number(process.env.RATE_LIMIT_MAX || 10)

  if (!globalThis.__contactRateStore) {
    globalThis.__contactRateStore = new Map()
  }

  const now = Date.now()
  const ip = getClientIp(req)
  const entry = globalThis.__contactRateStore.get(ip)

  if (!entry || now > entry.resetAt) {
    globalThis.__contactRateStore.set(ip, { count: 1, resetAt: now + windowMs })
    return { blocked: false }
  }

  entry.count += 1
  if (entry.count > max) {
    return { blocked: true }
  }

  return { blocked: false }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    res.status(405).json({ ok: false, error: 'Method not allowed.' })
    return
  }

  try {
    const rate = checkRateLimit(req)
    if (rate.blocked) {
      res.status(429).json({ ok: false, error: 'Too many requests. Please try later.' })
      return
    }

    const SMTP_HOST = process.env.SMTP_HOST || 'smtp.gmail.com'
    const SMTP_PORT = Number(process.env.SMTP_PORT || 587)
    const SMTP_SECURE = String(process.env.SMTP_SECURE || 'false').toLowerCase() === 'true'
    const SMTP_USER = process.env.SMTP_USER || ''
    const SMTP_PASS = process.env.SMTP_PASS || ''
    const SMTP_FROM = process.env.SMTP_FROM || SMTP_USER
    const MAIL_TO = process.env.MAIL_TO || SMTP_USER

    if (!SMTP_USER || !SMTP_PASS || !MAIL_TO) {
      res.status(500).json({ ok: false, error: 'Mail server is not configured.' })
      return
    }

    const name = cleanSingleLine(req.body?.name)
    const email = cleanSingleLine(req.body?.email)
    const subject = cleanSingleLine(req.body?.subject)
    const message = clean(req.body?.message)
    const website = clean(req.body?.website)

    const captchaA = Number(req.body?.captchaA)
    const captchaB = Number(req.body?.captchaB)
    const captchaAnswer = Number(req.body?.captchaAnswer)

    if (website) {
      res.status(200).json({ ok: true })
      return
    }

    if (!name || !email || !subject || !message) {
      res.status(400).json({ ok: false, error: 'Missing required fields.' })
      return
    }

    if (name.length > 120 || email.length > 254 || subject.length > 180 || message.length > 5000) {
      res.status(400).json({ ok: false, error: 'Input exceeds allowed limits.' })
      return
    }

    if (!emailRegex.test(email)) {
      res.status(400).json({ ok: false, error: 'Invalid email format.' })
      return
    }

    if (!Number.isFinite(captchaA) || !Number.isFinite(captchaB) || !Number.isFinite(captchaAnswer)) {
      res.status(400).json({ ok: false, error: 'Invalid captcha payload.' })
      return
    }

    if (captchaA + captchaB !== captchaAnswer) {
      res.status(400).json({ ok: false, error: 'Captcha verification failed.' })
      return
    }

    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_SECURE,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    })

    await transporter.sendMail({
      from: SMTP_FROM,
      to: MAIL_TO,
      replyTo: email,
      subject: `[Portfolio] ${subject}`,
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
      html: renderMailHtml({ name, email, subject, message }),
    })

    res.status(200).json({ ok: true })
  } catch (error) {
    console.error('Contact endpoint error:', error)
    res.status(500).json({ ok: false, error: 'Unable to send message right now.' })
  }
}
