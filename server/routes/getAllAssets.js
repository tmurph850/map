const db = require('../db/index');

const getAllAssets = (req, res) => {
  db.query('SELECT * FROM asset_table', (err, response) => {
    if (err) {
      res.send({
          error: "There was an error querying the DB for all assets.",
          responseCode: 400
      });
    }
    res.send(response.rows);
  });
};

module.exports = getAllAssets;