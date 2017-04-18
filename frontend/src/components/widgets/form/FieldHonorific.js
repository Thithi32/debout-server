import React from 'react';

const FieldHonorific = ({ input, label, meta, ...props}) => (
  <select {...input} {...props}>
    <option value="M">M</option>
    <option value="Mme">Mme</option>
  </select>
)

export default FieldHonorific;