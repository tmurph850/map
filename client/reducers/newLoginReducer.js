import { NEW_LOGIN } from '../actions/actionTypes';

export default (state = [], action) => {
  switch (action.type) {
    case NEW_LOGIN:
      return [ ...state, Object.assign({}, action.payload) ];
    default:
      return state;
  }
};
