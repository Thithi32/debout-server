import React from 'react';
import ReactDOM from 'react-dom';
import { mount } from 'enzyme';
import sinon from 'sinon';
import { Provider } from 'react-redux';

import OrderForm from './OrderForm';

import { store } from './../../../store';

const default_props = {
  createOrder: sinon.spy(),
  order: {},
  store: {
    subscribe: sinon.spy(),
    getState: sinon.spy(),
    dispatch: sinon.spy(),
  },
}

const isRendered = (wrapper) => (expect(wrapper.find('div').length).toBeGreaterThan(0));

it('renders without crashing', () => {
  let wrapper = mount( <Provider store={store}><OrderForm { ...default_props }/></Provider> );
  isRendered(wrapper);
});

