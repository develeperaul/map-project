import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Description from './Description.vue'
import { mockMarkers, type Marker } from '../../data/mock'

const project = mockMarkers.find(marker => marker.id === '1')!
const tasks = project.tasks!
const travelMarker: Marker = {
  id: 'travel-test',
  title: 'Тестовое путешествие',
  description: '',
  coordinates: [37.6173, 55.7558],
  category: 'travel',
  date: '2026-04-11',
  city: 'Москва',
  images: [],
}

const stubs = {
  BaseIcon: { template: '<span data-stub="icon" />' },
  Chip: { template: '<span data-stub="chip">{{ label }}</span>', props: ['label'] },
}

describe('CardsMobile/Description', () => {
  it('renders as a fixed overlay card instead of bottom-sheet content', () => {
    const wrapper = mount(Description, {
      props: {
        marker: travelMarker,
      },
      global: {
        stubs,
      },
    })

    expect(wrapper.classes()).toContain('fixed')
    expect(wrapper.classes()).toContain('inset-0')
    expect(wrapper.classes()).toContain('bg-transparent')
    expect(wrapper.text()).toContain(travelMarker.title)
  })

  it('renders task slider state and emits close/back separately', async () => {
    const wrapper = mount(Description, {
      props: {
        marker: tasks[1],
        project,
        tasks,
        taskIndex: 1,
      },
      global: {
        stubs,
      },
    })

    expect(wrapper.text()).toContain(project.title)
    expect(wrapper.text()).toContain('Выполнено')
    expect(wrapper.findAll('[data-slide-dot]')).toHaveLength(tasks.length)

    await wrapper.find('button[aria-label="Назад к задачам"]').trigger('click')
    await wrapper.find('button[aria-label="Закрыть описание"]').trigger('click')

    expect(wrapper.emitted('back')).toHaveLength(1)
    expect(wrapper.emitted('close')).toHaveLength(1)
  })

  it('emits task index updates from dots and swipe', async () => {
    const wrapper = mount(Description, {
      props: {
        marker: tasks[0],
        project,
        tasks,
        taskIndex: 0,
      },
      global: {
        stubs,
      },
    })

    await wrapper.findAll('[data-slide-dot]')[2].trigger('click')
    await wrapper.trigger('touchstart', { touches: [{ clientX: 240 }] })
    await wrapper.trigger('touchend', { changedTouches: [{ clientX: 120 }] })

    expect(wrapper.emitted('update:taskIndex')).toEqual([[2], [1]])
  })
})
