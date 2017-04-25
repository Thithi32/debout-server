import React from 'react';
import ReactDOM from 'react-dom';
import { shallow } from 'enzyme';
import SubscriptionSignature from './SubscriptionSignature';

const default_props = {
  total: 15,
}

const isRendered = (wrapper) => (expect(wrapper.find('div').length).toBeGreaterThan(0));

it('renders without crashing', () => {
  let wrapper = shallow( <SubscriptionSignature { ...default_props }/> );
  isRendered(wrapper);
});

