# Film Lady Productions
## Gatsby Website — Build Brief & Tutorial
*Prepared for Claude Code · 2026*


---


# 1. Project Overview & Goals

This document is a complete build brief and step-by-step tutorial for constructing the Film Lady Productions showcase website using Gatsby 5, TypeScript, Tailwind CSS 4, and GSAP ScrollTrigger. It is written for Claude Code and should be followed sequentially.

The website is a **five-panel horizontal-scroll experience** that showcases three creative projects under the Film Lady Productions brand: the Cinefile Blog, Kino Royale Podcast, and the Royal Simulator app. The design language is **opulent gothic** — antique gold, deep void-black, crimson accents, and aristocratic typography — consistent with the 'exiled Russian film critic royalty' persona.


### Design decisions that must be preserved

- Horizontal scroll driven by GSAP ScrollTrigger pin + scrub (vertical wheel input → horizontal movement)
- Cormorant Garamond for display type, Cinzel for UI labels, EB Garamond for body text
- Custom gold reticle cursor with inertial lag
- Floating dust particles on the foyer panel (canvas/WebGL)
- Parallax Cyrillic words drifting at different depths per panel
- Project image hover reveal: curtain lifts to expose image + visit link
- Gold ruled progress bar along the bottom edge
- Section numbers in Cyrillic labels (БЛОГ, ПОДКАСТ, СИМУЛЯТОР)
- Nav dots on the right edge, keyboard arrow key navigation

---


# 2. Technology Stack

Every package choice below is intentional. Do not substitute alternatives without a clear reason.


## 2.1  Core Framework


### Gatsby 5

Gatsby is a React-based static site generator. It compiles your React components into plain HTML/CSS/JS at build time, meaning there is no server — the output is a folder of static files you deploy directly to Netlify. This is ideal for Film Lady Productions because the site has no dynamic data, deploys to the same Netlify account already hosting cinefileblog.com, and benefits from Gatsby's asset optimisation pipeline (image lazy-loading, font subsetting, JS chunking).

> Gatsby 5 requires Node 18+. Confirm with `node -v` before starting.


### TypeScript

All source files will use TypeScript (`.tsx` for components, `.ts` for utilities and data). TypeScript provides type-checking across the project, which is consistent with the Royal Simulator codebase. Gatsby 5 has first-class TypeScript support — no separate config needed beyond `tsconfig.json`.


### Tailwind CSS v4

Tailwind is a utility-first CSS framework. Rather than writing class names like `.project-title`, you compose styles inline: `className="font-cormorant text-4xl text-parchment"`. Tailwind 4 is a major departure from v3: there is **no tailwind.config.ts and no postcss.config.js**. Configuration has moved entirely into CSS. Design tokens — the Film Lady gold, void, crimson, and parchment values — are declared using the `@theme` directive inside `globals.css`, making the CSS file the single source of truth for the visual identity.


## 2.2  Animation Layer


### GSAP + ScrollTrigger

GSAP (GreenSock Animation Platform) is the industry-standard JavaScript animation library, used on the vast majority of Awwwards-level sites. Its **ScrollTrigger** plugin is what powers the horizontal scroll mechanic: it pins the scroll container, then maps the user's vertical scroll progress to a horizontal translateX movement. This approach is more robust than hand-rolled requestAnimationFrame loops because ScrollTrigger handles:

- Scroll velocity and inertia automatically
- Resize recalculation when the viewport changes
- Integration with Gatsby's client-side navigation lifecycle
- Scrub-linked animations — any animation can be tied to scroll position

GSAP is free for non-commercial use. The ScrollTrigger plugin is included in the free tier.


### Framer Motion

Used for component-level micro-animations that are not scroll-driven: the cursor hover scaling, panel entry fade-ups, and the simulator choice cycling. Framer Motion integrates cleanly with React's state model and is simpler than GSAP for purely declarative animations.


## 2.3  Supporting Packages

- **gatsby-plugin-image** — Gatsby's image optimisation pipeline. Automatically generates WebP variants, lazy-loads, and prevents layout shift. Use for any project screenshots or images.
- **gatsby-plugin-google-fonts** — Loads Cormorant Garamond, Cinzel, and EB Garamond from Google Fonts at build time, so they are inlined into the HTML rather than a runtime fetch.
- **gatsby-plugin-manifest** — Generates a web app manifest for PWA behaviour (icon, theme colour).
- **clsx** — A tiny utility for conditionally composing Tailwind class names. Replaces string interpolation in className props.

---


# 3. Project Scaffold — Step by Step

