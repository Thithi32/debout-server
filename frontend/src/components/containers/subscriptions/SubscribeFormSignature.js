import React from 'react';
import { Field } from 'redux-form';

import './SubscribeFormSignature.css';

const toMoney = (num) => (`${num.toFixed(2).replace('.', ',')}€`);

const SubscribeFormSignature = (props) => (
  <div className="subscription-signature">
    <p>
      <Field name="subscription_signed" component="input" type="checkbox" />
      &nbsp;&nbsp;<strong>Votre abonnement sera effectif dès réception de votre paiement de {toMoney(props.total)}, que vous pourrez faire: en ligne avec une CB, ou par virement, ou par chèque, comme indiqué dans l&apos;email de confirmation que vous allez recevoir</strong>
    </p>
  </div>
);

SubscribeFormSignature.propTypes = {
  total: React.PropTypes.number.isRequired,
};

export default SubscribeFormSignature;
