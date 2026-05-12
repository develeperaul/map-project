export type Category = 'projects' | 'travel' | 'sport'

export interface Tag {
  id: number
  title: string
}

export interface MarkerImage {
  url: string
  description?: string
  city?: string
}

export interface Marker {
  id: string
  title: string
  description: string
  coordinates?: [number, number]
  category: Category
  date: string
  city: string
  distance?: string
  tags?: Tag[]
  status?: number | 'completed'
  sportTypes?: string[]
  images: MarkerImage[]
  tasks?: Marker[]
}

export const mockMarkers: Marker[] = []

export function getMarkersByCategory(category: Category): Marker[] {
  return mockMarkers.filter(m => m.category === category)
}