Follow these steps in order. Each command is explained so you understand what it does, not just what to type.


## 3.1  Initialise the Gatsby Project


### Why Gatsby's CLI

The Gatsby CLI `gatsby new` scaffolds a project with the correct Webpack config, Babel transforms, and Gatsby plugin wiring already in place. Starting from a plain `npm init` would require manually reproducing all of that. The TypeScript starter is the correct base.

1. Install the Gatsby CLI globally if not already present:
```bash
npm install -g gatsby-cli
```

2. Create the project using Gatsby's TypeScript starter:
```bash
gatsby new film-lady-productions https://github.com/gatsbyjs/gatsby-starter-minimal-ts
```

*This clones the minimal TypeScript starter — no bloat, no demo pages, just the bare scaffold.*

3. Enter the directory and confirm the structure:
```bash
cd film-lady-productions
ls
```

You should see: `src/`, `gatsby-config.ts`, `package.json`, `tsconfig.json`.


## 3.2  Install Dependencies


### Why install in one batch

Yarn (or npm) resolves the entire dependency tree in one pass. Installing packages individually creates multiple lockfile writes and can produce version conflicts.

1. Install all runtime dependencies:
```bash
npm install gsap @gsap/react framer-motion clsx
npm install gatsby-plugin-google-fonts gatsby-plugin-image gatsby-plugin-manifest
npm install gatsby-plugin-sharp gatsby-transformer-sharp
```

*gsap is the core library. @gsap/react provides the useGSAP hook which handles cleanup automatically in React 18's strict mode. gatsby-plugin-sharp is required by gatsby-plugin-image.*

2. Install Tailwind 4 and its PostCSS adapter:
```bash
npm install -D tailwindcss @tailwindcss/postcss postcss @types/gsap
```

*Tailwind 4 uses a PostCSS adapter rather than a config file. There is no tailwind.config.ts — configuration lives entirely in CSS.*


## 3.3  Configure Tailwind 4


### What changed in Tailwind 4

Tailwind 4 eliminates the JavaScript config file entirely. Instead of `tailwind.config.ts`, you use two new CSS primitives:

- `@import "tailwindcss"` — replaces the old three-line `@tailwind base/components/utilities` directives with a single import.
- `@theme { }` — declares your design tokens as CSS custom properties. Tailwind reads these and generates the corresponding utility classes automatically. `--color-gold: #c9a84c` becomes `text-gold`, `bg-gold`, `border-gold`, etc.


### Gatsby + Tailwind 4 wiring

For Gatsby, use `@tailwindcss/postcss` which Tailwind 4 provides for non-Vite environments.

1. Create `postcss.config.js` at the project root:
```js
module.exports = {
  plugins: {
    '@tailwindcss/postcss': {},
  },
}
```

*This is the only PostCSS config needed. No autoprefixer — Tailwind 4 handles vendor prefixing internally.*

2. Create `src/styles/globals.css` with the full design system:
```css
/* Tailwind 4: single import replaces @tailwind base/components/utilities */
@import "tailwindcss";

/* ── Film Lady Productions design tokens ────────────────────────────── */
/* @theme declares tokens as CSS variables AND generates utility classes. */
/* e.g. --color-gold → text-gold, bg-gold, border-gold, fill-gold, etc.  */
@theme {
  /* Colours */
  --color-void:           #0a0704;
  --color-void-2:         #130e09;
  --color-void-3:         #1c1510;
  --color-gold:           #c9a84c;
  --color-gold-light:     #e8cc7a;
  --color-gold-dim:       #8a6e2a;
  --color-crimson:        #6b1a1a;
  --color-crimson-bright: #9b2a2a;
  --color-parchment:      #e8dfc8;
  --color-parchment-dim:  #b8af98;

  /* Font families */
  --font-cormorant: 'Cormorant Garamond', serif;
  --font-cinzel:    'Cinzel', serif;
  --font-garamond:  'EB Garamond', serif;
}

/* ── Base resets ────────────────────────────────────────────────────── */
*, *::before, *::after { box-sizing: border-box; }
html, body { overflow: hidden; background: #0a0704; cursor: none; }
body { -webkit-font-smoothing: antialiased; }
```


### How to use the tokens in components

Once declared in `@theme`, the tokens are available as Tailwind utilities:

