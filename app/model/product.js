var connection = require('../dbconnection');
var mysql = require('mysql');

var Product = {
	getAllProduct: function(callback){
		var sql = "SELECT * FROM `product`"
		return connection.query(sql, callback)
	},

	getQuantity: function(id, callback){
		var sql = "SELECT quantity FROM product WHERE id=?"
		return connection.query(sql, [id], callback)
	},

	decreaseProduct: function(req, callback){
		var sql = '';

		req.forEach(function (item) {
		  sql += mysql.format("UPDATE `product` SET quantity = ? WHERE id = ?; ", [item.quantity, item.id]);
		});

		return connection.query(sql, callback)
	},

};	

module.exports = Product;