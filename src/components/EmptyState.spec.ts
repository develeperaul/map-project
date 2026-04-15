import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import EmptyState from './EmptyState.vue'

describe('EmptyState', () => {
  it('renders icon, title, and description', () => {
    const wrapper = mount(EmptyState, {
      props: {
        icon: 'search',
        title: 'Ничего не найдено',
        description: 'Измените параметры поиска'
      }
    })

    expect(wrapper.text()).toContain('Ничего не найдено')
    expect(wrapper.text()).toContain('Измените параметры поиска')
    expect(wrapper.find('use').attributes('href')).toBe('#search')
  })
})
