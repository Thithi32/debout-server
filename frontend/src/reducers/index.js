import { combineReducers } from 'redux';

import companies from './companies';
import hubs from './hubs';
import { reducer as form } from 'redux-form';

export default combineReducers({
  companies,
  hubs,
  form
});