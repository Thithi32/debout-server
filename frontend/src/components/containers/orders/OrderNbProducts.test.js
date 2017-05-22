import React from 'react';
import ReactDOM from 'react-dom';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import OrderNbProducts from './OrderNbProducts';

const default_props = {
  onChangeShippingPrice: sinon.spy(),
  price: 13.5
}

const isRendered = (wrapper) => (expect(wrapper.find('div').length).toBeGreaterThan(0));

it('renders without crashing', () => {
  let wrapper = shallow( <OrderNbProducts { ...default_props }/> );
  isRendered(wrapper);
});

