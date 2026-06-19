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

function formatSubmittedAt() {
  try {
    const formatter = new Intl.DateTimeFormat('en-IN', {
      timeZone: 'Asia/Kolkata',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })

    const parts = formatter.formatToParts(new Date())
    const map = Object.fromEntries(parts.map((part) => [part.type, part.value]))
    return `${map.year}-${map.month}-${map.day} ${map.hour}:${map.minute} IST`
  } catch (_error) {
    return `${new Date().toISOString().slice(0, 16).replace('T', ' ')} UTC`
  }
}

function renderMailHtml({ name, email, subject, message }) {
  const safeName = escapeHtml(name)
  const safeEmail = escapeHtml(email)
  const safeSubject = escapeHtml(subject)
  const safeMessage = escapeHtml(message)
  const submittedAt = escapeHtml(formatSubmittedAt())

  return `
  <div style="margin:0;padding:0;background-color:#f1f5f9;background-image:radial-gradient(circle at 0% 0%, rgba(37,99,235,0.08), transparent 30%),radial-gradient(circle at 100% 100%, rgba(56,189,248,0.08), transparent 30%),linear-gradient(rgba(37,99,235,0.08) 1px, transparent 1px),linear-gradient(90deg, rgba(37,99,235,0.08) 1px, transparent 1px);background-size:auto,auto,28px 28px,28px 28px;font-family:Inter,Segoe UI,Arial,sans-serif;color:#0f172a">
    <div style="width:100%;padding:24px 12px;box-sizing:border-box">
      <div style="max-width:680px;margin:0 auto;background:#fff;border:1px solid #dbe2ea;border-radius:14px;overflow:hidden">
        <div style="background:linear-gradient(135deg,#dbeafe,#eff6ff);border-bottom:1px solid #dbe2ea;padding:18px 22px">
          <table role="presentation" style="width:100%;border-collapse:collapse"><tr>
            <td style="width:110px;vertical-align:middle">
              <div style="width:96px;height:56px;border-radius:12px;display:inline-flex;align-items:center;justify-content:center;border:1px solid #bfdbfe;background:#fff;box-shadow:0 2px 4px rgba(37,99,235,0.08)">
                <span style="font-weight:800;font-size:36px;letter-spacing:-0.3px;color:#0f172a;line-height:1">NM<span style="color:#2563eb">.</span></span>
              </div>
            </td>
            <td style="vertical-align:middle">
              <h1 style="margin:0;font-size:20px;line-height:1.3">New Contact Form Submission</h1>
              <p style="margin:6px 0 0;font-size:13px;color:#475569">Received from your portfolio website contact form.</p>
            </td>
          </tr></table>
        </div>
        <div style="padding:20px 22px">
          <table role="presentation" style="width:100%;border-collapse:collapse;margin-bottom:14px">
            <tr><td style="width:130px;font-size:14px;padding:8px 0;vertical-align:top;border-bottom:1px solid #edf2f7;color:#475569;font-weight:600">Name</td><td style="font-size:14px;padding:8px 0;vertical-align:top;border-bottom:1px solid #edf2f7;color:#0f172a">${safeName}</td></tr>
            <tr><td style="width:130px;font-size:14px;padding:8px 0;vertical-align:top;border-bottom:1px solid #edf2f7;color:#475569;font-weight:600">Email</td><td style="font-size:14px;padding:8px 0;vertical-align:top;border-bottom:1px solid #edf2f7;color:#0f172a"><a href="mailto:${safeEmail}" style="color:#2563eb;text-decoration:none">${safeEmail}</a></td></tr>
            <tr><td style="width:130px;font-size:14px;padding:8px 0;vertical-align:top;border-bottom:1px solid #edf2f7;color:#475569;font-weight:600">Subject</td><td style="font-size:14px;padding:8px 0;vertical-align:top;border-bottom:1px solid #edf2f7;color:#0f172a">${safeSubject}</td></tr>
            <tr><td style="width:130px;font-size:14px;padding:8px 0;vertical-align:top;border-bottom:1px solid #edf2f7;color:#475569;font-weight:600">Submitted</td><td style="font-size:14px;padding:8px 0;vertical-align:top;border-bottom:1px solid #edf2f7;color:#0f172a">${submittedAt}</td></tr>
          </table>
          <div style="margin-top:14px;padding:14px;border:1px solid #dbe2ea;border-radius:10px;background:#f8fafc;font-size:14px;line-height:1.6;color:#1e293b;white-space:pre-wrap">${safeMessage}</div>
        </div>
        <div style="border-top:1px solid #dbe2ea;background:#f8fafc;padding:14px 22px 18px">
          <p style="margin:3px 0;font-size:12px;color:#64748b"><strong>Nuthan Murarysetty</strong> | Application Architect</p>
          <p style="margin:3px 0;font-size:12px;color:#64748b">Email: <a href="mailto:inbox.nuthan@gmail.com" style="color:#2563eb;text-decoration:none">inbox.nuthan@gmail.com</a> | Location: India</p>
          <p style="margin:3px 0;font-size:12px;color:#64748b">Social Profiles</p>
          <p style="margin:8px 0 0;font-size:12px;color:#64748b">
            <a href="https://github.com/nuthanm" style="color:#2563eb;text-decoration:none">GitHub</a> |
            <a href="https://www.linkedin.com/in/nuthanm/?skipRedirect=true" style="color:#2563eb;text-decoration:none">LinkedIn</a> |
            <a href="https://x.com/nuthanmurari" style="color:#2563eb;text-decoration:none">X</a> |
            <a href="https://nuthanmurarysetty.medium.com/" style="color:#2563eb;text-decoration:none">Medium</a> |
            <a href="https://www.codementor.io/@inboxnuthan" style="color:#2563eb;text-decoration:none">CodeMentor</a>
          </p>
        </div>
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
