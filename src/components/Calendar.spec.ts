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

  it('blocks navigation and dates outside the provided bounds', () => {
    const wrapper = mount(Calendar, {
      props: {
        modelValue: { start: new Date('2024-06-10'), end: null },
        minDate: new Date('2024-06-01'),
        maxDate: new Date('2024-06-20'),
      },
    })

    const buttons = wrapper.findAll('button')
    const prevMonth = buttons.find(button => button.attributes('aria-label') === 'Предыдущий месяц')
    const nextMonth = buttons.find(button => button.attributes('aria-label') === 'Следующий месяц')
    const allowedDay = buttons.find(button => button.text().trim() === '15')
    const blockedDay = buttons.find(button => button.text().trim() === '25')

    expect(prevMonth?.attributes('disabled')).toBeDefined()
    expect(nextMonth?.attributes('disabled')).toBeDefined()
    expect(allowedDay?.attributes('disabled')).toBeUndefined()
    expect(blockedDay?.attributes('disabled')).toBeDefined()
  })

  it('opens month and year dropdowns from the header labels', async () => {
    const wrapper = mount(Calendar, {
      props: {
        modelValue: { start: new Date('2024-06-10'), end: null },
        minDate: new Date('2023-01-01'),
        maxDate: new Date('2025-12-31'),
      },
    })

    const headerButtons = wrapper.findAll('button').filter(button => {
      const text = button.text().trim()
      return text === 'Июнь' || text === '2024'
    })

    await headerButtons[0].trigger('click')
    expect(wrapper.text()).toContain('Январь')
    expect(wrapper.text()).toContain('Май')

    await wrapper.findAll('button').find(button => button.text().trim() === 'Май')?.trigger('click')
    expect(wrapper.text()).toContain('Май')

    await headerButtons[1].trigger('click')
    expect(wrapper.text()).toContain('2023')
    expect(wrapper.text()).toContain('2025')

    await wrapper.findAll('button').find(button => button.text().trim() === '2025')?.trigger('click')
    expect(wrapper.text()).toContain('2025')
  })

  it('closes the active dropdown when clicking outside', async () => {
    const wrapper = mount(Calendar, {
      props: {
        modelValue: { start: new Date('2024-06-10'), end: null },
      },
      attachTo: document.body,
    })

    const monthButton = wrapper.findAll('button').find(button => button.text().trim() === 'Июнь')
    await monthButton?.trigger('click')
    expect(wrapper.text()).toContain('Январь')

    document.body.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))
    await wrapper.vm.$nextTick()

    expect(wrapper.text()).not.toContain('Январь')
    wrapper.unmount()
  })
})
