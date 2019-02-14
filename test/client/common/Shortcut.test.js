import {withMockedImports} from '../TestUtils'
import {describe, it} from 'mocha'
import {expect} from 'chai'
import React from 'react'
import {mount} from 'enzyme'
import {mocks} from '../Mocking'

describe('<Shortcut/>', function () {

  const DEFAULT_PROPS = {
    hotkeys: []
  }

  const bind = mocks.spy()
  const unbind = mocks.spy()

  const {Shortcut} = withMockedImports('client/common/Shortcut', {
    'mousetrap': {bind, unbind}
  })

  it('should bind the hot keys on mount', function () {
    const hotkeys = ['a']
    const props = {...DEFAULT_PROPS, hotkeys}

    mount(<Shortcut {...props} />)

    expect(bind).to.have.been.calledWith(hotkeys)
  })

  it('should unbind the hot keys on unmount', function () {
    const hotkeys = ['a']
    const props = {...DEFAULT_PROPS, hotkeys}

    const wrapper = mount(<Shortcut {...props} />)
    wrapper.unmount()

    expect(unbind).to.have.been.calledWith(hotkeys)
  })

  it('should unbind old hot keys and bind new ones if they are different', function () {
    const originalHotkeys = ['a']
    const newHotkeys = ['b']
    const props = {...DEFAULT_PROPS, hotkeys: originalHotkeys}

    const wrapper = mount(<Shortcut {...props} />)
    wrapper.setProps({hotkeys: newHotkeys})

    expect(unbind).to.have.been.calledWith(originalHotkeys)
    expect(bind).to.have.been.calledWith(newHotkeys)
  })

  it('should not do anything if the hot key has not changed', function () {
    const hotkeys = ['a']
    const props = {...DEFAULT_PROPS, hotkeys}

    const wrapper = mount(<Shortcut {...props} />)
    wrapper.setProps({hotkeys})

    expect(unbind).to.not.have.been.called()
    expect(bind).to.not.have.been.calledTwice() // it gets called once on mount
  })

  describe('accessibility', function () {

    // we only add the span to get a ref
    it('should hide the empty span', function () {
      const hotkeys = ['a']
      const props = {...DEFAULT_PROPS, hotkeys}

      const wrapper = mount(<Shortcut {...props} />)

      expect(wrapper.find('span')).to.have.prop('aria-hidden', true)
    })
  })
})
