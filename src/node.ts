import { join } from 'path'
import { loadSync, Font } from 'opentype.js'
import { Anchor, STSOptions, STSOptionsWithFont, getD, getHeight, getMetrics, getPath, getWidth } from './index'

export { Anchor, STSOptions, STSOptionsWithFont, getD, getHeight, getMetrics, getPath, getWidth }
export { Font }

export function loadFont(fontPath: string) {
  const path = join(__dirname, fontPath)
  return loadSync(path)
}

export function getSVG(text: string, options: STSOptions) {
  if (!options.font) {
    options.font = loadFont('../fonts/ipag.ttf')
  }
  const metrics = getMetrics(text, options as STSOptionsWithFont)
  let svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${metrics.width}" height="${metrics.height}">`
  if (options.beforePath) svg += options.beforePath
  svg += getPath(text, options as STSOptionsWithFont)
  if (options.afterPath) svg += options.afterPath
  svg += '</svg>'

  return svg
}
