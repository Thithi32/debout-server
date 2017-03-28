import { START_LOADING, STOP_LOADING } from '../actions'
export default function widgets(state = {loading: false}, action = {}) {
  switch (action.type) {
    case START_LOADING: 
      return {loading: true};
    case STOP_LOADING: 
      return {loading: false};
    default: 
      return state;
  }
}