```tsx
// Color tokens → utility classes
className="text-gold"            // color: #c9a84c
className="bg-void"              // background: #0a0704
className="border-parchment-dim" // border-color: #b8af98

// Font tokens → utility classes
className="font-cormorant"       // font-family: Cormorant Garamond, serif
className="font-cinzel"          // font-family: Cinzel, serif
className="font-garamond"        // font-family: EB Garamond, serif

// Opacity modifiers still work as expected
className="text-gold/50"         // color: #c9a84c at 50% opacity
className="bg-void/80"           // background: #0a0704 at 80% opacity
```

3. Import globals.css in `gatsby-browser.tsx` (create if absent):
```tsx
import './src/styles/globals.css'
```


## 3.4  Configure Gatsby Plugins


### What gatsby-config.ts does

This file is Gatsby's central configuration. It tells Gatsby which plugins to load, what metadata to attach to the site's HTML head, and (for larger sites) where GraphQL data sources live. For this site the key plugins are the Google Fonts loader and the image pipeline.

1. Replace `gatsby-config.ts` with:
```ts
import type { GatsbyConfig } from 'gatsby'

const config: GatsbyConfig = {
  siteMetadata: {
    title: 'Film Lady Productions',
    description: 'A court of cinema, criticism & controlled chaos.',
    siteUrl: 'https://filmladyproductions.com',
  },
  plugins: [
    {
      resolve: 'gatsby-plugin-google-fonts',
      options: {
        fonts: [
          'Cormorant Garamond:300,300i,400,400i,600,600i',
          'Cinzel:400,600,900',
          'EB Garamond:400,400i,500,500i',
        ],
        display: 'swap',
      },
    },
    'gatsby-plugin-image',
    'gatsby-plugin-sharp',
    'gatsby-transformer-sharp',
    {
      resolve: 'gatsby-plugin-manifest',
      options: {
        name: 'Film Lady Productions',
        short_name: 'Film Lady',
        background_color: '#0a0704',
        theme_color: '#c9a84c',
        display: 'standalone',
        icon: 'src/images/icon.png',
      },
    },
  ],
}

export default config
```


---


# 4. File & Component Structure

This is the complete directory layout to build. Every file listed here needs to be created.

```
film-lady-productions/
├── gatsby-config.ts
├── gatsby-browser.tsx       ← import globals.css here
├── gatsby-ssr.tsx           ← mirror of gatsby-browser for SSR
├── postcss.config.js        ← @tailwindcss/postcss adapter (Tailwind 4)
├── tsconfig.json
├── src/
│   ├── styles/
│   │   └── globals.css      ← @import tailwindcss + @theme tokens here
│   ├── data/
│   │   └── projects.ts      ← typed project data objects
│   ├── types/
│   │   └── index.ts         ← shared TypeScript interfaces
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Cursor.tsx
│   │   │   ├── NavDots.tsx
│   │   │   └── ProgressBar.tsx
│   │   └── panels/
│   │       ├── FoyerPanel.tsx
│   │       ├── DecreePanel.tsx
│   │       └── ProjectPanel.tsx   ← reusable, takes Project as prop
│   ├── hooks/
│   │   └── useHorizontalScroll.ts ← GSAP ScrollTrigger logic here
│   ├── images/
│   │   └── icon.png
│   └── pages/
│       └── index.tsx        ← assembles all panels
```


## 4.1  src/types/index.ts

Define the shared data shape for a project entry. All three projects conform to this interface.

```ts
export interface Project {
  id:           string         // 'blog' | 'podcast' | 'simulator'
  index:        number         // 1 | 2 | 3
  tag:          string         // e.g. 'The Written Word'
  title:        string[]       // split lines, e.g. ['The Cinefile', 'Blog']
  titleAccent:  number         // which line index gets gold italic styling
  format:       string         // e.g. 'cinefileblog.com · Est. 2025'
  description:  string
  tags:         string[]       // pill tags
  link:         string         // href
  linkLabel:    string         // CTA text
  cyrillicWord: string         // parallax background word
  cyrillicLabel: string        // section counter label e.g. 'II · БЛОГ'
  imageType:    'canvas-blog' | 'canvas-podcast' | 'sim-mock'
  reversed:     boolean        // true = image on right
}
```


## 4.2  src/data/projects.ts

A typed array of the three projects. This is the single source of truth — changing copy, links, or labels happens here, not scattered across components.

```ts
import type { Project } from '../types'

export const projects: Project[] = [
  {
    id: 'blog',
    index: 1,
    tag: 'The Written Word',
    title: ['The Cinefile', 'Blog'],
    titleAccent: 1,
    format: 'cinefileblog.com · Est. 2025',
    description: `Long-form criticism from the exile's desk. Gothic horror,
