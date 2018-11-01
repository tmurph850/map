const db = require('../db/index');

const postAssetOrDep = (req, res) => {
  let postArr = req.body.postData;
  let appId = postArr[0];
  let requestNumber = postArr[3];
  let assetValues = [appId];
  let dependencyValues = [appId];
  let assetText = 'INSERT INTO appassets_table (application, asset_name) VALUES';
  let dependencyText = 'INSERT INTO appdependencies_table (application, dependency_name) VALUES';
  //let values = [postObj.appId, postObj.newData];

  const query = (text, values) => {
    return new Promise((resolve, reject) => {
      db.query(text, values, (err, response) => {
        if (err) {
          console.log("Query rejected");
          reject({
              error: "There was an error querying the DB for application data.",
              responseCode: 400
            });
        } else {
          console.log("Query resolved");
          resolve(response);
        }
      });
    });
  };

  const buildTextAndValues = (assets, deps) => { 
      let assetIndex = 2;
      let depIndex = 2;

      
      if ( assets !== null ) {
        let newAssets = assets.newData;
        newAssets.forEach(asset => {
          assetValues.push(asset);
          if ( assetIndex < newAssets.length + 1 ) {
            assetText = assetText + '($1, $' +assetIndex+ '),';
          }
          if ( assetIndex === newAssets.length + 1 ) {
            assetText = assetText + '($1, $' +assetIndex+ ')';
          }
          assetIndex++;
        });
      }

      if ( deps !== null ) {
        let newDeps = deps.newData;
        newDeps.forEach(dep => {
          dependencyValues.push(dep);
          if ( depIndex < newDeps.length + 1 ) {
            dependencyText = dependencyText + '($1, $' +depIndex+ '),';
          }
          if ( depIndex === newDeps.length + 1 ) {
            dependencyText = dependencyText + '($1, $' +depIndex+ ')';
          }
          depIndex++;
        });
      }
  
  };

  if ( postArr[1] !== null && postArr[2] !== null ) {
    buildTextAndValues(postArr[1], postArr[2]);
    //const assetPromise = query(assetText, assetValues);
    //const dependencyPromise = query(dependencyText, dependencyValues);

    query(assetText, assetValues).then((assetResponse) => {
      return query(dependencyText, dependencyValues).then((depResponse) => {
        res.send({
          success: true,
          status: 200,
          requestNumber: requestNumber
        });
      });
    });
  }

  if ( postArr[1] !== null && postArr[2] === null ) {
    buildTextAndValues(postArr[1], null);
    query(assetText, assetValues).then((assetResponse) => {
      console.log("Asset Response: " + assetResponse);
      res.send({
        success: true,
        status: 200,
        requestNumber: requestNumber
      });
    }).catch((err) => {
      res.send(err);
    });
  }

  if ( postArr[1] === null && postArr[2] !== null ) {
    buildTextAndValues(null, postArr[2]);
    query(dependencyText, dependencyValues).then((depResponse) => {
      console.log("Dep Response: " + depResponse);
      res.send({
        success: true,
        status: 200,
        requestNumber: requestNumber
      });
    }).catch((err) => {
      res.send(err);
    });
  }

};

module.exports = postAssetOrDep;