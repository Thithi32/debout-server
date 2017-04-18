import React from 'react';

const toMoney = (num) => ( num.toFixed(2).replace('.',',') + "€" );

const FieldNbProducts = ({ input, price, packs, meta: { touched, error }, ...props}) => (
  <div className={ touched && error && ' error' }>
    <select {...input} {...props}>
        <option key={ 0 } value="0">Choisir le nombre d&#39;exemplaires</option>  
      { packs.map((pack,i) =>
        <option key={ i } value={ pack.nb }>{ pack.nb } exemplaires = { toMoney(pack.nb * price) }</option>  
      )}
    </select>
    { touched && error && <div className="form-message"><small>{error}</small></div> }
  </div>
)

export default FieldNbProducts;