prestige cinema, and the films that haunt you — reviewed with forensic
theatricality and a complete disregard for brevity.`,
    tags: ['Film Criticism', 'Gothic Horror', 'Prestige Cinema', 'Letterboxd'],
    link: 'https://cinefileblog.com',
    linkLabel: 'Enter the Archive',
    cyrillicWord: 'РЕЦЕНЗИЯ',
    cyrillicLabel: 'II · БЛОГ',
    imageType: 'canvas-blog',
    reversed: false,
  },
  {
    id: 'podcast',
    index: 2,
    tag: 'The Spoken Court',
    title: ['Kino', 'Royale'],
    titleAccent: 1,
    format: 'Podcast · Spotify & ACX',
    description: `The Film Lady holds court. Each episode is a deep-dive
audience with a single film — dissected, dramatised, and dispatched with
the full weight of exile-fuelled opinion.`,
    tags: ['Audio', 'Deep Dives', 'Spotify', 'ACX'],
    link: 'https://kinoroyalepodcast.com',
    linkLabel: 'Hear the Proclamation',
    cyrillicWord: 'КИНО',
    cyrillicLabel: 'III · ПОДКАСТ',
    imageType: 'canvas-podcast',
    reversed: true,
  },
  {
    id: 'simulator',
    index: 3,
    tag: 'Interactive Horror',
    title: ['The Royal', 'Simulator'],
    titleAccent: 1,
    format: 'React · TypeScript · Vite · GitHub Pages',
    description: `You are the exiled royal. You are placed inside the horror.
What do you do? A growing library of scenario JSON objects drawn from film,
novel, and television — each demanding a response worthy of the Crown.`,
    tags: ['React', 'TypeScript', 'Vite', 'JSON Scenarios', 'Horror'],
    link: 'https://github.com/filmladyroyal',
    linkLabel: 'Enter the Simulation',
    cyrillicWord: 'КОРОЛЕВА',
    cyrillicLabel: 'IV · СИМУЛЯТОР',
    imageType: 'sim-mock',
    reversed: false,
  },
]
```


---


# 5. GSAP Horizontal Scroll — Deep Dive

This section explains the ScrollTrigger mechanic in detail. Read it before writing any code.


## 5.1  How ScrollTrigger Pin + Scrub Works

**The core idea: **you create a scroll container that is taller than the viewport (to give the user scroll room), but you **pin** it in place visually so it never actually moves down the page. Instead, as the user scrolls down, GSAP intercepts that scroll progress and uses it to **scrub** (drive) a horizontal translateX animation. The result: scrolling down moves the content sideways.


### The three ScrollTrigger options that make this work

- **pin: true** — tells ScrollTrigger to fix (pin) the trigger element in the viewport while the user scrolls through the declared scroll length. The element stays visually static while the URL's scroll position advances.
- **scrub: 1** — ties the animation progress directly to scroll position. The number (1) is a smoothing factor in seconds — it adds slight lag so the scroll feels weighty rather than instantaneous. Higher numbers = more lag.
- **end: () => totalScrollWidth** — defines where the scroll ends. This must equal the total horizontal distance the container needs to travel (total panels width minus one viewport width).


### Why GSAP over CSS scroll-snap or overflow-x

CSS scroll-snap and overflow-x: scroll give you native horizontal scroll, but they hand control to the browser. You lose the ability to:

- Tie parallax word positions to the exact scroll progress
- Sequence entry animations relative to panel position
- Control the scroll easing and inertia
- Cleanly reset/kill animations on React component unmount


## 5.2  The useHorizontalScroll Hook


### Why a custom hook

The GSAP logic needs to run after the DOM is mounted and must clean up when the component unmounts. A React hook is the correct place for this — it encapsulates the setup/cleanup lifecycle using `useGSAP` from `@gsap/react`, which is GSAP's official React integration.

Create `src/hooks/useHorizontalScroll.ts`:

```ts
import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Register the ScrollTrigger plugin.
// Must happen once before any ScrollTrigger usage.
gsap.registerPlugin(ScrollTrigger)

interface UseHorizontalScrollOptions {
  panelCount: number
}

export function useHorizontalScroll({ panelCount }: UseHorizontalScrollOptions) {
  const containerRef = useRef<HTMLDivElement>(null)
  const trackRef     = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    const container = containerRef.current
    const track     = trackRef.current
    if (!container || !track) return

    const totalScrollWidth = (panelCount - 1) * window.innerWidth

    const tween = gsap.to(track, {
      x: -totalScrollWidth,
      ease: 'none',
      scrollTrigger: {
        trigger:           container,
        start:             'top top',
        end:               () => `+=${totalScrollWidth}`,
        pin:               true,
        scrub:             1.2,
        anticipatePin:     1,
        invalidateOnRefresh: true
      }
    })

    return () => { tween.kill() }
  }, { scope: containerRef })

  return { containerRef, trackRef }
}
```


