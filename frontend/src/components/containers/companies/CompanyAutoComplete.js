import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Field } from 'redux-form';

import { fetchCompanies } from './../../../actions';
import removeDiacritics from './../../../helpers';

import { FormGroupInput } from './../../widgets';

const upper = value => value && value.toUpperCase();

export class CompanyAutoComplete extends Component {

  constructor() {
    super();
    this.state = {};
  }

  componentDidMount() {
    if (!this.props.companies.length && !this.companiesFetched) {
      this.props.fetchCompanies();
      this.companiesFetched = true;
    }
  }

  changeCompany(e, str, old_str) {
    let choices = [];
    const tolower = (s) => { return removeDiacritics(s.toLowerCase()); };
    if (str && str.length >= 3) {
      choices = this.props.companies.filter(
        (company) => ((tolower(company['Raison sociale']).indexOf(tolower(str)) > -1) ?
        company['Raison sociale'] :
        false
      ));
    }

    this.setState({ company_autocomplete: choices });
    this.props.onChangeCompany(e, str, old_str);
  }

  selectCompany(company) {
    this.setState({ company_autocomplete: {} });
    this.props.onSelectCompany(company);
  }

  render() {
    return (
      <div className="dropdown open">
        <Field
          name="company"
          label="Nom de la structure"
          component={FormGroupInput} type="text" className="form-control"
          onChange={this.changeCompany.bind(this)}
          normalize={upper}
        />

        { this.state.company_autocomplete && this.state.company_autocomplete.length > 0 &&
          <ul className="dropdown-menu">
            { this.state.company_autocomplete.map((company) =>
              <li key={company.line}>
                <a tabIndex={-1} role="menuitem" onClick={() => this.selectCompany(company)}>{ company['Raison sociale'] }</a>
              </li>
            )}
          </ul>
        }
      </div>
    );
  }
}

CompanyAutoComplete.propTypes = {
  companies: React.PropTypes.array.isRequired,
  fetchCompanies: React.PropTypes.func.isRequired,
  onChangeCompany: React.PropTypes.func,
  onSelectCompany: React.PropTypes.func,
};

CompanyAutoComplete.defaultProps = {
  onChangeCompany: () => {},
  onSelectCompany: () => {},
};

function mapStateToProps(state) {
  return {
    companies: state.companies || [],
  };
}

export default connect(mapStateToProps, { fetchCompanies })(CompanyAutoComplete);
