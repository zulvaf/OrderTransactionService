var connection = require('../dbconnection');
var Utils = require('../utils');

var OrderProduct = {
	insertOrderProduct: function(id, req, callback){
		var sql = Utils._generateOrderStatement(id, req);		
		return connection.query(sql, callback)
	},

};	

module.exports = OrderProduct;