import { GET_ASSET_DATA } from '../actions/actionTypes';

export default (state = [], action) => {
  switch (action.type) {
    case GET_ASSET_DATA:
      return [ ...state, Object.assign({}, action.payload)];
    default:
      return state;
  }
};