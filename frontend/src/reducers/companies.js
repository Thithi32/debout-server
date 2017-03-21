import { SET_COMPANIES } from '../actions'
export default function companies(state = [], action = {}) {
  switch (action.type) {
    case SET_COMPANIES: 
      return action.companies;
    default: return state;
  }
}