import axios from 'axios';
import { 
  GET_APPLICATION_DATA,
  GET_CURRENT_ASSETS,
  GET_CURRENT_DEPENDENCIES,
  GET_ASSET_DATA,
  POST_APP_FORM,
  POST_ASSET_OR_DEP
} from './actionTypes';

const getAppDataDevUrl = 'http://localhost:3000/getApplicationData';
const getAppDataProdUrl = 'http://ec2-18-214-185-132.compute-1.amazonaws.com:3000/getApplicationData';
const getAssetDataDevUrl = 'http://localhost:3000/getAssetData';
const getAssetDataProdUrl = 'http://ec2-18-214-185-132.compute-1.amazonaws.com:3000/getAssetData';
const getCurrentAssetsDevUrl = 'http://localhost:3000/getCurrentAssets';
const getCurrentAssetsProdUrl = 'http://ec2-18-214-185-132.compute-1.amazonaws.com:3000/getCurrentAssets';
const getCurrentDependenciesDevUrl = 'http://localhost:3000/getCurrentDependencies';
const getCurrentDependenciesProdUrl = 'http://ec2-18-214-185-132.compute-1.amazonaws.com:3000/getCurrentDependencies';
const postAppFormDevUrl = 'http://localhost:3000/postAppForm';
const postAppFormProdUrl = 'http://ec2-18-214-185-132.compute-1.amazonaws.com:3000/postAppForm';
const postAssetOrDepDevUrl = 'http://localhost:3000/postAssetOrDep';
const postAssetOrDepProdUrl = 'http://ec2-18-214-185-132.compute-1.amazonaws.com:3000/postAssetOrDep';

export const postData = (postData, postType) => {
  let actionType;
  let correctUrl;
  let env = "dev";
  //let env = "prod";

  switch (postType) {
    case "get_application_data":
      actionType = GET_APPLICATION_DATA;
      if ( env === "dev" ) {
        correctUrl = getAppDataDevUrl;
      } else {
        correctUrl = getAppDataProdUrl;
      }
      break;
    case "get_current_assets":
      actionType = GET_CURRENT_ASSETS;
      if ( env === "dev" ) {
        correctUrl = getCurrentAssetsDevUrl;
      } else {
        correctUrl = getCurrentAssetsProdUrl;
      }
      break;
    case "get_current_dependencies":
      actionType = GET_CURRENT_DEPENDENCIES;
      if ( env === "dev" ) {
        correctUrl = getCurrentDependenciesDevUrl;
      } else {
        correctUrl = getCurrentDependenciesProdUrl;
      }
      break;
    case "get_asset_data":
      actionType = GET_ASSET_DATA;
      if ( env === "dev" ) {
        correctUrl = getAssetDataDevUrl;
      } else {
        correctUrl = getAssetDataProdUrl;
      }
      break;
    case "post_app_form":
      actionType = POST_APP_FORM;
      if ( env === "dev" ) {
        correctUrl = postAppFormDevUrl;
      } else {
        correctUrl = postAppFormProdUrl;
      }
      break;
    case "post_asset_or_dep":
      actionType = POST_ASSET_OR_DEP;
      if ( env === "dev" ) {
        correctUrl = postAssetOrDepDevUrl;
      } else {
        correctUrl = postAssetOrDepProdUrl;
      }
      break;
    default:
      break;
  }

  const request = axios({
    method: "post",
    url: correctUrl,
    data: {postData: postData},
    responseType: "json",
  });

  return (dispatch) => {
    request.then(({data}) => {
      dispatch({type: actionType, payload: data});
    });
  };

};