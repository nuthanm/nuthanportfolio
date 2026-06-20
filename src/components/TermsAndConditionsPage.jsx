import { personalInfo } from '../data'

export default function TermsAndConditionsPage() {
  const updatedOn = '2026-06-20'

  return (
    <div className="min-h-screen bg-primary px-6 py-10 md:px-12 lg:px-24">
      <div className="mx-auto max-w-4xl glass-card p-6 md:p-10">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
          <a href="#contact" className="text-sm font-medium text-accent hover:underline">
            Back to portfolio
          </a>
          <a href="#/privacy-policy" className="text-sm font-medium text-accent hover:underline">
            Privacy Policy
          </a>
        </div>

        <h1 className="text-2xl font-bold text-text-main md:text-3xl">Terms and Conditions</h1>
        <p className="mt-2 text-sm text-text-secondary">Last updated: {updatedOn}</p>

        <div className="mt-8 space-y-6 text-sm leading-7 text-text-secondary">
          <section>
            <h2 className="mb-2 text-lg font-semibold text-text-main">1. Website Purpose</h2>
            <p>
              This portfolio shares professional information, project highlights, and contact
              options related to {personalInfo.name}.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-text-main">2. Acceptable Use</h2>
            <p>
              You agree not to use the site or contact form for spam, fraud, phishing, harassment,
              malware distribution, illegal activity, or unauthorized automated abuse.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-text-main">3. Intellectual Property</h2>
            <p>
              Original content on this website is protected by applicable intellectual property law.
              Third-party marks, logos, and names remain property of their respective owners.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-text-main">4. External Links</h2>
            <p>
              This site may link to third-party websites. Their content and privacy practices are
              controlled by those external operators.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-text-main">5. No Warranty</h2>
            <p>
              Information is provided on an "as is" basis without warranties of uninterrupted or
              error-free availability.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-text-main">6. Limitation of Liability</h2>
            <p>
              To the extent permitted by law, the site owner is not liable for indirect or
              consequential losses arising from use of this website.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-text-main">7. Enforcement</h2>
            <p>
              Abusive requests may be blocked and relevant data may be retained for security,
              compliance, and legal defense.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-text-main">8. Changes</h2>
            <p>
              Terms may be updated periodically. Continued use after updates means acceptance of the
              revised terms.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
