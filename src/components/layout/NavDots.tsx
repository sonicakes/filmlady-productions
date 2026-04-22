import React from 'react'
import clsx from 'clsx'

// Labels shown on dot hover — one per panel in order
const LABELS = ['Foyer', 'Decree', 'Blog', 'Podcast', 'Simulator', 'Footer']

interface Props {
  count:      number
  current:    number
  onNavigate: (index: number) => void
}

export default function NavDots({ count, current, onNavigate }: Props) {
  return (
    // Fixed to the right edge, vertically centred.
    // Hidden on mobile — the vertical scroll handles navigation naturally.
    <nav
      className="fixed right-6 top-1/2 -translate-y-1/2 z-[500]
        flex-col gap-3 hidden md:flex"
      aria-label="Panel navigation"
    >
      {Array.from({ length: count }, (_, i) => (
        <button
          key={i}
          data-hoverable
          onClick={() => onNavigate(i)}
          aria-label={`Go to ${LABELS[i] ?? `panel ${i + 1}`}`}
          className="group relative flex items-center justify-end gap-2"
        >
          {/* Tooltip label — slides in from the right on hover */}
          <span
            className="font-cinzel text-[0.45rem] tracking-[0.25em] text-gold-dim
              opacity-0 group-hover:opacity-100
              translate-x-1 group-hover:translate-x-0
              transition-all duration-200
              whitespace-nowrap"
          >
            {LABELS[i]}
          </span>

          {/* The dot itself */}
          <span
            className={clsx(
              'block w-[6px] h-[6px] rounded-full border transition-all duration-300',
              i === current
                ? 'bg-gold border-gold shadow-[0_0_8px_rgba(201,168,76,0.5)]'
                : 'bg-transparent border-gold-dim',
            )}
          />
        </button>
      ))}
    </nav>
  )
}
