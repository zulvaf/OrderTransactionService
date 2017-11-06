var connection = require('../../dbconnection');

var OrderProduct = {
	insertOrderProduct: function(req, callback){
		var sql = "INSERT INTO `order_product` (id_order, id_product, total) VALUES ?"
		return connection.query(sql, [req], callback)
	},

};	

module.exports = OrderProduct;