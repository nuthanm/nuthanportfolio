import { useEffect, useState } from 'react'
import { FiAlertCircle, FiArrowLeft, FiCheck, FiExternalLink, FiMail, FiX } from 'react-icons/fi'
import { apiEndpoint } from '../apiBase'
import { Meta, Person } from './Testimonials'

// #/review?t=<signed token>[&intent=reject]
// Opened from the buttons in a "New Testimonial Received" email. Nothing
// changes until a button on this page is pressed, so email link scanners
// that pre-open URLs can't approve or reject anything.

function readParams() {
  const query = window.location.hash.split('?')[1] || ''
  const params = new URLSearchParams(query)
  return { token: params.get('t') || '', intent: params.get('intent') || 'approve' }
}

const copy = {
  pending: { eyebrow: 'Testimonial review', title: 'Publish this on your site?' },
  published: { eyebrow: 'Live on your site', title: 'This testimonial is published.' },
  rejected: { eyebrow: 'Rejected', title: "This testimonial won't be published." },
  unpublished: { eyebrow: 'Removed', title: 'This testimonial is no longer on your site.' },
  gone: { eyebrow: 'Nothing to review', title: 'This testimonial was already handled or has expired.' },
  error: { eyebrow: 'Review link problem', title: "This link can't be used." },
}

