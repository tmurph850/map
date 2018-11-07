import axios from 'axios';
import { GET_ALL_APPLICATION_NAMES } from './actionTypes';

const devUrl = 'http://localhost:3000/getAllApplicationNames';
const prodUrl = 'http://ec2-18-214-185-132.compute-1.amazonaws.com:3000/getAllApplicationNames';


export const getAllApplicationNames = () => {

  const request = axios({
    method: "get",
    url: devUrl,
    responseType: "json",
  });

  return (dispatch) => {
    request.then(({data}) => {
      dispatch({type: GET_ALL_APPLICATION_NAMES, payload: data});
    });
  };

};