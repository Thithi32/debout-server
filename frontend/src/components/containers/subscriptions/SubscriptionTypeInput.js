import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Field, formValueSelector } from 'redux-form'

import './SubscriptionTypeInput.css'

const toMoney = (num) => ( (num && num.toFixed(2).replace('.',',') + "€") || "" );

class SubscriptionTypeInput extends Component {

  constructor() {
    super()
    this.state = {}
  }

  onChangeSubscriptionType(...args) {
    this.setState({ subscription_type: args[1] })
  }

  onChangeSolidarityPrice(...args) {
    this.setState({ solidarity_price: args[1] })
  }

  render() {
    const solidarityType = this.state.subscription_type !== 'simple'
    const disabled =  !solidarityType ? { disabled: 'disabled' } : {}
    const receptAvailable = solidarityType && this.state.solidarity_price >= this.props.simple_subscription_price * 4;
    const receptDisabled = !receptAvailable ? { disabled: 'disabled' } : {}
    const solidarityNbMag = (this.props.solidarity_price >= this.props.simple_subscription_price + this.props.mag_price) ? Math.floor((this.props.solidarity_price - this.props.simple_subscription_price) / this.props.mag_price) : 0

    return (
      <div className="subscription-type-input">
        <img src="img/subscription.png" alt="Subscription" className="subscription-image hidden-xs" />
        <div className="col-sm-5">
          <label htmlFor="type">
            <Field component="input" type="radio" name="type" value="simple" onChange={this.onChangeSubscriptionType.bind(this)} />
            ABONNEMENT SIMPLE
          </label>
          <p>
           Je m&#39;abonne pour 1 an au prix de 10€
          </p>
        </div>
        <img src="img/subscription.png" alt="Subscription" className="subscription-image visible-xs-block" />
        <div className="col-sm-7">
          <label htmlFor="type">
            <Field component="input" type="radio" name="type" value="solidaire" onChange={this.onChangeSubscriptionType.bind(this)} />
            ABONNEMENT SOLIDAIRE
          </label>
          <div {...disabled}>
            <p>
              Je m&#39;abonne pour un montant total de <Field component="input" type="number" name="solidarity_price" {...disabled} onChange={this.onChangeSolidarityPrice.bind(this)} />€<br />
              et j&#39;offre <strong>{ solidarityNbMag }</strong> magazines debout.
            </p>
            <p>
              Ma dépense réelle après déduction fiscale <a href="/subscribe#term_2">(2)</a>:
              {toMoney((this.props.solidarity_price < this.props.simple_subscription_price * 4) ? this.props.solidarity_price : this.props.solidarity_price * 0.34)}
            </p>
            <div className="donation_recept" {...receptDisabled}>
              <label htmlFor="donation_recept">
                <Field component="input" type="checkbox" name="donation_recept" value="simple" {...receptDisabled} />
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
  simple_subscription_price: React.PropTypes.number.isRequired,
  mag_price: React.PropTypes.number.isRequired,
  solidarity_price: React.PropTypes.number.isRequired,
}

const selector = formValueSelector('subscription')
function mapStateToProps(state) {
  return {
    solidarity_price: parseInt(selector(state, 'solidarity_price'), 10) || 0,
  }
}

export default connect(mapStateToProps)(SubscriptionTypeInput)

