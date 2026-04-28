import { useRef, useState, useCallback } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'

// Note: ScrollTrigger and ScrollToPlugin are registered once in gatsby-browser.tsx.
// We don't re-register here — calling registerPlugin twice is harmless but noisy.

interface Options {
  panelCount:     number
  progressBarRef: React.RefObject<HTMLDivElement | null>
}

export function useHorizontalScroll({ panelCount, progressBarRef }: Options) {
  // containerRef → the outer div that GSAP pins.
  //   It provides the scroll height. GSAP freezes it visually while the
  //   user scrolls, then maps that scroll progress to the track's translateX.
  //
  // trackRef → the inner flex row of panels.
  //   This is what actually moves horizontally. It must be a separate element
  //   from the container: you can't pin and translate the same element.
  const containerRef = useRef<HTMLDivElement>(null)
  const trackRef     = useRef<HTMLDivElement>(null)

  // currentPanel is React state so NavDots re-renders when the active panel changes.
  const [currentPanel, setCurrentPanel] = useState(0)

  // scrollToPanel is exposed to the page so NavDots and the Foyer enter button
  // can trigger programmatic jumps. It uses GSAP's ScrollToPlugin to smoothly
  // animate the window's scroll position — ScrollTrigger then picks that up
  // and translates it into horizontal movement automatically.
  const scrollToPanel = useCallback(
    (index: number) => {
      if (typeof window === 'undefined') return
      const totalScrollWidth = (panelCount - 1) * window.innerWidth
      const target = (index / (panelCount - 1)) * totalScrollWidth
      gsap.to(window, { scrollTo: target, duration: 1.2, ease: 'power2.inOut' })
    },
    [panelCount],
  )

  useGSAP(
    () => {
      // SSR guard: this callback runs after mount, but double-check just in case.
      if (typeof window === 'undefined') return

      // On mobile we skip GSAP entirely. CSS (in globals.css) handles the
      // vertical stacking layout. The panels just scroll normally.
      if (window.innerWidth < 768) return

      const container = containerRef.current
      const track     = trackRef.current
      if (!container || !track) return

      // Total horizontal distance the track must travel to reach the last panel:
      // (5 panels - 1) × 100vw = 400vw.
      const totalScrollWidth = (panelCount - 1) * window.innerWidth

      // Set the track's pixel width so all panels fit side-by-side.
      // We do this here rather than inline in JSX so it doesn't run on the server.
      track.style.width = `${panelCount * 100}vw`

      // ── Main horizontal scroll tween ──────────────────────────────────────
      // gsap.to() animates track.x from 0 to -totalScrollWidth.
      // ease: 'none' is intentional — ScrollTrigger's scrub is the easer.
      // Adding easing here would cause double-easing and feel wrong.
      const tween = gsap.to(track, {
        x: -totalScrollWidth,
        ease: 'none',
        scrollTrigger: {
          id:      'horizontal-scroll',
          trigger: container,
          start:   'top top',
          // end defines the total scroll distance available.
          // Using a function so it recalculates on window resize.
          end:              () => `+=${totalScrollWidth}`,
          pin:              true,   // freeze container in viewport while scrolling
          scrub:            1.2,    // 1.2s lag — feels heavy and aristocratic
          anticipatePin:    1,      // prevents a flicker on pin entry
          invalidateOnRefresh: true, // recalculates on resize

          onUpdate: (self) => {
            // Update active panel index (0-based)
            const panel = Math.round(self.progress * (panelCount - 1))
            setCurrentPanel(panel)

            // Update progress bar width directly via ref — no React state,
            // no re-render. This fires ~60 times per second; state would be brutal.
            if (progressBarRef.current) {
              progressBarRef.current.style.width = `${self.progress * 100}%`
            }
          },
        },
      })

      // ── Parallax words ────────────────────────────────────────────────────
      // Each .parallax-word element carries a data-speed attribute (0–1).
      // speed < 1 means the word moves slower than the main track,
      // making it appear to sit at a greater depth (further from camera).
      const parallaxWords =
        track.querySelectorAll<HTMLElement>('.parallax-word')

      parallaxWords.forEach((word) => {
        const speed = parseFloat(word.dataset.speed ?? '0.3')
        gsap.to(word, {
          x: -totalScrollWidth * speed,
          ease: 'none',
          scrollTrigger: {
            trigger: container,
            start:   'top top',
            end:     () => `+=${totalScrollWidth}`,
            scrub:   1.2,
          },
        })
      })

      // ── Wheel intercept — one scroll = one panel ─────────────────────────
      // We prevent default scroll and drive navigation ourselves so the panel
      // always lands cleanly. A lock flag blocks further events until the
      // 1.2s scrollToPanel animation has settled (+ 200ms buffer for scrub).
      let wheelLocked = false
      const handleWheel = (e: WheelEvent) => {
        e.preventDefault()
        if (wheelLocked) return
        const st = ScrollTrigger.getById('horizontal-scroll')
        if (!st) return
        const current = Math.round(st.progress * (panelCount - 1))
        // Respect horizontal trackpad swipes as well as vertical wheel
        const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY
        if (delta > 0)      scrollToPanel(Math.min(panelCount - 1, current + 1))
        else if (delta < 0) scrollToPanel(Math.max(0, current - 1))
        else return
        wheelLocked = true
        setTimeout(() => { wheelLocked = false }, 1400)
      }

      // ── Keyboard navigation ───────────────────────────────────────────────
      const handleKeyDown = (e: KeyboardEvent) => {
        const st = ScrollTrigger.getById('horizontal-scroll')
        if (!st) return
        const current = Math.round(st.progress * (panelCount - 1))
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
          scrollToPanel(Math.min(panelCount - 1, current + 1))
        }
        if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
          scrollToPanel(Math.max(0, current - 1))
        }
      }

      // passive: false is required so we can call e.preventDefault() on wheel
      window.addEventListener('wheel',   handleWheel, { passive: false })
      window.addEventListener('keydown', handleKeyDown)

      return () => {
        tween.kill()
        window.removeEventListener('wheel',   handleWheel)
        window.removeEventListener('keydown', handleKeyDown)
      }
    },
    // scope: containerRef tells useGSAP to scope all selector queries
    // to the container element. Prevents cross-component interference.
    { scope: containerRef, dependencies: [panelCount] },
  )

  return { containerRef, trackRef, currentPanel, scrollToPanel }
}
