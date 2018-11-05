import { HANDLE_AUTH } from './actionTypes';

export const handleAuth = (authType) => {
  let status;
  
  if (authType === "authenticate") {
    status = {
      isAuthenticated: true
    };
  } else {
    status = {
      isAuthenticated: false
    };
  }

  return (dispatch) => {
    dispatch({type: HANDLE_AUTH, payload: status});
  };

};
