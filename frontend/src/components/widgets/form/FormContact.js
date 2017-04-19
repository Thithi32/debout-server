import React, { Component } from 'react';
import { Field, FormSection } from 'redux-form';
import { FieldHonorific, FieldInputError } from './index';

/*** Normalizers ****/
const upper = value => value && value.toUpperCase();
const normalizePhone = value => {
  if (!value) {
    return value;
  }

  let onlyNums = value.replace(/[^\d]/g, '');
  if (onlyNums.slice(0, 1) !== "0") onlyNums = `0${onlyNums}`;

  if (onlyNums.length <= 2) {
    return onlyNums;
  }
  if (onlyNums.length <= 4) {
    return `${onlyNums.slice(0, 2)} ${onlyNums.slice(2)}`;
  }
  if (onlyNums.length <= 6) {
    return `${onlyNums.slice(0, 2)} ${onlyNums.slice(2, 4)} ${onlyNums.slice(4)}`;
  }
  if (onlyNums.length <= 8) {
    return `${onlyNums.slice(0, 2)} ${onlyNums.slice(2, 4)} ${onlyNums.slice(4, 6)} ${onlyNums.slice(6)}`;
  }
  if (onlyNums.length > 10) { onlyNums = onlyNums.slice(0, 10); }
  return `${onlyNums.slice(0, 2)} ${onlyNums.slice(2, 4)} ${onlyNums.slice(4, 6)} ${onlyNums.slice(6, 8)} ${onlyNums.slice(8)}`;
};


class FormContact extends Component {
  render() {
    const name = this.props.name || 'contact';
    const mobile_label = "Téléphone mobile" + ((this.props.needPhone) ? " ¹" : "");
    const phone_label = "Téléphone fixe" + ((this.props.needPhone) ? " ¹" : "");
    return (
      <FormSection name={name}>
        <div className="form-group contact-form">
          { this.props.title &&
            <label>{ this.props.title }</label>
          }
          <Field name="honorific" onChange={(e)=>{ this.props.onChange && this.props.onChange(e); }} label="Civilité" component={FieldHonorific} disabled={this.props.disabled} className="honorific form-control"/>
          <div className="name-group">
            <Field name="name" onChange={(e)=>{ this.props.onChange && this.props.onChange(e); }} placeholder="Nom *" 
              disabled={this.props.disabled} component="input" type="text" className="form-control" normalize={upper}/>  
            <Field name="firstname" onChange={(e)=>{ this.props.onChange && this.props.onChange(e); }} placeholder="Prénom" 
              disabled={this.props.disabled} component="input" type="text" className="form-control"/>  
          </div>
          <Field name="name" component={FieldInputError} touched />
          <div className="input-group email-group">
            <span className="input-group-addon" id="email_label"><i className="glyphicon glyphicon-envelope"></i></span>
            <Field name="email" placeholder="Email *" disabled={this.props.disabled} component="input" type="text" className="form-control" aria-describedby="email_label"
               onChange={(e)=>{ this.props.onChange && this.props.onChange(e); }}/>  
          </div>
          <Field name="email" component={FieldInputError} touched/>
          <div className="input-group mobile-group">
            <span className="input-group-addon" id="mobile_label"><i className="glyphicon glyphicon-phone"></i></span>
            <Field name="mobile" placeholder={mobile_label} disabled={this.props.disabled} component="input" type="text" className="form-control" aria-describedby="mobile_label"
               onChange={(e)=>{ this.props.onChange && this.props.onChange(e); }} normalize={normalizePhone}/>  
          </div>
          <div className="input-group phone-group">
            <span className="input-group-addon" id="phone_label"><i className="glyphicon glyphicon-phone-alt"></i></span>
            <Field name="phone" placeholder={phone_label} disabled={this.props.disabled} component="input" type="text" className="form-control" aria-describedby="phone_label"
               onChange={(e)=>{ this.props.onChange && this.props.onChange(e); }} normalize={normalizePhone}/>  
          </div>
          <Field name="mobile" component={FieldInputError} touched/>
          <Field name="phone" component={FieldInputError} touched/>
        </div>
      </FormSection>
    )
  }
}

FormContact.propTypes = {
  name: React.PropTypes.string,
  title: React.PropTypes.string,
  needPhone: React.PropTypes.bool,
  disabled: React.PropTypes.bool,
  onChange: React.PropTypes.func,
}

export default FormContact;

