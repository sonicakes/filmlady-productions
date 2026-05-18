import React, { useEffect, useRef, useState } from 'react'
import clsx from 'clsx'
import { motion } from 'framer-motion'
import { StaticImage } from 'gatsby-plugin-image'
import { SiSpotify, SiApplepodcasts, SiIheartradio } from 'react-icons/si'
import { MdRssFeed } from 'react-icons/md'
import type { Project, ProjectSample } from '../../types'
import CrownIcon from '../layout/CrownIcon'

// ─── Project image ────────────────────────────────────────────────────────────
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

// ─── Shared close button ──────────────────────────────────────────────────────
function CloseBtn({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      data-hoverable
      aria-label="Close"
      className="absolute top-4 right-4 font-cinzel text-[0.6rem] tracking-[0.2em]
        text-gold-dim hover:text-gold transition-colors duration-200"
    >
      ✕
    </button>
  )
}

// ─── Quote overlay (Blog) — newspaper clippings ───────────────────────────────
const CLIP_ROTATIONS = ['-2deg', '1.8deg']
const CLIP_OFFSETS   = ['-6px',  '6px']

function Clipping({ movie, excerpt, quote, attribution, rotation, offsetX, zIndex }: {
  movie: string; excerpt: string; quote: string; attribution: string
  rotation: string; offsetX: string; zIndex: number
}) {
  return (
    <div
      className="relative bg-parchment px-5 pt-4 pb-5 w-full
        shadow-[3px_6px_20px_rgba(0,0,0,0.55)]"
      style={{ transform: `rotate(${rotation}) translateX(${offsetX})`, zIndex }}
    >
      {/* Movie stamp — absolute overlay, inset so it stays within card */}
      <div
        className="absolute top-3 right-3 w-11 h-11 rounded-full
          border-2 border-dashed border-crimson-bright
          flex items-center justify-center text-center
          bg-transparent"
        style={{ transform: 'rotate(15deg)' }}
      >
        <span className="font-cinzel text-crimson-bright leading-tight px-1"
          style={{ fontSize: '9px', letterSpacing: '0.06em', fontWeight: 700 }}>
          {movie}
        </span>
      </div>

      {/* Newspaper header */}
      <div className="border-t-[2.5px] border-b border-[#1a1209]/50 pt-[3px] pb-[5px] mb-3">
        <p className="font-cinzel text-[0.38rem] tracking-[0.45em] text-[#1a1209]/50 uppercase">
          The Cinefile Blog · Est. 2025
        </p>
      </div>

      {/* Excerpt */}
      <p className="font-garamond text-[#1a1209] text-[0.75rem] leading-[1.75] mb-3">
        {excerpt}
      </p>

      {/* Pull quote */}
      <blockquote className="border-l-[2px] border-[#1a1209]/35 pl-3 my-3">
        <p className="font-cormorant italic text-[#1a1209] text-[0.88rem] leading-[1.6]">
          &ldquo;{quote}&rdquo;
        </p>
      </blockquote>

      {/* Byline */}
      <p className="font-cinzel text-[0.38rem] tracking-[0.2em] text-[#1a1209]/50 mt-3">
        {attribution}
      </p>
    </div>
  )
}

function QuoteOverlay({
  sample, open, onClose,
}: { sample: Extract<ProjectSample, { type: 'quote' }>; open: boolean; onClose: () => void }) {
  useEffect(() => {
    if (open && window.innerWidth < 768) {
      const scrollY = window.scrollY
      document.body.style.overflow = 'hidden'
      document.body.style.position = 'fixed'
      document.body.style.width    = '100%'
      document.body.style.top      = `-${scrollY}px`
      return () => {
        document.body.style.overflow = ''
        document.body.style.position = ''
        document.body.style.width    = ''
        document.body.style.top      = ''
        window.scrollTo(0, scrollY)
      }
    }
  }, [open])

  return (
    <div
      className="fixed md:absolute inset-0 z-[200] bg-void/97 flex flex-col justify-center
        gap-0 px-6 py-8 transition-opacity duration-500 overflow-y-auto"
      style={{ opacity: open ? 1 : 0, pointerEvents: open ? 'auto' : 'none' }}
    >
      <CloseBtn onClick={onClose} />
      {sample.clippings.map((clip, i) => (
        <div key={i} style={{ marginTop: i > 0 ? '-18px' : 0 }}>
          <Clipping
            movie={clip.movie}
            excerpt={clip.excerpt}
            quote={clip.quote}
            attribution={clip.attribution}
            rotation={CLIP_ROTATIONS[i] ?? '0deg'}
            offsetX={CLIP_OFFSETS[i]   ?? '0px'}
            zIndex={i + 1}
          />
        </div>
      ))}
    </div>
  )
}

