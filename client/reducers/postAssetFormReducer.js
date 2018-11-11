import { POST_ASSET_FORM } from '../actions/actionTypes';

export default (state = [], action) => {
  switch (action.type) {
    case POST_ASSET_FORM:
      return [ ...state, Object.assign({}, action.payload)];
    default:
      return state;
  }
};