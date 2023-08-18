import { Font, parse } from 'opentype.js'
import { Anchor, STSOptionsWithFont, getD, getHeight, getMetrics, getPath, getWidth } from './index'

export { Anchor, STSOptionsWithFont, getD, getHeight, getMetrics, getPath, getWidth }
export { Font }

export function loadFont(font: ArrayBuffer) {
  return parse(font)
}

export function getSVG(text: string, options: STSOptionsWithFont) {
  const metrics = getMetrics(text, options)
  let svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${metrics.width}" height="${metrics.height}">`
  if (options.beforePath) svg += options.beforePath
  svg += getPath(text, options)
  if (options.afterPath) svg += options.afterPath
  svg += '</svg>'

  return svg
}