### What each part does — line by line

- `gsap.registerPlugin(ScrollTrigger)` — GSAP uses a plugin architecture. ScrollTrigger is not included by default; you must register it before using it. Do this once at the module level, not inside a component.
- `useGSAP(() => {...}, { scope: containerRef })` — GSAP's React hook. It replaces useEffect for GSAP code. The scope option scopes selector queries to the container element and ensures cleanup when the component unmounts.
- `ease: 'none'` — the tween itself has no easing because the scroll position is the driver. If you added easing here, the track would accelerate/decelerate relative to scroll, which would feel wrong.
- `scrub: 1.2` — adds 1.2 seconds of smoothing lag. The track catches up to where scroll says it should be over 1.2s. This creates the heavy, inertial feel suited to the opulent aesthetic.
- `pin: true` — the most important option. Without this, the container would scroll normally and the translateX animation would fight against the vertical scroll.
- `invalidateOnRefresh: true` — when the window resizes, ScrollTrigger recalculates the start/end values. Without this, the scroll distance breaks on resize.


## 5.3  Parallax Within the Scroll

The Cyrillic background words move at a different speed than the main content, creating depth. Add this inside the same `useGSAP` callback, after the main tween:

```ts
const parallaxWords = track.querySelectorAll<HTMLElement>('.parallax-word')

parallaxWords.forEach(word => {
  const speed = parseFloat(word.dataset.speed ?? '0.3')
  gsap.to(word, {
    x: -totalScrollWidth * speed,
    ease: 'none',
    scrollTrigger: {
      trigger: container,
      start:   'top top',
      end:     () => `+=${totalScrollWidth}`,
      scrub:   1.2,
    }
  })
})
```


## 5.4  Progress Bar

The gold progress bar reflects scroll progress. ScrollTrigger exposes an `onUpdate` callback that fires on every scroll tick:

```ts
onUpdate: (self) => {
  if (progressBarRef?.current) {
    progressBarRef.current.style.width = `${self.progress * 100}%`
  }
}
// self.progress is 0 at start, 1 at end.
```


---


# 6. Component Implementation


## 6.1  Cursor Component


### Why a custom cursor

The default OS cursor would break the Film Lady aesthetic. The custom gold reticle reinforces the theatrical, precision-focused persona. The inertial lag creates the sense of something heavy and deliberate moving through space. The lag is implemented with a `requestAnimationFrame` loop and linear interpolation (lerp):

```ts
// Linear interpolation: moves 'from' toward 'to' by factor 'ease'
const lerp = (from: number, to: number, ease: number) =>
  from + (to - from) * ease

// In the animation loop:
cx = lerp(cx, mouseX, 0.12)  // 0.12 = 12% per frame → ~8-frame lag
cy = lerp(cy, mouseY, 0.12)
```

Create `src/components/layout/Cursor.tsx`:

```tsx
'use client'
import { useEffect, useRef, useState } from 'react'

export default function Cursor() {
  const reticleRef = useRef<HTMLDivElement>(null)
  const [hovering, setHovering] = useState(false)
  const pos = useRef({ mx: 0, my: 0, cx: 0, cy: 0 })

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      pos.current.mx = e.clientX
      pos.current.my = e.clientY
    }
    window.addEventListener('mousemove', onMove)

    let raf: number
    const tick = () => {
      const p = pos.current
      p.cx += (p.mx - p.cx) * 0.12
      p.cy += (p.my - p.cy) * 0.12
      if (reticleRef.current) {
        reticleRef.current.style.left = p.cx + 'px'
        reticleRef.current.style.top  = p.cy + 'px'
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <>
      {/* True mouse position dot — instant */}
      <div className='fixed z-[10000] pointer-events-none w-[5px] h-[5px]
        rounded-full bg-gold -translate-x-1/2 -translate-y-1/2'
        style={{ left: pos.current.mx, top: pos.current.my }}
      />
      {/* Lagged reticle ring */}
      <div
        ref={reticleRef}
        className={`fixed z-[9999] pointer-events-none w-7 h-7
          -translate-x-1/2 -translate-y-1/2 transition-transform duration-150
          ${hovering ? 'scale-[1.6]' : 'scale-100'}`}
      >
        <svg viewBox='0 0 28 28' fill='none'>
          <line x1='14' y1='0' x2='14' y2='8' stroke='#c9a84c' strokeWidth='1'/>
          <line x1='14' y1='20' x2='14' y2='28' stroke='#c9a84c' strokeWidth='1'/>
          <line x1='0' y1='14' x2='8' y2='14' stroke='#c9a84c' strokeWidth='1'/>
          <line x1='20' y1='14' x2='28' y2='14' stroke='#c9a84c' strokeWidth='1'/>
          <circle cx='14' cy='14' r='4' stroke='#c9a84c' strokeWidth='1'/>
          <circle cx='14' cy='14' r='1.5' fill='#c9a84c'/>
        </svg>
      </div>
    </>
  )
}
```