// ─── Audio overlay (Podcast) ──────────────────────────────────────────────────
const BAR_PEAKS = [0.45, 0.8, 1, 0.65, 0.9, 0.55, 0.75, 0.4, 0.85, 0.6, 0.95, 0.5]

function AudioOverlay({
  sample, open, onClose,
}: { sample: Extract<ProjectSample, { type: 'audio' }>; open: boolean; onClose: () => void }) {
  const audioRef    = useRef<HTMLAudioElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)
  const timeRef     = useRef<HTMLSpanElement>(null)
  const [playing, setPlaying] = useState(false)
  const [volume,  setVolume]  = useState(1)

  const fmt = (s: number) =>
    `${Math.floor(s / 60)}:${Math.floor(s % 60).toString().padStart(2, '0')}`

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    const onUpdate = () => {
      const pct = audio.duration ? (audio.currentTime / audio.duration) * 100 : 0
      if (progressRef.current) progressRef.current.style.width = `${pct}%`
      if (timeRef.current)
        timeRef.current.textContent = `${fmt(audio.currentTime)} / ${fmt(audio.duration || 0)}`
    }
    const onEnded = () => setPlaying(false)
    audio.addEventListener('timeupdate', onUpdate)
    audio.addEventListener('ended', onEnded)
    return () => {
      audio.removeEventListener('timeupdate', onUpdate)
      audio.removeEventListener('ended', onEnded)
    }
  }, [])

  useEffect(() => {
    if (!open) {
      if (audioRef.current) { audioRef.current.pause(); setPlaying(false) }
      return
    }
    if (window.innerWidth < 768) {
      const scrollY = window.scrollY
      document.body.style.overflow = 'hidden'
      document.body.style.position = 'fixed'
      document.body.style.width    = '100%'
      document.body.style.top      = `-${scrollY}px`
      return () => {
        document.body.style.overflow = ''
        document.body.style.position = ''
        document.body.style.width    = ''
        document.body.style.top      = ''
        window.scrollTo(0, scrollY)
      }
    }
  }, [open])

  const toggle = () => {
    const audio = audioRef.current
    if (!audio) return
    if (playing) { audio.pause(); setPlaying(false) }
    else         { void audio.play(); setPlaying(true) }
  }

  const changeVolume = (v: number) => {
    setVolume(v)
    if (audioRef.current) audioRef.current.volume = v
  }

  return (
    <div
      className="fixed md:absolute inset-0 z-[200] bg-void/97 flex flex-col items-center
        justify-center gap-6 px-8 py-10 transition-opacity duration-500"
      style={{ opacity: open ? 1 : 0, pointerEvents: open ? 'auto' : 'none' }}
    >
      <CloseBtn onClick={onClose} />
      <audio ref={audioRef} src={sample.src} preload="metadata" />

      {/* ── Episode card ── */}
      <div className="w-full md:w-full border border-gold/30 px-6 py-5 flex flex-col gap-3 bg-void-3"
        style={{ width: 'calc(100% + 2rem)', marginLeft: '-1rem', marginRight: '-1rem' }}
      >
        <p className="font-cinzel text-gold-dim tracking-[0.35em]" style={{ fontSize: '9px' }}>
          {sample.episode}
        </p>
        <h3 className="font-cormorant italic text-gold leading-tight text-[1.4rem] md:text-[2rem]">
          {sample.title}
        </h3>
        <div className="w-8 h-px bg-gold/30" />
        <p className="font-garamond italic text-parchment-dim leading-[1.6]" style={{ fontSize: '13px', whiteSpace: 'pre-line' }}>
          {sample.subtitle}
        </p>
      </div>

      {/* ── Controls ── */}
      <div className="w-full flex flex-col items-center gap-4">

        {/* Animated EQ bars */}
        <div className="flex items-end gap-[4px]" style={{ height: '44px' }}>
          {BAR_PEAKS.map((peak, i) => (
            <motion.div
              key={i}
              className="rounded-full"
              style={{
                width: '3px',
                height: '44px',
                background: 'rgba(201,168,76,0.55)',
                originY: 1,
              }}
              animate={{ scaleY: playing ? peak : 0.08 }}
              transition={
                playing
                  ? { duration: 0.55 + i * 0.06, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }
                  : { duration: 0.4 }
              }
            />
          ))}
        </div>

        {/* Play / Pause */}
        <button
          onClick={toggle}
          data-hoverable
          aria-label={playing ? 'Pause' : 'Play'}
          className="w-14 h-14 flex items-center justify-center border border-gold/40
            hover:border-gold hover:bg-gold/10 transition-all duration-300"
        >
          {playing ? (
            <svg viewBox="0 0 20 20" className="w-5 h-5 fill-gold">
              <rect x="4" y="3" width="4" height="14" />
              <rect x="12" y="3" width="4" height="14" />
            </svg>
          ) : (
            <svg viewBox="0 0 20 20" className="w-5 h-5 fill-gold" style={{ marginLeft: '2px' }}>
              <polygon points="4,2 18,10 4,18" />
            </svg>
          )}
        </button>

        {/* Progress track */}
        <div className="w-full flex flex-col gap-2">
          <div className="relative w-full bg-gold/20" style={{ height: '2px' }}>
            <div
              ref={progressRef}
              className="absolute left-0 top-0 bg-gold"
              style={{ width: '0%', height: '2px' }}
            />
          </div>
          <span
            ref={timeRef}
            className="font-cinzel text-[0.5rem] tracking-[0.2em] text-gold-dim self-end"
          >
            0:00 / 0:00
          </span>
        </div>

        {/* Volume */}
        <div className="w-full flex items-center gap-3">
          {/* Speaker icon */}
          <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5"
            strokeLinecap="round" strokeLinejoin="round"
            className="w-4 h-4 flex-shrink-0 text-gold-dim"
          >
            <path d="M3 7.5h3l4-3v11l-4-3H3z" />
            {volume > 0   && <path d="M13 7a4 4 0 0 1 0 6" />}
            {volume > 0.5 && <path d="M15 5a7 7 0 0 1 0 10" />}
          </svg>
          <input
            type="range"
            min={0} max={1} step={0.02}
            value={volume}
            aria-label="Volume"
            onChange={e => changeVolume(Number(e.target.value))}
            className="flex-1 h-px appearance-none cursor-pointer"
            style={{
              accentColor: '#c9a84c',
              background: `linear-gradient(to right, #c9a84c ${volume * 100}%, rgba(201,168,76,0.2) ${volume * 100}%)`,
            }}
          />
        </div>
      </div>
    </div>
  )
}

