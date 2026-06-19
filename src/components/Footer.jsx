import { FiGithub, FiLinkedin, FiTwitter, FiHeart, FiMail } from 'react-icons/fi'
import { SiCodementor, SiMedium } from 'react-icons/si'
import { Link } from 'react-scroll'
import { personalInfo } from '../data'

const navLinks = [
  { label: 'About', to: 'hero' },
  { label: 'Timeline', to: 'timeline' },
  { label: 'Skills', to: 'skills' },
  { label: 'Portfolio', to: 'portfolio' },
  { label: 'Contact', to: 'contact' },
]

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-surface border-t border-slate-200 px-6 md:px-12 lg:px-24 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-10 mb-10">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <span className="text-text-main font-bold text-2xl">
              NM<span className="text-accent">.</span>
            </span>
            <p className="text-text-secondary text-sm leading-relaxed max-w-xs">
              Building scalable web apps, teaching tech, and sharing my learning journey through blogs and videos.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-text-main font-semibold text-sm uppercase tracking-wider mb-4">
              Quick Links
            </h4>
            <ul className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    smooth
                    duration={500}
                    offset={-70}
                    className="text-text-secondary hover:text-accent text-sm cursor-pointer transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social & Links */}
          <div>
            <h4 className="text-text-main font-semibold text-sm uppercase tracking-wider mb-4">
              Connect & Follow
            </h4>
            <div className="flex flex-col gap-3">
              {[
                { icon: FiGithub, label: 'GitHub', href: personalInfo.social.github },
                { icon: FiLinkedin, label: 'LinkedIn', href: personalInfo.social.linkedin },
                { icon: FiTwitter, label: 'Twitter', href: personalInfo.social.twitter },
                { icon: SiMedium, label: 'Medium', href: personalInfo.social.medium },
                { icon: SiCodementor, label: 'CodeMentor', href: personalInfo.social.codementor },
              ].map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-text-secondary hover:text-accent text-sm transition-colors"
                >
                  <Icon size={16} />
                  {label}
                </a>
              ))}
              <a
                href={`mailto:${personalInfo.email}`}
                className="flex items-center gap-2 text-text-secondary hover:text-accent text-sm transition-colors"
              >
                <FiMail size={16} />
                {personalInfo.email}
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-200 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-muted text-xs flex items-center gap-1.5">
            Made with <FiHeart size={12} className="text-accent" /> by {personalInfo.name}
          </p>
          <p className="text-muted text-xs">© {year} All rights reserved.</p>
        </div>
        <div className="mt-4 text-[11px] leading-relaxed text-slate-500 text-center sm:text-left">
          Trademarked names, logos, and brands belong to their respective owners. Referenced here for portfolio demonstration and identification only.
        </div>
      </div>
    </footer>
  )
}
