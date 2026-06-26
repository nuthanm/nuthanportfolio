# Nuthan Murarysetty — Portfolio

> Personal portfolio website for **Nuthan Murarysetty** — Application Architect, Full Stack Developer, Instructor, and Content Creator with 12+ years of enterprise engineering experience.

[![Live Site](https://img.shields.io/badge/Live%20Site-Visit%20Portfolio-0A66C2?style=for-the-badge&logo=vercel&logoColor=white)](https://nuthanportfolio.vercel.app/)
[![Last Commit](https://img.shields.io/github/last-commit/nuthanm/nuthanportfolio?style=for-the-badge&logo=github)](https://github.com/nuthanm/nuthanportfolio/commits/main)
[![React 18](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://react.dev/)
[![Vite 5](https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS 3](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)

## Quick Links

[Live Portfolio](https://nuthanportfolio.vercel.app/) •
[Content Guide](./docs/content-update-guide.md) •
[Contact Form Setup](./docs/contact-form-gmail-setup.md) •
[LinkedIn](https://www.linkedin.com/in/nuthanm/) •
[GitHub](https://github.com/nuthanm)

---

## 🌐 Live Preview

[![Portfolio Preview](https://s.wordpress.com/mshots/v1/https%3A%2F%2Fnuthanportfolio.vercel.app%2F?w=1200)](https://nuthanportfolio.vercel.app/)

---

## ✨ Highlights

- **Professional personal brand site** with a polished one-page experience and dedicated legal pages.
- **Live GitHub stats integration** to showcase contribution activity and repository metrics automatically.
- **Secure contact flow** powered by server-side validation, captcha protection, rate limiting, Helmet, and CORS.
- **Content-first architecture** where portfolio details are maintained centrally in `src/data.js`.
- **Deployment-ready Vercel setup** with serverless API endpoints for contact and GitHub metrics.

---

## 🖼️ Screenshots

### Hero Section
![Hero](https://s.wordpress.com/mshots/v1/https%3A%2F%2Fnuthanportfolio.vercel.app%2F?w=1200&h=630)

### Portfolio Projects
| Investment Tracker | Debt Tracker | Private Journal |
|---|---|---|
| [![Investment Tracker](https://s.wordpress.com/mshots/v1/https%3A%2F%2Fmyinvestmenttracker.vercel.app%2F?w=400)](https://myinvestmenttracker.vercel.app/) | [![Debt Tracker](https://s.wordpress.com/mshots/v1/http%3A%2F%2Fmydebttracker.vercel.app%2F?w=400)](http://mydebttracker.vercel.app/) | [![Private Journal](https://s.wordpress.com/mshots/v1/https%3A%2F%2Fprivate-journal.vercel.app%2F?w=400)](https://private-journal.vercel.app/) |

---

## 🛠️ Tech Stack

### Frontend
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white&style=flat-square)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white&style=flat-square)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?logo=tailwindcss&logoColor=white&style=flat-square)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-11-0055FF?logo=framer&logoColor=white&style=flat-square)

### Backend / API
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js&logoColor=white&style=flat-square)
![Nodemailer](https://img.shields.io/badge/Nodemailer-Gmail_SMTP-0078D4?style=flat-square)

### Infrastructure
![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000000?logo=vercel&logoColor=white&style=flat-square)
![GitHub](https://img.shields.io/badge/Source-GitHub-181717?logo=github&logoColor=white&style=flat-square)

---

## 📁 Project Structure

```text
nuthanportfolio/
├── api/                        # Vercel serverless API functions
│   ├── contact.js              # Contact form handler (email via Gmail SMTP)
│   ├── contact-captcha.js      # Signed captcha challenge generator
│   ├── github-stats.js         # GitHub metrics endpoint for hero cards
│   └── health.js               # Health check endpoint
├── docs/                       # Developer guides
│   ├── contact-form-gmail-setup.md
│   └── content-update-guide.md
├── public/                     # Static assets
│   ├── logos/                  # Technology and AI tool logos (SVG)
│   ├── thumbnails/             # Project preview images
│   └── favicon.svg
├── server/
│   └── index.js                # Local Express server (dev only)
├── src/
│   ├── components/             # React components
│   │   ├── AiToolsStrip.jsx
│   │   ├── Contact.jsx
│   │   ├── Footer.jsx
│   │   ├── Hero.jsx
│   │   ├── ImportantInfo.jsx
│   │   ├── Navbar.jsx
│   │   ├── Portfolio.jsx
│   │   ├── PrivacyPolicyPage.jsx
│   │   ├── Skills.jsx
│   │   ├── TermsAndConditionsPage.jsx
│   │   └── Timeline.jsx
│   ├── data.js                 # All portfolio content lives here
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── .env.example                # Environment variable template
├── index.html
├── package.json
├── tailwind.config.js
└── vite.config.js
```

> **To update any portfolio content** (bio, timeline, skills, projects, certifications), edit **`src/data.js`** only. See [`docs/content-update-guide.md`](./docs/content-update-guide.md) for details.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm

### 1. Clone the repository

```bash
git clone https://github.com/nuthanm/nuthanportfolio.git
cd nuthanportfolio
```

### 2. Install dependencies

```bash
npm ci
```

### 3. Configure environment variables

```bash
cp .env.example .env
```

Edit `.env` and fill in your Gmail SMTP credentials:

```env
VITE_CONTACT_ENDPOINT=/api/contact
VITE_CONTACT_CAPTCHA_ENDPOINT=/api/contact-captcha
VITE_GITHUB_STATS_ENDPOINT=/api/github-stats

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=yourgmail@gmail.com
SMTP_PASS=your_gmail_app_password
SMTP_FROM="Your Name <yourgmail@gmail.com>"
MAIL_TO=yourgmail@gmail.com
CONTACT_CAPTCHA_SECRET=replace_with_a_long_random_secret
CAPTCHA_TOKEN_TTL_MS=600000
FRONTEND_ORIGIN=http://localhost:5173

RATE_LIMIT_WINDOW_MS=600000
RATE_LIMIT_MAX=10
```

See [`docs/contact-form-gmail-setup.md`](./docs/contact-form-gmail-setup.md) for generating a Gmail App Password.

### 4. Run locally

**Frontend only (no contact form email):**
```bash
npm run dev
```

**Frontend + local API backend:**
```bash
# Terminal 1
npm run api

# Terminal 2
npm run dev
```

The site will be available at `http://localhost:5173`.

### 5. Build for production

```bash
npm run build
npm run preview
```

---

## ☁️ Deployment (Vercel)

1. Push this repository to GitHub.
2. Import the project in [Vercel](https://vercel.com/).
3. Add the following **Environment Variables** in Vercel Project Settings:

   | Variable | Value |
   |---|---|
   | `SMTP_HOST` | `smtp.gmail.com` |
   | `SMTP_PORT` | `587` |
   | `SMTP_SECURE` | `false` |
   | `SMTP_USER` | your Gmail address |
   | `SMTP_PASS` | your Gmail App Password |
   | `SMTP_FROM` | display name + email |
   | `MAIL_TO` | receiver Gmail address |
   | `CONTACT_CAPTCHA_SECRET` | long random secret value |
   | `CAPTCHA_TOKEN_TTL_MS` | `600000` |
   | `FRONTEND_ORIGIN` | your frontend origin(s), comma-separated |
   | `RATE_LIMIT_WINDOW_MS` | `600000` |
   | `RATE_LIMIT_MAX` | `10` |

4. Click **Deploy**. Vercel auto-detects the `api/` folder and serves it as serverless functions.

---

## 🔒 Security

- **Rate limiting** — contact form limited to configured requests per time window.
- **Honeypot field** — hidden field traps bots silently.
- **Signed captcha token** — server-generated captcha challenge with tamper-resistant token.
- **Consent gating** — users must accept Privacy Policy and Terms before submit.
- **Server-side validation** — strict length and email format checks on every request.
- **Origin/Referer checks** — requests are validated against configured frontend origin(s).
- **Helmet** — HTTP security headers applied on the Express backend.
- **CORS** — restricted to the configured `FRONTEND_ORIGIN`.
- **Environment secrets** — all sensitive values are stored in `.env` (never committed).

---

## 📄 Content Attribution

- Project preview thumbnails are generated via WordPress mShots from publicly accessible URLs.
- Technology and brand names (Microsoft, Azure, GitHub, OpenAI, Anthropic, LinkedIn) belong to their respective owners.
- The profile image is sourced from the owner's public GitHub profile.
- Logo files are simplified visual references for identification purposes only.

---

## 🌍 Social & Links

| Platform | Link |
|---|---|
| GitHub | [github.com/nuthanm](https://github.com/nuthanm) |
| LinkedIn | [linkedin.com/in/nuthanm](https://www.linkedin.com/in/nuthanm/) |
| X / Twitter | [x.com/nuthanmurari](https://x.com/nuthanmurari) |
| Medium | [nuthanmurarysetty.medium.com](https://nuthanmurarysetty.medium.com/) |
| CodeMentor | [codementor.io/@inboxnuthan](https://www.codementor.io/@inboxnuthan) |

---

## 📬 Contact

Have feedback, collaboration ideas, or questions? Use the **Contact** section on the live portfolio or email directly at **inbox.nuthan@gmail.com**.

---

© 2026 Nuthan Murarysetty. All rights reserved.
