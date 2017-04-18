import React, { Component } from 'react';
import { Field } from 'redux-form';
import { FieldNbProducts } from './../../widgets';

const packs = [
  { nb: 10, shipping: 10 },
  { nb: 25, shipping: 22 },
  { nb: 50, shipping: 30 },
  { nb: 100, shipping: 38 },
  { nb: 150, shipping: 42 },
  { nb: 200, shipping: 50 },
  { nb: 250, shipping: 53 },
  { nb: 300, shipping: 58 },
  { nb: 350, shipping: 65 },
  { nb: 400, shipping: 70 },
  { nb: 450, shipping: 80 },
  { nb: 500, shipping: 90 },
  { nb: 600, shipping: 102 },
  { nb: 700, shipping: 120 },
  { nb: 800, shipping: 135 },
  { nb: 900, shipping: 150 },
  { nb: 1000, shipping: 170 }
];

class OrderNbProducts extends Component {

  onChange(e, value) {
    value = parseInt(value,10);
    let pack = packs.find((pack) => { return (pack.nb === value); });
    this.props.onChangeShippingPrice(pack.shipping);
  }

  render() {
    return (
      <div className="form-group">
        <label htmlFor="nb_products">Nombre d&#39;exemplaires du magazine</label>
        <Field name="nb_products" price={this.props.price} component={FieldNbProducts} packs={packs} 
          className="form-control" onChange={ this.onChange.bind(this) } />  
        <small>À noter : Un paquet de 25 exemplaires du magazine pèse environ 3,5 kg.</small>
      </div>
    )
  }

}

OrderNbProducts.propTypes = {
  onChangeShippingPrice: React.PropTypes.func,
  price: React.PropTypes.number.isRequired,
}

export default OrderNbProducts;
