import { describe, it, expect } from 'vitest'
import { STSOptionsWithFont, getMetrics } from '../src'
import { loadSync } from '@alsoasked/opentype.js'

const font = loadSync('./fonts/ipag.ttf')

function assertAlmostEqual(a: number, b: number, epsilon: number) {
  expect(Math.abs(a - b) < epsilon).toBe(true)
}

describe('getMetrics', () => {
  let word = ''
  function testGetMetrics(
    options: STSOptionsWithFont,
    expected: {
      x: number
      y: number
      baseline: number
      width: number
      height: number
      ascender: number
      descender: number
    },
  ) {
    const epsilon = 0.001
    const title = JSON.stringify(expected)
    const actual = getMetrics(word, options)

    it(title, () => {
      assertAlmostEqual(actual.width, expected.width, epsilon)
      assertAlmostEqual(actual.height, expected.height, epsilon)
    })
  }

  describe('hello', () => {
    word = 'hello'

    testGetMetrics(
      { font },
      { x: 0, y: -63.3515625, baseline: 0, width: 180, height: 72, ascender: 63.3515625, descender: -8.6484375 },
    )
    testGetMetrics(
      { font, fontSize: 10 },
      { x: 0, y: -8.798828125, baseline: 0, width: 25, height: 10, ascender: 8.798828125, descender: -1.201171875 },
    )
    testGetMetrics(
      { font, fontSize: 100 },
      { x: 0, y: -87.98828125, baseline: 0, width: 250, height: 100, ascender: 87.98828125, descender: -12.01171875 },
    )

    testGetMetrics(
      { font, kerning: false },
      { x: 0, y: -63.3515625, baseline: 0, width: 180, height: 72, ascender: 63.3515625, descender: -8.6484375 },
    )
    testGetMetrics(
      { font, kerning: true },
      { x: 0, y: -63.3515625, baseline: 0, width: 180, height: 72, ascender: 63.3515625, descender: -8.6484375 },
    )
    testGetMetrics(
      { font, letterSpacing: 0.2 },
      {
        x: 0,
        y: -63.3515625,
        baseline: 0,
        width: 252.00000000000003,
        height: 72,
        ascender: 63.3515625,
        descender: -8.6484375,
      },
    )
    testGetMetrics(
      { font, tracking: 200 },
      {
        x: 0,
        y: -63.3515625,
        baseline: 0,
        width: 252.00000000000003,
        height: 72,
        ascender: 63.3515625,
        descender: -8.6484375,
      },
    )
  })

  describe('宇治', () => {
    word = '宇治'

    testGetMetrics(
      { font },
      { x: 0, y: -63.3515625, baseline: 0, width: 144, height: 72, ascender: 63.3515625, descender: -8.6484375 },
    )

    testGetMetrics(
      { font, fontSize: 10 },
      { x: 0, y: -8.798828125, baseline: 0, width: 20, height: 10, ascender: 8.798828125, descender: -1.201171875 },
    )
    testGetMetrics(
      { font, fontSize: 100 },
      { x: 0, y: -87.98828125, baseline: 0, width: 200, height: 100, ascender: 87.98828125, descender: -12.01171875 },
    )

    testGetMetrics(
      { font, kerning: false },
      { x: 0, y: -63.3515625, baseline: 0, width: 144, height: 72, ascender: 63.3515625, descender: -8.6484375 },
    )
    testGetMetrics(
      { font, kerning: true },
      { x: 0, y: -63.3515625, baseline: 0, width: 144, height: 72, ascender: 63.3515625, descender: -8.6484375 },
    )
    testGetMetrics(
      { font, letterSpacing: 0.2 },
      { x: 0, y: -63.3515625, baseline: 0, width: 172.8, height: 72, ascender: 63.3515625, descender: -8.6484375 },
    )
    testGetMetrics(
      { font, tracking: 200 },
      { x: 0, y: -63.3515625, baseline: 0, width: 172.8, height: 72, ascender: 63.3515625, descender: -8.6484375 },
    )
  })
})
