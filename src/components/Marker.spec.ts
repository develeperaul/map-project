import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Marker from './Marker.vue'

describe('Marker', () => {
  it('adds active class when selected', () => {
    const wrapper = mount(Marker, {
      props: {
        category: 'projects',
        active: true
      }
    })

    expect(wrapper.find('.active').exists()).toBe(true)
  })
})
