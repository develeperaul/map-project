import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import TaskList from './TaskList.vue'
import { mockMarkers } from '../../data/mock'

const project = mockMarkers.find(marker => marker.id === '1')!

const global = {
  stubs: {
    BaseIcon: { template: '<span data-stub="icon" />' },
  },
}

describe('CardsMobile/TaskList', () => {
  it('renders project title, completed count and tasks', () => {
    const wrapper = mount(TaskList, {
      props: {
        project,
      },
      global,
    })

    expect(wrapper.text()).toContain(project.title)
    expect(wrapper.text()).toContain('Выполнено 2/5')
    expect(wrapper.text()).toContain(project.tasks![0].title)
    expect(wrapper.text()).toContain(project.tasks![1].title)
  })

  it('emits selected task with its index', async () => {
    const wrapper = mount(TaskList, {
      props: {
        project,
      },
      global,
    })

    await wrapper.findAll('button').find(button => button.text().includes(project.tasks![1].title))?.trigger('click')

    expect(wrapper.emitted('select')?.[0]).toEqual([project.tasks![1], 1])
  })

  it('marks the active task row', () => {
    const wrapper = mount(TaskList, {
      props: {
        project,
        activeTaskIndex: 2,
      },
      global,
    })

    const activeTask = wrapper.find('[data-task-active="true"]')

    expect(activeTask.exists()).toBe(true)
    expect(activeTask.text()).toContain(project.tasks![2].title)
  })
})
