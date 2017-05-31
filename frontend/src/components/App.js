import React from 'react';
import { Router, Route, browserHistory } from 'react-router';

import { FormOnly } from './layout';
import { Loader } from './widgets';
import { OrderForm, OrderConfirm, SubscribeForm, Home } from './containers';
import './App.css';

const App = () => (
  <div>
    <FormOnly>
      <Router history={browserHistory}>
        <Route path="/" component={Home} />
        <Route path="/home" component={Home} />
        <Route path="/commande" component={OrderForm} />
        <Route path="/abonnement" component={SubscribeForm} />
        <Route path="/order/confirm/:id" component={OrderConfirm} />
      </Router>
    </FormOnly>
    <Loader />
  </div>
);

export default App;
