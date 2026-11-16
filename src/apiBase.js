// Resolves API endpoints the same way the contact form does: from
// VITE_CONTACT_ENDPOINT (e.g. http://localhost:8787/api/contact locally, or
// /api/contact on Vercel), never pointing a deployed site at localhost.
export function apiEndpoint(name) {
  const configured = import.meta.env.VITE_CONTACT_ENDPOINT || '/api/contact'
  const isRemote =
    typeof window !== 'undefined' &&
    window.location.hostname !== 'localhost' &&
    window.location.hostname !== '127.0.0.1'
  const pointsAtLocalhost = configured.includes('localhost') || configured.includes('127.0.0.1')
  const contact = isRemote && pointsAtLocalhost ? '/api/contact' : configured
  return contact.includes('/contact') ? contact.replace(/\/contact$/, `/${name}`) : `/api/${name}`
}
