import React, { Component } from 'react';
import { connect } from "react-redux";
import { Field } from 'redux-form';

import { fetchHubs } from "./../../../actions";

export class HubSelect extends Component {

  constructor () {
    super();
    this.state = {};
  }

  componentDidMount() {
    if (!this.props.hubs.length && !this.state.hubsFetched) {
      this.props.fetchHubs();
      this.setState({ hubsFetched: true});
    }
  }

  getHubOptions() {
    return this.props.hubs.map((hub, idx) => {
      let name = hub['NOM 1'] + " " + hub['NOM 2'];
      return { key: idx, value: name, text: name}; //hub['BA']
    });
  }

  onChangeHub(e, option) {
    let hub;
    if (!option || option === 'BEEOTOP') {
      hub = { name: 'BEEOTOP' };
    } else {
      for (let i = 0; i < this.props.hubs.length; i++) {
        const h = this.props.hubs[i];
        const hub_name = `${h['NOM 1']} ${h['NOM 2']}`;
        if (hub_name.toLowerCase() === option.toLowerCase()) {
          hub = h;
          break;
        }
      }

      hub.name = `${hub['NOM 1']} ${hub['NOM 2']}`;
      hub.address_inline = [hub['ADRESSE 1'], hub['ADRESSE 2'], hub.CP, hub.VILLE]
                            .filter((n) => { return n.trim() !== ''; })
                            .join(' ');
    }
    this.props.onChange(hub);
  }

  render() {

    return (
      <Field name="hub" className="form-control" component="select" onChange={ this.onChangeHub.bind(this) }>
          <option key={ "BEEOTOP" } value={ "BEEOTOP" }>Choisir votre Banque Alimentaire</option>
        { this.getHubOptions().map((option) =>
          <option key={ option.key } value={ option.value }>{ option.text }</option>
        )}
      </Field>
    )
  }
}

HubSelect.propTypes = {
  hubs: React.PropTypes.array.isRequired,
  onChange: React.PropTypes.func,
  fetchHubs: React.PropTypes.func.isRequired,
}

function mapStateToProps(state) {
  return {
    hubs: state.hubs || [],
  }
}

export default connect(mapStateToProps, { fetchHubs })(HubSelect);


