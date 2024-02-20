import { Font } from '@alsoasked/opentype.js'

export type Anchor =
  | 'left'
  | 'center'
  | 'right'
  | 'top'
  | 'middle'
  | 'bottom'
  | 'left baseline'
  | 'left top'
  | 'left middle'
  | 'left bottom'
  | 'center top'
  | 'center middle'
  | 'center bottom'
  | 'right top'
  | 'right middle'
  | 'right bottom'

export interface STSOptions {
  font?: Font
  x?: number
  y?: number
  fontSize?: number
  anchor?: Anchor
  kerning?: boolean
  letterSpacing?: number
  tracking?: number
  attributes?: Record<string, string>
  beforePath?: string
  afterPath?: string
}

export type STSOptionsWithFont = STSOptions & { font: Font }

export function getD(text: string, options: STSOptionsWithFont) {
  const fontSize = options.fontSize || 72
  const kerning = options.kerning
  const letterSpacing = options.letterSpacing
  const tracking = options.tracking
  const metrics = getMetrics(text, options)
  const path = options.font.getPath(text, metrics.x, metrics.baseline, fontSize, { kerning, letterSpacing, tracking })

  return path.toPathData(2)
}

export function getPath(text: string, options: STSOptionsWithFont) {
  const attributes = options.attributes || {}
  const attributesString = Object.keys(attributes)
    .map((key) => `${key}="${attributes[key]}"`)
    .join(' ')
  const d = getD(text, options)

  if (attributesString) {
    return `<path ${attributesString} d="${d}"/>`
  }

  return `<path d="${d}"/>`
}

export function getHeight(fontSize: number, font: Font) {
  const fontScale = (1 / font.unitsPerEm) * fontSize
  return (font.ascender - font.descender) * fontScale
}

export function getWidth(text: string, options: STSOptionsWithFont) {
  const fontSize = options.fontSize || 72
  const kerning = 'kerning' in options ? options.kerning : true
  const fontScale = (1 / options.font.unitsPerEm) * fontSize

  let width = 0
  const glyphs = options.font.stringToGlyphs(text)
  for (let i = 0; i < glyphs.length; i++) {
    const glyph = glyphs[i]

    if (glyph.advanceWidth) {
      width += glyph.advanceWidth * fontScale
    }

    if (kerning && i < glyphs.length - 1) {
      const kerningValue = options.font.getKerningValue(glyph, glyphs[i + 1])
      width += kerningValue * fontScale
    }

    if (options.letterSpacing) {
      width += options.letterSpacing * fontSize
    } else if (options.tracking) {
      width += (options.tracking / 1000) * fontSize
    }
  }
  return width
}

function parseAnchorOption(anchor: Anchor) {
  let horizontalMatch = anchor.match(/left|center|right/gi) || []
  let horizontal = horizontalMatch.length === 0 ? 'left' : horizontalMatch[0]

  let verticalMatch = anchor.match(/baseline|top|bottom|middle/gi) || []
  let vertical = verticalMatch.length === 0 ? 'baseline' : verticalMatch[0]

  return { horizontal, vertical }
}

export function getMetrics(text: string, options: STSOptionsWithFont) {
  const fontSize = options.fontSize || 72
  const anchor = parseAnchorOption(options.anchor || 'left baseline')

  const width = getWidth(text, options)
  const height = getHeight(fontSize, options.font)

  const fontScale = (1 / options.font.unitsPerEm) * fontSize
  const ascender = options.font.ascender * fontScale
  const descender = options.font.descender * fontScale

  let x = options.x || 0
  switch (anchor.horizontal) {
    case 'left':
      x -= 0
      break
    case 'center':
      x -= width / 2
      break
    case 'right':
      x -= width
      break
    default:
      throw new Error(`Unknown anchor option: ${anchor.horizontal}`)
  }

  let y = options.y || 0
  switch (anchor.vertical) {
    case 'baseline':
      y -= ascender
      break
    case 'top':
      y -= 0
      break
    case 'middle':
      y -= height / 2
      break
    case 'bottom':
      y -= height
      break
    default:
      throw new Error(`Unknown anchor option: ${anchor.vertical}`)
  }

  const baseline = y + ascender

  return {
    x,
    y,
    baseline,
    width,
    height,
    ascender,
    descender,
  }
}
