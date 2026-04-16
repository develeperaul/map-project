import { describe, expect, it } from 'vitest'
import { mockMarkers } from '../../data/mock'
import { resolveSelection } from './selection'

describe('resolveSelection', () => {
  it('resolves a project marker to the first task', () => {
    const result = resolveSelection(mockMarkers[0])

    expect(result.kind).toBe('project')
    if (result.kind === 'project') {
      expect(result.project.id).toBe(mockMarkers[0].id)
      expect(result.taskIndex).toBe(0)
    }
  })

  it('resolves a task marker to its project and index', () => {
    const result = resolveSelection(mockMarkers[0].tasks![3])

    expect(result.kind).toBe('task')
    if (result.kind === 'task') {
      expect(result.project.id).toBe(mockMarkers[0].id)
      expect(result.taskIndex).toBe(3)
      expect(result.task.id).toBe(mockMarkers[0].tasks![3].id)
    }
  })

  it('resolves a travel marker as a plain marker', () => {
    const result = resolveSelection(mockMarkers[5])

    expect(result.kind).toBe('marker')
    if (result.kind === 'marker') {
      expect(result.marker.id).toBe(mockMarkers[5].id)
    }
  })
})
