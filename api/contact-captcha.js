import crypto from 'crypto'

const clean = (value) => String(value || '').trim()
const cleanSingleLine = (value) => clean(value).replace(/[\r\n]+/g, ' ')
const ORIGIN_LIST = (process.env.FRONTEND_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map((x) => x.trim())
  .filter(Boolean)

function getCaptchaSecret() {
  return process.env.CONTACT_CAPTCHA_SECRET || `${process.env.SMTP_USER || ''}:${process.env.SMTP_PASS || ''}`
}

function signCaptchaPayload(payload) {
  return crypto.createHmac('sha256', getCaptchaSecret()).update(payload).digest('hex')
}

function isAllowedRequestSource(req) {
  const origin = cleanSingleLine(req.headers.origin)
  const referer = cleanSingleLine(req.headers.referer)

  if (origin && ORIGIN_LIST.includes(origin)) {
    return true
  }

  if (referer) {
    return ORIGIN_LIST.some((allowed) => referer === allowed || referer.startsWith(`${allowed}/`))
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
