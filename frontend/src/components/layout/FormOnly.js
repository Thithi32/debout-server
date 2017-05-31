import React from 'react';
import './FormOnly.css';

const FormOnly = ({ children }) => (
  <div className="form-only">
    <div id="form-wrapper" className="open container container-small">

      <div id="content-wrapper">
        <div className="page-content">

          <div className="row">
            <div className="col-xs-12">
              {children}
            </div>
          </div>

        </div>
      </div>

    </div>
  </div>
);

export default FormOnly;
