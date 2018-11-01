import { AUTHENTICATE_USER } from '../actions/actionTypes';

export default (state = [], action) => {
  switch (action.type) {
    case AUTHENTICATE_USER:
      return [ ...state, action.payload];
    default:
      return state;
  }
};