> ⚠ The cursor component uses `style={{ left/top }}` in the render for the dot, but the actual live position is updated via `ref` in the RAF loop — NOT via state. Setting state 60 times per second would cause 60 re-renders per second, which would tank performance. Only the scale (hover state) uses React state because it changes rarely.


## 6.2  NavDots Component

The nav dots on the right edge allow clicking to jump to a panel. Expose the current panel index from the `useHorizontalScroll` hook via a `currentPanel` state, updated in ScrollTrigger's `onUpdate` callback:

```ts
onUpdate: (self) => {
  const panel = Math.round(self.progress * (panelCount - 1))
  setCurrentPanel(panel)
}

// scrollToPanel: programmatic jump to a panel index
const scrollToPanel = (index: number) => {
  const target = (index / (panelCount - 1)) * totalScrollWidth
  gsap.to(window, { scrollTo: target, duration: 1.2, ease: 'power2.inOut' })
  // Note: requires gsap ScrollToPlugin — add to registerPlugin()
}
```


## 6.3  ProjectPanel Component


### Why one reusable component

All three project panels share the same structure: a large image/mock on one side, project text on the other, a parallax word, and a section counter. Making this a single component that accepts a `Project` prop means:

- Copy changes happen in projects.ts, not in three separate components
- Layout bugs are fixed once, not three times
- The reversed prop handles the mirror layout for the podcast panel

Create `src/components/panels/ProjectPanel.tsx`:

```tsx
import type { Project } from '../../types'
import clsx from 'clsx'

interface Props { project: Project }

export default function ProjectPanel({ project }: Props) {
  const {
    tag, title, titleAccent, format,
    description, tags, link, linkLabel,
    cyrillicWord, cyrillicLabel, index, reversed
  } = project

  return (
    <section className='relative w-screen h-screen flex-shrink-0
      flex items-center justify-center overflow-hidden bg-void'>

      {/* Section counter */}
      <div className='absolute top-10 right-12 font-cinzel text-[0.6rem]
        tracking-[0.25em] text-gold-dim flex flex-col items-center gap-1'>
        <span className='text-gold text-sm'>♛</span>
        <span>{cyrillicLabel}</span>
      </div>

      {/* Parallax word */}
      <span
        className='parallax-word absolute font-cormorant text-[8rem]
          font-light pointer-events-none select-none whitespace-nowrap
          text-gold/[0.03]'
        data-speed={index === 1 ? '0.4' : index === 2 ? '0.25' : '0.35'}
        style={{ bottom: '5%', right: '-3%' }}
      >
        {cyrillicWord}
      </span>

      {/* Main grid */}
      <div className={clsx(
        'grid grid-cols-2 w-[85vw] max-w-[1200px] gap-20 items-center',
        reversed && 'direction-rtl'
      )}>

        {/* Image reveal */}
        <div className='relative overflow-hidden aspect-[4/5] max-h-[65vh] group'>
          <div className='w-full h-full bg-void-2' />
          {/* Curtain overlay — lifts on hover */}
          <div className='absolute inset-0 bg-void origin-top scale-y-100
            group-hover:scale-y-0 transition-transform duration-700
            ease-[cubic-bezier(0.76,0,0.24,1)]' />
          {/* Hover CTA */}
          <div className='absolute inset-0 flex flex-col items-center
            justify-end p-8 bg-gradient-to-t from-void/90 to-transparent
            opacity-0 group-hover:opacity-100 transition-opacity duration-500
            delay-300'>
            <a href={link}
              className='font-cinzel text-[0.6rem] tracking-[0.4em] text-gold
                border border-gold-dim px-6 py-2 hover:bg-gold/10
                hover:border-gold transition-all'>
              {linkLabel} →
            </a>
          </div>
        </div>

        {/* Text block */}
        <div className='relative'>
          <div className='font-cinzel text-[0.55rem] tracking-[0.4em]
            text-gold mb-4 flex items-center gap-3'>
            <span className='w-6 h-px bg-gold block' />
            {tag}
          </div>
          <h2 className='font-cormorant text-[clamp(2rem,3.5vw,3rem)]
            font-light text-parchment leading-[1.1] mb-2'>
            {title.map((line, i) => (
              <span key={i} className={clsx(
                'block', i === titleAccent && 'italic text-gold'
              )}>
                {line}
              </span>
            ))}
          </h2>
          <p className='font-garamond text-[0.85rem] italic text-gold-dim
            mb-7 tracking-wide'>{format}</p>
          <p className='font-garamond text-base leading-[1.85]
            text-parchment-dim mb-8 whitespace-pre-line'>{description}</p>
          <div className='flex flex-wrap gap-2 mb-8'>
            {tags.map(t => (
              <span key={t} className='font-cinzel text-[0.5rem]
                tracking-[0.2em] text-gold-dim border border-gold/20 px-3 py-1'>
                {t}
              </span>
            ))}
          </div>
          <a href={link} className='inline-flex items-center gap-3 font-cinzel
            text-[0.6rem] tracking-[0.35em] text-gold hover:gap-5 transition-all'>
            {linkLabel} →
          </a>
        </div>
      </div>
    </section>
  )
}
```


