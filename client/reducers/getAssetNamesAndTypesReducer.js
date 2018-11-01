import { GET_ASSET_NAMES_TYPES } from '../actions/actionTypes';

export default (state = [], action) => {
  switch (action.type) {
    case GET_ASSET_NAMES_TYPES:
      return [ ...state, Object.assign({}, action.payload)];
    default:
      return state;
  }
};