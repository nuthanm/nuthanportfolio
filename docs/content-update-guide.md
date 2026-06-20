# Portfolio Content Update Guide

This project keeps most portfolio content in one file: src/data.js

## 1) Add/Update Career Timeline
1. Open src/data.js
2. Find export const timeline
3. Add or edit one object with:
   - id
   - year
   - role
   - company
   - description
   - tags (array)

Example:
{
  id: 8,
  year: "Jun 2026 - Present",
  role: "Role Name",
  company: "Company Name",
  description: "Short impact-focused summary.",
  tags: ["Skill 1", "Skill 2"]
}

## 2) Add/Update Certifications
1. Open src/data.js
2. Find export const certifications
3. Add one object with:
   - id
   - title
   - issuer
   - year
   - issuedOn
   - credentialUrl
   - logoImage

Tip: Put logo files in public/logos and reference with /logos/file.svg

## 3) Add/Update Skills
1. Open src/data.js
2. Find export const skills
3. Add a category object:
   - category
   - items (array)

Example:
{
  category: "ORM",
  items: ["EF Core", "Dapper"]
}

If category icon/style is needed, also update src/components/Skills.jsx in categoryMeta.

## 4) Add/Update Portfolio Apps
1. Open src/data.js
2. Find export const portfolio
3. Add or edit app object fields:
   - id
   - name
   - description
   - tech
   - liveUrl
   - image
   - category

Tip: For stable thumbnails, store local images in public/thumbnails and use /thumbnails/name.svg or .png

## 5) Contact Form Behavior
1. Frontend form is in src/components/Contact.jsx
2. Direct submit endpoint environment variable is VITE_CONTACT_ENDPOINT
3. Captcha endpoint can be configured with VITE_CONTACT_CAPTCHA_ENDPOINT (or auto-derived)
4. If endpoint is not set, form opens the default mail client (mailto fallback)
5. Signed captcha challenge and consent are required before submit
6. Setup details are in docs/contact-form-gmail-setup.md

## 6) Hero Stats and Experience Automation
1. Hero cards are rendered in src/components/Hero.jsx
2. Live GitHub stats endpoint is /api/github-stats (or VITE_GITHUB_STATS_ENDPOINT)
3. Stats include:
   - Public Repositories
   - Contributions (Current Year)
   - Contributions (So Far)
4. Years of IT Experience is auto-calculated from personalInfo.itCareerStartDate in src/data.js
5. Keep personalInfo.itCareerStartDate as your true career start date (currently Dec 2013)

## 7) After Any Content Change
Run:
npm run build

If build succeeds, your updates are safe to deploy.
