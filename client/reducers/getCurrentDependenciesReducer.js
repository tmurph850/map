import { GET_CURRENT_DEPENDENCIES } from '../actions/actionTypes';

export default (state = [], action) => {
  switch (action.type) {
    case GET_CURRENT_DEPENDENCIES:
      return [ ...state, Object.assign({}, action.payload)];
    default:
      return state;
  }
};