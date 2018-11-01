import { NEW_SIGNUP } from '../actions/actionTypes';

export default (state = [], action) => {
  switch (action.type) {
    case NEW_SIGNUP:
      return [ ...state, Object.assign({}, action.payload) ];
    default:
      return state;
  }
};
