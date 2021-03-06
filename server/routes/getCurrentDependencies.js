const db = require('../db/index');

const getCurrentDependencies = (req, res) => {
  let appId = req.body.postData;
  const text = `SELECT * FROM appdependencies_table WHERE application = $1`;
  const values = [appId];

  db.query(text, values, (err, response) => {
    if (err) {
      res.send({
          error: "There was an error querying the DB for application dependencies.",
          responseCode: 400
      });
    } else {
      res.send(response.rows);
    }
   // db.end();
  });
};

module.exports = getCurrentDependencies;