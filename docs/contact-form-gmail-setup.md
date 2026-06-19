# Contact Form to Gmail (No Paid Third-Party) Setup

This guide uses your own lightweight backend endpoint and Gmail SMTP.
No paid form provider is required.

## Prerequisites
1. Gmail account where you want to receive messages.
2. 2-Step Verification enabled on Gmail account.
3. Gmail App Password generated (16-char password).
4. A simple backend endpoint URL (for example: https://your-domain.com/api/contact).

## Step 1: Generate Gmail App Password
1. Open Google Account settings.
2. Go to Security.
3. Enable 2-Step Verification (if not already enabled).
4. Open App passwords.
5. Create a new app password (Mail).
6. Copy the generated 16-character password.

## Step 2: Create Backend Contact Endpoint
Your backend endpoint should:
1. Accept JSON POST with name, email, subject, message.
2. Validate required fields.
3. Validate anti-spam checks:
   - reject when honeypot field has value
   - reject when captcha answer is missing or invalid
4. Send email to your Gmail using SMTP:
   - host: smtp.gmail.com
   - port: 587
   - secure: false (STARTTLS)
   - user: your Gmail address
   - pass: app password

## Step 3: Set Frontend Environment Variable
In project root, create .env file:

VITE_CONTACT_ENDPOINT=https://your-domain.com/api/contact

Then restart dev server.

For local development with this project backend:
1. Copy `.env.example` to `.env`.
2. Fill `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`, and `MAIL_TO`.
3. Start API server: `npm run api`
4. Start frontend: `npm run dev`

## Step 4: Test Contact Form
1. Open portfolio Contact section.
2. Fill form fields.
3. Check I am a human.
4. Click Send Message.
5. Confirm email arrives in your Gmail inbox.

## Notes
1. If VITE_CONTACT_ENDPOINT is empty, form opens mail client fallback.
2. Anti-spam currently includes:
   - required captcha challenge
   - hidden honeypot field
3. Backend protection includes:
   - CORS allowlist (`FRONTEND_ORIGIN`)
   - rate limiting (`RATE_LIMIT_WINDOW_MS`, `RATE_LIMIT_MAX`)
   - server-side captcha and honeypot checks
   - strict input length and email format validation
4. Always keep `.env` out of source control and use Gmail App Passwords only.
