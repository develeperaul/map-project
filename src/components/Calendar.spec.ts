import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import Calendar from './Calendar.vue'

describe('Calendar', () => {
  it('renders action buttons when showActions is enabled', () => {
    const wrapper = mount(Calendar, {
      props: {
        mode: 'range',
        showActions: true,
        modelValue: { start: null, end: null }
      }
    })

    expect(wrapper.text()).toContain('Сбросить')
    expect(wrapper.text()).toContain('Применить')
  })
})
