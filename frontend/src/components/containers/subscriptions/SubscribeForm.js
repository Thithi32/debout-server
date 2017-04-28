import React, { Component } from 'react';
import { connect } from "react-redux";
import { reduxForm } from 'redux-form';
import { FormOnlyHeader, FormOnlyContent } from "./../../layout";
import { FormContact, FormAddress } from "./../../widgets";
import { createSubscription } from "./../../../actions";
import SubscribeFormErrors from "./SubscribeFormErrors";
import SubscriptionTypeInput from "./SubscriptionTypeInput";
import SubscribeFormSignature from "./SubscribeFormSignature";
import SubscribeFormTerms from "./SubscribeFormTerms";
import validate from './SubscribeForm.validate'

import "./SubscribeForm.css";

export class SubscribeForm extends Component {
  render() {
    return (
      <div className="widget subscription-form">

        <FormOnlyHeader>
          <h2>Abonnez-vous solidaire!</h2>
          <p>
            En vous abonnant à debout, vous pouvez offrir des magazines à ceux qui en ont besoin pour se (re)mettre debout.<br />
            A partir de 40 €, vous bénéficiez d&#39;une réduction de votre impôt sur le revenu.
          </p>
        </FormOnlyHeader>

        <FormOnlyContent>

          <form onSubmit={ this.props.handleSubmit(this.props.createSubscription) } autoComplete="off">

            <div className="gray-row row">
              <SubscriptionTypeInput />
            </div>

            <div className="panel panel-default">
              <div className="panel-heading">
                <h3 className="panel-title title">MERCI DE FAIRE PARVENIR MON ABONNEMENT PERSONNEL À</h3>
              </div>
              <div className="panel-body">
                <FormContact needPhone />
                <br/>
                <br/>
                <FormAddress title="Adresse de livraison" />
              </div>
            </div>

            <SubscribeFormSignature total={50}/>

            <div>
              <p>
                <small>
                * : information obligatoire
                </small><br />
                <small>
                &sup1; : veuillez renseigner au moins un numéro de téléphone
                </small>
              </p>
            </div>

            { !this.props.valid &&
              <div className="gray-row">
                <div className="panel panel-default">
                  <div className="panel-heading">
                    <h3 className="panel-title title">Il manque des informations pour valider votre abonnement</h3>
                  </div>
                  <div className="panel-body">
                    <SubscribeFormErrors />
                  </div>
                </div>
              </div>
            }

            <div className="form-group">
              <button type="submit" disabled={!this.props.valid}>
                S&#39;abonner
              </button>
            </div>

          </form>

          <SubscribeFormTerms />

        </FormOnlyContent>

      </div>
    )
  }
}

/**** FOR TESTS ****/
const simpleValues = {
  type: 'simple',
  contact: {
    name: 'DELBART',
    firstname: 'Thierry',
    email: 'delbart@mailinator.com',
    mobile: '06 12 34 56 78',
    phone: '01 12 34 56 78',
  },
  address: {
    address1: '12 rue de la paix',
    address2: 'Forum de Innovation',
    zip: '12000',
    city: 'MONTPELLIER'
  },
  subscription_signed: true
}

const solidarityValues = {
  type: 'solidaire',
  solidarity_price: "20",
  solidarity_nb: "5",
  contact: {
    name: 'DELBART',
    firstname: 'Thierry',
    email: 'delbart@mailinator.com',
    mobile: '06 12 34 56 78',
    phone: '01 12 34 56 78',
  },
  address: {
    address1: '12 rue de la paix',
    address2: 'Forum de Innovation',
    zip: '12000',
    city: 'MONTPELLIER'
  },
  subscription_signed: true
}
/******/

const initialValues = {
  type: 'solidaire',
  solidarity_price: "20",
  solidarity_nb: "5",
}

SubscribeForm = reduxForm({
  form: 'subscription',
//  initialValues: simpleValues,
  initialValues: solidarityValues,
//  initialValues,
  validate,
}, null, { createSubscription })(SubscribeForm);

SubscribeForm.propTypes = {
  createSubscription: React.PropTypes.func.isRequired,
}

function mapStateToProps(state) {
  return {
    subscription: (state && state.form && state.form.subscription) || {},
  }
}

export default connect(mapStateToProps, { createSubscription })(SubscribeForm);
