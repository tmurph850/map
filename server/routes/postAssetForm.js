const db = require('../db/index');

const postAssetForm = (req, res) => {
  console.log("Initiating request to post asset form data");
  let formData = req.body.postData.newData;
  let otherData = req.body.postData;
  let arrayUpdates =  otherData.arrayUpdates;
  console.log(formData);
  let requestNumber = req.body.postData.requestNumber;
  let columns = '';
  let text = '';
  let values = [];

  let dependencyTypes = [
    "",
    "server",
    "appliance",
    "storage_array",
    "switch",
    "vm",
    "esx_host",
    "chassis",
    "blade_server",
    "firewall"
  ];

  const query = (text, values) => {
    return new Promise((resolve, reject) => {
      db.query(text, values, (err, response) => {
        if (err) {
          console.log("Query rejected");
          reject({
              error: err,
              responseCode: 400
            });
        } else {
          console.log("Query resolved");
          resolve(response);
        }
      });
    });
  };



  const buildArrayQuery = (dataObj, oldValues) => {
    columns = '';
    text = '';
    var dependencyName = dataObj.dependencyName;
    var dbColumn = '';

    if ( dataObj.application_name ) {
      values = [dataObj.application_name];
      dbColumn = "asset_list";
    } else {
      values = [dataObj.asset_name];
      let depType = dependencyTypes[dataObj.dependencyType];
      console.log(oldValues);

      switch (depType) {
        case 'server':
        case 'blade_server':
          dbColumn = 'server_dependencies';
          break;
        case 'storage_array':
          dbColumn = 'storage_dependencies';
          break;
        case 'esx_host':
          dbColumn = 'network_dependencies';
          break;
        case 'firewall':
          dbColumn = 'firewall';
          break;
        default:
          dbColumn = 'storage_dependencies';
      }
    }

    let newArr;

    if ( Array.isArray(oldValues[dbColumn]) ) {
      newArr = oldValues[dbColumn];
    }

    if ( oldValues[dbColumn] === null || oldValues[dbColumn] === undefined ) {
      newArr = [];
    }

    if ( dataObj.added === true ) {
      if ( newArr.includes(dependencyName) !== true ) {
        newArr.push(dependencyName);
      }
    }

    if ( dataObj.removed === true ) {
      let indexOf = newArr.indexOf(dependencyName);
      newArr.splice(indexOf, 1);
    }

    let newVal = '{' + newArr.toString() + '}';

    values.push(newVal);
    if ( dataObj.application_name ) {
      text = 'UPDATE application_table SET ' + dbColumn + ' = $2 WHERE application_name = $1';
    } else {
      text = 'UPDATE asset_table SET ' + dbColumn + ' = $2 WHERE asset_name = $1';
    }
    
  };

  const buildQuery = (dataObj) => {
    columns = '';
    text = '';
    values = [otherData.assetId];
    let copy = Object.assign({}, dataObj);
    let propArray = Object.keys(copy);
    let propLen = propArray.length;
    let i = 1;
    
    propArray.forEach((prop) => {
      if ( prop !== "assetId" && prop !== "assetName" && prop !== "assetNumber" && i < propLen ) {
        if ( Array.isArray(copy[prop]) ) {
          let newStr = copy[prop].join(', ');
          let newValue = '{' + newStr + '}';
          columns = columns + prop + ' = ' + '$' + (i+1) + ', ';
          values.push(newValue);
        } else {
          columns = columns + prop + ' = ' + '$' + (i+1) + ', ';
          values.push(copy[prop]);
        }
        
      }
      if ( prop !== "assetId" && prop !== "assetName" && prop !== "requestNumber" && i === propLen ) {
        if ( Array.isArray(copy[prop]) ) {
          let newStr = copy[prop].join(', ');
          let newValue = '{' + newStr + '}';
          columns = columns + prop + ' = ' + '$' + (i+1);
          //values.push(newValue);
          values.push(newValue);
        } else {
          columns = columns + prop + ' = ' + '$' + (i+1);
          values.push(copy[prop]);
        }
      }
      i++;
    });
    text = 'UPDATE asset_table SET ' + columns + 'WHERE asset_id = $1';
  };

  const getOldVal = (updateObj) => {
    let oldText;
    let oldVals;
    if ( updateObj.application_name ) {
      let dbColumn = 'asset_list';
      oldVals = [updateObj.application_name];
      oldText = 'SELECT ' + dbColumn + ' FROM application_table WHERE application_name = $1';

    } else {
      let depType = dependencyTypes[updateObj.dependencyType];
      oldVals = [updateObj.asset_name];
      let dbColumn = '';

      switch (depType) {
        case 'server':
        case 'blade_server':
          dbColumn = 'server_dependencies';
          break;
        case 'storage_array':
          dbColumn = 'storage_dependencies';
          break;
        case 'esx_host':
          dbColumn = 'network_dependencies';
          break;
        case 'firewall':
          dbColumn = 'firewall';
          break;
        default:
          dbColumn = 'storage_dependencies';
          break;
      }

      oldText = 'SELECT ' + dbColumn + ' FROM asset_table WHERE asset_name = $1';
    }
    
    return query(oldText, oldVals);
  };

  const getChassisInfo = (chassisName) => {
    let values = [chassisName];
    let text = 'SELECT * FROM asset_table INNER JOIN chassis_table ON (asset_table.asset_id = chassis_table.asset_id) WHERE asset_table.asset_name = $1';
    return query(text, values);
  };

  const updateChassisInfo = (chassisId) => {

  };

  const queryAll = (arr) => {
    return Promise.all(arr).then(response => {
      res.send({
        success: true,
        status: 200,
        requestNumber: requestNumber
      });
    }).catch(err => {
      res.send({
        error: err,
        responseCode: 400,
        requestNumber: requestNumber,
        success: false
      });
    });
  };

  if ( otherData.needsBatch !== true ) {
    buildQuery(formData);
    query(text, values).then(response => {
      console.log("Request successful!");
      res.send({
        success: true,
        status: 200,
        requestNumber: requestNumber
      });
     // db.end();
    }).catch(err => {
      res.send({
        error: err,
        responseCode: 400,
        requestNumber: requestNumber,
        success: false
      });
    });
  } else {
    let arr = [];
    let i = 0;
    let obj = {};

    arrayUpdates.forEach(update => {
      let oldVals;
      getOldVal(update).then(response => {
        oldVals = response.rows[0];
        buildArrayQuery(update, oldVals);
        obj["query" + i] = query(text, values);
        arr.push(obj["query" + i]);
      });
      i++;
    });

    if ( otherData.isBladeData === true ) {
      let newParentName = otherData.bladeData.chassis;
      let assetId = otherData.assetId;

      let queryText = 'UPDATE blade_table SET chassis = $2 WHERE asset_id = $1';
      let queryValues = [assetId, newParentName];
      let bladeQuery = query(queryText, queryValues);
      arr.push(bladeQuery);
    }

    /*if ( otherData.isChassisData === true ) {
      
    }*/

    buildQuery(formData);
    let mainQuery = query(text, values);
    arr.push(mainQuery);

    queryAll(arr).then(response => {
      console.log(response);
    });

  }


};

module.exports = postAssetForm;