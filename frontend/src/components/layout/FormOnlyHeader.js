import React, { Component } from 'react';

export default class FormOnlyHeader extends Component {
  render() {
    return (
      <div className="widget-header">
        <div className="logo">
          <img className="pull-left" src="img/logo_mini.jpg" alt="Logo Debout" />
        </div>

        <div className="row">
          { this.props.children }
        </div>
      </div>
    )
  }
}

