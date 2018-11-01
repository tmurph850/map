const db = require('../db/index');
const fs = require('fs');

const getApplicationData = (req, res) => {
  let appName = req.body.postData;
  const text = `SELECT * FROM application_table WHERE LOWER(application_name) = LOWER($1)`;
  const values = [appName];

  db.query(text, values, (err, response) => {
    if (err) {
      res.send({
          error: "There was an error querying the DB for application data.",
          responseCode: 400
      });
    } else {
      //fs.appendFileSync('response.txt', JSON.stringify(response.rows[0]));
      res.send(response.rows);

    }
   // db.end();
  });
};

module.exports = getApplicationData;