import React from 'react'
import portraitSrc from '../../images/film-lady-portrait.jpg'
import CrownIcon from '../layout/CrownIcon'

interface Props {
  onNavigate: (panelIndex: number) => void
}

export default function DecreePanel({ onNavigate }: Props) {
  return (
    <section id="decree-panel" className="relative w-screen min-h-screen md:h-screen flex-shrink-0 flex items-center justify-center bg-void-2 md:overflow-hidden py-20 md:py-0">

      {/* Section counter */}
      <div aria-hidden="true" className="absolute top-10 right-12 font-cinzel text-[0.65rem]
        tracking-[0.25em] text-gold-dim flex flex-col items-center gap-1">
        <CrownIcon className="w-4 h-3" />
        <span>N · УКАЗ</span>
      </div>

      {/* Decorative Cyrillic words */}
      <span
        aria-hidden="true"
        className="parallax-word absolute font-cormorant font-light
          pointer-events-none select-none whitespace-nowrap
          text-[8rem] text-gold/[0.03] [-webkit-text-stroke:1px_rgba(201,168,76,0.04)]"
        data-speed="0.3"
        style={{ bottom: '-4%', left: '-2%' }}
      >
        МАНИФЕСТ
      </span>
      <span
        aria-hidden="true"
        className="parallax-word absolute font-cormorant font-light
          pointer-events-none select-none whitespace-nowrap uppercase
          text-[12rem] text-gold/[0.02] [-webkit-text-stroke:1px_rgba(201,168,76,0.03)]"
        data-speed="0.15"
        style={{ top: '5%', right: '-4%' }}
      >
        критик
      </span>

      {/* Two-column grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 w-[85vw] max-w-[1200px] gap-16 md:gap-24 items-center">

        {/* ── Left: medallion + manifesto text ── */}
        <div className="relative">

          {/* Circular portrait medallion */}
          <div className="relative z-10 w-36 h-36 rounded-full overflow-hidden mb-5
            ring-1 ring-gold/30"
            style={{ boxShadow: '0 0 18px 4px rgba(201,168,76,0.25), 0 0 38px 8px rgba(201,168,76,0.10)' }}
          >
            <img
              src={portraitSrc as string}
              alt="The Film Lady"
              className="w-full h-full object-cover object-top"
              style={{ filter: 'sepia(0.1) contrast(1.05)' }}
            />
            {/* Subtle gold rim overlay */}
            <div className="absolute inset-0 rounded-full ring-1 ring-inset ring-gold/20 pointer-events-none" />
          </div>

          {/* Large decorative numeral behind the heading */}
          <span aria-hidden="true" className="absolute -top-12 -left-8 font-cormorant font-light
            text-[clamp(5rem,12vw,10rem)] leading-none select-none
            text-void-3 [-webkit-text-stroke:1px_rgba(201,168,76,0.15)]">
            N
          </span>

          <p className="relative font-cinzel text-[0.6rem] tracking-[0.4em] text-gold mb-6">
            The Royal Decree
          </p>

          <h2 className="relative font-cormorant font-light text-parchment leading-[1.2] mb-6"
            style={{ fontSize: 'clamp(2.2rem, 3.5vw, 3.2rem)' }}>
            A Pretentious Fake-Royalty<br />
            <em className="italic text-gold">Exiled Russian</em><br />
            Film Critic
          </h2>

          <div className="gold-rule" />

          <p className="font-garamond text-[1.05rem] leading-[1.85] text-parchment-dim">
            Once first in line to the throne of Imperial Russia. Now in exile in the depths of Terra Australis.{' '}
            <strong className="text-parchment font-medium">Film Lady Productions</strong>{' '}
            is a creative platform built on the sacred trinity of criticism,
            performance, and obsessive cinephilia.
          </p>
        </div>

        {/* ── Right: trinity cards ── */}
        <div className="flex flex-col gap-6">
          {[
            { pillar: 'Pillar I',   title: 'The Cinefile Blog',   desc: 'Written criticism, long-form reviews, the printed word', panelIndex: 2 },
            { pillar: 'Pillar II',  title: 'Kino Royale Podcast', desc: 'The spoken court, episodic deep dives, audio theatre',   panelIndex: 3 },
            { pillar: 'Pillar III', title: 'The Royal Simulator', desc: 'Interactive horror scenarios, audience as participant',   panelIndex: 4 },
          ].map(({ pillar, title, desc, panelIndex }) => (
            <button
              key={pillar}
              data-hoverable
              onClick={() => onNavigate(panelIndex)}
              className="trinity-card border-l border-gold-dim pl-6 py-4 text-left w-full
                group/card transition-colors duration-300"
            >
              <p className="font-cinzel text-[0.55rem] tracking-[0.35em] text-gold-dim mb-1">
                ✦ &nbsp; {pillar}
              </p>
              <div className="flex items-baseline justify-between gap-4">
                <p className="font-cormorant text-[1.3rem] text-parchment">{title}</p>
                <span aria-hidden="true" className="font-cinzel text-[0.55rem] tracking-[0.2em]
                  text-gold-dim opacity-0 group-hover/card:opacity-100
                  transition-opacity duration-300 flex-shrink-0">
                  Enter →
                </span>
              </div>
              <p className="font-garamond text-[0.9rem] italic text-parchment-dim mt-1">{desc}</p>
            </button>
          ))}

          <div className="gold-rule" />

          <p className="font-garamond text-[0.85rem] italic text-parchment-dim leading-[1.7]">
            "One title. Three formats. The Unholy Trinity."
          </p>
        </div>
      </div>
    </section>
  )
}
