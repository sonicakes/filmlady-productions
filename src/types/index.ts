// Shared TypeScript interface for a single project entry.
// All three projects (blog, podcast, simulator) conform to this shape.
// Having one interface means TypeScript will catch copy/paste errors
// across the data file and any component that consumes project data.

export interface Project {
  id:           string                                      // used as React key
  index:        number                                      // 1 | 2 | 3
  tag:          string                                      // overline label
  title:        string[]                                    // split into lines
  titleAccent:  number                                      // which line gets gold italic
  format:       string                                      // format/platform line
  description:  string
  tags:         string[]                                    // pill tags
  link:         string
  linkLabel:    string                                      // CTA button text
  cyrillicWord: string                                      // large parallax bg word
  cyrillicLabel: string                                     // section counter e.g. 'II · БЛОГ'
  imageType:    'canvas-blog' | 'canvas-podcast' | 'sim-mock'
  reversed:     boolean                                     // image on right when true
}
