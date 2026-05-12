import { describe, expect, it } from 'vitest'
import type { Marker } from '../../data/mock'
import { markerFixtures, travelFixture } from '../../test/markers'
import { resolveSelection } from './selection'

describe('resolveSelection', () => {
  it('resolves a project marker without selecting a task by default', () => {
    const result = resolveSelection(markerFixtures[0], markerFixtures)

    expect(result.kind).toBe('project')
    if (result.kind === 'project') {
      expect(result.project.id).toBe(markerFixtures[0].id)
      expect(result.taskIndex).toBe(-1)
    }
  })

  it('resolves a task marker to its project and index', () => {
    const result = resolveSelection(markerFixtures[0].tasks![3], markerFixtures)

    expect(result.kind).toBe('task')
    if (result.kind === 'task') {
      expect(result.project.id).toBe(markerFixtures[0].id)
      expect(result.taskIndex).toBe(3)
      expect(result.task.id).toBe(markerFixtures[0].tasks![3].id)
    }
  })

  it('resolves a travel marker as a plain marker', () => {
    const result = resolveSelection(travelFixture, markerFixtures)

    expect(result.kind).toBe('marker')
    if (result.kind === 'marker') {
      expect(result.marker.id).toBe(travelFixture.id)
    }
  })

  it('resolves API project tasks from the provided source markers', () => {
    const apiProject: Marker = {
      id: 'section-20',
      title: 'API Project',
      description: '',
      category: 'projects',
      date: '2026-04-01',
      city: 'Москва',
      status: 50,
      images: [],
      tasks: [
        {
          id: '101',
          title: 'API Task',
          description: '',
          coordinates: [37.6173, 55.7558],
          category: 'projects',
          date: '2026-04-02',
          city: 'Москва',
          status: 50,
          images: [],
        },
      ],
    }

    const result = resolveSelection(apiProject.tasks![0], [apiProject])

    expect(result.kind).toBe('task')
    if (result.kind === 'task') {
      expect(result.project.id).toBe(apiProject.id)
      expect(result.taskIndex).toBe(0)
      expect(result.task.id).toBe('101')
    }
  })
})
