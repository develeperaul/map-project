import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import ImageWithLoader from './ImageWithLoader.vue'

describe('ImageWithLoader', () => {
  it('shows circular progress until the image is loaded', async () => {
    vi.useFakeTimers()

    const wrapper = mount(ImageWithLoader, {
      props: {
        src: 'https://example.com/image.jpg',
        alt: 'Example image',
        wrapperClass: 'h-10 w-10 rounded',
        imgClass: 'h-full w-full object-cover',
      },
    })

    expect(wrapper.classes()).toContain('bg-base-light-00')
    expect(wrapper.text()).toContain('0%')
    expect(wrapper.find('img').classes()).toContain('opacity-0')

    vi.advanceTimersByTime(240)
    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toMatch(/\d+%/)

    await wrapper.find('img').trigger('load')

    expect(wrapper.text()).not.toContain('%')
    expect(wrapper.find('img').classes()).toContain('opacity-100')

    vi.useRealTimers()
  })

  it('shows camera-off fallback when image loading fails', async () => {
    const wrapper = mount(ImageWithLoader, {
      props: {
        src: 'https://example.com/broken-image.jpg',
        alt: 'Broken image',
        wrapperClass: 'h-10 w-10 rounded',
        imgClass: 'h-full w-full object-cover',
      },
      global: {
        stubs: {
          BaseIcon: {
            template: '<svg data-test="base-icon" :data-name="name" />',
            props: ['name'],
          },
        },
      },
    })

    await wrapper.find('img').trigger('error')

    expect(wrapper.find('[data-test="base-icon"]').exists()).toBe(true)
    expect(wrapper.find('[data-test="base-icon"]').attributes('data-name')).toBe('camera-off')
    expect(wrapper.find('img').classes()).toContain('opacity-0')
  })
})
