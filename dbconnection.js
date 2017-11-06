var mysql = require('mysql');

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'password',
  database : 'order_transaction',
  multipleStatements: true
});

module.exports = connection;