import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { describe, expect, it } from 'vitest'
import Description from './Description.vue'
import { useMapStore } from '../../stores/map'
import { mockMarkers } from '../../data/mock'

describe('Cards/Description', () => {
  it('renders slider controls for project tasks', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)

    const store = useMapStore()
    store.selectMarker(mockMarkers[0])

    const wrapper = mount(Description, {
      global: {
        plugins: [pinia]
      },
      props: {
        tasks: mockMarkers[0].tasks,
        taskIndex: 0
      }
    })

    expect(wrapper.text()).toContain('Выполнено 2/5')
    expect(wrapper.text()).toContain('Назад')
    expect(wrapper.text()).toContain('Далее')
    expect(wrapper.findAll('img').length).toBeGreaterThan(0)
    expect(wrapper.findAll('[data-slide-dot]').length).toBe(5)

    const nextButton = wrapper.findAll('button').find((button) => button.text().includes('Далее'))
    await nextButton?.trigger('click')
    expect(wrapper.emitted('update:taskIndex')?.[0]).toEqual([1])
  })
})
