import React from 'react'
import { mount } from 'enzyme'
import sinon from 'sinon'
import { Provider } from 'react-redux'

import SubscribeForm from './SubscribeForm'

import { store } from './../../../store'

const defaultProps = {
  subscription: {},
  store: {
    subscribe: sinon.spy(),
    getState: sinon.spy(),
    dispatch: sinon.spy(),
  },
}

const isRendered = (wrapper) => (expect(wrapper.find('div').length).toBeGreaterThan(0))

it('renders without crashing', () => {
  const wrapper = mount(<Provider store={store}><SubscribeForm {...defaultProps} /></Provider>)
  isRendered(wrapper)
})