---


# 7. Assembling the Page

The index page brings everything together. Create `src/pages/index.tsx`:

```tsx
import type { HeadFC } from 'gatsby'
import { useRef } from 'react'
import { useHorizontalScroll } from '../hooks/useHorizontalScroll'
import { projects } from '../data/projects'
import Cursor from '../components/layout/Cursor'
import NavDots from '../components/layout/NavDots'
import ProgressBar from '../components/layout/ProgressBar'
import FoyerPanel from '../components/panels/FoyerPanel'
import DecreePanel from '../components/panels/DecreePanel'
import ProjectPanel from '../components/panels/ProjectPanel'

const PANEL_COUNT = 2 + projects.length

export default function IndexPage() {
  const progressBarRef = useRef<HTMLDivElement>(null)

  const { containerRef, trackRef, currentPanel, scrollToPanel } =
    useHorizontalScroll({ panelCount: PANEL_COUNT, progressBarRef })

  return (
    <>
      <Cursor />
      <NavDots count={PANEL_COUNT} current={currentPanel} onNavigate={scrollToPanel} />
      <ProgressBar ref={progressBarRef} />

      {/*
        containerRef: provides scroll height, pinned by GSAP
        trackRef: the flex row that actually moves horizontally
      */}
      <div ref={containerRef} className='w-full h-screen overflow-hidden'>
        <div ref={trackRef} className='flex h-full'
          style={{ width: `${PANEL_COUNT * 100}vw` }}>
          <FoyerPanel onEnter={() => scrollToPanel(1)} />
          <DecreePanel />
          {projects.map(project => (
            <ProjectPanel key={project.id} project={project} />
          ))}
        </div>
      </div>
    </>
  )
}

export const Head: HeadFC = () => <title>Film Lady Productions</title>
```


### Why the outer/inner div split

GSAP's `pin` freezes the **containerRef** element while scroll advances. The **trackRef** element inside it is what actually moves horizontally via translateX. They must be separate elements: if you tried to pin and translate the same element, the pin would fight the translation.


---


# 8. Canvas Particle System — Foyer


### Why a React useEffect for canvas

The canvas element is a low-level imperative API — it doesn't fit React's declarative model. The correct pattern is: render a `<canvas>` element declaratively, then use `useEffect` to grab a ref to it and run the imperative animation loop. The ref does not cause re-renders; the canvas is updated directly each frame.

Inside `FoyerPanel.tsx`, add the particle system:

