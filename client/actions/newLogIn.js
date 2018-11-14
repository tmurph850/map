import axios from 'axios';
import { NEW_LOGIN } from './actionTypes';
const devUrl = 'http://localhost:3000/login';
const prodUrl = 'http://ec2-18-214-185-132.compute-1.amazonaws.com:3000/login';

export const newLogIn = (email, password) => {
  const request = axios({
    method: "post",
    url: prodUrl,
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
