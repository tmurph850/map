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
import postAssetOrDepReducer from './postAssetOrDepReducer';
import getAssetNamesAndTypesReducer from './getAssetNamesAndTypesReducer';

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
  assetOrDepResponse: postAssetOrDepReducer,
  assetNamesAndTypes: getAssetNamesAndTypesReducer
});

export default rootReducer;
