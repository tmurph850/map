import { HANDLE_AUTH } from '../actions/actionTypes';

export default (state = [], action) => {
  switch (action.type) {
    case HANDLE_AUTH:
      return [...state, action.payload];
    default:
      return state;
  }
};
