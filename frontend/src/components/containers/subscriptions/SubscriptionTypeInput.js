import React, { Component } from 'react';
import { Field } from 'redux-form';

import "./SubscriptionTypeInput.css";

class SubscriptionTypeInput extends Component {

  constructor () {
    super();
    this.state = {};
  }  

  onChangeSubscriptionType(elt,value,old_value) {
    this.setState({'subscription_type': value});
  }

  render() {
    const disabled = ( this.state.subscription_type !== "solidaire") ? { "disabled": "disabled" } : {};
    return (
      <div className="subscription-type-input">
        <img src="img/subscription.png" alt="Subscription" className="subscription-image hidden-xs" />
        <div className="col-sm-5">
          <label>
            <Field component="input" type="radio" name="type" value="simple" onChange={this.onChangeSubscriptionType.bind(this)}/>
            ABONNEMENT SIMPLE
          </label>
          <p>
           Je m&#39;abonne pour 1 an au prix de 10€
          </p>
        </div>
        <img src="img/subscription.png" alt="Subscription" className="subscription-image visible-xs-block" />
        <div className="col-sm-7">
          <label>
            <Field component="input" type="radio" name="type" value="solidaire" onChange={this.onChangeSubscriptionType.bind(this)}/>
            ABONNEMENT SOLIDAIRE
          </label>
          <div { ...disabled }>
            <p>
              Je m&#39;abonne pour un montant total de <Field component="input" type="text" name="solidarity_price" { ...disabled }/>€ 
              et j&#39;offre <Field component="input" type="text" name="solidarity_nb" { ...disabled } /> magazines debout.
            </p>
            <div className="donation_recept">
              <label>
                <Field component="input" type="checkbox" name="donation_recept" value="simple"/>
                Je souhaite recevoir un reçu fiscal à joindre à ma prochaine déclaration de revenus
                (uniquement si le montant de mon abonnement solidaire est supérieur à 40 €)
              </label>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

SubscriptionTypeInput.propTypes = {
}

export default SubscriptionTypeInput;

