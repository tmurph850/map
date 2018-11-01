const db = require('../db/index');

const getAssetTypes = (req, res) => {
  db.query('SELECT * FROM asset_types_table', (err, response) => {
    if (err) {
      res.send({
          error: "There was an error querying the DB for asset types.",
          responseCode: 400,
          details: err
      });
    } else {
      let assetTypes = {};
      response.rows.forEach(asset => {
        assetTypes[asset.asset_type_id] = asset.asset_type_name;
      });
      res.send(assetTypes);
    }
   // db.end();
  });
};

module.exports = getAssetTypes;