import crypto from 'crypto'

const clean = (value) => String(value || '').trim()
const cleanSingleLine = (value) => clean(value).replace(/[\r\n]+/g, ' ')
const ORIGIN_LIST = (process.env.FRONTEND_ORIGIN || '')
  .split(',')
  .map((x) => x.trim())
  .filter(Boolean)

function getCaptchaSecret() {
  return process.env.CONTACT_CAPTCHA_SECRET || `${process.env.SMTP_USER || ''}:${process.env.SMTP_PASS || ''}`
}

function signCaptchaPayload(payload) {
  return crypto.createHmac('sha256', getCaptchaSecret()).update(payload).digest('hex')
}

function toOrigin(value) {
  const text = cleanSingleLine(value)
  if (!text) {
    return ''
  }

  try {
    return new URL(text).origin
  } catch (_error) {
    return ''
  }
}

function getRequestOrigin(req) {
  const host = cleanSingleLine(req.headers['x-forwarded-host'] || req.headers.host)
  if (!host) {
    return ''
  }

  const proto = cleanSingleLine(req.headers['x-forwarded-proto'] || 'https')
  return `${proto}://${host}`
}

function getAllowedOrigins(req) {
  const allowed = new Set(ORIGIN_LIST.map((value) => toOrigin(value)).filter(Boolean))
  const requestOrigin = getRequestOrigin(req)
  if (requestOrigin) {
    allowed.add(requestOrigin)
  }

  const vercelUrl = cleanSingleLine(process.env.VERCEL_URL)
  if (vercelUrl) {
    const vercelOrigin = toOrigin(`https://${vercelUrl}`)
    if (vercelOrigin) {
      allowed.add(vercelOrigin)
    }
  }

  return allowed
}

function isAllowedRequestSource(req) {
  const allowedOrigins = getAllowedOrigins(req)
  const origin = toOrigin(req.headers.origin)
  const refererOrigin = toOrigin(req.headers.referer)

  if (origin && allowedOrigins.has(origin)) {
    return true
  }

  if (refererOrigin && allowedOrigins.has(refererOrigin)) {
    return true
  }

  return false
}

function createCaptchaChallenge() {
  const a = Math.floor(Math.random() * 8) + 2
  const b = Math.floor(Math.random() * 8) + 2
  const issuedAt = Date.now()
  const nonce = crypto.randomBytes(8).toString('hex')
  const payload = `${a}:${b}:${issuedAt}:${nonce}`
  const signature = signCaptchaPayload(payload)
  const token = Buffer.from(`${payload}:${signature}`).toString('base64url')

  return {
    challenge: `${a} + ${b}`,
    token,
  }
}

export default function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    res.status(405).json({ ok: false, error: 'Method not allowed.' })
    return
  }

  if (!isAllowedRequestSource(req)) {
    res.status(403).json({ ok: false, error: 'Origin not allowed.' })
    return
  }

  const challenge = createCaptchaChallenge()
  res.setHeader('Cache-Control', 'no-store')
  res.status(200).json({ ok: true, ...challenge })
}
