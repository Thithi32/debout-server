import { SET_HUBS } from '../actions'
export default function hubs(state = [], action = {}) {
  switch (action.type) {
    case SET_HUBS: 
      return action.hubs;
    default: return state;
  }
}