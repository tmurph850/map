const db = require('../db/index');

const getAllAssetNames = (req, res) => {
  db.query('SELECT asset_name, asset_type, asset_id FROM asset_table', (err, response) => {
    if (err) {
      res.send({
          error: "There was an error querying the DB for all applications.",
          responseCode: 400,
          details: err
      });
    } else {
      let assetNames =[];
      response.rows.forEach(asset => {
        assetNames.push(asset);
      });
      res.send(assetNames);
    }
   // db.end();
  });
};

module.exports = getAllAssetNames;