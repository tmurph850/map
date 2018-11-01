const db = require('../db/index');

const getChassis = (req, res) => {
  db.query('SELECT * FROM chassis_table', (err, response) => {
    if (err) {
      res.send({
          error: "There was an error querying the DB for all chassis.",
          responseCode: 400
      });
    }
    res.send(response.rows);
  });
};

module.exports = getChassis;