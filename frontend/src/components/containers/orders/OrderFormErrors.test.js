import React from 'react';
import ReactDOM from 'react-dom';
import { shallow } from 'enzyme';
import OrderFormErrors from './OrderFormErrors';

const isRendered = (wrapper) => (expect(wrapper.find('div').length).toBeGreaterThan(0));

it('renders without crashing', () => {
  let wrapper = shallow( <OrderFormErrors /> );
  isRendered(wrapper);
});
