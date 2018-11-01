import { GET_CURRENT_ASSETS } from '../actions/actionTypes';

export default (state = [], action) => {
  switch (action.type) {
    case GET_CURRENT_ASSETS:
      return [ ...state, Object.assign({}, action.payload)];
    default:
      return state;
  }
};