const db = require('../db/index');

const postAppForm = (req, res) => {
  console.log("Initiating request to post form data");
  let formData = req.body.postData;
  let requestNumber = formData.requestNumber;
  let columns = '';
  let text = '';
  let values = [];

  values.push(formData.appId);

  const buildQuery = () => {
    let copy = Object.assign({}, formData);
    delete copy.appId;
    delete copy.appName;
    delete copy.requestNumber;
    let propArray = Object.keys(copy);
    let propLen = propArray.length;
    let i = 1;
    
    propArray.forEach((prop) => {
      if ( prop !== "appId" && prop !== "appName" && prop !== "requestNumber" && i < propLen ) {
        columns = columns + prop + ' = ' + '$' + (i+1) + ', ';
        values.push(copy[prop]);
      }
      if ( prop !== "appId" && prop !== "appName" && prop !== "requestNumber" && i === propLen ) {
        columns = columns + prop + ' = ' + '$' + (i+1);
        values.push(copy[prop]);
      }
      i++;
    });
    text = 'UPDATE application_table SET ' + columns + ' WHERE application = $1';
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

module.exports = postAppForm;