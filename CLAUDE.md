# Film Lady Productions — Claude Code Guide

## Project Overview

A five-panel **horizontal-scroll showcase site** for Film Lady Productions, built with Gatsby 5 + TypeScript + Tailwind CSS 4 + GSAP ScrollTrigger. The aesthetic is **opulent gothic**: void-black backgrounds, antique gold, crimson accents, aristocratic serif typography, and Cyrillic parallax text — consistent with the 'exiled Russian film critic royalty' persona.

The site showcases three creative projects: the **Cinefile Blog**, **Kino Royale Podcast**, and the **Royal Simulator** app.

Deployed to: Netlify  
Repo: https://github.com/sonicakes/filmlady-productions  
Brief: `flp-gatsby-brief.md` (full spec, read it for context)  
HTML prototype: `C:\Users\sonia\Downloads\index.html` (reference for canvas/cursor logic)

---

## Technology Stack

| Layer | Choice | Notes |
|---|---|---|
| Framework | Gatsby 5 | Static site, deploys to Netlify |
| Language | TypeScript | `.tsx` for components, `.ts` for utilities |
| Styling | Tailwind CSS 4 | No `tailwind.config.ts` — all config in `globals.css` via `@theme` |
| Animation | GSAP + ScrollTrigger | Horizontal scroll mechanic |
| Micro-animation | Framer Motion | Cursor hover, entry fade-ups |
| Utilities | clsx | Conditional class composition |
| Fonts | Google Fonts via `gatsby-ssr.tsx` | **Not** via `gatsby-plugin-google-fonts` |

### Do not substitute any of these without a clear reason.

---

## Design Tokens (Tailwind 4 `@theme`)

Declared in `src/styles/globals.css`. These generate utility classes automatically.

```
--color-void           #0a0704      → bg-void, text-void
--color-void-2         #130e09
--color-void-3         #1c1510
--color-gold           #c9a84c      → text-gold, bg-gold, border-gold
--color-gold-light     #e8cc7a
--color-gold-dim       #8a6e2a
--color-crimson        #6b1a1a
--color-crimson-bright #9b2a2a
--color-parchment      #e8dfc8
--color-parchment-dim  #b8af98

--font-cormorant  'Cormorant Garamond', serif   → font-cormorant
--font-cinzel     'Cinzel', serif               → font-cinzel
--font-garamond   'EB Garamond', serif          → font-garamond
```

Opacity modifiers work normally: `text-gold/50`, `bg-void/80`.

---

## File Structure

```
filmlady-productions/
├── CLAUDE.md
├── flp-gatsby-brief.md          ← full project brief
├── gatsby-config.ts
├── gatsby-browser.tsx           ← globals.css import + GSAP plugin registration
├── gatsby-ssr.tsx               ← Google Fonts <link> tags live here
├── postcss.config.js            ← @tailwindcss/postcss adapter (Tailwind 4)
├── netlify.toml
├── tsconfig.json
└── src/
    ├── styles/
    │   └── globals.css          ← @import tailwindcss + @theme tokens + mobile overrides
    ├── types/
    │   └── index.ts             ← Project interface
    ├── data/
    │   └── projects.ts          ← Single source of truth for all project copy ⚠️ USER-EDITED
    ├── hooks/
    │   └── useHorizontalScroll.ts  ← GSAP ScrollTrigger + parallax + keyboard nav
    ├── components/
    │   ├── layout/
    │   │   ├── Cursor.tsx       ← Gold reticle with lerp lag
    │   │   ├── NavDots.tsx      ← Right-edge dots, click to jump panel
    │   │   └── ProgressBar.tsx  ← Gold bar along bottom edge
    │   └── panels/
    │       ├── FoyerPanel.tsx   ← Canvas particle system, crest SVG, enter button
    │       ├── DecreePanel.tsx  ← Medallion portrait, manifesto, trinity cards
    │       ├── ProjectPanel.tsx ← Reusable, receives Project prop
    │       └── FooterPanel.tsx  ← Final panel
    ├── images/
    │   ├── film-lady-portrait.jpg
    │   ├── cinefile-blog.png
    │   ├── kino-royale-pod.png
    │   └── royal-simulator-poster.png
    └── pages/
        └── index.tsx            ← Assembles all panels, PANEL_COUNT = 6
```