```tsx
useEffect(() => {
  const canvas = canvasRef.current
  if (!canvas) return
  const ctx = canvas.getContext('2d')!

  const resize = () => {
    canvas.width  = window.innerWidth
    canvas.height = window.innerHeight
  }
  resize()
  window.addEventListener('resize', resize)

  type Particle = {
    x: number; y: number; vx: number; vy: number
    size: number; opacity: number; growing: boolean; rate: number
  }

  const make = (): Particle => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx: (Math.random() - 0.5) * 0.3,
    vy: -(Math.random() * 0.5 + 0.1),
    size: Math.random() * 1.5 + 0.3,
    opacity: 0, growing: true,
    rate: Math.random() * 0.015 + 0.003,
  })

  const particles: Particle[] = Array.from({ length: 120 }, make)

  let raf: number
  const draw = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    for (const p of particles) {
      p.x += p.vx; p.y += p.vy
      p.opacity += p.growing ? p.rate : -p.rate * 0.5
      if (p.opacity >= 0.6) p.growing = false
      if (p.opacity <= 0 || p.y < -10) Object.assign(p, make())
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(201,168,76,${p.opacity})`
      ctx.fill()
    }
    raf = requestAnimationFrame(draw)
  }
  draw()

  return () => {
    cancelAnimationFrame(raf)
    window.removeEventListener('resize', resize)
  }
}, [])
```


---


# 9. SSR Safety — Critical Gatsby Gotcha

Gatsby renders pages server-side (Node.js) at build time. **window, document, and all browser APIs do not exist in Node.js.** Any code that references them at module level will crash the build.


### The three rules

- **Never call GSAP at module level.** All GSAP code must be inside useEffect, useGSAP, or event handlers — all of which run client-side only.
- **Guard window access.** If you must reference window outside a hook, check:
```ts
if (typeof window !== 'undefined') {
  // safe to use window here
}
```

- **Use gatsby-browser.tsx for client-only setup.** GSAP plugin registration should happen in gatsby-browser.tsx, not at component level, to guarantee it only runs in the browser.

In `gatsby-browser.tsx`:

```tsx
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)

export { } // required for TypeScript module resolution
```


---


# 10. Netlify Deployment


## 10.1  netlify.toml

Create `netlify.toml` at the project root:

```toml
[build]
  command = "gatsby build"
  publish = "public"

[build.environment]
  NODE_VERSION = "20"

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options        = "SAMEORIGIN"
    X-Content-Type-Options = "nosniff"
```


## 10.2  GitHub → Netlify wiring

1. Push the project to a new GitHub repo: `film-lady-productions`
2. In Netlify dashboard: Add new site → Import from Git → select the repo
3. Netlify auto-detects `gatsby build` and `public/` from netlify.toml
4. Set a custom domain in Netlify's Domain Management panel if desired

---


# 11. Recommended Build Order for Claude Code

Follow this order. Each step produces something runnable so you can verify before continuing.

1. **Scaffold and install** — Section 3.1 through 3.4. Run `gatsby develop` and confirm the default Gatsby page loads at localhost:8000.
2. **Configure Tailwind 4** — Section 3.3. Add the design tokens to the `@theme` block in globals.css. Verify by adding a test element with `className="text-gold"` and confirming the gold colour renders.
3. **Create types and data** — `src/types/index.ts` and `src/data/projects.ts`. No visual output yet, but TypeScript will catch any shape errors immediately.
4. **Build the useHorizontalScroll hook** — Section 5.2. Wire it into a bare index.tsx with five placeholder `<section>` divs. Confirm horizontal scroll works before adding any visual polish.
5. **Build the Cursor component** — Section 6.1. Confirm the gold reticle appears and tracks the mouse with lag.
6. **Build FoyerPanel with canvas particles** — Section 8. Confirm the particle system runs.
7. **Build DecreePanel** with static layout.
8. **Build ProjectPanel** — Section 6.3. Wire up the first project (Blog) and confirm the hover reveal and parallax word work.
9. **Map all three projects** through ProjectPanel.
10. **Add NavDots, ProgressBar, and keyboard navigation.**
11. **Deploy to Netlify** — Section 10.

---


# 12. Notes & Reminders


### Fonts

Cormorant Garamond, Cinzel, and EB Garamond are loaded via `gatsby-plugin-google-fonts`. They will not render in development until the plugin runs — use `gatsby build && gatsby serve` to verify final font output.


### GSAP free tier

ScrollTrigger and ScrollToPlugin are both included in GSAP's free tier. If you ever need MorphSVG, DrawSVG, or SplitText (text character animations), those require a GSAP Club membership. They are not required for this build.


### The HTML prototype

The hand-built HTML prototype already contains the working canvas code, particle system, cursor lerp, and project copy. Reference it freely when implementing the React components — the logic translates directly, it just needs to be moved into useEffect hooks and typed.


### Persona consistency

All copy, section labels, link text, and Cyrillic words are defined in `src/data/projects.ts`. Do not hardcode persona copy into components. If the Film Lady's voice needs to change, it changes in one file.



---

*End of Brief · Film Lady Productions · 2026*