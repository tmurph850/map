const getAllApplicationNames = require('./getAllApplicationNames');
const getAllAssetNames = require('./getAllAssetNames');
const getAllAssets = require('./getAllAssets');
const getApplicationData = require('./getApplicationData');
const getAssetData = require('./getAssetData');
const getCurrentAssets = require('./getCurrentAssets');
const getCurrentDependencies = require('./getCurrentDependencies');
const postAppForm = require('./postAppForm');
const postAssetOrDep = require('./postAssetOrDep');
const getAssetTypes = require('./getAssetTypes');
const getBlades = require('./getBlades');
const getChassis = require('./getChassis');

module.exports = (app) => {
  app.get('/getAllApplicationNames', getAllApplicationNames);
  app.get('/getAllAssetNames', getAllAssetNames);
  app.get('/getAssetTypes', getAssetTypes);
  app.get('/getAllAssets', getAllAssets);
  app.get('/getBlades', getBlades);
  app.get('/getChassis', getChassis);
  app.post('/getApplicationData', getApplicationData);
  app.post('/getAssetData', getAssetData);
  app.post('/getCurrentAssets', getCurrentAssets);
  app.post('/getCurrentDependencies', getCurrentDependencies);
  app.post('/postAppForm', postAppForm);
  app.post('/postAssetOrDep', postAssetOrDep);
};
