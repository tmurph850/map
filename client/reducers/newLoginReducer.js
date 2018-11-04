import { NEW_LOGIN } from '../actions/actionTypes';

export default (state = [], action) => {
  switch (action.type) {
    case NEW_LOGIN:
      return [...state, action.payload];
    default:
      return state;
  }
};
