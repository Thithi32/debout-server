import React from 'react';

const FieldInputError = ({input, meta, ...props}) => (
  <div>
  { meta.error &&
    <div {...props} className="error">
      <span className="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>
      <span className="sr-only">Erreur:</span>
      &nbsp;{meta.error}
    </div>
  }
  </div>
)

export default FieldInputError;