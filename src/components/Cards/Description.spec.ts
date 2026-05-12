import { enableAutoUnmount, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { afterEach, describe, expect, it } from 'vitest'
import Description from './Description.vue'
import { useMapStore } from '../../stores/map'
import { projectFixture, travelFixture } from '../../test/markers'

enableAutoUnmount(afterEach)

afterEach(() => {
  document.body.innerHTML = ''
  document.body.style.overflow = ''
})

describe('Cards/Description', () => {
  it('renders slider controls for project tasks', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)

    const store = useMapStore()
    store.selectMarker(projectFixture)

    const wrapper = mount(Description, {
      global: {
        plugins: [pinia]
      },
      props: {
        tasks: projectFixture.tasks,
        taskIndex: 0
      }
    })

    expect(wrapper.text()).toContain('Выполнено 2/5')
    expect(wrapper.text()).toContain(projectFixture.distance)
    expect(wrapper.text()).toContain('Назад')
    expect(wrapper.text()).toContain('Далее')
    expect(wrapper.findAll('img').length).toBeGreaterThan(0)
    expect(wrapper.findAll('[data-slide-dot]').length).toBe(5)

    const nextButton = wrapper.findAll('button').find((button) => button.text().includes('Далее'))
    await nextButton?.trigger('click')
    expect(wrapper.emitted('update:taskIndex')?.[0]).toEqual([1])
  })

  it('renders every image from the marker gallery', () => {
    const pinia = createPinia()
    setActivePinia(pinia)

    const store = useMapStore()
    const marker = {
      ...projectFixture,
      tasks: [],
      images: [
        { url: 'https://example.com/one.jpg' },
        { url: 'https://example.com/two.jpg' },
        { url: 'https://example.com/three.jpg' },
        { url: 'https://example.com/four.jpg' },
      ],
    }
    store.selectMarker(marker)

    const wrapper = mount(Description, {
      global: {
        plugins: [pinia]
      }
    })

    const imageSources = wrapper.findAll('img').map(image => image.attributes('src'))

    expect(imageSources).toEqual([
      'https://example.com/one.jpg',
      'https://example.com/two.jpg',
      'https://example.com/three.jpg',
      'https://example.com/four.jpg',
    ])
  })

  it('renders travel distance when it is available', () => {
    const pinia = createPinia()
    setActivePinia(pinia)

    const store = useMapStore()
    store.selectMarker(travelFixture)

    const wrapper = mount(Description, {
      global: {
        plugins: [pinia]
      }
    })

    expect(wrapper.text()).toContain(travelFixture.distance)
  })

  it('opens a fullscreen gallery from the clicked marker image', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)

    const store = useMapStore()
    const marker = {
      ...projectFixture,
      tasks: [],
      images: [
        { url: 'https://example.com/one.jpg', description: 'Первое фото' },
        { url: 'https://example.com/two.jpg', description: 'Второе фото' },
      ],
    }
    store.selectMarker(marker)

    const wrapper = mount(Description, {
      attachTo: document.body,
      global: {
        plugins: [pinia]
      }
    })

    await wrapper.findAll('button[aria-label^="Открыть изображение"]')[1].trigger('click')

    expect(document.body.textContent).toContain('2 из 2')
    expect(document.body.textContent).toContain('Второе фото')
    expect(document.body.style.overflow).toBe('hidden')

    const prevButton = document.body.querySelector<HTMLButtonElement>('button[aria-label="Предыдущее изображение"]')
    await prevButton?.click()

    expect(document.body.textContent).toContain('1 из 2')
    expect(document.body.textContent).toContain('Первое фото')

    const closeButton = document.body.querySelector<HTMLButtonElement>('button[aria-label="Закрыть просмотр"]')
    await closeButton?.click()

    expect(document.body.textContent).not.toContain('1 из 2')
    expect(document.body.style.overflow).toBe('')
  })
})
