// Shared testimonial approval logic, used by the Vercel functions in /api and
// by the local Express server (server/index.js). Files under api/_lib are not
// deployed as their own endpoints because the folder name starts with "_".
//
// Flow:
//   1. The feedback form posts to /api/contact with formType "testimonial".
//      If the person allowed publishing, the submission is stored as pending
//      and the notification email gets "Approve & publish" / "Reject" buttons.
//   2. Each button opens /#/review?t=<signed token> on the site. That page
//      shows the quote and only acts when you press a button there (email
//      scanners that pre-open links can't publish anything).
//   3. Approved quotes are served by GET /api/testimonials and shown on the
//      landing page next to the ones in src/data.js.
//
// Environment:
//   TESTIMONIAL_REVIEW_SECRET   long random string that signs review links (required)
//   KV_REST_API_URL / KV_REST_API_TOKEN               (Vercel's Upstash integration)
//   or UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN
//   TESTIMONIAL_STORE=memory    local testing only: keep data in process memory
//   SITE_URL                    optional, base URL used in email links
//   SMTP_* / MAIL_TO            same mail settings as the contact form (for replies)
//
// Privacy: the submitter's email is kept only while a testimonial is pending,
// so a reply can be sent after you decide. It is never returned to the browser
// and is dropped when the testimonial is approved or rejected.

import crypto from 'crypto'
import nodemailer from 'nodemailer'

const PENDING_PREFIX = 'testimonial:pending:'
const PUBLISHED_KEY = 'testimonials:published'
const REVIEW_TTL_SECONDS = 30 * 24 * 60 * 60

const RELATIONSHIPS = ['Client', 'Trainee / Student', 'Colleague', 'Mentee']
const LIMITS = { name: 120, role: 120, company: 120, relationship: 80, quote: 600, linkedin: 200 }

const clean = (value) => String(value ?? '').trim()
const oneLine = (value) => clean(value).replace(/[\r\n]+/g, ' ')

// ─── Storage ────────────────────────────────────────────────────────────────

function restConfig() {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || ''
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || ''
  return url && token ? { url: url.replace(/\/+$/, ''), token } : null
}

function useMemoryStore() {
  return process.env.TESTIMONIAL_STORE === 'memory'
}

function memoryStore() {
  if (!globalThis.__testimonialMemoryStore) {
    globalThis.__testimonialMemoryStore = { kv: new Map(), hash: new Map() }
  }
  return globalThis.__testimonialMemoryStore
}

