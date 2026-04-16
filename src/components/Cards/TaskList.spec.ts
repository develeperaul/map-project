import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import TaskList from './TaskList.vue'
import { mockMarkers } from '../../data/mock'

describe('Cards/TaskList', () => {
  it('renders desktop header and highlights the active task', () => {
    const project = mockMarkers[0]

    const wrapper = mount(TaskList, {
      props: {
        project,
        activeTaskIndex: 2
      }
    })

    expect(wrapper.text()).toContain(project.title)
    expect(wrapper.text()).toContain('Выполнено 2/5')
    expect(wrapper.text()).toContain('Подготовить программу')
    expect(wrapper.text()).toContain('Москва')
    expect(wrapper.text()).toContain('Май 2024')
    expect(wrapper.find('[data-task-active="true"]').exists()).toBe(true)
  })
})
