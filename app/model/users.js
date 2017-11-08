var connection = require('../dbconnection');

var User = {
	getUserById: function(name, callback){
		var sql = "SELECT * FROM users WHERE users.username=$1";
		return connection.query(sql, [name], callback);
	},

};	

module.exports = User;