---

## Architecture — Key Rules

### GSAP / ScrollTrigger
- **Never call GSAP at module level.** All GSAP code runs inside `useGSAP` or `useEffect` (client-side only).
- GSAP plugin registration (`ScrollTrigger`, `ScrollToPlugin`) happens in `gatsby-browser.tsx` — not in components.
- `window`/`document` access anywhere outside a hook must be guarded: `if (typeof window !== 'undefined')`.
- The scroll mechanic: `containerRef` is pinned by GSAP; `trackRef` (the flex row) is what actually translates horizontally.

### Tailwind 4
- No `tailwind.config.ts`. Design tokens live entirely in the `@theme` block in `globals.css`.
- PostCSS adapter: `@tailwindcss/postcss` in `postcss.config.js`. No autoprefixer needed.
- `@import "tailwindcss"` replaces the old three-line base/components/utilities directives.

### Fonts
- Fonts are loaded in `gatsby-ssr.tsx` via `<link>` tags — **not** via `gatsby-plugin-google-fonts`.
- They don't render in `gatsby develop` until full build. Use `gatsby build && gatsby serve` to verify font output.

### Images
- Project images use `StaticImage` from `gatsby-plugin-image`.
- The portrait medallion in DecreePanel uses a plain `<img>` tag (StaticImage broke the fixed circular container).
- `gatsby-source-filesystem` is installed and required by `StaticImage`.

### Mobile
- On mobile, GSAP horizontal scroll is skipped entirely; panels stack vertically.
- Classes `scroll-container` and `scroll-track` in `globals.css` handle the mobile layout switch.
- Panels use `min-h-screen md:h-screen` + `md:overflow-hidden` + `py-20 md:py-0` to avoid content clipping.
- Curtain reveal is `scale-y-0` on mobile (images always visible); desktop-only on hover.

### React / Gatsby
- All component files include `import React from 'react'` — Gatsby uses the classic JSX transform.
- Performance-sensitive updates (cursor position, canvas frames) use refs + direct DOM mutation, **not** state. Setting state 60×/sec causes 60 re-renders/sec.
- `gatsby-plugin-manifest` is currently **commented out** — no `icon.png` yet.

---

## Panel Layout (PANEL_COUNT = 6)

| Index | Panel | Component |
|---|---|---|
| 0 | Foyer | `FoyerPanel` |
| 1 | Decree | `DecreePanel` |
| 2 | Cinefile Blog | `ProjectPanel` |
| 3 | Kino Royale | `ProjectPanel` |
| 4 | Royal Simulator | `ProjectPanel` |
| 5 | Footer | `FooterPanel` |

---

## Project Data — `src/data/projects.ts`

⚠️ **Do not overwrite this file.** It has been hand-edited by the user. Key user edits:
- `Est. 2025`
- Royal Simulator link: `https://royal-simulator.netlify.app/`
- Podcast link: `#` (placeholder — live URL TBD)

All persona copy, Cyrillic labels, section counters, and link text are defined here. Never hardcode these into components.

---

## Current Build Status

**Working:** All six panels render correctly on desktop and mobile.

### Still to do
1. **PWA icon** — create `src/images/icon.png`, then uncomment `gatsby-plugin-manifest` in `gatsby-config.ts`
2. **Push to GitHub** (`sonicakes/filmlady-productions`) and connect Netlify for deployment
3. Any remaining visual polish or copy tweaks

---

## Dev Commands

```bash
gatsby develop      # local dev server at localhost:8000
gatsby build        # production build
gatsby serve        # serve the built output (use to verify fonts)
gatsby clean        # clear .cache and public/
```

Node 18+ required. Confirm with `node -v`.

---

## Deployment

`netlify.toml` is configured: build command `gatsby build`, publish dir `public`, Node 20.

GitHub → Netlify: push to `main`, import repo in Netlify dashboard, auto-deploy on push.
