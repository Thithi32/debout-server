import React, { Component } from 'react';
import { connect } from "react-redux";
import { confirmOrder, startLoading, stopLoading } from "./../../../actions";
import { ContactUs } from "./../../widgets";

import "./OrderConfirm.css";

class OrderConfirm extends Component {
  componentDidMount() {
    this.props.confirmOrder(this.props.params.id);
    this.props.startLoading();
  }

  render() {
    return (
      <div>
        { this.props.confirmed === undefined &&
          <h2>La commande {this.props.params.id} est en cours de confirmation</h2>
        }
        { this.props.confirmed === true &&
          <div>
            <h2>La commande {this.props.params.id} a bien été confirmée</h2>
          </div>
        }
        { this.props.confirmed === false &&
          <div>
            <h2>La commande {this.props.params.id} n&#39;a pu être confirmée</h2>
            { this.props.confirmation_error &&
              <p>
                {this.props.confirmation_error}
              </p>
            } 
            <p>Veuillez nous contacter <ContactUs /></p>
          </div>
        }
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    confirmed: state.orders.confirmed,
    order: state.orders.order,
    confirmation_error: state.orders.confirmation_error
  }
}

export default connect(mapStateToProps, { confirmOrder, startLoading, stopLoading })(OrderConfirm)