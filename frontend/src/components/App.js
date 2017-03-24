import React, { Component } from 'react';
import { FormOnly } from './layout';
import { Loader } from './widgets';
import './App.css';

class App extends Component {
  render() {
    return (
      <div>
        <FormOnly />
        <Loader />
      </div>
    );
  }
}

export default App;
