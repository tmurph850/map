import { GET_APPLICATION_DATA } from '../actions/actionTypes';

export default (state = [], action) => {
  switch (action.type) {
    case GET_APPLICATION_DATA:
      return [ ...state, Object.assign({}, action.payload)];
    default:
      return state;
  }
};