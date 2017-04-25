import React from 'react';
import ReactDOM from 'react-dom';
import { shallow } from 'enzyme';
import OrderFormTable from './OrderFormTable';

const default_props = {
  price: 0.5,
  nb_products: 20,
  shipping_price: 3.5,
  total: 13.5
}

const isRendered = (wrapper) => (expect(wrapper.find('div').length).toBeGreaterThan(0));

it('renders without crashing', () => {
  let wrapper = shallow( <OrderFormTable { ...default_props }/> );
  isRendered(wrapper);
});

