var connection = require('../dbconnection');

var Coupon = {
	getQuantityDate: function(id, callback){
		var sql = "SELECT quantity, date_started, date_ended FROM `coupon` WHERE id=?"
		return connection.query(sql, [id], callback)
	},

	decreaseCoupon: function(id, callback){
		var sql = "UPDATE `coupon` SET quantity = quantity - 1 WHERE id=?"
		return connection.query(sql, [id], callback)
	},

};	

module.exports = Coupon;