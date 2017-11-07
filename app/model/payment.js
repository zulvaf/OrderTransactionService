var connection = require('../dbconnection');

var Payment = {
	getAllPayment: function(callback){
		var sql = "SELECT * FROM `payment` JOIN `order` ON order.id = payment.id_order";
		return connection.query(sql, callback);
	},

	getPaymentById: function(id, callback){
		var sql = "SELECT * FROM `payment` JOIN `order` ON order.id = payment.id_order WHERE payment.id=?";
		return connection.query(sql, [id], callback);
	},

	getPaymentByOrderId: function(id, callback){
		var sql = "SELECT * FROM `payment` JOIN `order` ON order.id = payment.id_order WHERE payment.id_order=?";
		return connection.query(sql, [id], callback);
	},

	insertPayment: function(req, callback){
		var sql = "INSERT INTO `payment` (id_order, total_payment, payment_date) VALUES (?,?,?)"
		return connection.query(sql, [req.id_order, req.total_payment, req.payment_date], callback);
	},

};	

module.exports = Payment;