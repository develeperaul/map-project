import { describe, expect, it } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import type { Marker } from '../data/mock'
import { calculateBounds, calculateBoundsFromMarkers, useMapStore } from './map'

function createTask(id: string, coordinates?: [number, number]): Marker {
  return {
    id,
    title: id,
    description: '',
    category: 'projects',
    date: '2026-04-01',
    city: '',
    status: 100,
    images: [],
    coordinates,
  }
}

function createSportMarker(id: string, sportTypes: string[], tags: Marker['tags'] = []): Marker {
  return {
    id,
    title: id,
    description: '',
    category: 'sport',
    date: '2026-04-01',
    city: '',
    status: 100,
    images: [],
    sportTypes,
    tags,
  }
}

function createProjectMarker(id: string, date: string): Marker {
  return {
    id,
    title: id,
    description: '',
    category: 'projects',
    date,
    city: 'Москва',
    status: 100,
    images: [],
    tasks: [
      createTask(`${id}-task`, [37, 55]),
    ],
  }
}

function createTravelMarker(id: string, city: string): Marker {
  return {
    id,
    title: id,
    description: '',
    category: 'travel',
    date: '2024-06-01',
    city,
    status: 100,
    images: [],
  }
}

describe('calculateBoundsFromMarkers', () => {
  it('returns null when fewer than two tasks have coordinates', () => {
    expect(calculateBoundsFromMarkers([createTask('1', [37, 55])], null)).toBeNull()
    expect(calculateBoundsFromMarkers([createTask('1')], null)).toBeNull()
  })

  it('ignores tasks without coordinates', () => {
    const selectedTask = createTask('1', [37, 55])
    const bounds = calculateBoundsFromMarkers([
      selectedTask,
      createTask('2'),
      createTask('3', [38, 56]),
    ], selectedTask)

    expect(bounds).not.toBeNull()
    expect(bounds![0][0]).toBeLessThan(37)
    expect(bounds![1][0]).toBeGreaterThan(38)
  })

  it('centers bounds around the selected task while covering all coordinates', () => {
    const selectedTask = createTask('selected', [37, 55])
    const bounds = calculateBoundsFromMarkers([
      selectedTask,
      createTask('near', [38, 55.5]),
      createTask('far', [35, 54]),
    ], selectedTask)

    expect(bounds).not.toBeNull()

    const centerLng = (bounds![0][0] + bounds![1][0]) / 2
    const centerLat = (bounds![0][1] + bounds![1][1]) / 2

    expect(centerLng).toBeCloseTo(37)
    expect(centerLat).toBeCloseTo(55)
    expect(bounds![0][0]).toBeLessThan(35)
    expect(bounds![1][0]).toBeGreaterThan(38)
    expect(bounds![0][1]).toBeLessThan(54)
    expect(bounds![1][1]).toBeGreaterThan(55.5)
  })
})

describe('calculateBounds', () => {
  it('returns null when markers do not have coordinates', () => {
    expect(calculateBounds([createTask('1'), createTask('2')])).toBeNull()
  })

  it('centers and zooms to a single coordinate marker', () => {
    const bounds = calculateBounds([createTask('1', [60.6, 56.8])])

    expect(bounds).toEqual({
      center: [60.6, 56.8],
      zoom: 14,
    })
  })

  it('does not zoom out below the usable map scale for wide marker spreads', () => {
    const bounds = calculateBounds([
      createTask('west', [30, 55]),
      createTask('east', [130, 62]),
    ])

    expect(bounds).not.toBeNull()
    expect(bounds!.center).toEqual([80, 58.5])
    expect(bounds!.zoom).toBe(3)
  })
})

describe('project map focus', () => {
  it('shows only focused project tasks on the map', () => {
    setActivePinia(createPinia())
    const store = useMapStore()
    const firstProjectTasks = [createTask('project-1-task-1'), createTask('project-1-task-2')]

    store.projectMarkers = [
      {
        id: 'section-1',
        title: 'Project 1',
        description: '',
        category: 'projects',
        date: '2026-04-01',
        city: '',
        images: [],
        tasks: firstProjectTasks,
      },
      {
        id: 'section-2',
        title: 'Project 2',
        description: '',
        category: 'projects',
        date: '2026-04-01',
        city: '',
        images: [],
        tasks: [createTask('project-2-task-1')],
      },
    ]
    store.setCategory('projects')

    expect(store.mapMarkers.map(marker => marker.id)).toEqual([
      'project-1-task-1',
      'project-1-task-2',
      'project-2-task-1',
    ])

    store.focusProjectTasks(store.projectMarkers[0], firstProjectTasks[0])

    expect(store.mapMarkers.map(marker => marker.id)).toEqual([
      'project-1-task-1',
      'project-1-task-2',
    ])
  })

  it('focuses project tasks without selecting the first task by default', () => {
    setActivePinia(createPinia())
    const store = useMapStore()
    const tasks = [
      createTask('project-1-task-1', [60.6, 56.8]),
      createTask('project-1-task-2', [61.2, 57.1]),
    ]
    const project: Marker = {
      id: 'section-1',
      title: 'Project 1',
      description: '',
      category: 'projects',
      date: '2026-04-01',
      city: '',
      images: [],
      tasks,
    }

    store.focusProjectTasks(project, null)

    expect(store.focusedProjectTasks.map(task => task.id)).toEqual([
      'project-1-task-1',
      'project-1-task-2',
    ])
    expect(store.focusedProjectSelectedTaskId).toBeNull()
    expect(store.selectedMarker).toBeNull()
  })

  it('zooms to a selected project task like a regular marker', () => {
    setActivePinia(createPinia())
    const store = useMapStore()
    const task = createTask('project-1-task-1', [60.6, 56.8])
    const project: Marker = {
      id: 'section-1',
      title: 'Project 1',
      description: '',
      category: 'projects',
      date: '2026-04-01',
      city: '',
      images: [],
      tasks: [
        task,
        createTask('project-1-task-2', [61.2, 57.1]),
      ],
    }

    store.focusProjectTasks(project, task)
    store.selectMarker(task)

    expect(store.mapCenter).toEqual([60.6, 56.8])
    expect(store.mapZoom).toBe(14)
  })
})

