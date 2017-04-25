import React from 'react';
import ReactDOM from 'react-dom';
import { shallow } from 'enzyme';
import SubscriptionTypeInput from './SubscriptionTypeInput';

const default_props = {
}

const isRendered = (wrapper) => (expect(wrapper.find('div').length).toBeGreaterThan(0));

it('renders without crashing', () => {
  let wrapper = shallow( <SubscriptionTypeInput { ...default_props }/> );
  isRendered(wrapper);
});

