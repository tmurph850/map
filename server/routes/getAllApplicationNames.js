const db = require('../db/index');

const getAllApplicationNames = (req, res) => {
  db.query('SELECT application_name FROM application_table', (err, response) => {
    if (err) {
      res.send({
          error: "There was an error querying the DB for all applications.",
          responseCode: 400,
          details: err
      });
    } else {
      let appNames =[];
      response.rows.forEach(app => {
        appNames.push(app.application_name);
      });
      res.send(appNames);
    }
   // db.end();
  });
};

module.exports = getAllApplicationNames;