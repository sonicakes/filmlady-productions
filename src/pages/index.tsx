import React, { useEffect, useRef, useState } from 'react'
import type { HeadFC } from 'gatsby'

import { useHorizontalScroll } from '../hooks/useHorizontalScroll'
import { projects } from '../data/projects'

import Cursor      from '../components/layout/Cursor'
import NavDots     from '../components/layout/NavDots'
import ProgressBar from '../components/layout/ProgressBar'

import FoyerPanel   from '../components/panels/FoyerPanel'
import DecreePanel  from '../components/panels/DecreePanel'
import ProjectPanel from '../components/panels/ProjectPanel'
import FooterPanel  from '../components/panels/FooterPanel'

// Total panels: Foyer + Decree + projects + Footer
const PANEL_COUNT = 2 + projects.length + 1   // = 6

export default function IndexPage() {
  const progressBarRef = useRef<HTMLDivElement>(null)

  const { containerRef, trackRef, currentPanel, scrollToPanel } =
    useHorizontalScroll({ panelCount: PANEL_COUNT, progressBarRef })

  // Scroll hint fades out the first time the user scrolls.
  // We watch the window scroll event and flip a boolean once — that's all
  // we need, so a ref (not state) is fine for the "has scrolled" flag.
  const [hintVisible, setHintVisible] = useState(true)
  const hasScrolled = useRef(false)

  useEffect(() => {
    const hide = () => {
      if (!hasScrolled.current) {
        hasScrolled.current = true
        setHintVisible(false)
      }
    }
    window.addEventListener('wheel',      hide, { passive: true })
    window.addEventListener('touchmove',  hide, { passive: true })
    window.addEventListener('keydown',    hide)
    return () => {
      window.removeEventListener('wheel',     hide)
      window.removeEventListener('touchmove', hide)
      window.removeEventListener('keydown',   hide)
    }
  }, [])

  return (
    <>
      {/* ── Fixed UI layer ────────────────────────────────────────────── */}
      <Cursor />
      <NavDots
        count={PANEL_COUNT}
        current={currentPanel}
        onNavigate={scrollToPanel}
      />
      <ProgressBar ref={progressBarRef} />

      {/* Back-to-home button — visible on all panels except the Foyer */}
      <button
        data-hoverable
        onClick={() => scrollToPanel(0)}
        className="fixed top-10 left-10 z-[500] font-cinzel text-[0.55rem]
          tracking-[0.35em] text-gold-dim flex items-center gap-2
          hover:text-gold transition-all duration-300"
        style={{
          opacity:        currentPanel > 0 ? 1 : 0,
          pointerEvents:  currentPanel > 0 ? 'auto' : 'none',
          transition:     'opacity 0.6s ease, color 0.3s ease',
        }}
        aria-hidden={currentPanel === 0}
        tabIndex={currentPanel === 0 ? -1 : 0}
      >
        ←&nbsp;FOYER
      </button>

      {/* Scroll hint — lives here (not inside FoyerPanel) so it stays
          fixed on screen regardless of which panel is visible */}
      <div
        id="scroll-hint"
        aria-hidden="true"
        className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[500]
          font-cinzel text-[0.55rem] tracking-[0.35em] text-gold-dim
          items-center gap-4 transition-opacity duration-1000
          hidden md:flex"
        style={{ opacity: hintVisible ? 1 : 0, pointerEvents: 'none' }}
      >
        <span className="block w-7 h-px bg-gold-dim" />
        SCROLL TO ENTER THE COURT
        <span className="block w-7 h-px bg-gold-dim" />
      </div>

      {/* ── Scroll stage ──────────────────────────────────────────────── */}
      {/*
        containerRef: the element GSAP pins.
          - On desktop: h-screen + overflow-hidden, stays fixed in viewport
            while scroll position advances.
          - On mobile (via .scroll-container CSS): height auto, normal flow.

        trackRef: the flex row of panels that GSAP translates horizontally.
          - Width is set in px by the hook after mount (panelCount × 100vw).
          - On mobile (via .scroll-track CSS): width 100%, flex-direction column.
      */}
      <div
        ref={containerRef}
        className="scroll-container w-full h-screen overflow-hidden"
      >
        <div
          ref={trackRef}
          className="scroll-track flex h-full"
        >
          <FoyerPanel onEnter={() => {
            if (window.innerWidth < 768) {
              document.getElementById('decree-panel')?.scrollIntoView({ behavior: 'smooth' })
            } else {
              scrollToPanel(1)
            }
          }} />
          <DecreePanel />
          {projects.map((project, i) => (
            <ProjectPanel
              key={project.id}
              project={project}
              isActive={currentPanel === 2 + i}
            />
          ))}
          <FooterPanel />
        </div>
      </div>
    </>
  )
}

// Gatsby's Head API — injects into <head> without a separate helmet library
export const Head: HeadFC = () => (
  <>
    <title>Film Lady Productions</title>
    <meta
      name="description"
      content="A court of cinema, criticism & controlled chaos."
    />
  </>
)
