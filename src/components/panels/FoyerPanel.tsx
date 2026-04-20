import React, { useEffect, useRef } from 'react'

interface Props {
  onEnter: () => void
}

// Particle shape — kept local, not exported
type Particle = {
  x: number; y: number
  vx: number; vy: number
  size: number
  opacity: number
  growing: boolean
  rate: number
}

function makeParticle(w: number, h: number): Particle {
  return {
    x:       Math.random() * w,
    y:       Math.random() * h,
    vx:      (Math.random() - 0.5) * 0.3,
    vy:      -(Math.random() * 0.5 + 0.1),  // always drifting upward
    size:    Math.random() * 1.5 + 0.3,
    opacity: 0,
    growing: true,
    rate:    Math.random() * 0.015 + 0.003,
  }
}

export default function FoyerPanel({ onEnter }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    // Canvas is a browser-only imperative API — never runs during SSR.
    // We grab the canvas element via ref, then run the animation loop.
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!

    const resize = () => {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    // Seed 120 particles with randomised starting opacity so the screen
    // doesn't look empty for the first few seconds
    const particles: Particle[] = Array.from({ length: 120 }, () => {
      const p = makeParticle(canvas.width, canvas.height)
      p.opacity = Math.random() * 0.4   // start partially visible
      return p
    })

    let raf: number
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (const p of particles) {
        p.x += p.vx
        p.y += p.vy

        // Particles pulse: grow to max opacity then fade out
        p.opacity += p.growing ? p.rate : -p.rate * 0.5
        if (p.opacity >= 0.6) p.growing = false

        // Reset particle when it fades out or drifts off the top
        if (p.opacity <= 0 || p.y < -10) {
          Object.assign(p, makeParticle(canvas.width, canvas.height))
        }

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

  return (
    <section className="relative w-screen h-screen flex-shrink-0 flex items-center justify-center bg-void overflow-hidden">

      {/* Particle canvas — sits behind everything (z-0) */}
      <canvas ref={canvasRef} className="absolute inset-0 z-0" />

      {/* Decorative Cyrillic words */}
      <span
        className="parallax-word absolute font-cormorant font-light pointer-events-none select-none whitespace-nowrap
          text-[11rem] text-gold/[0.025] uppercase [-webkit-text-stroke:1px_rgba(201,168,76,0.035)]"
        data-speed="0.25"
        style={{ top: '6%', left: '-2%' }}
      >
        дама
      </span>
      <span
        className="parallax-word absolute font-cormorant font-light pointer-events-none select-none whitespace-nowrap
          text-[6rem] text-gold/[0.04] [-webkit-text-stroke:1px_rgba(201,168,76,0.05)]"
        data-speed="0.5"
        style={{ bottom: '-3%', right: '5%' }}
      >
        КИНО
      </span>

      {/* Foyer content — z-10 so it sits above the canvas */}
      <div className="relative z-10 text-center flex flex-col items-center gap-6">

        {/* Crest SVG — the Film Lady logo from the prototype */}
        <svg
          className="w-20 h-20 mb-2 anim-1"
          viewBox="0 0 80 80"
          fill="none"
        >
          <circle cx="40" cy="40" r="38" stroke="#c9a84c" strokeWidth="0.75" opacity="0.4" />
          <circle cx="40" cy="40" r="32" stroke="#c9a84c" strokeWidth="0.5"  opacity="0.25" />
          {/* Crown */}
          <path d="M26 42 L26 34 L32 38 L40 28 L48 38 L54 34 L54 42 Z"
            stroke="#c9a84c" strokeWidth="1" fill="none" />
          <rect x="24" y="42" width="32" height="5"
            stroke="#c9a84c" strokeWidth="1" fill="none" />
          {/* Film reel hint */}
          <circle cx="40" cy="55" r="4"   stroke="#c9a84c" strokeWidth="0.75" opacity="0.5" />
          <circle cx="40" cy="55" r="1.5" fill="#c9a84c"   opacity="0.5" />
          {/* Side ornaments */}
          <path d="M20 40 Q15 35 20 30" stroke="#c9a84c" strokeWidth="0.5" opacity="0.3" fill="none" />
          <path d="M60 40 Q65 35 60 30" stroke="#c9a84c" strokeWidth="0.5" opacity="0.3" fill="none" />
        </svg>

        <p className="anim-2 font-cinzel text-[0.6rem] tracking-[0.5em] text-gold-dim uppercase">
          Est. in Exile · Anno MMXXIV
        </p>

        <h1 className="anim-3 font-cormorant font-light text-parchment leading-[1.05]"
          style={{ fontSize: 'clamp(3.5rem, 7vw, 6.5rem)' }}>
          Film Lady<br />
          <em className="italic text-gold">Productions</em>
        </h1>

        <p className="anim-4 font-garamond italic text-parchment-dim tracking-[0.05em]">
          A court of cinema, criticism &amp; controlled chaos
        </p>

        {/* Ornamental divider */}
        <div className="anim-5 flex items-center gap-4">
          <span className="block w-14 h-px bg-gold-dim" />
          <span className="text-gold text-sm">✦</span>
          <span className="block w-14 h-px bg-gold-dim" />
        </div>

        <button
          data-hoverable
          onClick={onEnter}
          className="anim-6 font-cinzel text-[0.6rem] tracking-[0.4em] text-gold
            border border-gold-dim px-10 py-4 bg-transparent uppercase
            hover:bg-gold/[0.08] hover:border-gold hover:tracking-[0.55em]
            transition-all duration-400"
        >
          Enter the Court
        </button>
      </div>

      {/* Scroll hint lives in index.tsx as a fixed overlay — not here */}
    </section>
  )
}
