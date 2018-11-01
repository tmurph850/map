import { GET_ALL_APPLICATION_NAMES } from '../actions/actionTypes';

export default (state = [], action) => {
  switch (action.type) {
    case GET_ALL_APPLICATION_NAMES:
      return [ ...state, action.payload];
    default:
      return state;
  }
};