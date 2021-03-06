import React from 'react';
import ReactDOM from 'react-dom';
import { shallow } from 'enzyme';
import sinon from 'sinon';

import { HubSelect } from './HubSelect';


const defaultProps = {
  hubs: [
    { "BA": "BA01", "NOM 1": "BANQUE ALIMENTAIRE", "NOM 2": "DE L'AIN", "Contact Magazine Debout": "Martine ROBIN et Monique DEBOST CINELLI", "Président": "Gilles BOLLARD", "ADRESSE 1": "", "ADRESSE 2": "1 rue Suzanne Valadon", "CP": "01000", "VILLE": "BOURG-EN-BRESSE", "TELEPHONE": "04 74 32 24 74", "MAIL": "BA010@banquealimentaire.org", "OUVERTURE": "du lundi au vendredi, le matin", "line": 2 },
    { "BA": "BA02", "NOM 1": "BANQUE ALIMENTAIRE", "NOM 2": "DE L'AISNE", "Contact Magazine Debout": "Patrick BIDARD, Daniel DUVAL, Philippe Tanière", "Président": "François CHEMERY", "ADRESSE 1": "", "ADRESSE 2": "28 CHEMIN DE LEHAUCOURT", "CP": "02100", "VILLE": "SAINT-QUENTIN", "TELEPHONE": "03 23 64 36 82", "MAIL": "BA020@banquealimentaire.org", "OUVERTURE": "du lundi au vendredi, le matin", "line": 3 },
    { "BA": "BA04", "NOM 1": "BANQUE ALIMENTAIRE", "NOM 2": "DES ALPES-DU-SUD", "Contact Magazine Debout": "Edith Pannellier", "Président": "Patrice AUTIER", "ADRESSE 1": "ZONE ARTISANALE LES BOUILLOUETTES", "ADRESSE 2": "124 RUE MARIE CURIE", "CP": "04700", "VILLE": "ORAISON", "TELEPHONE": "09 77 35 47 74", "MAIL": "BA040@banquealimentaire.org", "OUVERTURE": "du lundi au vendredi, le matin", "line": 4 },
    { "BA": "BA06", "NOM 1": "BANQUE ALIMENTAIRE", "NOM 2": "DES ALPES-MARITIMES", "Contact Magazine Debout": "Jean Pierre CARON", "Président": "François MULLER", "ADRESSE 1": "2 CHEMIN DES ECOLES", "ADRESSE 2": "LINGOSTIERE", "CP": "06200", "VILLE": "NICE", "TELEPHONE": "04 92 10 05 31", "MAIL": "BA060@banquealimentaire.org", "OUVERTURE": "du lundi au vendredi, le matin", "line": 5 },
    { "BA": "BA08", "NOM 1": "BANQUE ALIMENTAIRE", "NOM 2": "DES ARDENNES", "Contact Magazine Debout": "André Bouchet", "Président": "", "ADRESSE 1": "", "ADRESSE 2": "8 rue André-Marie Ampère", "CP": "08000", "VILLE": "CHARLEVILLE-MEZIERES", "TELEPHONE": "03 24 56 22 21", "MAIL": "BA080@banquealimentaire.org", "OUVERTURE": "du lundi au vendredi, le matin", "line": 6 }
  ],
  fetchHubs: sinon.spy(),
}

const isRendered = (wrapper) => (expect(wrapper.find('Field[name="hub"]').length).toBe(1));
const hubKey = (idx) => ( `${defaultProps['hubs'][idx]['NOM 1']} ${defaultProps['hubs'][idx]['NOM 2']}` );

it('renders without crashing', () => {
  let wrapper = shallow( <HubSelect { ...defaultProps } /> );
  isRendered(wrapper);
});

it ('should select BA', () => {
  let props = defaultProps;
  props.onChange = sinon.spy();
  let wrapper = shallow( <HubSelect { ...props } /> );
  isRendered(wrapper);

  let fieldHub = wrapper.find('Field[name="hub"]').first();

  const choice = 1;
  const value = hubKey(choice);
  fieldHub.value = value; // simulate doesn't set value
  fieldHub.simulate('change', fieldHub, value);
  expect(props.onChange.lastCall.args[0].BA).toBe(defaultProps.hubs[choice].BA);
});
