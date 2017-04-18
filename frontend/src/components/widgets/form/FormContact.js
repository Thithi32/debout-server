import React, { Component } from 'react';
import { Field, FormSection } from 'redux-form';
import { FieldHonorific, FieldInputError } from './index';

class FormContact extends Component {
  render() {
    const name = this.props.name || 'contact';
    const section = this.props.section || '';
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
            <Field name="name" onChange={(e)=>{ this.props.onChange && this.props.onChange(e); }} placeholder="Nom *" disabled={this.props.disabled} component="input" type="text" className="form-control"/>  
            <Field name="firstname" onChange={(e)=>{ this.props.onChange && this.props.onChange(e); }} placeholder="Prénom" disabled={this.props.disabled} component="input" type="text" className="form-control"/>  
          </div>
          <Field name={`${section}.${name}.name`} component={FieldInputError} />
          <div className="input-group email-group">
            <span className="input-group-addon" id="email_label"><i className="glyphicon glyphicon-envelope"></i></span>
            <Field name="email" placeholder="Email *" disabled={this.props.disabled} component="input" type="text" className="form-control" aria-describedby="email_label"
               onChange={(e)=>{ this.props.onChange && this.props.onChange(e); }}/>  
          </div>
          <Field name={`${section}.${name}.email`} component={FieldInputError} />
          <div className="input-group mobile-group">
            <span className="input-group-addon" id="mobile_label"><i className="glyphicon glyphicon-phone"></i></span>
            <Field name="mobile" placeholder={mobile_label} disabled={this.props.disabled} component="input" type="text" className="form-control" aria-describedby="mobile_label"
               onChange={(e)=>{ this.props.onChange && this.props.onChange(e); }}/>  
          </div>
          <div className="input-group phone-group">
            <span className="input-group-addon" id="phone_label"><i className="glyphicon glyphicon-phone-alt"></i></span>
            <Field name="phone" placeholder={phone_label} disabled={this.props.disabled} component="input" type="text" className="form-control" aria-describedby="phone_label"
               onChange={(e)=>{ this.props.onChange && this.props.onChange(e); }}/>  
          </div>
          <Field name={`${section}.${name}.mobile`} component={FieldInputError} />
        </div>
      </FormSection>
    )
  }
}

FormContact.propTypes = {
  name: React.PropTypes.string,
  title: React.PropTypes.string,
  section: React.PropTypes.string,
  needPhone: React.PropTypes.bool,
  disabled: React.PropTypes.bool,
  onChange: React.PropTypes.func,
}

export default FormContact;

