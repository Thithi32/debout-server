import React from 'react';
import ReactDOM from 'react-dom';
import { shallow } from 'enzyme';

import OrderShippingOptions from './OrderShippingOptions';

const default_props = {
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

it('renders without crashing', () => {
  let wrapper = shallow( <OrderShippingOptions { ...default_props } /> );
  isRendered(wrapper);
});

it('should show ba shipping', () => {
  let wrapper = shallow( <OrderShippingOptions { ...default_props } /> );
  let label = (secondOptionLabel(wrapper));
  expect(label).toContain('Banque Alimentaire');
  expect(label).toContain(default_props.hub.name);
  expect(label).toContain(default_props.hub.address_inline);
  expect(label).toContain(default_props.hub.OUVERTURE);
});

it('should show ba shipping', () => {
  let props = default_props;
  props.hub = { name: "BEEOTOP" };
  let wrapper = shallow( <OrderShippingOptions { ...props } /> );
  let label = (secondOptionLabel(wrapper));
  expect(label).toContain('BEEOTOP de Paris');
});
