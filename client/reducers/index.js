import { combineReducers } from 'redux';
import NewSignUpReducer from './newSignUpReducer';
import AuthenticateUserReducer from './authenticateUserReducer';
import NewLogInReducer from './newLoginReducer';
import getAllApplicationNamesReducer from './getAllApplicationNamesReducer';
import getAllAssetNamesReducer from './getAllAssetNamesReducer';
import getApplicationDataReducer from './getApplicationDataReducer';
import getAssetDataReducer from './getAssetDataReducer';
import getCurrentAssetsReducer from './getCurrentAssetsReducer';
import getCurrentDependenciesReducer from './getCurrentDependenciesReducer';
import postAppFormReducer from './postAppFormReducer';
import postAssetFormReducer from './postAssetFormReducer';
import postAssetOrDepReducer from './postAssetOrDepReducer';
import getAssetNamesAndTypesReducer from './getAssetNamesAndTypesReducer';
import handleAuthReducer from './handleAuthReducer';
import updateAssetReducer from './updateAssetReducer';

const rootReducer = combineReducers({
  signUpResponse: NewSignUpReducer,
  isUserAuthenticated: AuthenticateUserReducer,
  logInResponse: NewLogInReducer,
  allApplicationNames: getAllApplicationNamesReducer,
  allAssetNames: getAllAssetNamesReducer,
  applicationData: getApplicationDataReducer,
  assetData: getAssetDataReducer,
  currentAssets: getCurrentAssetsReducer,
  currentDependencies: getCurrentDependenciesReducer,
  appFormResponse: postAppFormReducer,
  assetFormResponse: postAssetFormReducer,
  assetOrDepResponse: postAssetOrDepReducer,
  assetNamesAndTypes: getAssetNamesAndTypesReducer,
  userAuth: handleAuthReducer,
  updatedAsset: updateAssetReducer
});

export default rootReducer;
