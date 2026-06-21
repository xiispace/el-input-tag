import { shallowMount } from '@vue/test-utils'
import ElInputTag from '../../src/ElInputTag.vue'

const stubs = {
  'el-tag': {
    template: '<span class="el-tag"><slot /></span>'
  }
}

function mountComponent (propsData = {}) {
  return shallowMount(ElInputTag, {
    propsData: {
      value: [],
      ...propsData
    },
    stubs
  })
}

describe('ElInputTag', () => {
  it('adds a tag when Enter is pressed', () => {
    const wrapper = mountComponent()

    wrapper.vm.newTag = 'alpha'
    wrapper.vm.addNew({ type: 'keydown', keyCode: 13, stopPropagation: jest.fn(), preventDefault: jest.fn() })

    expect(wrapper.emitted().input[0][0]).toEqual(['alpha'])
    expect(wrapper.vm.newTag).toBe('')
  })

  it('splits comma-separated input and ignores duplicates', () => {
    const wrapper = mountComponent({ value: ['alpha'] })

    wrapper.vm.newTag = 'alpha, beta, gamma'
    wrapper.vm.addNew({ type: 'blur' })

    expect(wrapper.emitted().input[0][0]).toEqual(['alpha', 'beta', 'gamma'])
  })

  it('can transform numeric input into a number array', () => {
    const wrapper = mountComponent({
      transformTag: tag => Number(tag),
      validateTag: tag => /^\d+$/.test(tag)
    })

    wrapper.vm.newTag = '1,2,3'
    wrapper.vm.addNew({ type: 'keydown', keyCode: 13, stopPropagation: jest.fn(), preventDefault: jest.fn() })

    expect(wrapper.emitted().input[0][0]).toEqual([1, 2, 3])
  })

  it('emits invalid and skips tags rejected by validateTag', () => {
    const wrapper = mountComponent({ validateTag: tag => /^\d+$/.test(tag) })

    wrapper.vm.newTag = '1,two,3'
    wrapper.vm.addNew({ type: 'blur' })

    expect(wrapper.emitted().input[0][0]).toEqual(['1', '3'])
    expect(wrapper.emitted().invalid[0][0]).toBe('two')
  })

  it('does not remove from an empty tag list on Backspace', () => {
    const wrapper = mountComponent()

    wrapper.vm.removeLastTag()

    expect(wrapper.emitted().input).toBeUndefined()
  })

  it('does not add tags while IME composition is active', () => {
    const wrapper = mountComponent()

    wrapper.vm.newTag = '拼'
    wrapper.vm.isComposing = true
    wrapper.vm.addNew({ type: 'keydown', keyCode: 13, stopPropagation: jest.fn(), preventDefault: jest.fn() })

    expect(wrapper.emitted().input).toBeUndefined()
  })
})
