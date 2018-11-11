const db = require('../db/index');

const postAssetForm = (req, res) => {
  console.log("Initiating request to post asset form data");
  let formData = req.body.postData;
  console.log(formData);
  let requestNumber = formData.requestNumber;
  let columns = '';
  let text = '';
  let values = [];

  values.push(formData.assetId);

  const buildQuery = () => {
    let copy = Object.assign({}, formData);
    delete copy.assetId;
    delete copy.assetName;
    delete copy.requestNumber;
    let propArray = Object.keys(copy);
    let propLen = propArray.length;
    let i = 1;
    
    propArray.forEach((prop) => {
      if ( prop !== "assetId" && prop !== "assetName" && prop !== "assetNumber" && i < propLen ) {
        if ( Array.isArray(copy[prop]) ) {
          let newStr = copy[prop].toString();
          let newValue = `{${newStr}}`;
          columns = columns + prop + ' = ' + '$' + (i+1) + ', ';
          values.push(newValue);
        } else {
          columns = columns + prop + ' = ' + '$' + (i+1) + ', ';
          values.push(copy[prop]);
        }
        
      }
      if ( prop !== "assetId" && prop !== "assetName" && prop !== "requestNumber" && i === propLen ) {
        if ( Array.isArray(copy[prop]) ) {
          let newStr = copy[prop].toString();
          let newValue = `{${newStr}}`;
          columns = columns + prop + ' = ' + '$' + (i+1) + ', ';
          values.push(newValue);
        } else {
          columns = columns + prop + ' = ' + '$' + (i+1);
          values.push(copy[prop]);
        }
      }
      i++;
    });
    text = 'UPDATE asset_table SET ' + columns + ' WHERE asset_id = $1';
  };

  buildQuery();
  
  db.query(text, values, (err, response) => {
    if (err) {
      res.send({
        error: "There was an error posting form data to the db.",
        responseCode: 400,
        requestNumber: requestNumber,
        success: false
      });
    } else {
      console.log("Request successful!");
      res.send({
        success: true,
        status: 200,
        requestNumber: requestNumber
      });
    }
   // db.end();
  });
};

module.exports = postAssetForm;