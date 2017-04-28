import React from 'react';
import ReactDOM from 'react-dom';
import { shallow } from 'enzyme';
import SubscribeFormErrors from './SubscribeFormErrors';

const isRendered = (wrapper) => (expect(wrapper.find('div').length).toBeGreaterThan(0));

it('renders without crashing', () => {
  let wrapper = shallow( <SubscribeFormErrors /> );
  isRendered(wrapper);
});
