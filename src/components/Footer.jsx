import { FiArrowUp, FiGithub, FiLinkedin, FiTwitter, FiMail } from 'react-icons/fi'
import { SiCodementor, SiMedium } from 'react-icons/si'
import { Link } from 'react-scroll'
import { personalInfo } from '../data'

const navLinks = [
  { label: 'About', to: 'hero' },
  { label: 'Experience', to: 'timeline' },
  { label: 'Certifications', to: 'certifications' },
  { label: 'Skills', to: 'skills' },
  { label: 'Work', to: 'portfolio' },
  { label: 'Testimonials', to: 'testimonials' },
  { label: 'Contact', to: 'contact' },
]

const socials = [
  { icon: FiGithub, label: 'GitHub', key: 'github' },
  { icon: FiLinkedin, label: 'LinkedIn', key: 'linkedin' },
  { icon: FiTwitter, label: 'X (Twitter)', key: 'twitter' },
  { icon: SiMedium, label: 'Medium', key: 'medium' },
  { icon: SiCodementor, label: 'CodeMentor', key: 'codementor' },
]

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-line bg-subtle px-5 md:px-10 lg:px-16 pt-16 pb-10">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-12 gap-10">
          <div className="md:col-span-6">
            <p className="text-2xl md:text-3xl font-semibold text-fg leading-tight max-w-md">
              Building scalable systems, teaching tech and sharing what I learn.
            </p>
            <a
              href={`mailto:${personalInfo.email}`}
              className="mt-5 inline-flex items-center gap-2 text-sm text-fg-2 hover:text-accent transition-colors"
            >
              <FiMail size={15} /> {personalInfo.email}
            </a>
          </div>

          <nav aria-label="Footer" className="md:col-span-3">
            <p className="eyebrow mb-4">Sitemap</p>
            <ul className="flex flex-col gap-2.5">
              {navLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    smooth
                    duration={500}
                    offset={-80}
                    href={`#${link.to}`}
                    className="text-sm text-fg-2 hover:text-fg cursor-pointer transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="md:col-span-3">
            <p className="eyebrow mb-4">Connect</p>
            <ul className="flex flex-col gap-2.5">
              {socials.map(({ icon: Icon, label, key }) => (
                <li key={key}>
                  <a
                    href={personalInfo.social[key]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-fg-2 hover:text-fg transition-colors"
                  >
                    <Icon size={14} /> {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 pt-6 border-t border-line flex flex-col-reverse md:flex-row md:items-center md:justify-between gap-4 text-xs text-fg-3">
          <p>© {year} {personalInfo.name}. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <a href="#/privacy-policy" className="hover:text-fg transition-colors">Privacy Policy</a>
            <a href="#/terms-and-conditions" className="hover:text-fg transition-colors">Terms and Conditions</a>
            <Link
              to="hero"
              smooth
              duration={600}
              href="#hero"
              className="inline-flex items-center gap-1 hover:text-fg cursor-pointer transition-colors"
            >
              Back to top <FiArrowUp size={12} />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
