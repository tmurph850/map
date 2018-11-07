import axios from 'axios';
import { 
  GET_ALL_APPLICATION_NAMES,
  GET_ALL_ASSET_NAMES,
  GET_ASSET_NAMES_TYPES
} from './actionTypes';

const getAppNamesDevUrl = 'http://localhost:3000/getAllApplicationNames';
const getAppNamesProdUrl = 'http://ec2-18-214-185-132.compute-1.amazonaws.com:3000/getAllApplicationNames';
const getAssetNamesDevUrl = 'http://localhost:3000/getAllAssetNames';
const getAssetNamesProdUrl = 'http://ec2-18-214-185-132.compute-1.amazonaws.com:3000/getAllAssetNames';
const getBladesDevUrl = 'http://localhost:3000/getBlades';
const getBladesProdUrl = 'http://ec2-18-214-185-132.compute-1.amazonaws.com:3000/getBlades';
const getChassisDevUrl = 'http://localhost:3000/getChassis';
const getChassisProdUrl = 'http://ec2-18-214-185-132.compute-1.amazonaws.com:3000/getChassis';
const getAssetTypesDevUrl = 'http://localhost:3000/getAssetTypes';
const getAssetTypesProdUrl = 'http://ec2-18-214-185-132.compute-1.amazonaws.com:3000/getAssetTypes';


export const getData = (requestType) => {
  let actionType;
  let correctUrl;
  let env = "dev";
  //let env = "prod";

  switch (requestType) {
    case "get_app_names":
      actionType = GET_ALL_APPLICATION_NAMES;
      if ( env === "dev" ) {
        correctUrl = getAppNamesDevUrl;
      } else {
        correctUrl = getAppNamesDevUrl;
      }
      break;
    case "get_asset_names":
    actionType = GET_ALL_ASSET_NAMES;
      if ( env === "dev" ) {
        correctUrl = getAssetNamesDevUrl;
      } else {
        correctUrl = getAssetNamesDevUrl;
      }
      break;
    default:
      break;
  }

  if ( requestType === "get_asset_names_types" ) {
    actionType = GET_ASSET_NAMES_TYPES;

    const requestAssetNames = axios({
      method: "get",
      url: getAssetNamesProdUrl,
      responseType: "json",
    });

    const requestAssetTypes = axios({
      method: "get",
      url: getAssetTypesDevUrl,
      responseType: "json",
    });

    const requestAppNames = axios({
      method: "get",
      url: getAppNamesDevUrl,
      responseType: "json",
    });

    const requestBlades = axios({
      method: "get",
      url: getBladesDevUrl,
      responseType: "json",
    });

    const requestChassis = axios({
      method: "get",
      url: getChassisDevUrl,
      responseType: "json",
    });
  
    return (dispatch) => {
      Promise.all([requestAssetNames, requestAssetTypes, requestAppNames, requestBlades, requestChassis]).then((response) => {
        dispatch({type: actionType, payload: response});
      });
    };

  } else {

    const request = axios({
      method: "get",
      url: correctUrl,
      responseType: "json",
    });
  
    return (dispatch) => {
      request.then(({data}) => {
        dispatch({type: actionType, payload: data});
      });
    };

  }

  

};