export default function ReviewPage() {
  const [{ token, intent }] = useState(readParams)
  const [state, setState] = useState({ status: 'loading', testimonial: null, error: '' })
  const [busy, setBusy] = useState('')
  const [reply, setReply] = useState(null) // what the thank-you email would say
  const [notify, setNotify] = useState(true)
  const [replied, setReplied] = useState(null) // result after acting

  useEffect(() => {
    // Keep review pages out of search engines.
    const meta = document.createElement('meta')
    meta.name = 'robots'
    meta.content = 'noindex, nofollow'
    document.head.appendChild(meta)
    window.scrollTo(0, 0)
    return () => meta.remove()
  }, [])

  useEffect(() => {
    if (!token) {
      setState({ status: 'error', testimonial: null, error: 'The link is missing its review code.' })
      return
    }
    fetch(`${apiEndpoint('testimonial-review')}?t=${encodeURIComponent(token)}`, { headers: { Accept: 'application/json' } })
      .then(async (res) => {
        const data = await res.json().catch(() => null)
        if (!res.ok || !data?.ok) throw new Error(data?.error || 'Could not load this testimonial.')
        setState({ status: data.status, testimonial: data.testimonial || null, error: '' })
        setReply(data.reply || null)
      })
      .catch((error) => setState({ status: 'error', testimonial: null, error: error.message }))
  }, [token])

  const act = async (action) => {
    setBusy(action)
    try {
      const res = await fetch(apiEndpoint('testimonial-review'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ token, action, notify: Boolean(reply?.available && notify) }),
      })
      const data = await res.json().catch(() => null)
      if (!res.ok || !data?.ok) throw new Error(data?.error || 'Something went wrong.')
      setState((prev) => ({ status: data.status, testimonial: data.testimonial || prev.testimonial, error: '' }))
      if (action !== 'unpublish' && reply?.available && notify) setReplied(Boolean(data.replied))
    } catch (error) {
      setState((prev) => ({ ...prev, error: error.message }))
    } finally {
      setBusy('')
    }
  }

  const { status, testimonial, error } = state
  const heading = copy[status] || copy.pending
  const showCard = testimonial && ['pending', 'published', 'unpublished'].includes(status)

  return (
    <div className="min-h-screen bg-subtle px-5 py-10 md:py-16">
      <div className="mx-auto max-w-xl">
        <a href="#hero" className="inline-flex items-center gap-1.5 text-sm text-fg-3 hover:text-fg transition-colors">
          <FiArrowLeft size={14} /> Back to the portfolio
        </a>

        {status === 'loading' ? (
          <p className="mt-10 text-fg-3">Loading testimonial…</p>
        ) : (
          <>
            <p className="eyebrow mt-8">{heading.eyebrow}</p>
            <h1 className="mt-2 text-3xl md:text-4xl font-semibold text-fg">{heading.title}</h1>

            {status === 'pending' && intent === 'reject' && (
              <p className="mt-3 text-sm text-fg-2">You chose <strong>Reject</strong> in the email. Confirm below, or approve it instead.</p>
            )}
            {status === 'error' && <p className="mt-3 text-fg-2">{error}</p>}

            {showCard && (
              <figure className={`card mt-8 p-6 md:p-8 flex flex-col gap-5 ${status === 'unpublished' ? 'opacity-60' : ''}`}>
                <Meta t={testimonial} />
                <blockquote className="text-lg text-fg leading-relaxed whitespace-pre-line">&ldquo;{testimonial.quote}&rdquo;</blockquote>
                <Person t={testimonial} />
              </figure>
            )}

            {status === 'pending' && (
              <>
                <div className="mt-6 flex flex-wrap gap-3">
                  <button
                    type="button"
                    disabled={Boolean(busy)}
                    onClick={() => act('approve')}
                    className={`btn-primary !px-6 !py-3 disabled:opacity-60 ${intent === 'reject' ? 'order-2' : ''}`}
                  >
                    <FiCheck size={15} /> {busy === 'approve' ? 'Publishing…' : 'Approve & publish'}
                  </button>
                  <button
                    type="button"
                    disabled={Boolean(busy)}
                    onClick={() => act('reject')}
                    className={`btn-ghost !px-6 !py-3 disabled:opacity-60 ${intent === 'reject' ? '!border-red-400 !text-red-600 dark:!text-red-400' : ''}`}
                  >
                    <FiX size={15} /> {busy === 'reject' ? 'Rejecting…' : 'Reject'}
                  </button>
                </div>
                {reply?.available ? (
                  <div className="mt-6 rounded-xl border border-line bg-card p-4">
                    <label className="flex items-start gap-2.5 text-sm text-fg">
                      <input
                        type="checkbox"
                        checked={notify}
                        onChange={(e) => setNotify(e.target.checked)}
                        className="mt-1 h-4 w-4 accent-[rgb(var(--accent))]"
                      />
                      <span>
                        <FiMail className="inline -mt-0.5 mr-1" size={14} />
                        Email {reply.firstName || 'them'} a thank-you note
                      </span>
                    </label>
                    {notify && (
                      <details className="mt-3 text-sm">
                        <summary className="cursor-pointer text-fg-3 hover:text-fg">Preview the message</summary>
                        {['approve', 'reject'].map((kind) => (
                          <div key={kind} className="mt-3 rounded-lg bg-subtle border border-line p-3">
                            <p className="eyebrow mb-1">If you {kind}</p>
                            <p className="font-medium text-fg">{reply[kind]?.subject}</p>
                            <p className="mt-2 whitespace-pre-line text-fg-2 leading-relaxed">{reply[kind]?.text}</p>
                          </div>
                        ))}
                      </details>
                    )}
                  </div>
                ) : (
                  <p className="mt-6 text-xs text-fg-3">No thank-you email can be sent for this submission.</p>
                )}
                <p className="mt-4 text-xs text-fg-3">
                  Approved quotes appear in “What people say” within about a minute. You can unpublish from this same link later.
                </p>
              </>
            )}

            {status === 'published' && (
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <a href="#testimonials" className="btn-primary !px-6 !py-3">
                  <FiExternalLink size={15} /> View on site
                </a>
                <button type="button" disabled={Boolean(busy)} onClick={() => act('unpublish')} className="btn-ghost !px-6 !py-3 disabled:opacity-60">
                  {busy === 'unpublish' ? 'Removing…' : 'Unpublish'}
                </button>
              </div>
            )}

            {replied !== null && ['published', 'rejected'].includes(status) && (
              <p className={`mt-4 inline-flex items-center gap-2 text-sm ${replied ? 'text-emerald-700 dark:text-emerald-400' : 'text-amber-700 dark:text-amber-400'}`}>
                <FiMail size={14} />
                {replied
                  ? `Thank-you email sent to ${reply?.firstName || 'them'}.`
                  : "The decision was saved, but the thank-you email couldn't be sent."}
              </p>
            )}

            {error && status !== 'error' && (
              <p role="alert" className="mt-4 inline-flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
                <FiAlertCircle size={14} /> {error}
              </p>
            )}
          </>
        )}
      </div>
    </div>
  )
}
