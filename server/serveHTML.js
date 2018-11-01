const express = require('express');
const http = require('http');
const path = require('path');

const app = express();

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname + '/public/index.html'));
});

app.listen(8080);
console.log("App listening on port:8080");