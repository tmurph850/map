const db = require('../db/index');

const getAssetData = (req, res) => {
  let assetName = req.body.postData;
  const text = `SELECT * FROM asset_table WHERE LOWER(asset_name) = LOWER($1)`;
  const values = [assetName];

  db.query(text, values, (err, response) => {
    if (err) {
      res.send({
          error: "There was an error querying the DB for application data.",
          responseCode: 400
      });
    } else {
      res.send(response.rows);
    }
   // db.end();
  });
};

module.exports = getAssetData;