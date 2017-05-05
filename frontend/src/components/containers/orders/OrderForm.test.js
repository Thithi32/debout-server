import React from 'react'
import { mount } from 'enzyme'
import sinon from 'sinon'
import { Provider } from 'react-redux'

import OrderForm from './OrderForm'

import { store } from './../../../store'

const defaultProps = {
  createOrder: sinon.spy(),
  order: {},
  store: {
    subscribe: sinon.spy(),
    getState: sinon.spy(),
    dispatch: sinon.spy(),
  },
}

const isRendered = (wrapper) => (expect(wrapper.find('div').length).toBeGreaterThan(0))

it('renders without crashing', () => {
  const wrapper = mount(<Provider store={store}><OrderForm {...defaultProps} /></Provider>)
  isRendered(wrapper)
})

