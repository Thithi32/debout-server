import React, { Component } from 'react';
import { connect } from "react-redux";
import { Field } from 'redux-form';

import { fetchCompanies } from "./../../../actions";
import removeDiacritics from "./../../../helpers";

import { FormGroupInput } from './../../widgets';

export class CompanyAutoComplete extends Component {

  constructor () {
    super();
    this.state = {};
  }

  componentDidMount() {
    if (!this.props.companies.length && !this.state.companiesFetched) {
      this.props.fetchCompanies();
      this.setState({ companiesFetched: true});
    }
  }

  changeCompany(e, str, old_str) {
    let choices = [];
    let tolower = (str) => { return removeDiacritics(str.toLowerCase()); }
    if (str && str.length >= 3) 
      choices = this.props.companies.filter( (company) => ( tolower(company['Raison sociale']).indexOf(tolower(str)) > -1 ) ? company['Raison sociale'] : false );

    this.setState( { 'company_autocomplete': choices} );
  }

  selectCompany(company) {
    this.props.onCompanyChange(company);
    this.setState({company_autocomplete: {}});
  }

  render() {
    return (
      <div className="dropdown open">
        <Field name="company" label="Nom de la structure" 
          component={FormGroupInput} type="text" className="form-control"
          onChange={this.changeCompany.bind(this)}/>  

        { this.state.company_autocomplete && this.state.company_autocomplete.length > 0 &&
          <ul className="dropdown-menu">
            { this.state.company_autocomplete.map((company, key) => 
                <li key={key}><a href="#" onClick={() => this.selectCompany(company)}>{ company['Raison sociale'] }</a></li>
            )}
          </ul>
        }
      </div>
    )
  }
}

CompanyAutoComplete.propTypes = {
  companies: React.PropTypes.array.isRequired,
  fetchCompanies: React.PropTypes.func.isRequired,
  onCompanyChange: React.PropTypes.func.isRequired
}

function mapStateToProps(state) {
  return {
    companies: state.companies || [],
  }
}

export default connect(mapStateToProps, { fetchCompanies })(CompanyAutoComplete);


