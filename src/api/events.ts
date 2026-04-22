import ky from 'ky'
import type { Marker } from '../data/mock'

const baseURL = 'https://rad.yes-project.ru'

const api = ky.create({
  prefix: baseURL,
  headers: {
    Accept: 'application/json',
  },
})

export async function fetchTravelMarkers(): Promise<Marker[]> {
  return await api.get('api/events/travel.php').json<Marker[]>()
}

export async function fetchProjectMarkers(): Promise<Marker[]> {
  return await api.get('api/events/projects.php').json<Marker[]>()
}

export interface EventElementProperty {
  id: number
  code: string
  name: string
  type: string
  userType: string | null
  multiple: boolean
  value: unknown
}

export interface EventElementDetails {
  id: string
  iblockId: number
  sectionId: number | null
  name: string
  code: string
  xmlId: string
  active: string
  activeFrom: string
  previewText: string
  previewTextType: string
  detailText: string
  detailTextType: string
  description: string
  properties: Record<string, EventElementProperty>
}

export async function fetchEventElementById(id: string | number): Promise<EventElementDetails> {
  return await api.get('api/events/element.php', {
    searchParams: {
      id,
    },
  }).json<EventElementDetails>()
}
