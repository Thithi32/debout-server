import React from 'react';
import FormInput from './FormInput';

const FormGroupInput = ({ input, label, ...props}) => (
  <div className="form-group">
    <label htmlFor={input.name}>{label}</label>
    <FormInput input={input} {...props} />
  </div>
)

export default FormGroupInput;
