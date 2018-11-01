const db = require('../db/index');

const getBlades = (req, res) => {
  db.query('SELECT * FROM blade_table', (err, response) => {
    if (err) {
      res.send({
          error: "There was an error querying the DB for all assets.",
          responseCode: 400
      });
    }
    res.send(response.rows);
  });
};

module.exports = getBlades;