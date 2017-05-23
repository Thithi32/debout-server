import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Field, reduxForm } from 'redux-form'
import { FormOnlyHeader, FormOnlyContent } from './../../layout'
import { FormContact, FormAddress, FormGroupInput } from './../../widgets'
import { createSubscription } from './../../../actions'
import SubscribeFormErrors from './SubscribeFormErrors'
import SubscriptionTypeInput from './SubscriptionTypeInput'
import SubscribeFormSignature from './SubscribeFormSignature'
import SubscribeFormTerms from './SubscribeFormTerms'
import validate from './SubscribeForm.validate'

import './SubscribeForm.css'

const upper = value => value && value.toUpperCase()

export class SubscribeForm extends Component { // eslint-disable-line
  render() {
    const values = this.props.subscription.values || {};
    const [magPrice, simpleSubscriptionPrice] = [2, 10]
    const total = (values.type === 'simple') ? simpleSubscriptionPrice : (parseInt(values.solidarity_price,10) || 0)

    return (
      <div className="widget subscription-form">

        <FormOnlyHeader>
          <h2>Abonnez-vous solidaire!</h2>
          <p>
            En vous abonnant à <a href="http://www.debout.fr">debout</a>, vous pouvez offrir des magazines à ceux qui en ont besoin pour se (re)mettre debout.<br />
            A partir de 40 €, vous bénéficiez d&#39;une réduction de votre impôt sur le revenu.
          </p>
          <p><small><a href="/subscribe#term_1" className="pull-right">Voir les conditions</a></small></p>
        </FormOnlyHeader>

        <FormOnlyContent>

          <form
            autoComplete="off"
            onSubmit={this.props.handleSubmit(this.props.createSubscription)}
            className="form-horizontal"
          >

            <div className="gray-row row">
              <SubscriptionTypeInput mag_price={magPrice} simple_subscription_price={simpleSubscriptionPrice} />
            </div>

            <div className="panel panel-default">
              <div className="panel-heading">
                <h3 className="panel-title title">MERCI DE FAIRE PARVENIR MON ABONNEMENT PERSONNEL À</h3>
              </div>
              <div className="panel-body">
                <FormContact needPhone />
                <Field
                  className="form-control"
                  component={FormGroupInput}
                  label="Raison sociale"
                  name="company_name"
                  normalize={upper}
                  type="text"
                />
                <FormAddress title="Adresse de livraison" />
              </div>
            </div>

            <SubscribeFormSignature total={total} />

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
              <button disabled={!this.props.valid} type="submit">
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

/** ** FOR TESTS ***
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
  solidarity_price: '40',
}

SubscribeForm = reduxForm({
  form: 'subscription',
//  initialValues: simpleValues,
//  initialValues: solidarityValues,
  initialValues,
  validate,
}, null, { createSubscription })(SubscribeForm)

SubscribeForm.propTypes = {
  createSubscription: React.PropTypes.func.isRequired,
}

function mapStateToProps(state) {
  return {
    subscription: (state && state.form && state.form.subscription) || { value: {}},
  }
}

export default connect(mapStateToProps, { createSubscription })(SubscribeForm)
