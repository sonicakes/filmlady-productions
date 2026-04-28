import React from 'react'
import CrownIcon from '../layout/CrownIcon'

function toRoman(n: number): string {
  const vals = [1000,900,500,400,100,90,50,40,10,9,5,4,1]
  const syms = ['M','CM','D','CD','C','XC','L','XL','X','IX','V','IV','I']
  let result = ''
  for (let i = 0; i < vals.length; i++) {
    while (n >= vals[i]) { result += syms[i]; n -= vals[i] }
  }
  return result
}

const LINKS = [
  {
    label: 'Github',
    href:  'https://github.com/sonicakes',
    sub:   '@sonicakes',
  },
  {
    label: 'Letterboxd',
    href:  'https://letterboxd.com/filmladyroyal/',
    sub:   '@filmladyroyal',
  },
  {
    label: 'Bluesky',
    href:  'https://bsky.app/profile/filmladyroyal.bsky.social',
    sub:   '@filmladyroyal',
  },
  {
    label: 'Contact',
    href:  'mailto:hello@filmladyproductions.com',
    sub:   'hello@filmladyproductions.com',
  },
]

export default function FooterPanel() {
  return (
    <section className="relative w-screen min-h-screen md:h-screen flex-shrink-0 flex flex-col items-center justify-center bg-void md:overflow-hidden py-20 md:py-0">

      {/* Decorative Cyrillic words */}
      <span
        className="parallax-word absolute font-cormorant font-light
          pointer-events-none select-none uppercase whitespace-nowrap
          text-[8rem] text-gold/[0.03] [-webkit-text-stroke:1px_rgba(201,168,76,0.04)]"
        data-speed="0.2"
        style={{ bottom: '-3%', right: '-2%' }}
      >
       фильма
      </span>
      <span
        className="parallax-word absolute font-cormorant font-light
          pointer-events-none select-none whitespace-nowrap
          text-[12rem] text-gold/[0.02] [-webkit-text-stroke:1px_rgba(201,168,76,0.03)]"
        data-speed="0.35"
        style={{ top: '4%', left: '-3%' }}
      >
         КОНЕЦ
      </span>

      {/* Section counter */}
      <div className="absolute top-10 right-12 font-cinzel text-[0.65rem]
        tracking-[0.25em] text-gold-dim flex flex-col items-center gap-1">
        <CrownIcon className="w-4 h-3" />
        <span>КОДА</span>
      </div>

      {/* Centre content */}
      <div className="relative z-10 flex flex-col items-center text-center gap-8 w-[85vw] max-w-[700px]">

        {/* Crest — echoes the Foyer */}
        <svg className="w-14 h-14 opacity-60" viewBox="0 0 80 80" fill="none">
          <circle cx="40" cy="40" r="38" stroke="#c9a84c" strokeWidth="0.75" opacity="0.4" />
          <circle cx="40" cy="40" r="32" stroke="#c9a84c" strokeWidth="0.5"  opacity="0.25" />
          <path d="M26 42 L26 34 L32 38 L40 28 L48 38 L54 34 L54 42 Z"
            stroke="#c9a84c" strokeWidth="1" fill="none" />
          <rect x="24" y="42" width="32" height="5"
            stroke="#c9a84c" strokeWidth="1" fill="none" />
          <circle cx="40" cy="55" r="4"   stroke="#c9a84c" strokeWidth="0.75" opacity="0.5" />
          <circle cx="40" cy="55" r="1.5" fill="#c9a84c"   opacity="0.5" />
          <path d="M20 40 Q15 35 20 30" stroke="#c9a84c" strokeWidth="0.5" opacity="0.3" fill="none" />
          <path d="M60 40 Q65 35 60 30" stroke="#c9a84c" strokeWidth="0.5" opacity="0.3" fill="none" />
        </svg>

        <div>
          <h2 className="font-cormorant font-light text-parchment leading-none flex flex-col items-center gap-1">
            <span style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}>Film Lady</span>
            <span className="italic text-gold" style={{ fontSize: 'clamp(0.75rem, 1.2vw, 1rem)', letterSpacing: '0.45em' }}>productions</span>
          </h2>
        </div>

        <p className="font-garamond italic text-parchment-dim text-[0.95rem] leading-[1.8] tracking-wide">
          "The court is adjourned. You may be dismissed."
        </p>

        {/* Divider */}
        <div className="flex items-center gap-4 w-full">
          <span className="flex-1 block h-px bg-gold/20" />
          <span className="text-gold text-xs">✦</span>
          <span className="flex-1 block h-px bg-gold/20" />
        </div>

        {/* Social links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10 w-full">
          {LINKS.map(({ label, href, sub }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith('mailto') ? undefined : '_blank'}
              rel="noreferrer"
              data-hoverable
              className="flex flex-col items-center gap-1 group"
            >
              <span className="font-cinzel text-[0.65rem] tracking-[0.35em] text-gold
                group-hover:text-parchment transition-colors duration-300">
                {label}
              </span>
              <span className="font-garamond text-[0.9rem] italic text-gold-dim
                group-hover:text-parchment-dim transition-colors duration-300">
                {sub}
              </span>
            </a>
          ))}
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 w-full">
          <span className="flex-1 block h-px bg-gold/20" />
          <span className="text-gold text-xs">✦</span>
          <span className="flex-1 block h-px bg-gold/20" />
        </div>

        <p className="font-cinzel text-[0.55rem] tracking-[0.3em] text-gold-dim/60">
          © {toRoman(new Date().getFullYear())} Film Lady Productions · Nothing is reserved
        </p>
      </div>
    </section>
  )
}
