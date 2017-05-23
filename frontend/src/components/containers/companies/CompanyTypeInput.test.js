import React from 'react';
import ReactDOM from 'react-dom';
import { shallow } from 'enzyme';
import sinon from 'sinon';

import { CompanyTypeInput } from './CompanyTypeInput'

const defaultProps = {
  order: {},
  fetchHubs: sinon.spy(),
  onChangeHub: sinon.spy(),
  onChange: sinon.spy(),
}

const isRendered = (wrapper) => (expect(wrapper.find('.company-type-input').length).toBe(1))

it('renders without crashing', () => {
  let wrapper = shallow( <CompanyTypeInput { ...defaultProps } /> );
  isRendered(wrapper);
});

it('should hide ba checkbox and select', () => {
  let wrapper = shallow( <CompanyTypeInput { ...defaultProps } /> );
  isRendered(wrapper);
  expect(wrapper.find('Field[name="has_hub"]').length).toBe(0);
  expect(wrapper.find('label[htmlFor="hub"]').length).toBe(0);
});

it('should show ba checkbox', () => {
  let props = defaultProps;
  props.order.values = {
    is_ccas: true,
    is_ngo: false,
  }
  let wrapper = shallow( <CompanyTypeInput { ...props } /> );
  isRendered(wrapper);
  expect(wrapper.find('Field[name="has_hub"]').length).toBe(1);
  expect(wrapper.find('label[htmlFor="hub"]').length).toBe(0);
});

it('should show ba checkbox and select', () => {
  let props = defaultProps;
  props.order.values = {
    is_ccas: true,
    is_ngo: false,
    has_hub: true,
  }
  let wrapper = shallow( <CompanyTypeInput { ...props } /> );
  isRendered(wrapper);
  expect(wrapper.find('Field[name="has_hub"]').length).toBe(1);
  expect(wrapper.find('label[htmlFor="hub"]').length).toBe(1);
});

it('should not show ba checkbox and select when ba_select is false', () => {
  let props = defaultProps;
  props.order.values = {
    is_ccas: true,
    is_ngo: false,
  }
  props.ba_select = false;
  let wrapper = shallow( <CompanyTypeInput { ...props } /> );
  isRendered(wrapper);
  expect(wrapper.find('Field[name="has_hub"]').length).toBe(0);
  expect(wrapper.find('label[htmlFor="hub"]').length).toBe(0);
});
