const db = require('../db/index');

const getAssetData = (req, res) => {
  let assetId = req.body.postData;
  const text = `SELECT * FROM asset_table WHERE asset_id = $1`;
  const values = [assetId];

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