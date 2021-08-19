import { defaultMerge } from '../lib/utils.js'

describe('Default merge', function () {
  it('configs', function () {
    const dst = {
      a: {
        b: 'b',
        c: [
          {
            d: 'd',
          },
        ],
      },
      e: 'e',
      f: [1, 2, 3],
    }
    const src = {
      a: {
        b: 'b',
        c: [
          {
            d: 'd',
          },
        ],
      },
      e: null,
      f: {
        0: 4,
      },
    }
    const out = {
      a: {
        b: 'b',
        c: [
          {
            d: 'd',
          },
          {
            d: 'd',
          },
        ],
      },
      e: null,
      f: [4, 2, 3],
    }
    expect(defaultMerge(dst, src)).toEqual(out)
  })
})
