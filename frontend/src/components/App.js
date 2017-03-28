import React, { Component } from 'react';
import { Router, Route, browserHistory } from 'react-router';

import { FormOnly } from './layout';
import { Loader } from './widgets';
import { OrderForm, OrderConfirm } from './containers';
import './App.css';

class App extends Component {
  render() {
    return (
      <div>
        <FormOnly>
          <Router history={browserHistory}>
            <Route path="/" component={OrderForm}/>
            <Route path="/order/confirm/:id" component={OrderConfirm}/>
          </Router>
        </FormOnly>
        <Loader />
      </div>
    );
  }
}

export default App;
