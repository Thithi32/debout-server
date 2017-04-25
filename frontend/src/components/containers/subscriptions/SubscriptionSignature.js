import React, { Component } from 'react';
import { Field } from 'redux-form';

const toMoney = (num) => ( num.toFixed(2).replace('.',',') + "€" );

class SubscriptionSignature extends Component {
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

SubscriptionSignature.propTypes = {
  total: React.PropTypes.number.isRequired,
}

export default SubscriptionSignature;
