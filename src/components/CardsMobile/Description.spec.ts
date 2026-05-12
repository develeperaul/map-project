import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import Description from './Description.vue'
import { projectFixture, travelFixture } from '../../test/markers'

const project = projectFixture
const tasks = project.tasks!

const stubs = {
  BaseIcon: { template: '<span data-stub="icon" />' },
  Chip: { template: '<span data-stub="chip">{{ label }}</span>', props: ['label'] },
  ImageWithLoader: {
    props: ['src', 'alt'],
    template: '<img :src="src" :alt="alt" data-stub="image-loader" />',
  },
}

afterEach(() => {
  document.body.innerHTML = ''
  document.body.style.overflow = ''
})

describe('CardsMobile/Description', () => {
  it('renders as a fixed overlay card instead of bottom-sheet content', () => {
    const wrapper = mount(Description, {
      props: {
        marker: travelFixture,
      },
      global: {
        stubs,
      },
    })

    const root = wrapper.get('[data-mobile-description]')
    expect(root.classes()).toContain('fixed')
    expect(root.classes()).toContain('inset-0')
    expect(root.classes()).toContain('bg-transparent')
    expect(wrapper.text()).toContain(travelFixture.title)
    expect(wrapper.text()).toContain(travelFixture.distance)
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
    expect(wrapper.text()).toContain(project.distance)
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

    const root = wrapper.get('[data-mobile-description]')

    await wrapper.findAll('[data-slide-dot]')[2].trigger('click')
    await root.trigger('touchstart', { touches: [{ clientX: 240 }] })
    await root.trigger('touchend', { changedTouches: [{ clientX: 120 }] })

    expect(wrapper.emitted('update:taskIndex')).toEqual([[2], [1]])
  })

  it('opens mobile fancybox from preview and switches images by swipe', async () => {
    const wrapper = mount(Description, {
      attachTo: document.body,
      props: {
        marker: {
          ...travelFixture,
          images: [
            { url: 'https://example.com/mobile-one.jpg', description: 'Первое фото', city: 'Северный полюс' },
            { url: 'https://example.com/mobile-two.jpg', description: 'Второе фото', city: 'Северный полюс' },
          ],
        },
      },
      global: {
        stubs,
      },
    })

    await wrapper.findAll('button[aria-label^="Открыть изображение"]')[1].trigger('click')

    expect(document.body.textContent).toContain('2 из 2')
    expect(document.body.textContent).toContain('Второе фото')
    expect(document.body.style.overflow).toBe('hidden')

    const dialog = document.body.querySelector('[aria-label="Просмотр изображений"]')
    dialog?.dispatchEvent(new TouchEvent('touchstart', { bubbles: true, touches: [{ clientX: 240 }] as unknown as Touch[] }))
    dialog?.dispatchEvent(new TouchEvent('touchend', { bubbles: true, changedTouches: [{ clientX: 120 }] as unknown as Touch[] }))
    await wrapper.vm.$nextTick()

    expect(document.body.textContent).toContain('1 из 2')
    expect(document.body.textContent).toContain('Первое фото')

    const closeButton = document.body.querySelector<HTMLButtonElement>('button[aria-label="Закрыть просмотр"]')
    await closeButton?.click()

    expect(document.body.textContent).not.toContain('1 из 2')
    expect(document.body.style.overflow).toBe('')
  })
})
