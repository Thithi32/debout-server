import React, { Component } from 'react';
import { OrderForm } from '../containers';
import './FormOnly.css' 

class FormOnly extends Component {
  render(){
    return (
      <div className="form-only">
        <div id="form-wrapper" className="open container container-small">

          <div id="content-wrapper">
            <div className="page-content">

              <div className="row">
                <div className="col-xs-12">
                  <OrderForm />
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    )
  }
}

export default FormOnly