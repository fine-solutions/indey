import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import FormButton from '../form/FormButton.vue'

describe('FormButton', () => {
  it('renders properly', () => {
    const wrapper = mount(FormButton, { props: { label: 'Button' } })
    expect(wrapper.text()).toContain('Button')
  })
})
