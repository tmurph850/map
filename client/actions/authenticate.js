import { AUTHENTICATE_USER } from './actionTypes';

export const authenticateUser = (str) => {
  return {type: AUTHENTICATE_USER, payload: str};
};
