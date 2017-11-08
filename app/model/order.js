var connection = require('../dbconnection');

var Order = {
	getAllOrder: function(callback){
		var sql = "SELECT * FROM orders JOIN order_product ON orders.id = order_product.id_order JOIN product ON order_product.id_product = product.id";
		return connection.query(sql, callback);
	},

	getOrderById: function(id, callback){
		var sql = "SELECT * FROM orders JOIN order_product ON orders.id = order_product.id_order JOIN product ON order_product.id_product = product.id WHERE orders.id=$1";
		return connection.query(sql, [id], callback);
	},

	updateStatusOrder: function(id, status, callback){
		var sql = "UPDATE orders SET status = $1 WHERE id = $2";
		return connection.query(sql, [status, id], callback);
	},

	insertOrder: function(req, callback){
		var sql = "INSERT INTO orders (id_user, id_coupon, status, total_price) VALUES ($1,$2,$3,$4) RETURNING id"
		return connection.query(sql, [req.id_user, req.id_coupon, req.status, req.total_price], callback);
	},

};	

module.exports = Order;