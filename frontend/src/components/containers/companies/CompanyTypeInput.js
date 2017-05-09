import React, { Component } from 'react';
import { connect } from "react-redux";
import { Field } from 'redux-form';

import { HubSelect } from "./../hubs";

export class CompanyTypeInput extends Component {

  onChangeHub(hub) {
    this.props.onChangeHub(hub);
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
                <HubSelect onChange={ this.onChangeHub.bind(this) }/>
              </div>
            }
          </div>
        }
      </div>
    )
  }
}

CompanyTypeInput.propTypes = {
  onChange: React.PropTypes.func,
  onChangeHub: React.PropTypes.func,
  order: React.PropTypes.object.isRequired,
}

function mapStateToProps(state) {
  return {
    order: state.form.order || {},
  }
}

export default connect(mapStateToProps, { })(CompanyTypeInput);


