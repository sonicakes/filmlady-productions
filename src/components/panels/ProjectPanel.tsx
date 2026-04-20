import React from 'react'
import clsx from 'clsx'
import { StaticImage } from 'gatsby-plugin-image'
import type { Project } from '../../types'

// ─── Project image ────────────────────────────────────────────────────────────
// StaticImage src must be a string literal — Gatsby parses these paths at
// build time to generate optimised WebP variants and srcSets. A variable path
// would fail. Each imageType gets its own explicit branch as a result.
function ProjectImage({ imageType }: { imageType: Project['imageType'] }) {
  if (imageType === 'canvas-blog') {
    return (
      <StaticImage
        src="../../images/cinefile-blog.png"
        alt="The Cinefile Blog"
        layout="fullWidth"
        objectFit="cover"
        objectPosition="center center"
        className="w-full h-full"
      />
    )
  }
  if (imageType === 'canvas-podcast') {
    return (
      <StaticImage
        src="../../images/kino-royale-pod.png"
        alt="Kino Royale Podcast"
        layout="fullWidth"
        objectFit="cover"
        objectPosition="center center"
        className="w-full h-full"
      />
    )
  }
  // sim-mock
  return (
    <StaticImage
      src="../../images/royal-simulator-poster.png"
      alt="The Royal Simulator"
      layout="fullWidth"
      objectFit="cover"
      objectPosition="center top"
      className="w-full h-full"
    />
  )
}

// ─── ProjectPanel ─────────────────────────────────────────────────────────────
interface Props {
  project:  Project
  isActive: boolean
}

const BG_BY_INDEX: Record<number, string> = {
  1: 'bg-void',
  2: 'bg-void-2',
  3: 'bg-void-3',
}

const SECONDARY_WORD: Record<number, { word: string; style: React.CSSProperties; speed: string; size: string }> = {
  1: { word: 'СЛОВА',   style: { top: '4%',  right: '-2%' }, speed: '0.55', size: 'text-[10rem]' },
  2: { word: 'ЗВУК',    style: { top: '3%',  right: '30%' }, speed: '0.45', size: 'text-[13rem]' },
  3: { word: 'УЖАС',    style: { top: '5%',  left:  '-2%' }, speed: '0.5',  size: 'text-[11rem]' },
}

