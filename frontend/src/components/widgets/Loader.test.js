import React from 'react';
import ReactDOM from 'react-dom';
import { shallow } from 'enzyme';

import { Loader }  from './Loader';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Loader />, div);
});


it('should not show layer', () => {
  let wrapper = shallow(<Loader/>)
  expect(wrapper.find('.loader-layer').length).toBe(0);
});

it('should show layer when loading', () => {
  const props = { loading: true };
  let wrapper = shallow(<Loader {...props}/>)
  expect(wrapper.find('.loader-layer').length).toBe(1);
});



