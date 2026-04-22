# Film Lady Productions

A five-panel horizontal-scroll showcase site for **Film Lady Productions** — a creative studio encompassing film criticism, a podcast, and an interactive horror app. Built with Gatsby 5, TypeScript, Tailwind CSS 4, and GSAP ScrollTrigger.

The design language is **opulent gothic**: void-black backgrounds, antique gold, crimson accents, and aristocratic serif typography, consistent with the 'exiled Russian film critic royalty' persona.

---

## Projects Showcased

| Project | Description | Link |
|---|---|---|
| **The Cinefile Blog** | Long-form film criticism — gothic horror, prestige cinema, reviewed with forensic theatricality | [cinefileblog.com](https://cinefileblog.com) |
| **Kino Royale Podcast** | Deep-dive episodes dissecting single films, dramatised and dispatched with full exile-fuelled opinion | Spotify & ACX |
| **The Royal Simulator** | Interactive horror app — React/TypeScript/Vite, scenario JSON library drawn from film, novel, and TV | [royal-simulator.netlify.app](https://royal-simulator.netlify.app/) |

---

## Tech Stack

- **Gatsby 5** — static site generator, deploys to Netlify
- **TypeScript** — all source files (`.tsx` components, `.ts` utilities)
- **Tailwind CSS 4** — utility-first styling; no `tailwind.config.ts`, all design tokens declared via `@theme` in `globals.css`
- **GSAP + ScrollTrigger** — horizontal scroll mechanic; vertical wheel input drives horizontal panel movement
- **Framer Motion** — micro-animations (cursor hover, entry fade-ups)
- **clsx** — conditional class composition

---

## Site Structure

The site is a single page with six horizontal panels:

1. **Foyer** — animated gold dust particles, crest, enter button
2. **Decree** — portrait medallion, manifesto text, trinity cards
3. **Cinefile Blog** — project panel with curtain image reveal
4. **Kino Royale** — project panel (reversed layout)
5. **Royal Simulator** — project panel
6. **Footer**

Navigation: scroll (desktop), keyboard arrow keys, or right-edge nav dots. On mobile, panels stack vertically.

---

## Getting Started

Requires Node 18+. Confirm with `node -v`.

```bash
# Install dependencies
npm install

# Start local dev server
npm run develop
# → http://localhost:8000

# Production build
npm run build

# Serve built output (use this to verify font rendering)
npm run serve

# Clear Gatsby cache
npm run clean
```

> Fonts (Cormorant Garamond, Cinzel, EB Garamond) are loaded via Google Fonts in `gatsby-ssr.tsx`. They do not render in `gatsby develop` — use `build && serve` to verify final typography.

---

## Project Structure

```
src/
├── styles/globals.css        # Tailwind 4 @theme tokens + mobile overrides
├── types/index.ts            # Project interface
├── data/projects.ts          # All project copy, links, and labels (single source of truth)
├── hooks/useHorizontalScroll.ts  # GSAP ScrollTrigger + parallax + keyboard nav
├── components/
│   ├── layout/               # Cursor, NavDots, ProgressBar
│   └── panels/               # FoyerPanel, DecreePanel, ProjectPanel, FooterPanel
└── pages/index.tsx           # Page root — assembles all panels
```

---

## Deployment

Hosted on **Netlify**. Build config is in `netlify.toml`:

```toml
[build]
  command = "gatsby build"
  publish = "public"

[build.environment]
  NODE_VERSION = "20"
```

Push to `main` on GitHub → Netlify auto-deploys.

---

## Design Tokens

Core colours, usable as Tailwind utility classes:

| Token | Hex | Classes |
|---|---|---|
| `void` | `#0a0704` | `bg-void`, `text-void` |
| `gold` | `#c9a84c` | `bg-gold`, `text-gold`, `border-gold` |
| `crimson` | `#6b1a1a` | `bg-crimson`, `text-crimson` |
| `parchment` | `#e8dfc8` | `text-parchment` |

Fonts: `font-cormorant` (Cormorant Garamond), `font-cinzel` (Cinzel), `font-garamond` (EB Garamond).

---

*Film Lady Productions · Est. 2025*
