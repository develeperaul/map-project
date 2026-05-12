import { describe, expect, it } from 'vitest'
import { MOBILE_SELECTION_MARGIN, resolveMapMargin } from './mapView.utils'

describe('mapView utils', () => {
  it('returns no margin on desktop', () => {
    expect(resolveMapMargin(false, true)).toBeUndefined()
    expect(resolveMapMargin(false, false)).toBeUndefined()
  })

  it('returns top margin on mobile when a selection is focused', () => {
    expect(resolveMapMargin(true, true)).toEqual(MOBILE_SELECTION_MARGIN)
  })
})
