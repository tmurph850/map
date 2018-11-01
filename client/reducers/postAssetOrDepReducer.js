import { POST_ASSET_OR_DEP } from '../actions/actionTypes';

export default (state = [], action) => {
  switch (action.type) {
    case POST_ASSET_OR_DEP:
      return [ ...state, Object.assign({}, action.payload)];
    default:
      return state;
  }
};