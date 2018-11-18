const { Pool } = require('pg');

const devHost = 'localhost';
const prodHost = 'ec2-18-214-185-132.compute-1.amazonaws.com';
const theDB = 'map';
const devPassword = 'Rajah2077$$';
const prodPassword = 'post1';

const pool = new Pool({
  user: 'postgres',
  host: prodHost,
  port: 5432,
  database: theDB,
  password: prodPassword
});

module.exports = {
  query: (text, params, callback) => {
    const start = Date.now();
    return pool.query(text, params, (err, res) => {
      const duration = Date.now() - start;
      //console.log('executed query', { text, duration });
      callback(err, res);
    });
  },
  getClient: (callback) => {
    pool.connect((err, client, done) => {
      const query = client.query.bind(client);

      // monkey patch the query method to keep track of the last query executed
      client.query = () => {
        client.lastQuery = arguments;
        client.query.apply(client, arguments);
      };

      // set a timeout of 5 seconds, after which we will log this client's last query
      const timeout = setTimeout(() => {
        console.error('A client has been checked out for more than 5 seconds!');
        console.error(`The last executed query on this client was: ${client.lastQuery}`);
      }, 5000);

      const release = (err) => {
        // call the actual 'done' method, returning this client to the pool
        done(err);

        // clear our timeout
        clearTimeout(timeout);

        // set the query method back to its old un-monkey-patched version
        client.query = query;
      };

      callback(err, client, done);
    });
  }
};

/*module.exports = {
  query: (text, params, callback) => {
    if ( pool._connected !== true ) {
      pool.connect();
    }
    pool.connect((err, client, done) => {
      if ( err ) {
        return err;
      } 
      return client.query(text, params, callback);
    });
    //return pool.query(text, params, callback);
  },
  end: () => {
    return client.release();
  }
};

module.exports = {
  query: (text, params, callback) => {
    if ( client._connected !== true ) {
      client.connect();
    }
    return client.query(text, params, callback);
  },
  end: () => {
    return client.end();
  }
};*/