// Runs one Redis command, e.g. ['SET', key, value, 'EX', 60].
async function redis(command) {
  if (useMemoryStore()) {
    const store = memoryStore()
    const [op, key, ...args] = command
    switch (op) {
      case 'SET': store.kv.set(key, args[0]); return 'OK'
      case 'GET': return store.kv.get(key) ?? null
      case 'DEL': return store.kv.delete(key) ? 1 : 0
      case 'HSET': store.hash.set(args[0], args[1]); return 1
      case 'HGET': return store.hash.get(args[0]) ?? null
      case 'HDEL': return store.hash.delete(args[0]) ? 1 : 0
      case 'HVALS': return [...store.hash.values()]
      default: throw new Error(`Unsupported memory command ${op}`)
    }
  }

  const config = restConfig()
  if (!config) throw new Error('Testimonial storage is not configured.')
  const response = await fetch(config.url, {
    method: 'POST',
    headers: { Authorization: `Bearer ${config.token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(command),
  })
  const data = await response.json().catch(() => null)
  if (!response.ok || !data || data.error) {
    throw new Error(`Storage error: ${data?.error || response.status}`)
  }
  return data.result
}

export function isApprovalConfigured() {
  return Boolean(reviewSecret()) && (useMemoryStore() || Boolean(restConfig()))
}

// ─── Signed review tokens ───────────────────────────────────────────────────

function reviewSecret() {
  const secret = process.env.TESTIMONIAL_REVIEW_SECRET || ''
  return secret.length >= 32 ? secret : ''
}

function sign(payload) {
  return crypto.createHmac('sha256', reviewSecret()).update(payload).digest('base64url')
}

export function createReviewToken(id, ttlSeconds = REVIEW_TTL_SECONDS) {
  const expiresAt = Math.floor(Date.now() / 1000) + ttlSeconds
  const payload = `${id}.${expiresAt}`
  return `${payload}.${sign(payload)}`
}

export function verifyReviewToken(token) {
  if (!reviewSecret()) return null
  const parts = oneLine(token).split('.')
  if (parts.length !== 3) return null
  const [id, expiresAt, signature] = parts
  if (!/^[a-f0-9]{16,64}$/.test(id) || !/^\d+$/.test(expiresAt)) return null
  const expected = sign(`${id}.${expiresAt}`)
  const a = Buffer.from(signature)
  const b = Buffer.from(expected)
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null
  if (Number(expiresAt) < Math.floor(Date.now() / 1000)) return { id, expired: true }
  return { id, expired: false }
}

// ─── Validation ─────────────────────────────────────────────────────────────

// Turns the form's testimonial fields into a safe record, or returns null.
export function normalizeTestimonial(input, name) {
  if (!input || typeof input !== 'object') return null
  const relationship = oneLine(input.relationship)
  const relationshipOther = oneLine(input.relationshipOther)
  const label = relationship === 'Other' ? (relationshipOther ? `Other: ${relationshipOther}` : '') : relationship
  if (!label || (relationship !== 'Other' && !RELATIONSHIPS.includes(relationship))) return null

  const linkedinRaw = oneLine(input.linkedin)
  const linkedin = /^https:\/\/([a-z]{2,3}\.)?(www\.)?linkedin\.com\/[\w\-./%?=&#]+$/i.test(linkedinRaw) ? linkedinRaw : ''
  const rating = Number(input.rating)

  const record = {
    name: oneLine(name),
    role: oneLine(input.role),
    company: oneLine(input.company),
    relationship: label,
    rating: Number.isInteger(rating) && rating >= 1 && rating <= 5 ? rating : undefined,
    linkedin: linkedin || undefined,
    quote: clean(input.quote).replace(/\r\n/g, '\n'),
  }

  if (!record.name || record.quote.length < 20) return null
  for (const [key, max] of Object.entries(LIMITS)) {
    if (record[key] && String(record[key]).length > max) return null
  }
  return record
}

// Older copies of the feedback page (a tab left open across a deploy) send
// only the text message, without the structured `testimonial` object. Rebuild
// it from that text so those submissions still get approve/reject buttons.
export function testimonialFromMessage(message) {
  const text = clean(message).replace(/\r\n/g, '\n')
  const field = (label) => {
    const match = text.match(new RegExp(`^${label}:[ \\t]*(.*)$`, 'mi'))
    const value = match ? oneLine(match[1]) : ''
    return value === '-' ? '' : value
  }
  const feedbackAt = text.search(/^Feedback:[ \t]*$/m)
  if (feedbackAt < 0) return null

  const relationship = field('Relationship')
  const other = relationship.match(/^Other:\s*(.*)$/i)
  const rating = field('Rating').match(/^([1-5])\/5$/)
  return {
    relationship: other ? 'Other' : relationship,
    relationshipOther: other ? other[1] : '',
    role: field('Role / title'),
    company: field('Company / batch'),
    rating: rating ? Number(rating[1]) : undefined,
    linkedin: field('LinkedIn'),
    quote: text.slice(feedbackAt).replace(/^Feedback:[ \t]*\n?/, '').trim(),
    allowPublish: /^YES\b/.test(field('OK to publish on site')),
  }
}

// The structured testimonial from a request body, falling back to the message text.
export function testimonialFromRequest(body) {
  const structured = body?.testimonial
  if (structured && typeof structured === 'object') return structured
  return testimonialFromMessage(body?.message)
}

// Public fields only: never expose the submitter's email.
function toPublic(record) {
  const { id, name, role, company, relationship, rating, linkedin, quote, approvedAt } = record
  return { id, name, role, company, relationship, rating, linkedin, quote, approvedAt }
}

// ─── Replies to the person who submitted ────────────────────────────────────
// Default messages sent after you approve or reject. Edit the wording here.
// {firstName} and {siteUrl} are filled in automatically.
export const REPLY_TEMPLATES = {
  approve: {
    subject: 'Thank you, your feedback is now on my portfolio',
    text: [
      'Hi {firstName},',
      '',
      'Thank you for taking the time to share your feedback. It means a lot. I have added it to the "What people say" section of my portfolio:',
      '{siteUrl}/#testimonials',
      '',
      'If you would like anything changed or removed, just reply to this email.',
      '',
      'Warm regards,',
      'Nuthan Murarysetty',
    ].join('\n'),
  },
  reject: {
    subject: 'Thank you for your feedback',
    text: [
      'Hi {firstName},',
      '',
      'Thank you for taking the time to share your feedback. I read every word and really appreciate it. I have decided to keep it private rather than publish it on the website, but it is genuinely helpful to me.',
      '',
      'Warm regards,',
      'Nuthan Murarysetty',
    ].join('\n'),
  },
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function firstNameOf(record) {
  return oneLine(record.name).split(/\s+/)[0] || ''
}

function buildReply(action, record) {
  const template = REPLY_TEMPLATES[action]
  if (!template) return null
  const firstName = firstNameOf(record) || 'there'
  const siteUrl = oneLine(record.siteUrl || 'https://nuthanportfolio.vercel.app').replace(/\/+$/, '')
  const fill = (text) => text.replace(/\{firstName\}/g, firstName).replace(/\{siteUrl\}/g, siteUrl)
  return { subject: fill(template.subject), text: fill(template.text) }
}

function renderReplyHtml(text) {
  const body = escapeHtml(text)
    .split('\n')
    .map((line) => (/^https?:\/\//.test(line) ? `<a href="${line}" style="color:#2563eb">${line}</a>` : line))
    .join('<br>')
  return `<div style="font-family:Inter,Segoe UI,Arial,sans-serif;font-size:15px;line-height:1.6;color:#0f172a;max-width:560px">${body}</div>`
}

function getMailer() {
  if (process.env.MAIL_TRANSPORT === 'json') return nodemailer.createTransport({ jsonTransport: true })
  const user = process.env.SMTP_USER || ''
  const pass = process.env.SMTP_PASS || ''
  if (!user || !pass) return null
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT || 587),
    secure: String(process.env.SMTP_SECURE || 'false').toLowerCase() === 'true',
    auth: { user, pass },
  })
}

// Sends the default reply. Returns true if the mail server accepted it.
async function sendReply(action, record) {
  const reply = buildReply(action, record)
  const mailer = getMailer()
  if (!reply || !mailer || !record.email) return false
  const info = await mailer.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: record.email,
    replyTo: process.env.MAIL_TO || process.env.SMTP_USER,
    subject: reply.subject,
    text: reply.text,
    html: renderReplyHtml(reply.text),
  })
  if (process.env.MAIL_TRANSPORT === 'json') console.log('[reply]', info.message)
  return true
}

// What the review page shows about the reply (never the email address itself).
function replyInfo(record) {
  return {
    available: Boolean(record.email) && Boolean(getMailer()),
    firstName: firstNameOf(record),
    approve: buildReply('approve', record),
    reject: buildReply('reject', record),
  }
}

function withoutEmail(record) {
  const { email: _email, ...rest } = record
  return rest
}

// ─── Operations ─────────────────────────────────────────────────────────────

// Stores a testimonial awaiting review and returns links for the email.
export async function createPendingTestimonial(record, siteUrl, email) {
  if (!isApprovalConfigured()) return null
  const id = crypto.randomBytes(12).toString('hex')
  const address = oneLine(email)
  const replyTo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address) && address.length <= 254 ? address : undefined
  const stored = { ...record, id, email: replyTo, siteUrl, submittedAt: new Date().toISOString() }
  await redis(['SET', `${PENDING_PREFIX}${id}`, JSON.stringify(stored), 'EX', String(REVIEW_TTL_SECONDS)])
  const token = createReviewToken(id)
  const base = `${siteUrl.replace(/\/+$/, '')}/#/review?t=${encodeURIComponent(token)}`
  return { id, approveUrl: base, rejectUrl: `${base}&intent=reject` }
}

export function resolveSiteUrl(req) {
  const configured = oneLine(process.env.SITE_URL)
  if (configured) return configured
  const origin = oneLine(req.headers?.origin)
  if (/^https?:\/\/[\w.-]+(:\d+)?$/.test(origin)) return origin
  return 'https://nuthanportfolio.vercel.app'
}

async function readPending(id) {
  const raw = await redis(['GET', `${PENDING_PREFIX}${id}`])
  return raw ? JSON.parse(raw) : null
}

async function readPublished(id) {
  const raw = await redis(['HGET', PUBLISHED_KEY, id])
  return raw ? JSON.parse(raw) : null
}

export async function listPublished() {
  if (!useMemoryStore() && !restConfig()) return []
  const values = (await redis(['HVALS', PUBLISHED_KEY])) || []
  return values
    .map((raw) => {
      try {
        return toPublic(JSON.parse(raw))
      } catch (_error) {
        return null
      }
    })
    .filter(Boolean)
    .sort((a, b) => String(b.approvedAt).localeCompare(String(a.approvedAt)))
}

// ─── HTTP handlers (work with both Vercel and Express req/res) ──────────────

function send(res, status, body, cache = 'no-store') {
  res.setHeader('Cache-Control', cache)
  res.status(status).json(body)
}

// GET /api/testimonials → approved testimonials for the landing page.
export async function handleList(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    send(res, 405, { ok: false, error: 'Method not allowed.' })
    return
  }
  try {
    const items = await listPublished()
    // Shared CDN cache for a minute, so new approvals show up quickly.
    send(res, 200, { ok: true, items }, 'public, s-maxage=60, stale-while-revalidate=300')
  } catch (error) {
    console.error('Testimonials list error:', error)
    send(res, 200, { ok: true, items: [] }, 'public, s-maxage=30')
  }
}

// GET  /api/testimonial-review?t=TOKEN          → what the review page shows
// POST /api/testimonial-review {token, action}  → approve | reject | unpublish
export async function handleReview(req, res) {
  try {
    if (!isApprovalConfigured()) {
      send(res, 503, { ok: false, error: 'Testimonial approval is not configured on the server.' })
      return
    }

    const token = req.method === 'GET' ? req.query?.t : req.body?.token
    const verified = verifyReviewToken(token)
    if (!verified) {
      send(res, 401, { ok: false, error: 'This review link is invalid.' })
      return
    }
    if (verified.expired) {
      send(res, 410, { ok: false, error: 'This review link has expired.' })
      return
    }
    const { id } = verified

    if (req.method === 'GET') {
      const pending = await readPending(id)
      if (pending) {
        send(res, 200, { ok: true, status: 'pending', testimonial: toPublic(pending), reply: replyInfo(pending) })
        return
      }
      const published = await readPublished(id)
      if (published) {
        send(res, 200, { ok: true, status: 'published', testimonial: toPublic(published) })
        return
      }
      send(res, 200, { ok: true, status: 'gone' })
      return
    }

    if (req.method !== 'POST') {
      res.setHeader('Allow', 'GET, POST')
      send(res, 405, { ok: false, error: 'Method not allowed.' })
      return
    }

    const action = oneLine(req.body?.action)
    const notify = req.body?.notify !== false
    const notifySafely = async (kind, record) => {
      if (!notify) return false
      try {
        return await sendReply(kind, record)
      } catch (error) {
        console.error('Could not send testimonial reply:', error)
        return false
      }
    }

    if (action === 'approve') {
      const pending = await readPending(id)
      if (!pending) {
        const already = await readPublished(id)
        send(res, already ? 200 : 404, already
          ? { ok: true, status: 'published', testimonial: toPublic(already) }
          : { ok: false, error: 'This testimonial was already handled or has expired.' })
        return
      }
      // The email address is not kept once the testimonial is published.
      const approved = { ...withoutEmail(pending), approvedAt: new Date().toISOString() }
      await redis(['HSET', PUBLISHED_KEY, id, JSON.stringify(approved)])
      await redis(['DEL', `${PENDING_PREFIX}${id}`])
      const replied = await notifySafely('approve', pending)
      send(res, 200, { ok: true, status: 'published', testimonial: toPublic(approved), replied })
      return
    }

    if (action === 'reject') {
      const pending = await readPending(id)
      await redis(['DEL', `${PENDING_PREFIX}${id}`])
      const replied = pending ? await notifySafely('reject', pending) : false
      send(res, 200, { ok: true, status: 'rejected', replied })
      return
    }

    if (action === 'unpublish') {
      await redis(['HDEL', PUBLISHED_KEY, id])
      send(res, 200, { ok: true, status: 'unpublished' })
      return
    }

    send(res, 400, { ok: false, error: 'Unknown action.' })
  } catch (error) {
    console.error('Testimonial review error:', error)
    send(res, 500, { ok: false, error: 'Something went wrong. Please try again.' })
  }
}

// HTML block appended to the notification email.
export function renderReviewButtons(links, escapeHtml) {
  if (!links) return ''
  const approve = escapeHtml(links.approveUrl)
  const reject = escapeHtml(links.rejectUrl)
  return `
          <div style="margin-top:18px;padding:16px;border:1px solid #dbe2ea;border-radius:10px;background:#fff">
            <p style="margin:0 0 12px;font-size:13px;color:#475569">They allowed publishing. Review it, then:</p>
            <a href="${approve}" style="display:inline-block;padding:10px 18px;border-radius:999px;background:#0a0e1a;color:#ffffff;font-size:14px;font-weight:600;text-decoration:none">&#10003; Approve &amp; publish</a>
            <a href="${reject}" style="display:inline-block;margin-left:8px;padding:10px 18px;border-radius:999px;border:1px solid #dbe2ea;color:#0f172a;font-size:14px;font-weight:600;text-decoration:none">Reject</a>
            <p style="margin:12px 0 0;font-size:12px;color:#64748b">Each button opens a confirmation page on your site. Links expire in 30 days.</p>
          </div>`
}
