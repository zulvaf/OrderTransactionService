var connection = require('../dbconnection');
var Utils = require('../utils');

var Product = {
	getAllProduct: function(callback){
		var sql = "SELECT * FROM product"
		return connection.query(sql, callback)
	},

	getQuantity: function(id, callback){
		var sql = "SELECT quantity FROM product WHERE id=$1"
		return connection.query(sql, [id], callback)
	},

	decreaseProduct: function(req, callback){
		var sql = Utils._generateProductStatement(req);
		return connection.query(sql, callback)
	},

};	

module.exports = Product;