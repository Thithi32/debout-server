import React from 'react';
import { FormSection } from 'redux-form';

const FormSectionPanel = (props) => (
  <FormSection name={props.name}>
    <div className="panel panel-default">
      <div className="panel-heading">
        <h3 className="panel-title title">{ props.title }</h3>
      </div>
      <div className="panel-body">
        {props.children}
      </div>
    </div>
  </FormSection>
)


FormSectionPanel.propTypes = {
  name: React.PropTypes.string.isRequired,
  title: React.PropTypes.string.isRequired,
}

export default FormSectionPanel;