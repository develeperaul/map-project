import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Marker from './Marker.vue'

describe('Marker', () => {
  it('keeps the active class when selected', () => {
    const wrapper = mount(Marker, {
      props: {
        category: 'projects',
        active: true,
      },
    })

    expect(wrapper.classes()).toContain('active')
    expect(wrapper.classes()).toContain('marker-pin--click')
  })

  it('renders the clicked state with white fill and category-colored shell', () => {
    const wrapper = mount(Marker, {
      props: {
        category: 'projects',
        state: 'click',
      },
    })

    const style = wrapper.attributes('style')

    expect(wrapper.classes()).toContain('marker-pin--click')
    expect(style).toContain('--marker-outer-color: #3F51B5')
    expect(style).toContain('--marker-inner-color: #FFFFFF')
    expect(style).toContain('--marker-icon-color: #3F51B5')
  })

  it('uses the hover color while hovered', async () => {
    const wrapper = mount(Marker, {
      props: {
        category: 'travel',
      },
    })

    await wrapper.trigger('mouseenter')

    expect(wrapper.classes()).toContain('marker-pin--hover')
    expect(wrapper.attributes('style')).toContain('--marker-inner-color: #FF8159')
  })
})