describe('sport markers', () => {
  it('uses loaded sport markers and filters by sport type', () => {
    setActivePinia(createPinia())
    const store = useMapStore()

    store.sportMarkers = [
      createSportMarker('sport-1', ['Бег']),
      createSportMarker('sport-2', ['Плавание']),
    ]
    store.setCategory('sport')
    store.setSportTypeFilter(['Бег'])

    expect(store.markers.map(marker => marker.id)).toEqual(['sport-1', 'sport-2'])
    expect(store.filteredMarkers.map(marker => marker.id)).toEqual(['sport-1'])
  })

  it('collects sport types from sport markers dynamically', () => {
    setActivePinia(createPinia())
    const store = useMapStore()

    store.sportMarkers = [
      createSportMarker('sport-1', ['Бег']),
      createSportMarker('sport-2', ['Плавание', 'Лыжи']),
    ]

    expect(store.sportTypes).toEqual([
      'Бег',
      'Лыжи',
      'Плавание',
    ])
  })

  it('builds available tags from loaded sport markers', () => {
    setActivePinia(createPinia())
    const store = useMapStore()

    store.sportMarkers = [
      createSportMarker('sport-1', ['Бег'], [
        { id: 1, title: ' Бег ' },
        { id: 2, title: 'Техника' },
      ]),
      createSportMarker('sport-2', ['Плавание'], [
        { id: 3, title: 'бег' },
        { id: 4, title: '  Сборы  ' },
      ]),
    ]

    store.setCategory('sport')

    expect(store.availableTags.map(tag => tag.title)).toEqual([
      'Бег',
      'Сборы',
      'Техника',
    ])
  })
})

describe('date filters', () => {
  it('filters markers by an inclusive date range and keeps invalid dates', () => {
    setActivePinia(createPinia())
    const store = useMapStore()

    store.projectMarkers = [
      createProjectMarker('before', '2024-05-31'),
      createProjectMarker('start', '2024-06-01'),
      createProjectMarker('inside', '2024-06-15'),
      createProjectMarker('end', '2024-06-30'),
      createProjectMarker('after', '2024-07-01'),
      createProjectMarker('invalid', ''),
    ]
    store.setCategory('projects')
    store.setDateRange({ start: '2024-06-01', end: '2024-06-30' })

    expect(store.filteredMarkers.map(marker => marker.id)).toEqual([
      'start',
      'inside',
      'end',
      'invalid',
    ])
  })

  it('uses filtered project markers for the map and clears only date range', () => {
    setActivePinia(createPinia())
    const store = useMapStore()

    store.projectMarkers = [
      createProjectMarker('visible', '2024-06-15'),
      createProjectMarker('hidden', '2024-07-15'),
    ]
    store.setCategory('projects')
    store.setCityFilter(['Москва'])
    store.setDateRange({ start: '2024-06-01', end: '2024-06-30' })

    expect(store.activeFilterCount).toBe(2)
    expect(store.dateRangeLabel).toBe('01.06.2024-30.06.2024')
    expect(store.mapMarkers.map(marker => marker.id)).toEqual(['visible-task'])

    store.clearDateRange()

    expect(store.dateRange).toEqual({ start: null, end: null })
    expect(store.cityFilter).toEqual(['Москва'])
    expect(store.activeFilterCount).toBe(1)
  })
})

describe('filter options', () => {
  it('resets filters when category changes', () => {
    setActivePinia(createPinia())
    const store = useMapStore()

    store.setCategory('sport')
    store.setDateRange({ start: '2024-06-01', end: '2024-06-30' })
    store.setCityFilter(['Москва'])
    store.setSportTypeFilter(['Плавание'])
    store.setTagFilter(['техника'])

    store.setCategory('travel')

    expect(store.dateRange).toEqual({ start: null, end: null })
    expect(store.cityFilter).toEqual([])
    expect(store.sportTypeFilter).toEqual([])
    expect(store.tagFilter).toEqual([])
  })

  it('builds locations from the currently loaded category markers', () => {
    setActivePinia(createPinia())
    const store = useMapStore()

    store.projectMarkers = [
      { ...createProjectMarker('project-msk', '2024-06-01'), city: 'Москва' },
      { ...createProjectMarker('project-kazan', '2024-06-01'), city: 'Казань' },
      { ...createProjectMarker('project-empty', '2024-06-01'), city: '' },
    ]
    store.travelMarkers = [
      createTravelMarker('travel-spb', 'Санкт-Петербург'),
    ]

    store.setCategory('projects')
    expect(store.locations).toEqual(['Казань', 'Москва'])

    store.setCategory('travel')
    expect(store.locations).toEqual(['Санкт-Петербург'])

    store.setCategory('all')
    expect(store.locations).toEqual(['Казань', 'Москва', 'Санкт-Петербург'])
  })
})
