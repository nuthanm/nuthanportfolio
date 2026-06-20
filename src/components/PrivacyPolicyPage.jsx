import { personalInfo } from '../data'

export default function PrivacyPolicyPage() {
  const updatedOn = '2026-06-20'

  return (
    <div className="min-h-screen bg-primary px-6 py-10 md:px-12 lg:px-24">
      <div className="mx-auto max-w-4xl glass-card p-6 md:p-10">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
          <a href="#contact" className="text-sm font-medium text-accent hover:underline">
            Back to portfolio
          </a>
          <a href="#/terms-and-conditions" className="text-sm font-medium text-accent hover:underline">
            Terms and Conditions
          </a>
        </div>

        <h1 className="text-2xl font-bold text-text-main md:text-3xl">Privacy Policy</h1>
        <p className="mt-2 text-sm text-text-secondary">Last updated: {updatedOn}</p>

        <div className="mt-8 space-y-6 text-sm leading-7 text-text-secondary">
          <section>
            <h2 className="mb-2 text-lg font-semibold text-text-main">1. Information We Collect</h2>
            <p>
              When you use the contact form, we collect your name, email address, subject, message,
              and limited technical metadata such as request IP and request timestamps.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-text-main">2. Why We Collect It</h2>
            <p>
              We use this information only to respond to your inquiry, communicate about potential
              projects, and prevent spam or abuse of this website.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-text-main">3. Legal Basis</h2>
            <p>
              Data is processed based on your consent when you submit the form, and on legitimate
              interest for operating, securing, and improving the portfolio contact service.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-text-main">4. Sharing and Processors</h2>
            <p>
              Contact submissions are routed through infrastructure and email providers used to run
              this website, including hosting and email delivery platforms. Data is not sold.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-text-main">5. Data Retention</h2>
            <p>
              Messages are retained only as long as needed for communication, record-keeping, and
              security monitoring, then deleted or archived securely.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-text-main">6. Security Measures</h2>
            <p>
              This site uses server-side validation, anti-bot controls, rate limiting, and origin
              checks to reduce abuse risk. No internet service can guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-text-main">7. Your Rights</h2>
            <p>
              Subject to applicable law, you may request access, correction, deletion, or
              restriction of your personal data. You may also withdraw consent for future processing.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-text-main">8. Contact</h2>
            <p>
              For privacy requests, contact <a href={`mailto:${personalInfo.email}`} className="text-accent hover:underline">{personalInfo.email}</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
