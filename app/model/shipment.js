var connection = require('../dbconnection');

var Shipment = {
	getAllShipment: function(callback){
		var sql = "SELECT * FROM `shipment` JOIN `order` ON order.id = shipment.id_order";
		return connection.query(sql, callback);
	},

	getShipmentById: function(id, callback){
		var sql = "SELECT * FROM `shipment` JOIN `order` ON order.id = shipment.id_order WHERE shipment.id=?";
		return connection.query(sql, [id], callback);
	},

	getShipmentByOrderId: function(id, callback){
		var sql = "SELECT * FROM `shipment` JOIN `order` ON order.id = shipment.id_order WHERE shipment.id_order=?";
		return connection.query(sql, [id], callback);
	},

	insertShipment: function(req, callback){
		var sql = "INSERT INTO `shipment` (id_order, shipment_status, operator) VALUES (?,?,?)"
		return connection.query(sql, [req.id_order, req.shipment_status, req.operator], callback);
	},

};	

module.exports = Shipment;