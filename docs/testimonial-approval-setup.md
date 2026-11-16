# Testimonial one-click approval

When someone submits the feedback form (`/#/feedback`) and ticks
"You may show my name, role and feedback on this website", the
"New Testimonial Received" email includes **Approve & publish** and **Reject**
buttons. Each opens `/#/review?t=…` on the site, which shows the quote and only
acts when you press a button there. Approved quotes appear in
"What people say" within about a minute, after the ones in `src/data.js`.

## One-time setup on Vercel

1. **Add storage.** Vercel dashboard → your project → **Storage** →
   **Create / Connect Database** → **Upstash for Redis** (free plan) →
   connect it to this project for all environments. This adds
   `KV_REST_API_URL` and `KV_REST_API_TOKEN` automatically.
2. **Add the signing secret.** Project → **Settings → Environment Variables** →
   add `TESTIMONIAL_REVIEW_SECRET` with a long random value (32+ characters),
   for Production (and Preview if you test there). To generate one:
   `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
3. *(Optional)* add `SITE_URL=https://nuthanportfolio.vercel.app` so email links
   always point at the production site.
4. **Redeploy** (Deployments → ⋯ → Redeploy) so the new variables are picked up.

Until both storage and the secret are set, emails still arrive but say
"One-click approval is unavailable"; publish manually via `src/data.js`.

## Using it

- **Approve & publish** in the email → confirm on the page → live within a minute.
- **Reject** → confirm → the submission is deleted from storage.
- **Thank-you reply:** the review page has an "Email <name> a thank-you note"
  checkbox (on by default) with a preview. After you approve or reject, the
  person gets the matching default message from your Gmail (replies come back
  to `MAIL_TO`). Untick it to decide silently.
- **Edit the wording** in `REPLY_TEMPLATES` at the top of the replies section in
  `api/_lib/testimonials.js`; `{firstName}` and `{siteUrl}` are filled in.
- Reopen the same email link later to **Unpublish** a quote.
- Links expire after 30 days; unhandled submissions are deleted then too.
- Changing `TESTIMONIAL_REVIEW_SECRET` invalidates every existing link.
- To remove a quote after its link expired, delete its entry from the
  `testimonials:published` hash in the Upstash console.
- **Privacy:** the submitter's email is stored only while a testimonial is
  pending (so the reply can be sent). It is never sent to the browser, and it
  is removed when you approve or reject, or after 30 days.

## Testing locally

```bash
# terminal 1: API with in-memory storage, emails printed to the console
RATE_LIMIT_MAX=500 PORT=8787 FRONTEND_ORIGIN=http://localhost:5173 \
MAIL_TRANSPORT=json TESTIMONIAL_STORE=memory \
TESTIMONIAL_REVIEW_SECRET=local-test-secret-0123456789abcdef0123456789 \
SITE_URL=http://localhost:5173 npm run api

# terminal 2: site pointed at that API
VITE_CONTACT_ENDPOINT=http://localhost:8787/api/contact \
VITE_CONTACT_CAPTCHA_ENDPOINT=http://localhost:8787/api/contact-captcha npm run dev
```

Submit `/#/feedback`, copy the `review?t=…` link from the logged email, and open it.
Replies to the submitter are printed as `[reply] …` lines in terminal 1.
