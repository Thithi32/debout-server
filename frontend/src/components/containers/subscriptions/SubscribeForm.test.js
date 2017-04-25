import React from 'react';
import ReactDOM from 'react-dom';
import { mount } from 'enzyme';
import sinon from 'sinon';
import { Provider } from 'react-redux';

import SubscribeForm from './SubscribeForm';

import { store } from './../../../store';

const default_props = {
  subscription: {},
  store: {
    subscribe: sinon.spy(),
    getState: sinon.spy(),
    dispatch: sinon.spy(),
  },
}

const isRendered = (wrapper) => (expect(wrapper.find('div').length).toBeGreaterThan(0));

it('renders without crashing', () => {
  let wrapper = mount( <Provider store={store}><SubscribeForm { ...default_props }/></Provider> );
  isRendered(wrapper);
});

