import React from 'react';
import ReactDOM from 'react-dom';
import { shallow } from 'enzyme';

import OrderShippingOptions from './OrderShippingOptions';

const defaultProps = {
  hub: {
    "BA": "BA11",
    "NOM 1": "BANQUE ALIMENTAIRE",
    "NOM 2": "DE L'AUDE",
    "Contact Magazine Debout": "François LASNIER Christiane PUJOL",
    "Président": "Jacques PÉRIN",
    "ADRESSE 1": "75 rue Édouard Branly (ex. Établissement PILPA)",
    "ADRESSE 2": "Z.I. la Bouriette",
    "CP": "11000",
    "VILLE": "CARCASSONNE",
    "TELEPHONE": "09 71 48 91 99",
    "MAIL": "BA110@banquealimentaire.org",
    "OUVERTURE": "du lundi au vendredi, le matin",
    "line": 8,
    "name": "BANQUE ALIMENTAIRE DE L'AUDE",
    "address_inline": "75 rue Édouard Branly (ex. Établissement PILPA) 11000 CARCASSONNE"
  },
  shipping_price: 34,
}

const isRendered = (wrapper) => (expect(wrapper.find('.radio').length).toBe(2));
const secondOptionLabel = (wrapper) => (wrapper.find('.radio').at(1).find('span').text());
const firstOptionLabel = (wrapper) => (wrapper.find('.radio').at(0).find('span').text());

it('renders without crashing', () => {
  let wrapper = shallow( <OrderShippingOptions { ...defaultProps } /> );
  isRendered(wrapper);
});

it('should show shipping price', () => {
  let wrapper = shallow( <OrderShippingOptions { ...defaultProps } /> );
  let label = firstOptionLabel(wrapper);
  expect(label).toContain(defaultProps.shipping_price);
});

it('should show ba shipping', () => {
  let wrapper = shallow( <OrderShippingOptions { ...defaultProps } /> );
  let label = secondOptionLabel(wrapper);
  expect(label).toContain('Banque Alimentaire');
  expect(label).toContain(defaultProps.hub.name);
  expect(label).toContain(defaultProps.hub.address_inline);
  expect(label).toContain(defaultProps.hub.OUVERTURE);
});

it('should show Beeotop shipping', () => {
  let props = defaultProps;
  props.hub = { name: "BEEOTOP" };
  let wrapper = shallow( <OrderShippingOptions { ...props } /> );
  let label = (secondOptionLabel(wrapper));
  expect(label).toContain('BEEOTOP de Paris');
});
