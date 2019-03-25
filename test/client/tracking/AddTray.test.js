import React from 'react'
import {shallow} from 'enzyme'
import {AddTray} from '../../../src/client/tracking/AddTray'
import _ from 'lodash'
import {change, locator} from '../testHelpers'

describe('<AddTray/>', () => {

  const DEFAULT_PROPS = {
    addTray: _.noop
  }

  test('should update the url', () => {
    const props = {...DEFAULT_PROPS}
    const wrapper = shallow(<AddTray {...props} />)
    change(wrapper.find(locator('add-tray-url')), 'some-new-url')
    expect(wrapper.state('url')).toEqual('some-new-url')
  })

  test('should update the username', () => {
    const props = {...DEFAULT_PROPS}
    const wrapper = shallow(<AddTray {...props} />)
    change(wrapper.find(locator('add-tray-username')), 'some-new-username')
    expect(wrapper.state('username')).toEqual('some-new-username')
  })

  test('should update the password', () => {
    const props = {...DEFAULT_PROPS}
    const wrapper = shallow(<AddTray {...props} />)
    change(wrapper.find(locator('add-tray-password')), 'some-new-password')
    expect(wrapper.state('password')).toEqual('some-new-password')
  })

  describe('add tray', () => {

    test('should pass the entered details', () => {
      const addTray = jest.fn()
      const props = {...DEFAULT_PROPS, addTray}

      const wrapper = shallow(<AddTray {...props} />)
      change(wrapper.find(locator('add-tray-url')), 'some-new-url')
      change(wrapper.find(locator('add-tray-username')), 'some-new-username')
      change(wrapper.find(locator('add-tray-password')), 'some-new-password')
      wrapper.find(locator('add-tray')).simulate('click')

      expect(addTray).toBeCalledWith('some-new-url', 'some-new-username', 'some-new-password')
    })

    test('should clear the entered url', () => {
      const props = {...DEFAULT_PROPS}

      const wrapper = shallow(<AddTray {...props} />)
      change(wrapper.find(locator('add-tray-url')), 'some-new-url')
      wrapper.find(locator('add-tray')).simulate('click')

      expect(wrapper.state('url')).toEqual('')
    })

    test('should clear the entered username', () => {
      const props = {...DEFAULT_PROPS}

      const wrapper = shallow(<AddTray {...props} />)
      change(wrapper.find(locator('add-tray-username')), 'some-new-username')
      wrapper.find(locator('add-tray')).simulate('click')

      expect(wrapper.state('username')).toEqual('')
    })

    test('should clear the entered password', () => {
      const props = {...DEFAULT_PROPS}

      const wrapper = shallow(<AddTray {...props} />)
      change(wrapper.find(locator('add-tray-password')), 'some-new-password')
      wrapper.find(locator('add-tray')).simulate('click')

      expect(wrapper.state('password')).toEqual('')
    })
  })
})
