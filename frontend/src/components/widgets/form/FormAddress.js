import React, { Component } from 'react';
import { Field, FormSection } from 'redux-form';
import { FormInput } from './index';

const upper = value => value && value.toUpperCase();
const onlynum = value => value && value.replace(/[^\d]/g, '').substring(0,5);

class FormAddress extends Component {
  render() {
    const name = this.props.name || 'address';
    return (
      <FormSection name={name}>
        <div className="form-group">
          { this.props.title &&
            <label htmlFor="address1">{ this.props.title }</label>
          }
          <Field component={FormInput} onChange={(e)=>{ this.props.onChange && this.props.onChange(e); }} 
            className="form-control" type="text" name="address1" placeholder="Ligne 1 *" disabled={this.props.disabled} />
          <Field component={FormInput} onChange={(e)=>{ this.props.onChange && this.props.onChange(e); }} 
            className="form-control" type="text" name="address2" placeholder="Ligne 2" disabled={this.props.disabled} />
          <Field component={FormInput} onChange={(e)=>{ this.props.onChange && this.props.onChange(e); }} 
            className="form-control" type="text" name="zip" placeholder="Code postal *" disabled={this.props.disabled} 
            normalize={onlynum}/>
          <Field component={FormInput} onChange={(e)=>{ this.props.onChange && this.props.onChange(e); }} 
            className="form-control" type="text" name="city" placeholder="Commune *" disabled={this.props.disabled} 
            normalize={upper} />
        </div>
      </FormSection>
    )
  }
}

FormAddress.propTypes = {
  name: React.PropTypes.string,
  title: React.PropTypes.string,
  disabled: React.PropTypes.bool,
  onChange: React.PropTypes.func,
}

export default FormAddress;
