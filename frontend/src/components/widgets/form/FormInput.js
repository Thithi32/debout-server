import React from 'react';

const FormInput = ({ input, type, meta: { touched, error }, ...props}) => (
  <div className={ touched && error && ' error' }>
    <input type={type} {...input} {...props} />  
    { touched && error && <div className="form-message"><small>{error}</small></div> }        
  </div>
)

export default FormInput;
