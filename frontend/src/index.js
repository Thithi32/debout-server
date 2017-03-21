import React from 'react';
import ReactDOM from 'react-dom';
import { App } from './components';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import allReducers from './reducers';
import { composeWithDevTools } from 'redux-devtools-extension';
import { Provider } from 'react-redux';
import './index.css';

const store = createStore(
  allReducers,
  composeWithDevTools (
    applyMiddleware(thunk)
  )
)

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
