import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import Description from './Description.vue'
import { projectFixture, travelFixture } from '../../test/markers'

const project = projectFixture
const tasks = project.tasks!
const longDescription = [
  'Координация календаря соревнований, распределение игровых площадок и назначение ответственных лиц.',
  'Ведение календаря матчей, фиксация результатов игр и сбор статистики команд.',
  'Организация взаимодействия между командами, судейской бригадой и администрацией площадок.',
  'Контроль соблюдения регламента соревнований и установленного расписания матчей.',
  'Актуализация турнирных таблиц и оперативное обновление информации по итогам игр.',
  'Подготовка сводных отчётов по результатам матчей и этапов соревнований.',
].join('\n')

const stubs = {
  BaseIcon: { template: '<span data-stub="icon" />' },
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
  it('renders as a fixed popup card with a grabber', () => {
    const wrapper = mount(Description, {
      attachTo: document.body,
      props: {
        marker: travelFixture,
      },
      global: {
        stubs,
      },
    })

    const root = document.body.querySelector('[data-mobile-description]')
    expect(root).toBeTruthy()
    expect(root?.className).toContain('fixed')
    expect(root?.className).toContain('inset-0')
    expect(root?.className).toContain('pointer-events-none')
    expect(document.body.querySelector('.cursor-grab')).toBeTruthy()
    expect(document.body.textContent).toContain(travelFixture.title)
    expect(document.body.textContent).toContain(travelFixture.distance)

    wrapper.unmount()
  })

  it('renders task header, status pagination and emits close/back separately', async () => {
    const wrapper = mount(Description, {
      attachTo: document.body,
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

    expect(document.body.textContent).toContain(project.title)
    expect(document.body.textContent).toContain('Выполнено 2/5')
    expect(document.body.textContent).toContain(tasks[1].title)
    expect(document.body.querySelectorAll('[data-task-dot]')).toHaveLength(tasks.length)
    expect(document.body.querySelector('[data-task-dot="0"]')?.getAttribute('data-task-status')).toBe('completed')
    expect(document.body.querySelector('[data-task-dot="1"]')?.getAttribute('data-task-status')).toBe('completed')
    expect(document.body.querySelector('[data-task-dot="1"]')?.getAttribute('data-task-active')).toBe('true')
    expect(document.body.querySelector('[data-task-dot="2"]')?.getAttribute('data-task-status')).toBe('in-progress')

    await document.body.querySelector<HTMLButtonElement>('button[aria-label="Назад"]')?.click()
    await document.body.querySelector<HTMLButtonElement>('button[aria-label="Закрыть описание"]')?.click()

    expect(wrapper.emitted('back')).toHaveLength(1)
    expect(wrapper.emitted('close')).toHaveLength(1)

    wrapper.unmount()
  })

  it('closes on drag and updates task index from dots', async () => {
    const wrapper = mount(Description, {
      attachTo: document.body,
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

    const grabber = document.body.querySelector('.cursor-grab')
    grabber?.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, clientY: 0 }))
    grabber?.dispatchEvent(new MouseEvent('mousemove', { bubbles: true, clientY: 160 }))
    grabber?.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, clientY: 160 }))

    expect(wrapper.emitted('close')).toHaveLength(1)

    await document.body.querySelector<HTMLButtonElement>('button[aria-label="Открыть задачу 3"]')?.click()
    expect(wrapper.emitted('update:taskIndex')).toEqual([[2]])

    wrapper.unmount()
  })

  it('opens the full text popup from the inline link and closes it by drag', async () => {
    const wrapper = mount(Description, {
      attachTo: document.body,
      props: {
        marker: {
          ...travelFixture,
          description: longDescription,
        },
      },
      global: {
        stubs,
      },
    })

    expect(document.body.textContent).toContain('Полный текст')

    await document.body.querySelector<HTMLButtonElement>('button[aria-label="Полный текст"]')?.click()

    expect(document.body.textContent).toContain('Описание')
    expect(document.body.textContent).toContain('Закрыть')
    expect(document.body.textContent).toContain('Актуализация турнирных таблиц')

    await document.body.querySelector<HTMLButtonElement>('[role="dialog"][aria-label="Полный текст"] button')?.click()
    expect(document.body.querySelector('[role="dialog"][aria-label="Полный текст"]')).toBeNull()

    wrapper.unmount()
  })

  it('opens mobile gallery from preview and switches images by swipe', async () => {
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

    await document.body.querySelectorAll<HTMLButtonElement>('button[aria-label^="Открыть изображение"]')[1]?.click()

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
    expect(document.body.style.overflow).toBe('hidden')

    wrapper.unmount()
    expect(document.body.style.overflow).toBe('')
  })
})
