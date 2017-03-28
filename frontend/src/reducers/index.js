import { combineReducers } from 'redux';

import companies from './companies';
import hubs from './hubs';
import widgets from './widgets';
import orders from './orders';
import { reducer as form } from 'redux-form';

export default combineReducers({
  companies,
  hubs,
  widgets,
  orders,
  form
});