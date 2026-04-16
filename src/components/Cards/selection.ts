import { mockMarkers, type Marker } from '../../data/mock'

export type SelectionTarget =
  | { kind: 'project'; project: Marker; taskIndex: number }
  | { kind: 'task'; project: Marker; taskIndex: number; task: Marker }
  | { kind: 'marker'; marker: Marker }

export function resolveSelection(marker: Marker): SelectionTarget {
  // Сначала пытаемся понять, не является ли кликнутый элемент самим проектом.
  const project = mockMarkers.find(item => item.id === marker.id)

  if (project) {
    if (project.category === 'projects' && project.tasks?.length) {
      return { kind: 'project', project, taskIndex: 0 }
    }

    return { kind: 'marker', marker: project }
  }

  // Если это не проект, ищем его среди задач проектов.
  for (const item of mockMarkers) {
    const taskIndex = item.tasks?.findIndex(task => task.id === marker.id) ?? -1
    if (taskIndex >= 0 && item.tasks) {
      return { kind: 'task', project: item, taskIndex, task: item.tasks[taskIndex] }
    }
  }

  return { kind: 'marker', marker }
}
