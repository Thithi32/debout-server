import React, { Component } from 'react';
import "./OrderFormTable.css";

const toMoney = (num) => ( (num && num.toFixed(2).replace('.',',') + "€") || "NaN" );

class OrderFormTable extends Component {
  render() {
    return (
      <div className="table-responsive order-form-table">
        <table className="table table-condensed ">
          <thead>
              <tr>
                <td><strong></strong></td>
                <td className="text-center"><strong>Prix</strong></td>
                <td className="text-center"><strong>Quantité</strong></td>
                <td className="text-right"><strong>Total</strong></td>
               </tr>
          </thead>
          <tbody>
            <tr>
              <td>Debout n°12</td>
              <td className="text-center">{toMoney(this.props.price)}</td>
              <td className="text-center">{this.props.nb_products}</td>
              <td className="text-right">{toMoney(this.props.price * this.props.nb_products)}</td>
            </tr>
            <tr>
              <td className="thick-line"></td>
              <td className="thick-line"></td>
              <td className="thick-line text-center"><strong>Livraison</strong></td>
              <td className="thick-line text-right">{toMoney(this.props.shipping_price)}</td>
            </tr>
            <tr style={{fontSize: '1.2em'}}>
              <td className="no-line"></td>
              <td className="no-line"></td>
              <td className="no-line text-center"><strong>TOTAL</strong></td>
              <td className="no-line text-right"><strong>{toMoney(this.props.total)}</strong></td>
            </tr>
          </tbody>
        </table>
      </div>
    )
  }
}

OrderFormTable.propTypes = {
  price: React.PropTypes.number.isRequired,
  nb_products: React.PropTypes.number.isRequired,
  shipping_price: React.PropTypes.number.isRequired,
  total: React.PropTypes.number.isRequired,
}

export default OrderFormTable;