import React from 'react'
import { shallow } from 'enzyme'
import SubscribeFormErrors from './SubscribeFormErrors'

const isRendered = (wrapper) => (expect(wrapper.find('div').length).toBeGreaterThan(0))

it('renders without crashing', () => {
  const wrapper = shallow(<SubscribeFormErrors />)
  isRendered(wrapper)
})
