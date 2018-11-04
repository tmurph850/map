const db = require('../db/index');

const newLogin = (req, res) => {
  let userEmail = req.body.email;
  let userPassword = req.body.password;
  const text = `SELECT * FROM users_table WHERE LOWER(user_email) = LOWER($1)`;
  const values = [userEmail];

  db.query(text, values, (err, response) => {
    if (err) {
      res.send({
          error: "There was an error querying the DB for application data.",
          responseCode: 400
      });
    } else {
      let userObj = response.rows[0];
      if ( userPassword === userObj.user_password ) {
        res.send({
          code: 200,
          status: "success"
        });
      } else {
        res.send({
          code: 400,
          status: "Incorrect Password"
        });
      }
    }
   // db.end();
  });
};

module.exports = newLogin;