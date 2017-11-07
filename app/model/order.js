var connection = require('../dbconnection');

var Order = {
	getAllOrder: function(callback){
		var sql = "SELECT * FROM `order` JOIN `order_product` ON order.id = order_product.id_order JOIN `product` ON order_product.id_product = product.id";
		return connection.query(sql, callback);
	},

	getOrderById: function(id, callback){
		var sql = "SELECT * FROM `order` JOIN `order_product` ON order.id = order_product.id_order JOIN `product` ON order_product.id_product = product.id WHERE order.id=?";
		return connection.query(sql, [id], callback);
	},

	updateStatusOrder: function(id, status, callback){
		var sql = "UPDATE `order` SET status = ? WHERE id = ?";
		return connection.query(sql, [status, id], callback);
	},

	insertOrder: function(req, callback){
		var sql = "INSERT INTO `order` (id_user, id_coupon, status, total_price) VALUES (?,?,?,?)"
		return connection.query(sql, [req.id_user, req.id_coupon, req.status, req.total_price], callback);
	},

};	

module.exports = Order;