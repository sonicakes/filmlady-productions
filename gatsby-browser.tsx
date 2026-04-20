// This file runs only in the browser — never during SSR.
// It is the correct place for GSAP plugin registration because
// GSAP references the DOM and window, which don't exist in Node.js.
import './src/styles/globals.css'

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'

// ScrollTrigger: drives the horizontal scroll mechanic.
// ScrollToPlugin: powers the programmatic panel jumps (nav dots, keyboard).
// Both must be registered once before any component uses them.
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)

export {}
