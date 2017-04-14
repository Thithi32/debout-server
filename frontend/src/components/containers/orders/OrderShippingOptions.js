import React, { Component } from 'react';
import { Field } from 'redux-form';

class OrderShippingOptions extends Component {

  render() {
    const { hub, shipping_price } = this.props;

    const hub_beeotop = (hub.name === "BEEOTOP");
    const hub_ba = !hub_beeotop;

    return (
      <div>
        <div className="form-group">
          <label htmlFor="shipping_option">Choisir votre mode de livraison</label>
          <div className="radio">
            <label>
              <Field component="input" type="radio" name="shipping_option" value="1"/>
               Option 1: Livraison dans votre structure{ shipping_price > 0 &&
                <span>
                  &nbsp;= { shipping_price }€
                </span>
               }
            </label>
          </div>
          <div className="radio">
            <label>
              <Field component="input" type="radio" name="shipping_option" value="2"/>
               
              { hub_ba &&
                <span>Option 2: Livraison gratuite dans votre Banque Alimentaire ({ hub.OUVERTURE }): { hub.name }, <em>{ hub.address_inline }</em></span>
              }
              { hub_beeotop &&
                <div>
                  <span>Option 2: Livraison gratuite au BEEOTOP de Paris, <em>14 boulevard de Douaumont – 75017 Paris</em></span>
                </div>
              }
            </label>
          </div>
        </div>
      </div>
    )
  }
}

OrderShippingOptions.propTypes = {
  hub: React.PropTypes.object.isRequired,
  shipping_price: React.PropTypes.number.isRequired,
}

export default OrderShippingOptions;

