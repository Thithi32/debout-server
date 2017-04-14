import React from 'react';
import ReactDOM from 'react-dom';
import { shallow } from 'enzyme';
import sinon from 'sinon';

import { CompanyAutoComplete } from './CompanyAutoComplete';

const default_props = {
  companies: [
    { "Raison sociale": "AAJT", "N°9": "0", "N°10": "0", "N°11": "0", "Type": "Association", "Asso d'une BA ?": "non", "Livraison via hub": "BANQUE ALIMENTAIRE BOUCHES-DU-RHONE", "Facturation magazine": "0", "Facturation transport": "non", "(livraison)\nCivilité": "Mme", "(livraison)\nNom": "Safarti", "(livraison)\nPrénom": "Aurelie", "(livraison)\nMail": "aurelie.sarfati@hotmail.fr", "(livraison)\nportable": "", "(livraison)\nfixe ": "04 91 07 80 00", "(livraison)\nAdresse 1": "3 rue Palestro", "(livraison)\nAdresse 2": "", "(livraison)\nCP": "13003", "(livraison)\nVille": "Marseille", "(facture)\nCivilité": "Mme", "(facture)\nNom": "Safarti", "re": "Aurelie", "(facture)\nMail": "aurelie.sarfati@hotmail.fr", "(facture)\nportable": "", "(facture)\nfixe ": "04 91 07 80 00", "(facture)\nRaison Sociale": "AAJT", "(facture)\nAdresse": "3 rue Palestro", "(facture)\nCP": "13003", "(facture)\nVille": "Marseille", "Commentaires": "", "Bon engagement? 1er num": "", "Bon engagement? dernier num": "", "line": 2 },
    { "Raison sociale": "AASEC", "N°9": "50", "N°10": "0", "N°11": "25", "Type": "Association", "Asso d'une BA ?": "non", "Livraison via hub": "non", "Facturation magazine": "0", "Facturation transport": "oui", "(livraison)\nCivilité": "Mme", "(livraison)\nNom": "COMBALUZIER", "(livraison)\nPrénom": "", "(livraison)\nMail": "asec740@orange.fr", "(livraison)\nportable": "", "(livraison)\nfixe ": "04 42 06 46 33", "(livraison)\nAdresse 1": "Centre Social Lucia Tichadou", "(livraison)\nAdresse 2": "Avenue Joseph Millat", "(livraison)\nCP": "13110", "(livraison)\nVille": "PORT BOUC", "(facture)\nCivilité": "Mme", "(facture)\nNom": "COMBALUZIER", "re": "", "(facture)\nMail": "asec740@orange.fr", "(facture)\nportable": "", "(facture)\nfixe ": "04 42 06 46 33", "(facture)\nRaison Sociale": "AASEC", "(facture)\nAdresse": "Centre Social Lucia Tichadou - Avenue Joseph Millat", "(facture)\nCP": "13110", "(facture)\nVille": "PORT BOUC", "Commentaires": "", "Bon engagement? 1er num": "", "Bon engagement? dernier num": "", "line": 3 },
    { "Raison sociale": "Accorderie du Bugey", "N°9": "50", "N°10": "50", "N°11": "50", "Type": "Association", "Asso d'une BA ?": "oui", "Livraison via hub": "BANQUE ALIMENTAIRE DU RHONE", "Facturation magazine": "0", "Facturation transport": "non", "(livraison)\nCivilité": "Mme", "(livraison)\nNom": "MOLLARET", "(livraison)\nPrénom": "Sylvie", "(livraison)\nMail": "sylvie.mollaret@orange.fr", "(livraison)\nportable": "06 22 50 67 43", "(livraison)\nfixe ": "09.52.82.65.64", "(livraison)\nAdresse 1": "1 av Paul Painleve", "(livraison)\nAdresse 2": "", "(livraison)\nCP": "1500", "(livraison)\nVille": "AMBERIEU EN BUGEY", "(facture)\nCivilité": "Mr", "(facture)\nNom": "ADAM", "re": "David", "(facture)\nMail": "bugey@accorderie.fr", "(facture)\nportable": "07.82.33.76.13", "(facture)\nfixe ": "09.52.82.65.64", "(facture)\nRaison Sociale": "Accorderie du Bugey", "(facture)\nAdresse": "1 av Paul Painleve", "(facture)\nCP": "1500", "(facture)\nVille": "AMBERIEU EN BUGEY", "Commentaires": "", "Bon engagement? 1er num": "", "Bon engagement? dernier num": "", "line": 4 },
    { "Raison sociale": "ACPM Accueil RSA", "N°9": "0", "N°10": "0", "N°11": "0", "Type": "Association", "Asso d'une BA ?": "non", "Livraison via hub": "BANQUE ALIMENTAIRE BOUCHES-DU-RHONE", "Facturation magazine": "0", "Facturation transport": "non", "(livraison)\nCivilité": "Mme", "(livraison)\nNom": "LIEUTAUD", "(livraison)\nPrénom": "Céline", "(livraison)\nMail": "celine.lieutaud@acpm.eu", "(livraison)\nportable": "06 78 99 35 77", "(livraison)\nfixe ": "04 95 05 16 51", "(livraison)\nAdresse 1": "10 avenue Alexandre Ansaldi", "(livraison)\nAdresse 2": "", "(livraison)\nCP": "13014", "(livraison)\nVille": "MARSEILLE", "(facture)\nCivilité": "Mme", "(facture)\nNom": "LIEUTAUD", "re": "Céline", "(facture)\nMail": "celine.lieutaud@acpm.eu", "(facture)\nportable": "06 78 99 35 77", "(facture)\nfixe ": "04 95 05 16 51", "(facture)\nRaison Sociale": "ACPM Accueil RSA", "(facture)\nAdresse": "10 avenue Alexandre Ansaldi", "(facture)\nCP": "13014", "(facture)\nVille": "MARSEILLE", "Commentaires": "", "Bon engagement? 1er num": "", "Bon engagement? dernier num": "", "line": 5 },
    { "Raison sociale": "ACSANTE 93", "N°9": "25", "N°10": "25", "N°11": "25", "Type": "Association", "Asso d'une BA ?": "non", "Livraison via hub": "non", "Facturation magazine": "0", "Facturation transport": "oui", "(livraison)\nCivilité": "Mme", "(livraison)\nNom": "BRIEUX", "(livraison)\nPrénom": "Cecile", "(livraison)\nMail": "cecile.brieux@acsante93.com", "(livraison)\nportable": "", "(livraison)\nfixe ": "01 41 50 50 10", "(livraison)\nAdresse 1": "2  rue de Lorraine", "(livraison)\nAdresse 2": "", "(livraison)\nCP": "93000", "(livraison)\nVille": "BOBIGNY", "(facture)\nCivilité": "Mme", "(facture)\nNom": "BRIEUX", "re": "Cecile", "(facture)\nMail": "cecile.brieux@acsante93.com", "(facture)\nportable": "", "(facture)\nfixe ": "01 41 50 50 10", "(facture)\nRaison Sociale": "ACSANTE 93", "(facture)\nAdresse": "2  rue de Lorraine", "(facture)\nCP": "93000", "(facture)\nVille": "BOBIGNY", "Commentaires": "", "Bon engagement? 1er num": "", "Bon engagement? dernier num": "", "line": 6 }
  ],
  fetchCompanies: sinon.spy(),
  onCompanyChange: sinon.spy()
}

