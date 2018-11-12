const db = require('../db/index');

const postAssetForm = (req, res) => {
  console.log("Initiating request to post asset form data");
  let formData = req.body.postData.newData;
  let otherData = req.body.postData;
  console.log(formData);
  let requestNumber = req.body.postData.requestNumber;
  let columns = '';
  let text = '';
  let values = [];

  values.push(otherData.assetId);

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

  const buildQuery = (dataObj) => {
    columns = '';
    text = '';
    values = [otherData.assetId];
    let copy = Object.assign({}, dataObj);
    delete copy.assetId;
    delete copy.assetName;
    delete copy.requestNumber;
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
};

module.exports = postAssetForm;