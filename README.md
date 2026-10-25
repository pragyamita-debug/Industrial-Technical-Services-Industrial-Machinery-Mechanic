# Industrial Profile Dashboard

An animated, black-steel and molten-orange profile site in a precision-manufacturing style, with glowing
industrial imagery.

## Edit the content

Everything on the page comes from **`src/data/profile.ts`**. Replace the placeholder values ("Your Name",
"Skill One" …) and the whole site updates — no other file needs to change. The numbers in `stats` are the ones
that count up. To offer a "Download CV" button, put the file in `public/` and set `cvUrl`.

| On the page | Field in `profile.ts` |
| --- | --- |
| Hero statement, eyebrow, stats | `tagline` (split over two lines), role and first year, years / certifications / projects |
| Core skills | first three `skills` on photo cards; the rest as a tool belt |
| Experience band | `experience` — click a role to open its bullets |
| Projects | `projects`, over a blueprint that draws itself in |
| Track record | `achievements` (the first figure in each counts up), `certifications`, `education` |
| Orange band | `motto` and the first of `goals` |
| Steel footer | name, headline, contact details, location |

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
npm run typecheck
npm run build        # static build in dist/ (deployed to GitHub Pages by .github/workflows/deploy.yml)
npm run build:single # one self-contained dist-single/index.html
```

Stack: Vite, React 18, TypeScript. Fonts (Space Grotesk, JetBrains Mono) are bundled locally. Photos are cut from
the reference designs and enlarged with Real-ESRGAN.

> GitHub Pages must be switched on once (Settings → Pages → Source: GitHub Actions) for the deploy workflow to publish.
