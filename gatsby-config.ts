import type { GatsbyConfig } from 'gatsby'

const config: GatsbyConfig = {
  siteMetadata: {
    title: 'Film Lady Productions',
    description: 'A court of cinema, criticism & controlled chaos.',
    siteUrl: 'https://filmladyproductions.com',
  },
  plugins: [
    'gatsby-plugin-image',
    'gatsby-plugin-sharp',
    'gatsby-transformer-sharp',
    {
      resolve: 'gatsby-plugin-manifest',
      options: {
        name: 'Film Lady Productions',
        short_name: 'Film Lady',
        background_color: '#0a0704',
        theme_color: '#c9a84c',
        display: 'standalone',
        // icon: 'src/images/icon.png' — add when you have a square PNG ready
      },
    },
  ],
}

export default config
