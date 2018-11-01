import axios from 'axios';
import { NEW_LOGIN } from './actionTypes';

export const newLogIn = (email, password) => {
  const request = axios({
    method: "post",
    url: `http://localhost:3000/login`,
    responseType: "json",
    data: {
      email: email,
      password: password
    }
  });

  return (dispatch) => {
    request.then(({data}) => {
      dispatch({type: NEW_LOGIN, payload: data});
    }).catch((error) => {
      console.log(error);
    });
  };

};
