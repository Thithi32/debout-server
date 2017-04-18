import React, { Component } from 'react';
import { FormAddress } from './index';

class FormAddressDisable extends Component {
  render() {
    const { disabled, ...props } = this.props;
    return (
      <div>
        { !disabled &&
          <div>
            <FormAddress { ...props } />
            <div className="hide">
              <FormAddress name="address_disabled" disabled { ...props } />
            </div>
          </div>
        }
        { disabled &&
          <div>
            <div className="hide">
              <FormAddress { ...props } />
            </div>
            <FormAddress name="address_disabled" disabled { ...props } />
          </div>
        }
      </div>
    )
  }
}

FormAddressDisable.propTypes = {
  name: React.PropTypes.string,
  title: React.PropTypes.string,
  disabled: React.PropTypes.bool,
  onChange: React.PropTypes.func,
}

export default FormAddressDisable;