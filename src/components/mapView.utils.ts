export type MapMargin = [number, number, number, number]

export const MOBILE_SELECTION_MARGIN: MapMargin = [-500, 0, 0, 0]

export function resolveMapMargin(isMobile: boolean, hasFocusedSelection: boolean): MapMargin | undefined {
  if (!isMobile || !hasFocusedSelection) {
    return undefined
  }

  return MOBILE_SELECTION_MARGIN
}
