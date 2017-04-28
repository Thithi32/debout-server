import React, { Component } from 'react';
import { Field } from 'redux-form';

import "./SubscribeFormSignature.css";

const toMoney = (num) => ( num.toFixed(2).replace('.',',') + "€" );

class SubscribeFormSignature extends Component {
  render() {
    return (
      <div className="subscription-signature">
        <Field name="subscription_signed" component="input" type="checkbox" /> 

        <small>
          &nbsp;&nbsp;<strong>Ce bon d&#39;abonnement vaut commande définitive.</strong>
          &nbsp;Je m’engage à régler la totalité de ma commande ({toMoney(this.props.total)}) à réception de la facture.
          <br />
        </small>
      </div>
    )
  }
}

SubscribeFormSignature.propTypes = {
  total: React.PropTypes.number.isRequired,
}

export default SubscribeFormSignature;