export default function ProjectPanel({ project, isActive }: Props) {
  const {
    index, tag, title, titleAccent, format,
    description, tags, link, linkLabel,
    cyrillicWord, cyrillicLabel,
    imageType, reversed,
  } = project

  return (
    <section
      className={clsx(
        'relative w-screen min-h-screen md:h-screen flex-shrink-0 flex items-center justify-center md:overflow-hidden py-20 md:py-0',
        BG_BY_INDEX[index] ?? 'bg-void',
      )}
    >
      {/* Section counter */}
      <div className="absolute top-10 right-12 font-cinzel text-[0.65rem]
        tracking-[0.25em] text-gold-dim flex flex-col items-center gap-1">
        <span className="text-gold text-[0.8rem]">♛</span>
        <span>{cyrillicLabel}</span>
      </div>

      {/* Parallax background words */}
      <span
        className="parallax-word absolute font-cormorant font-light
          pointer-events-none select-none uppercase whitespace-nowrap
          text-[8rem] text-gold/[0.03] [-webkit-text-stroke:1px_rgba(201,168,76,0.04)]"
        data-speed={index === 1 ? '0.4' : index === 2 ? '0.25' : '0.35'}
        style={
          reversed
            ? { bottom: '-1%', left: '-1%' }
            : { bottom: '-6%', right: '-3%' }
        }
      >
        {cyrillicWord}
      </span>
      {SECONDARY_WORD[index] && (
        <span
          className={`parallax-word absolute font-cormorant font-light pointer-events-none select-none whitespace-nowrap
            ${SECONDARY_WORD[index].size} text-gold/[0.02] [-webkit-text-stroke:1px_rgba(201,168,76,0.03)]`}
          data-speed={SECONDARY_WORD[index].speed}
          style={SECONDARY_WORD[index].style}
        >
          {SECONDARY_WORD[index].word}
        </span>
      )}

      {/* Main grid */}
      <div
        className={clsx(
          'grid grid-cols-1 md:grid-cols-2 w-[85vw] max-w-[1200px] gap-12 md:gap-20 items-center',
          reversed && 'md:[direction:rtl]',
        )}
      >
        {/* ── Image column ── */}
        <div
          className={clsx(
            'relative overflow-hidden aspect-[4/5] max-h-[65vh] group',
            reversed && 'md:[direction:ltr]',
          )}
        >
          <ProjectImage imageType={imageType} />

          {/* Curtain — mobile: always gone (scale-y-0).
               Desktop: covers image until panel is active or hovered. */}
          <div
            className={clsx(
              'absolute inset-0 bg-void origin-top transition-transform duration-700 ease-[cubic-bezier(0.76,0,0.24,1)]',
              'scale-y-0',                                                   // mobile: hidden
              !isActive && 'md:scale-y-100 md:group-hover:scale-y-0',        // desktop inactive
            )}
          />

          {/* CTA — mobile: always visible. Desktop: fades in on active or hover. */}
          <div
            className={clsx(
              'absolute inset-0 flex flex-col items-center justify-end p-8 bg-gradient-to-t from-void/90 to-transparent transition-opacity duration-500',
              'opacity-100',                                                  // mobile: always visible
              !isActive && 'md:opacity-0 md:group-hover:opacity-100 md:delay-300', // desktop inactive
            )}
          >
            <a
              href={link}
              target={link !== '#' ? '_blank' : undefined}
              rel="noreferrer"
              data-hoverable
              className="font-cinzel text-[0.6rem] tracking-[0.4em] text-gold
                border border-gold-dim px-6 py-2
                hover:bg-gold/10 hover:border-gold transition-all"
            >
              {linkLabel} →
            </a>
          </div>
        </div>

        {/* ── Text column ── */}
        <div className={clsx('relative', reversed && 'md:[direction:ltr]')}>
          <span className="absolute -top-10 -left-4 font-cormorant font-light
            text-[6rem] leading-none select-none
            text-gold/[0.07] [-webkit-text-stroke:1px_rgba(201,168,76,0.1)]">
            {String(index).padStart(2, '0')}
          </span>

          <div className="relative font-cinzel text-[0.55rem] tracking-[0.4em] text-gold
            mb-4 flex items-center gap-3">
            <span className="block w-6 h-px bg-gold" />
            {tag}
          </div>

          <h2 className="relative font-cormorant font-light text-parchment
            leading-[1.1] mb-2"
            style={{ fontSize: 'clamp(2rem, 3.5vw, 3rem)' }}>
            {title.map((line, i) => (
              <span key={i} className={clsx('block', i === titleAccent && 'italic text-gold')}>
                {line}
              </span>
            ))}
          </h2>

          <p className="font-garamond text-[0.85rem] italic text-gold-dim mb-7 tracking-wide">
            {format}
          </p>

          <p className="font-garamond text-base leading-[1.85] text-parchment-dim mb-8 whitespace-pre-line">
            {description}
          </p>

          <div className="flex flex-wrap gap-2 mb-8">
            {tags.map((t) => (
              <span key={t} className="font-cinzel text-[0.5rem] tracking-[0.2em]
                text-gold-dim border border-gold/20 px-3 py-1">
                {t}
              </span>
            ))}
          </div>

          <a
            href={link}
            target={link !== '#' ? '_blank' : undefined}
            rel="noreferrer"
            data-hoverable
            className="project-link inline-flex items-center gap-3 font-cinzel
              text-[0.6rem] tracking-[0.35em] text-gold
              transition-all duration-300 after:content-['→'] after:transition-transform
              hover:after:translate-x-1"
          >
            {linkLabel}
          </a>
        </div>
      </div>
    </section>
  )
}