// ─── Tarot card overlay (Simulator) ──────────────────────────────────────────
type CardScenario = { label: string; fate: string; imgKey?: string }

import hauntedHillImg   from '../../images/scenarios/haunted-hill.png'
import craftImg         from '../../images/scenarios/craft.png'
import rebeccaImg       from '../../images/scenarios/rebecca-og.png'
import blairWitchImg    from '../../images/scenarios/blair-witch.png'
import miseryImg        from '../../images/scenarios/misery-portrait.png'
import auditionImg      from '../../images/scenarios/audition.png'

const scenarioImages: Record<string, string> = {
  'haunted-hill':    hauntedHillImg,
  'craft':           craftImg,
  'rebecca-og':      rebeccaImg,
  'blair-witch':     blairWitchImg,
  'misery-portrait': miseryImg,
  'audition':        auditionImg,
}

function TarotCardOverlay({
  sample, open, onClose,
}: { sample: Extract<ProjectSample, { type: 'scenario' }>; open: boolean; onClose: () => void }) {
  const { scenarios } = sample
  const [flipped,  setFlipped]  = useState(false)
  const [scenario, setScenario] = useState<CardScenario | null>(null)

  const pickRandom = () => scenarios[Math.floor(Math.random() * scenarios.length)]

  const drawAgain = () => {
    setFlipped(false)
    setTimeout(() => {
      setScenario(pickRandom())
      setTimeout(() => setFlipped(true), 120)
    }, 750)
  }

  useEffect(() => {
    if (open) {
      const picked = pickRandom()
      setScenario(picked)
      setTimeout(() => setFlipped(true), 300)
      if (window.innerWidth < 768) {
        const scrollY = window.scrollY
        document.body.style.overflow = 'hidden'
        document.body.style.position = 'fixed'
        document.body.style.width    = '100%'
        document.body.style.top      = `-${scrollY}px`
        return () => {
          document.body.style.overflow = ''
          document.body.style.position = ''
          document.body.style.width    = ''
          document.body.style.top      = ''
          window.scrollTo(0, scrollY)
        }
      }
    } else {
      setFlipped(false)
      setScenario(null)
    }
  }, [open])

  return (
    <div
      className="fixed md:absolute inset-0 z-[200] bg-void/97 flex flex-col items-center
        justify-center gap-2 px-3 py-3 transition-opacity duration-500"
      style={{ opacity: open ? 1 : 0, pointerEvents: open ? 'auto' : 'none' }}
    >
      <CloseBtn onClick={onClose} />

      {/* Card — 3D flip container */}
      <div className="w-[90vw] md:w-[300px]" style={{ perspective: '1200px', height: 'clamp(360px, 75dvh, 560px)' }}>
        <div
          onClick={undefined}
          style={{
            position:        'relative',
            width:           '100%',
            height:          '100%',
            transformStyle:  'preserve-3d',
            transform:       flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
            transition:      'transform 0.75s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          {/* ── Card back ── */}
          <div
            className="absolute inset-0 border border-gold/35 overflow-hidden bg-void"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <svg className="absolute inset-0 w-full h-full opacity-[0.18]" preserveAspectRatio="xMidYMid slice">
              <defs>
                <pattern id="trellis" x="0" y="0" width="18" height="18" patternUnits="userSpaceOnUse">
                  <path d="M9 0 L18 9 L9 18 L0 9 Z" fill="none" stroke="#c9a84c" strokeWidth="0.6"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#trellis)" />
            </svg>
            <div className="absolute inset-[8px] border border-gold/20" />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
              <CrownIcon className="w-16 h-14 opacity-30" />
              <p className="font-cinzel text-gold/25" style={{ fontSize: '7.5px', letterSpacing: '0.35em' }}>
                ROYAL SIMULATOR
              </p>
            </div>
            {[['top-2 left-2', ''], ['top-2 right-2', 'rotate-90'], ['bottom-2 left-2', '-rotate-90'], ['bottom-2 right-2', 'rotate-180']].map(([pos, rot], i) => (
              <svg key={i} viewBox="0 0 10 10" className={`absolute ${pos} ${rot} w-3 h-3 opacity-20`}>
                <path d="M0 10 L0 0 L10 0" fill="none" stroke="#c9a84c" strokeWidth="1"/>
              </svg>
            ))}
          </div>

          {/* ── Card front — header top, illustration below ── */}
          <div
            className="absolute inset-0 border border-gold/35 bg-void overflow-hidden flex flex-col"
            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
          >
            <div className="absolute inset-[8px] border border-gold/15 pointer-events-none z-10" />

            {/* Header: title + fate text */}
            <div className="relative z-20 flex flex-col items-center gap-2 px-5 pt-6 pb-4 text-center bg-void">
              <p className="font-cinzel text-gold tracking-widest" style={{ fontSize: '13px', letterSpacing: '0.2em' }}>
                {scenario?.label}
              </p>
              <div className="w-10 h-px bg-gold/30" />
              <p className="font-garamond italic text-parchment-dim leading-[1.6]" style={{ fontSize: '13px' }}>
                {scenario?.fate}
              </p>
            </div>

            {/* Draw-again icon — centered over illustration */}
            {flipped && (
              <button
                onClick={e => { e.stopPropagation(); drawAgain() }}
                data-hoverable
                aria-label="Draw again"
                className="absolute inset-0 z-30 flex items-center justify-center
                  text-gold/0 hover:text-gold/70 transition-colors duration-300
                  bg-void/0 hover:bg-void/30"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10 drop-shadow-lg">
                  <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                  <path d="M3 3v5h5" />
                </svg>
              </button>
            )}

            {/* Illustration fills remaining height */}
            <div className="relative flex-1 overflow-hidden">
              {scenario?.imgKey ? (
                <img
                  src={scenarioImages[scenario.imgKey]}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover object-top"
                  style={{ filter: 'brightness(0.8) saturate(0.9)' }}
                />
              ) : (
                <svg className="absolute inset-0 w-full h-full opacity-[0.12]" preserveAspectRatio="xMidYMid slice">
                  <defs>
                    <pattern id="trellis-front" x="0" y="0" width="18" height="18" patternUnits="userSpaceOnUse">
                      <path d="M9 0 L18 9 L9 18 L0 9 Z" fill="none" stroke="#c9a84c" strokeWidth="0.6"/>
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#trellis-front)" />
                </svg>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile-only draw-again icon — shown below card after flip */}
      {flipped && (
        <button
          onClick={drawAgain}
          data-hoverable
          aria-label="Draw again"
          className="md:hidden text-gold-dim hover:text-gold transition-colors duration-300"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
          </svg>
        </button>
      )}
    </div>
  )
}

// ─── Platform icons ───────────────────────────────────────────────────────────
const PLATFORM_ICONS: Record<string, React.ComponentType<{ size?: number; 'aria-hidden'?: boolean }>> = {
  'Spotify':        SiSpotify,
  'Apple Podcasts': SiApplepodcasts,
  'iHeart':         SiIheartradio,
  'RSS':            MdRssFeed,
}

function PlatformIcon({ label }: { label: string }) {
  const Icon = PLATFORM_ICONS[label]
  return Icon ? <Icon size={18} aria-hidden /> : null
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
    description, tags, link, linkLabel, spotifyLink, platforms,
    cyrillicWord, cyrillicLabel,
    imageType, reversed, sample, sampleLabel,
  } = project

  const [sampleOpen, setSampleOpen] = useState(false)

  useEffect(() => {
    if (!isActive) setSampleOpen(false)
  }, [isActive])

  return (
    <section
      className={clsx(
        'relative w-screen min-h-screen md:h-screen flex-shrink-0 flex items-center justify-center md:overflow-hidden py-20 md:py-0',
        BG_BY_INDEX[index] ?? 'bg-void',
      )}
    >
      {/* Section counter */}
      <div aria-hidden="true" className="absolute top-10 right-12 font-cinzel text-[0.65rem]
        tracking-[0.25em] text-gold-dim flex flex-col items-center gap-1">
        <CrownIcon className="w-4 h-3" />
        <span>{cyrillicLabel}</span>
      </div>

      {/* Parallax background words */}
      <span
        aria-hidden="true"
        className="parallax-word absolute font-cormorant font-light
          pointer-events-none select-none uppercase whitespace-nowrap
          text-[8rem] text-gold/[0.03] [-webkit-text-stroke:1px_rgba(201,168,76,0.04)]"
        data-speed={index === 1 ? '0.4' : index === 2 ? '0.25' : '0.35'}
        style={reversed ? { bottom: '-1%', left: '-1%' } : { bottom: '-6%', right: '-3%' }}
      >
        {cyrillicWord}
      </span>
      {SECONDARY_WORD[index] && (
        <span
          aria-hidden="true"
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
        <div className={clsx('relative overflow-hidden max-h-[65vh] group', imageType === 'canvas-podcast' ? 'aspect-square' : 'aspect-[4/5]', reversed && 'md:[direction:ltr]')}>
          <ProjectImage imageType={imageType} />

          {/* Curtain */}
          <div
            aria-hidden="true"
            className={clsx(
              'absolute inset-0 bg-void origin-top transition-transform duration-700 ease-[cubic-bezier(0.76,0,0.24,1)]',
              'scale-y-0',
              !isActive && 'md:scale-y-100 md:group-hover:scale-y-0',
            )}
          />

          {/* Sample CTA — replaces the old linkLabel overlay on the image */}
          <div
            className={clsx(
              'absolute inset-0 flex flex-col items-center justify-end p-8 bg-gradient-to-t from-void/90 to-transparent transition-opacity duration-500',
              'opacity-100',
              !isActive && 'md:opacity-0 md:group-hover:opacity-100 md:delay-300',
            )}
          >
            <button
              onClick={() => setSampleOpen(true)}
              data-hoverable
              className="font-cinzel text-[0.6rem] tracking-[0.4em] text-gold
                border border-gold-dim px-6 py-2
                hover:bg-gold/10 hover:border-gold transition-all"
            >
              {sampleLabel} →
            </button>
          </div>

          {/* Sample overlays — sit above the curtain */}
          {sample.type === 'quote'    && <QuoteOverlay    sample={sample} open={sampleOpen} onClose={() => setSampleOpen(false)} />}
          {sample.type === 'audio'    && <AudioOverlay    sample={sample} open={sampleOpen} onClose={() => setSampleOpen(false)} />}
          {sample.type === 'scenario' && <TarotCardOverlay sample={sample} open={sampleOpen} onClose={() => setSampleOpen(false)} />}
        </div>

        {/* ── Text column ── */}
        <div className={clsx('relative', reversed && 'md:[direction:ltr]')}>
          <span aria-hidden="true" className="absolute -top-10 -left-4 font-cormorant font-light
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

          <p className="font-garamond text-[0.85rem] italic text-gold mb-7 tracking-wide">
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

          {link === '#' ? (
            <div className="flex items-center gap-6 flex-wrap">
              {spotifyLink && (
                <a
                  href={spotifyLink}
                  target="_blank"
                  rel="noreferrer"
                  data-hoverable
                  className="project-link inline-flex items-center gap-3 font-cinzel
                    text-[0.6rem] tracking-[0.35em] text-gold
                    transition-all duration-300 after:content-['→'] after:transition-transform
                    hover:after:translate-x-1"
                >
                  Listen on Spotify
                </a>
              )}
              <span className="inline-flex items-center font-cinzel
                text-[0.6rem] tracking-[0.35em] text-gold-dim cursor-default select-none">
                Website Coming Soon
              </span>
            </div>
          ) : (
            <a
              href={link}
              target="_blank"
              rel="noreferrer"
              data-hoverable
              className="project-link inline-flex items-center gap-3 font-cinzel
                text-[0.6rem] tracking-[0.35em] text-gold
                transition-all duration-300 after:content-['→'] after:transition-transform
                hover:after:translate-x-1"
            >
              {linkLabel}
            </a>
          )}

          {platforms && platforms.length > 0 && (
            <div className="flex items-center gap-4 mt-5">
              <span aria-hidden="true" className="font-cinzel text-[0.45rem] tracking-[0.3em] text-gold-dim">Stream</span>
              {platforms.map((p) => (
                <a
                  key={p.label}
                  href={p.url}
                  target="_blank"
                  rel="noreferrer"
                  data-hoverable
                  aria-label={p.label}
                  className="text-gold-dim hover:text-gold transition-colors duration-200"
                >
                  <PlatformIcon label={p.label} />
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
