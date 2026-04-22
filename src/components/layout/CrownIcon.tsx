import React from 'react'

interface Props {
  className?: string
}

export default function CrownIcon({ className = 'w-3 h-3' }: Props) {
  return (
    <svg
      viewBox="0 0 20 14"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M1 13 L1 7 L5.5 9.5 L10 1 L14.5 9.5 L19 7 L19 13 Z"
        stroke="#c9a84c"
        strokeWidth="1.2"
        strokeLinejoin="round"
        fill="none"
      />
      <rect x="1" y="13" width="18" height="1.5" fill="#c9a84c" opacity="0.6" rx="0.5" />
    </svg>
  )
}
