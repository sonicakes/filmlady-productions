// gatsby-ssr.tsx runs during `gatsby build` on the server (Node.js).
// We use it here for two things:
//   1. Injecting Google Fonts link tags into the HTML <head> at build time —
//      this means fonts are available immediately on first paint, no FOUT.
//   2. Mirroring the globals.css import so styles apply to server-rendered HTML.
//
// Note: GSAP is NOT imported here. GSAP touches window/document and would
// crash Node.js. All GSAP code lives in gatsby-browser.tsx or inside
// useEffect / useGSAP hooks (client-only lifecycle).

import React from 'react'
import type { GatsbySSR } from 'gatsby'

export const onRenderBody: GatsbySSR['onRenderBody'] = ({
  setHeadComponents,
}) => {
  setHeadComponents([
    <link
      key="gf-preconnect"
      rel="preconnect"
      href="https://fonts.googleapis.com"
    />,
    <link
      key="gf-preconnect-static"
      rel="preconnect"
      href="https://fonts.gstatic.com"
      crossOrigin="anonymous"
    />,
    <link
      key="gf-fonts"
      rel="stylesheet"
      href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;900&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&family=EB+Garamond:ital,wght@0,400;0,500;1,400;1,500&display=swap"
    />,
  ])
}
