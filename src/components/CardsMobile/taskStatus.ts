import type { Marker } from '../../data/mock'

export type TaskDotState = 'current' | 'completed' | 'in-progress' | 'pending'

export const getTaskDotState = (task: Marker, index: number, activeTaskIndex: number): TaskDotState => {
  if (index === activeTaskIndex) return 'current'
  if (task.status === 100) return 'completed'
  if (typeof task.status === 'number' && task.status > 0) return 'in-progress'
  return 'pending'
}

export const getTaskDotClass = (state: TaskDotState) => {
  switch (state) {
    case 'current':
      return 'border-secondary-dark bg-secondary-dark'
    case 'completed':
      return 'border-text-00 bg-text-00'
    case 'in-progress':
      return 'border-primary bg-white'
    case 'pending':
      return 'border-border bg-base-light-00'
  }
}
