# Industrial Machinery Mechanic CV Dashboard

Candidates upload a CV (PDF, DOCX or TXT) and get an animated, black-steel and molten-orange dashboard for
industrial and technical trades — a precision-manufacturing layout with glowing industrial imagery.

The CV is read **in the browser** — nothing is uploaded to a server. The parsed profile is kept in `localStorage`
on the candidate's own device. Add `?demo` to the address to open the site filled from the fictional sample CV.

## What goes where

| On the page | Filled from the CV |
| --- | --- |
| Hero statement, eyebrow, stats | tagline (split over two lines), role and first year, years / certifications / projects counting up |
| "One mechanic. Complete control." | three core skills on photo cards (line taken from the CV's own bullets), remaining skills as a tool belt |
| Experience band | roles with thumbnails — click one to open its bullets — over the plant at sunrise, with counting figures |
| Projects | projects over a glowing blueprint that draws itself in |
| Track record | achievements (the first figure in each counts up), certifications and training next to the glowing shield |
| Orange band | motto and next goal |
| Steel footer | name, headline, contact details, location |

Trade qualifications (associate degrees, apprenticeships, certificates, NVQ/BTEC/HND, City & Guilds) are read as
separate education entries.

## Motion

- A molten sunrise climbs behind the steel gears on load, a sheen slides across the metal and sparks drift up.
- A second sunrise pulses over the plant in the experience band; the blueprint draws itself in and glows; the
  shield floats with a pulse ring; the steel mark turns slowly on the orange band; footer seams glow.
- Every card carries a light travelling around its border; photos zoom on hover; numbers count up on reveal.
- Everything respects `prefers-reduced-motion`.

## Develop

```bash
npm install
npm run dev          # local dev server
npm test             # parser tests (vitest)
npm run build        # static build in dist/ (deployed to GitHub Pages by .github/workflows/deploy.yml)
npm run build:single # one self-contained dist-single/index.html
npm run build:demo   # same, but opens already filled from the sample CV (showcase)
```

Stack: Vite, React 18, TypeScript, pdf.js and mammoth for reading files. Fonts (Space Grotesk, JetBrains Mono) are
bundled locally. Photos are cut from the reference designs and enlarged with Real-ESRGAN.

The sample CV and every name, email and company in it are fictional.

> GitHub Pages must be switched on once (Settings → Pages → Source: GitHub Actions) for the deploy workflow to publish.
