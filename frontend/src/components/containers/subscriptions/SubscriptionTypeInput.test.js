import React from 'react'
import { shallow } from 'enzyme'
import sinon from 'sinon'

import { SubscriptionTypeInput } from './SubscriptionTypeInput'

const defaultProps = {
  simple_subscription_price: 10,
  mag_price: 2,
  solidarity_price: 20,
}

const isRendered = (wrapper) => (expect(wrapper.find('.subscription-type-input').length).toBeGreaterThan(0))

it('renders without crashing', () => {
  const wrapper = shallow(<SubscriptionTypeInput { ...defaultProps }/>)
  isRendered(wrapper)
});