it('renders without crashing', () => {
  let wrapper = shallow( <CompanyAutoComplete { ...default_props } /> );
  expect(wrapper.find('.dropdown').length).toBe(1);
});

it('should open dropdown', () => {
  let wrapper = shallow( <CompanyAutoComplete { ...default_props } /> );
  let input = wrapper.instance().changeCompany(null,"AAJT","");
  expect(wrapper.find('.dropdown-menu').length).toBe(1);
});

it('should not open dropdown because input value to short', () => {
  let wrapper = shallow( <CompanyAutoComplete { ...default_props } /> );
  let input = wrapper.instance().changeCompany(null,"AA","");
  expect(wrapper.find('.dropdown-menu').length).toBe(0);
});

it('should open dropdown with 2 results', () => {
  let wrapper = shallow( <CompanyAutoComplete { ...default_props } /> );
  let input = wrapper.instance().changeCompany(null,"acc","");
  expect(wrapper.find('.dropdown-menu > li').length).toBe(2);
});

it('should open dropdown and select first option', () => {
  let props = default_props;
  props.onCompanyChange = sinon.spy();
  let wrapper = shallow( <CompanyAutoComplete { ...props } /> );
  expect(default_props.onCompanyChange.callCount).toBe(0);
  let input = wrapper.instance().changeCompany(null,"acc","");
  expect(wrapper.find('.dropdown-menu > li').length).toBe(2);
  wrapper.find('.dropdown-menu > li').first().find('a').simulate('click');
  expect(props.onCompanyChange.callCount).toBe(1);
});


