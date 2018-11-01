import axios from 'axios';
import { NEW_SIGNUP, AUTHENTICATE_USER } from './actionTypes';

export const newSignUp = (email, password) => {
  const request = axios({
    method: "post",
    url: `http://localhost:3000/signup`,
    responseType: "json",
    data: {
      email: email,
      password: password
    }
  });

  return (dispatch) => {
    request.then(({data}) => {
      dispatch({type: NEW_SIGNUP, payload: data});
      localStorage.setItem("token", data.token);
      dispatch({type: AUTHENTICATE_USER, payload: "true"});
    }).catch((error) => {
      console.log(error);
    });
  };

};
