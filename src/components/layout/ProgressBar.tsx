import { forwardRef } from 'react'

// forwardRef lets the parent pass a ref into this component.
// The useHorizontalScroll hook holds that ref and updates style.width
// directly on every scroll tick — no state, no re-renders.
const ProgressBar = forwardRef<HTMLDivElement>((_, ref) => (
  <div
    ref={ref}
    className="fixed bottom-0 left-0 h-[2px] w-0 z-[1000] pointer-events-none
      transition-none"
    style={{
      background:
        'linear-gradient(90deg, #8a6e2a, #c9a84c, #e8cc7a)',
    }}
  />
))

ProgressBar.displayName = 'ProgressBar'

export default ProgressBar
