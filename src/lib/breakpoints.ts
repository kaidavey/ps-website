/**
 * Breakpoints, in pixels.
 *
 * These mirror the comment block in src/styles/tokens.css. CSS custom
 * properties are not valid inside @media queries, so the values must be
 * written literally in stylesheets — this module is the canonical reference,
 * and the source for any JS that ever needs to match a media query.
 *
 * Use them for layout *rearrangement* only. Resizing is handled by the fluid
 * clamp() scales in tokens.css and should never need a media query.
 *
 * Only the hero currently uses one, at `lg`.
 */
export const breakpoints = {
  sm: 480,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const

export type Breakpoint = keyof typeof breakpoints
