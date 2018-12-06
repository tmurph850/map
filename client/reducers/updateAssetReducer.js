import { UPDATE_ASSET } from '../actions/actionTypes';

export default (state = [], action) => {
  switch (action.type) {
    case UPDATE_ASSET:
      return [...state, Object.assign({}, action.payload)];
    default:
      return state;
  }
};