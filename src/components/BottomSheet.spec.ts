import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import BottomSheet from './BottomSheet.vue'

const originalResizeObserver = globalThis.ResizeObserver

afterEach(() => {
  document.body.style.overflow = ''
  document.documentElement.style.overflow = ''
  document.body.innerHTML = ''
  globalThis.ResizeObserver = originalResizeObserver
})

describe('BottomSheet', () => {
  it('emits height changes while open', async () => {
    const observe = vi.fn()
    const disconnect = vi.fn()

    class MockResizeObserver {
      callback: ResizeObserverCallback

      constructor(callback: ResizeObserverCallback) {
        this.callback = callback
      }

      observe = observe
      disconnect = disconnect
      unobserve = vi.fn()
    }

    globalThis.ResizeObserver = MockResizeObserver

    const wrapper = mount(BottomSheet, {
      props: {
        modelValue: true,
        height: 'auto',
      },
      slots: {
        default: '<div style="height: 100px" />',
      },
      attachTo: document.body,
    })

    await Promise.resolve()
    await Promise.resolve()

    expect(observe).toHaveBeenCalled()
    expect(wrapper.emitted('height-change')).toBeTruthy()

    wrapper.unmount()
  })

  it('locks document scroll while open and restores it on close', async () => {
    document.body.style.overflow = 'auto'
    document.documentElement.style.overflow = 'clip'

    const wrapper = mount(BottomSheet, {
      props: {
        modelValue: true,
      },
      attachTo: document.body,
    })

    expect(document.body.style.overflow).toBe('hidden')
    expect(document.documentElement.style.overflow).toBe('hidden')

    await wrapper.setProps({ modelValue: false })

    expect(document.body.style.overflow).toBe('auto')
    expect(document.documentElement.style.overflow).toBe('clip')
  })

  it('restores document scroll when unmounted while open', () => {
    document.body.style.overflow = 'auto'
    document.documentElement.style.overflow = 'clip'

    const wrapper = mount(BottomSheet, {
      props: {
        modelValue: true,
      },
      attachTo: document.body,
    })

    wrapper.unmount()

    expect(document.body.style.overflow).toBe('auto')
    expect(document.documentElement.style.overflow).toBe('clip')
  })

  it('keeps document scroll locked until every open sheet is closed', async () => {
    document.body.style.overflow = 'auto'
    document.documentElement.style.overflow = 'clip'

    const first = mount(BottomSheet, {
      props: {
        modelValue: true,
      },
      attachTo: document.body,
    })
    const second = mount(BottomSheet, {
      props: {
        modelValue: true,
      },
      attachTo: document.body,
    })

    first.unmount()

    expect(document.body.style.overflow).toBe('hidden')
    expect(document.documentElement.style.overflow).toBe('hidden')

    await second.setProps({ modelValue: false })

    expect(document.body.style.overflow).toBe('auto')
    expect(document.documentElement.style.overflow).toBe('clip')
  })
})
