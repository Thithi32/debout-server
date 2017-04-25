import React, { Component } from 'react';
import { connect } from "react-redux";
import { reduxForm } from 'redux-form';
import { FormOnlyHeader, FormOnlyContent } from "./../../layout";
import { FormSectionPanel, FormContact, FormAddress } from "./../../widgets";
import SubscriptionTypeInput from "./SubscriptionTypeInput";
import SubscriptionSignature from "./SubscriptionSignature";
import SubscriptionTerms from "./SubscriptionTerms";

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

          <form autoComplete="off">

            <div className="gray-row row">
              <SubscriptionTypeInput />
            </div>

            <FormSectionPanel name="subscriber" title="MERCI DE FAIRE PARVENIR MON ABONNEMENT PERSONNEL À">

              <FormContact needPhone />
              <br/>
              <FormAddress title="Adresse de livraison" />

            </FormSectionPanel>

            <SubscriptionSignature total={50}/>

            <div className="form-group">
              <button type="submit" disabled={!this.props.valid}>
                Commander
              </button>
            </div>

          </form>

          <SubscriptionTerms />

        </FormOnlyContent>

      </div>
    )
  }
}

SubscribeForm = reduxForm({
  form: 'subscription',
}, null, null)(SubscribeForm);

function mapStateToProps(state) {
  return {
    subscription: (state && state.form && state.form.subscription) || {},
  }
}

export default connect(mapStateToProps, { })(SubscribeForm);
