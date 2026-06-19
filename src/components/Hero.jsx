import { motion } from 'framer-motion'
import { Link } from 'react-scroll'
import { FiArrowDown, FiGithub, FiLinkedin, FiMail, FiTwitter } from 'react-icons/fi'
import { SiCodementor, SiMedium } from 'react-icons/si'
import { githubStats, personalInfo } from '../data'

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay, ease: 'easeOut' },
  }),
}

const fadeInRight = {
  hidden: { opacity: 0, x: -60 },
  visible: (delay = 0) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, delay, ease: 'easeOut' },
  }),
}

const particles = [
  { id: 1, size: 5, x: '8%', y: '18%', delay: 0.2, duration: 8 },
  { id: 2, size: 7, x: '18%', y: '62%', delay: 0.6, duration: 10 },
  { id: 3, size: 4, x: '27%', y: '30%', delay: 0.1, duration: 9 },
  { id: 4, size: 6, x: '36%', y: '78%', delay: 0.9, duration: 11 },
  { id: 5, size: 5, x: '45%', y: '22%', delay: 0.4, duration: 8 },
  { id: 6, size: 8, x: '56%', y: '65%', delay: 0.3, duration: 12 },
  { id: 7, size: 4, x: '64%', y: '36%', delay: 1.1, duration: 10 },
  { id: 8, size: 6, x: '72%', y: '16%', delay: 0.8, duration: 9 },
  { id: 9, size: 5, x: '82%', y: '58%', delay: 0.5, duration: 11 },
  { id: 10, size: 7, x: '90%', y: '28%', delay: 0.7, duration: 10 },
]

export default function Hero() {
  return (
    <section
      id="hero"
      className="min-h-screen flex items-start justify-center section-padding relative overflow-hidden pt-28 md:pt-32"
    >
      <div className="absolute top-14 left-10 w-72 h-72 bg-blue-100 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-16 right-16 w-64 h-64 bg-sky-100 rounded-full blur-3xl pointer-events-none" />

      <div className="absolute inset-0 z-0 pointer-events-none opacity-55 [background-image:linear-gradient(to_right,rgba(59,130,246,0.14)_1px,transparent_1px),linear-gradient(to_bottom,rgba(59,130,246,0.14)_1px,transparent_1px)] [background-size:40px_40px]" />

      <div className="absolute inset-0 z-0 pointer-events-none">
        {particles.map((particle) => (
          <motion.span
            key={particle.id}
            className="absolute rounded-full bg-accent/20"
            style={{
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              left: particle.x,
              top: particle.y,
            }}
            animate={{
              y: [0, -12, 0],
              opacity: [0.2, 0.55, 0.2],
            }}
            transition={{
              duration: particle.duration,
              delay: particle.delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto w-full grid md:grid-cols-2 gap-12 items-center relative z-10">
        {/* Left - Details */}
        <motion.div
          variants={fadeUp}
          initial={false}
          animate="visible"
          custom={0.2}
          className="flex flex-col gap-7"
        >
          <motion.div
            initial={false}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 border border-blue-200 rounded-full text-accent text-sm font-semibold w-fit">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              Open to full-time roles and contract projects
            </span>
          </motion.div>

          <motion.h1
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-text-main tracking-tight leading-tight"
          >
            {personalInfo.name}
          </motion.h1>

          <motion.p
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-lg md:text-xl text-text-secondary leading-relaxed max-w-xl"
          >
            {personalInfo.tagline}
          </motion.p>

          <motion.p
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-text-secondary text-base leading-relaxed max-w-2xl"
          >
            {personalInfo.bio}
          </motion.p>

          <motion.div
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.6 }}
            className="grid grid-cols-2 gap-3 max-w-2xl"
          >
            {githubStats.map((stat) => (
              <div key={stat.label} className="glass-card p-4 bg-white/90">
                <p className="text-2xl font-extrabold text-accent">{stat.value}</p>
                <p className="text-xs text-text-secondary mt-1">{stat.label}</p>
              </div>
            ))}
          </motion.div>

          <motion.div
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="flex flex-wrap items-center gap-4"
          >
            <Link
              to="portfolio"
              smooth
              duration={600}
              offset={-70}
              className="px-7 py-3 bg-accent hover:bg-accent-light text-white font-semibold rounded-xl cursor-pointer transition-all duration-200 shadow-md hover:-translate-y-0.5"
            >
              View Portfolio
            </Link>
            <Link
              to="contact"
              smooth
              duration={600}
              offset={-70}
              className="px-7 py-3 border border-slate-300 text-text-main hover:border-accent hover:text-accent font-semibold rounded-xl cursor-pointer transition-all duration-200 hover:-translate-y-0.5"
            >
              Contact Me
            </Link>
          </motion.div>

          <motion.div
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="flex items-center gap-4 pt-4 border-t border-slate-200"
          >
            {[
              { icon: FiGithub, href: personalInfo.social.github, label: 'GitHub' },
              { icon: FiLinkedin, href: personalInfo.social.linkedin, label: 'LinkedIn' },
              { icon: FiTwitter, href: personalInfo.social.twitter, label: 'Twitter' },
              { icon: SiMedium, href: personalInfo.social.medium, label: 'Medium' },
              { icon: SiCodementor, href: personalInfo.social.codementor, label: 'CodeMentor' },
            ].map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="text-slate-500 hover:text-accent transition-all duration-200 hover:-translate-y-1 inline-flex"
              >
                <Icon size={22} />
              </a>
            ))}
            <a
              href={`mailto:${personalInfo.email}`}
              className="text-slate-500 hover:text-accent transition-all duration-200 hover:-translate-y-1 inline-flex"
              aria-label="Email"
            >
              <FiMail size={22} />
            </a>
          </motion.div>
        </motion.div>

        {/* Right - Photo */}
        <motion.div
          variants={fadeInRight}
          initial={false}
          animate="visible"
          custom={0}
          className="flex items-center justify-center md:justify-end"
        >
          <div className="relative w-[22rem] h-[22rem] md:w-[28rem] md:h-[34rem]">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-100 to-sky-100 opacity-80 blur-2xl" />
            <div className="absolute inset-0 rounded-3xl overflow-hidden border border-slate-200 shadow-xl">
              <img
                src={personalInfo.photo}
                alt={personalInfo.name}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent" />
            </div>
            <motion.div
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="absolute -bottom-5 left-6 px-4 py-2 bg-white border border-slate-200 rounded-xl text-text-main text-sm font-semibold shadow"
            >
              Based in {personalInfo.location}
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 8, 0] }}
        transition={{ delay: 1.2, duration: 1.6, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-muted"
      >
        <FiArrowDown size={20} />
      </motion.div>
    </section>
  )
}
