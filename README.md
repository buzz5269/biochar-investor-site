# Buswell Biochar — Investor Website (Next.js)

Investor-ready, interactive site with contact & data-room request forms.

## Quick start
```bash
npm install
npm run dev
# open http://localhost:3000
```

## Environment (`.env.local`)
Create `.env.local` at project root with SMTP details for form delivery (use your provider’s values). Example:
```env
SMTP_HOST=smtp.yourprovider.com
SMTP_PORT=587
SMTP_USER=postmaster@yourdomain.com
SMTP_PASS=yourpassword
SMTP_SECURE=false
CONTACT_TO=tombuswell80@gmail.com
```
If these are missing, the forms will gracefully fallback and ask users to email you directly.

## Deploy (Vercel)
```bash
npm i -g vercel
vercel
```

## Editing
- Main page: `pages/index.js` (update copy, links, metrics).
- Forms: API routes in `pages/api/contact.js` and `pages/api/dataroom.js` (Nodemailer).
- PDF: Put your latest plan in `/public/Biochar_Carbon_Sequestration_Business_Plan_Full.pdf`.
- SEO: OG image at `/public/og.jpg`, `robots.txt`, and a basic `sitemap.xml` placeholder (update your domain).

## Accessibility & Performance
The UI uses semantic HTML, focus states, large tap targets, and responsive layout. Test Lighthouse and tweak as needed.