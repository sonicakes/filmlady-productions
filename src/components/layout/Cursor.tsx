import React, { useEffect, useRef } from 'react'

export default function Cursor() {
  const reticleRef = useRef<HTMLDivElement>(null)
  const dotRef     = useRef<HTMLDivElement>(null)

  // pos holds raw mouse coords (mx/my) and the lagged reticle position (cx/cy).
  // Using a ref instead of state: this object updates 60× per second inside a
  // requestAnimationFrame loop. State would trigger 60 re-renders per second
  // and tank performance. Refs update silently.
  const pos = useRef({ mx: 0, my: 0, cx: 0, cy: 0 })

  useEffect(() => {
    // Hide on touch devices — no pointer to track
    if ('ontouchstart' in window) return

    const dot     = dotRef.current
    const reticle = reticleRef.current
    if (!dot || !reticle) return

    // Update raw position and move the dot immediately (no lag)
    const onMove = (e: MouseEvent) => {
      pos.current.mx = e.clientX
      pos.current.my = e.clientY
      dot.style.left = e.clientX + 'px'
      dot.style.top  = e.clientY + 'px'
    }
    window.addEventListener('mousemove', onMove)

    // RAF loop: lerp reticle toward true mouse position each frame.
    // lerp formula: current += (target - current) * factor
    // factor 0.12 = 12% per frame → ~8 frames to close 90% of the gap
    let raf: number
    const tick = () => {
      const p = pos.current
      p.cx += (p.mx - p.cx) * 0.12
      p.cy += (p.my - p.cy) * 0.12
      reticle.style.left = p.cx + 'px'
      reticle.style.top  = p.cy + 'px'
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    // Scale up the reticle when hovering interactive elements.
    // We use classList directly (no state) for the same performance reason.
    const onEnter = () => reticle.classList.add('scale-[1.6]')
    const onLeave = () => reticle.classList.remove('scale-[1.6]')

    const attachHover = () => {
      document
        .querySelectorAll('a, button, [data-hoverable], .nav-dot, .trinity-card, .sim-choice')
        .forEach((el) => {
          el.addEventListener('mouseenter', onEnter)
          el.addEventListener('mouseleave', onLeave)
        })
    }
    attachHover()

    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <>
      {/* Instant dot — true mouse position, updated via ref in RAF */}
      <div
        ref={dotRef}
        className="fixed z-[10000] pointer-events-none w-[5px] h-[5px]
          rounded-full bg-gold -translate-x-1/2 -translate-y-1/2
          hidden md:block"
      />

      {/* Lagged reticle ring — lerps toward mouse each frame */}
      <div
        ref={reticleRef}
        className="fixed z-[9999] pointer-events-none w-7 h-7
          -translate-x-1/2 -translate-y-1/2
          transition-transform duration-150
          hidden md:block"
      >
        <svg viewBox="0 0 28 28" fill="none">
          <line x1="14" y1="0"  x2="14" y2="8"  stroke="#c9a84c" strokeWidth="1" />
          <line x1="14" y1="20" x2="14" y2="28" stroke="#c9a84c" strokeWidth="1" />
          <line x1="0"  y1="14" x2="8"  y2="14" stroke="#c9a84c" strokeWidth="1" />
          <line x1="20" y1="14" x2="28" y2="14" stroke="#c9a84c" strokeWidth="1" />
          <circle cx="14" cy="14" r="4"   stroke="#c9a84c" strokeWidth="1" />
          <circle cx="14" cy="14" r="1.5" fill="#c9a84c" />
        </svg>
      </div>
    </>
  )
}
