var connection = require('../dbconnection');

var Coupon = {
	getCouponById: function(id, callback){
		var sql = "SELECT * FROM coupon WHERE id=$1"
		return connection.query(sql, [id], callback)
	},

	decreaseCoupon: function(id, callback){
		var sql = "UPDATE coupon SET quantity = quantity - 1 WHERE id=$1"
		return connection.query(sql, [id], callback)
	},

};	

module.exports = Coupon;