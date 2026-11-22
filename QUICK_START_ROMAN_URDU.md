# Updated portfolio — run aur deploy karne ka tareeqa

## Local computer par

1. Complete Editable Source ZIP extract karein.
2. VS Code mein folder open karein.
3. Node.js 20+ install karke `node --version` check karein (Node 22 tested).
4. `npm test` run karein; phir `node serve.js` run karein.
5. Browser mein `http://localhost:8080` open karein.
6. Work, About, Skills, Experience, Gallery, Contact, project pages aur dark/light theme ko test karein.
7. Browser suite ke liye `npm install`, Chrome path set, aur `npm run test:browser` use karein.

## Changes kahan karein

- Website design: `index.html`, `editorial.css`.
- Existing styling: `style.css`, `premium.css`.
- Projects and links: `modules/projects.js`; change ke baad `node tools/generate-case-studies.mjs`.
- LinkedIn/email: `modules/profile.js`, static hero links aur SEO tags.
- Contact form: `index.html` aur `modules/contact.js`.
- CV aur original profile photo: `Images/`.

## Publish

Recommended: feature branch par push karke PR review karein. Phir `main` mein merge karein. Existing `.github/workflows/pages.yml` public-only website files deploy karti hai. Alternative: deployable ZIP ke contents hosting root mein upload karein.

Important: Is environment mein actual GitHub push, live email delivery, Google sign-in, Firebase moderation aur full browser QA nahi hue. Local checks pass hain, lekin deployment se pehle live tests zaroor karein.
