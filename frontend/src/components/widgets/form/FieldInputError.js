import React from 'react';

const FieldInputError = ({input, meta, touched, ...props}) => (
  <div>
  { meta.error && (!touched || meta.touched) &&
    <div {...props} className="error">
      <span className="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>
      <span className="sr-only">Erreur:</span>
      &nbsp;{meta.error}
    </div>
  }
  </div>
)

export default FieldInputError;