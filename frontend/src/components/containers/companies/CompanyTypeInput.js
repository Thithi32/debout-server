import React, { Component } from 'react';
import { connect } from "react-redux";
import { Field } from 'redux-form';

import { fetchHubs } from "./../../../actions";

export class CompanyTypeInput extends Component {

  constructor () {
    super();
    this.state = {};
  }

  componentDidMount() {
    if (!this.props.hubs.length && !this.state.hubsFetched) {
      this.props.fetchHubs();
      this.setState({ hubsFetched: true});
    }
  }

  getHubOptions() {
    return this.props.hubs.map((hub, idx) => {
      let name = hub['NOM 1'] + " " + hub['NOM 2'];
      return { key: idx, value: name, text: name}; //hub['BA']
    });
  }

  onChangeHub(e,option) {
    let hub;
    if (!option || option === "BEEOTOP") {
      hub = { name: "BEEOTOP" };
    } else {
      hub = this.props.hubs.find((h) => {
        let hub_name = h['NOM 1'] + " " + h['NOM 2'];
        return hub_name.toLowerCase() === option.toLowerCase();
      });

      hub.name = hub['NOM 1'] + " " + hub['NOM 2'];
      hub.address_inline = [hub['ADRESSE 1'],hub['ADRESSE 2'],hub['CP'],hub['VILLE']]
                            .filter(function(n){ return n.trim() !== '' })
                            .join(' ');
    }
    this.props.onChangeHub(hub);
  }

  FieldHub(fieldProps) {
    let { options, ...other } = fieldProps;
    return (
      <Field {...other} component="select">
          <option key={ "BEEOTOP" } value={ "BEEOTOP" }>Choisir votre Banque Alimentaire</option>
        { options.map((option) =>
          <option key={ option.key } value={ option.value }>{ option.text }</option>
        )}
      </Field>
    )
  }

  onChange(e, value, old_value) {
    this.props.onChange(e, value, old_value);
  }

  render() {

    const order = this.props.order;

    const is_ngo_ccas = order.values && (order.values.is_ngo || order.values.is_ccas);
    const has_hub = order.values && order.values.has_hub;


    return (
      <div className="company-type-input">
        <div className="form-group">
          <label>Vous êtes?</label>
          <div className="checkbox">
            <label>
              <Field name="is_ccas" component="input" type="checkbox" onChange={this.onChange.bind(this)}/>
              une mairie ou un CCAS
            </label>
          </div>
        </div>

        <div className="form-group">
          <div className="checkbox">
            <label>
              <Field name="is_ngo" component="input" type="checkbox" onChange={this.onChange.bind(this)}/>
              une association à but non lucratif
            </label>
          </div>
        </div>

        { is_ngo_ccas &&
          <div>
            <div className="form-group">
              <div className="checkbox">
                <label>
                  <Field name="has_hub" component="input" type="checkbox" onChange={this.onChange.bind(this)}/>
                  partenaire d&#39;une Banque Alimentaire (livraison gratuite)
                </label>
              </div>
            </div>

            { has_hub &&
              <div className="form-group">
                <label htmlFor="hub">Quelle est votre Banque Alimentaire?</label>
                <this.FieldHub name="hub" className="form-control" options={ this.getHubOptions() } onChange={ this.onChangeHub.bind(this) }/>
              </div>
            }
          </div>
        }
      </div>
    )
  }
}

CompanyTypeInput.propTypes = {
  hubs: React.PropTypes.array.isRequired,
  onChange: React.PropTypes.func,
  onChangeHub: React.PropTypes.func,
  fetchHubs: React.PropTypes.func.isRequired,
  order: React.PropTypes.object.isRequired,
}

function mapStateToProps(state) {
  return {
    order: state.form.order || {},
    hubs: state.hubs || [],
  }
}

export default connect(mapStateToProps, { fetchHubs })(CompanyTypeInput);


