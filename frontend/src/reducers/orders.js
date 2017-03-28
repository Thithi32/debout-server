import { ORDER_CONFIRMED, ORDER_NOT_CONFIRMED } from '../actions'
export default function orders(state = {}, action = {}) {
  switch (action.type) {
    case ORDER_CONFIRMED: 
      return {confirmed: true, order: action.order};
    case ORDER_NOT_CONFIRMED: 
    console.log(action);
      return {confirmed: false, confirmation_error: action.error};
    default: 
      return state;
  }
}