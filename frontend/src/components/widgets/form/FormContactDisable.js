import React, { Component } from 'react';
import { FormContact } from './index';

class FormContactDisable extends Component {
  render() {
    const { disabled, ...props } = this.props;
    return (
      <div>
        { !disabled &&
          <div>
            <FormContact { ...props } />
            <div className="hide">
              <FormContact name="contact_disabled" disabled { ...props } />
            </div>
          </div>
        }
        { disabled &&
          <div>
            <div className="hide">
              <FormContact { ...props } />
            </div>
            <FormContact name="contact_disabled" disabled { ...props } />
          </div>
        }
      </div>
    )
  }
}

FormContactDisable.propTypes = {
  name: React.PropTypes.string,
  title: React.PropTypes.string,
  section: React.PropTypes.string,
  needPhone: React.PropTypes.bool,
  disabled: React.PropTypes.bool,
  onChange: React.PropTypes.func,
}

export default FormContactDisable;