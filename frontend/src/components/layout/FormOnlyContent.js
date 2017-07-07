import React, { Component } from 'react';

export default class FormOnlyHeader extends Component {
  render() {
    return (
      <div className="widget-body">
        { this.props.children }
      </div>
    )
  }
}
