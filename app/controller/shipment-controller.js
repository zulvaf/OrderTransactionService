var Shipment = require('../model/shipment');
var Order = require('../model/order');

var ShipmentController = {
	getAllShipment: function(req, res, next){
		Shipment.getAllShipment(function(err,result){
			if (err) return res.status(400).send({
				'success' : false,
				'message' : 'Bad Request'
			});
			return res.status(200).send({
	    		'success': true, 
	    		'data': (result.rows.length == 0) ? 'Empty Data' : result.rows
	    	});
		})
	},

	getShipmentById: function(req, res, next){
		Shipment.getShipmentById(req.params.id, function(err,result){
			if (err) return res.status(400).send({
				'success' : false,
				'message' : 'Bad Request'
			});
			return res.status(200).send({
	    		'success': true, 
	    		'data': result.rows[0] || 'Empty Data'
	    	});
		});
	},

	getShipmentByOrderId: function(req, res, next){
		Shipment.getShipmentByOrderId(req.query.id_order, function(err,result){
			if (err) return res.status(400).send({
				'success' : false,
				'message' : 'Bad Request'
			});
			return res.status(200).send({
	    		'success': true, 
	    		'data': (result.rows.length == 0) ? 'Empty Data' : result.rows
	    	});
		});
	},

	getShipmentByUserId: function(req, res, next){
		Shipment.getShipmentByUserId(req.decoded.id_user, function(err, result){
			if (err) return res.status(400).send({
				'success' : false,
				'message' : 'Bad Request'
			});
			return res.status(200).send({
	    		'success': true, 
	    		'data': (result.rows.length == 0) ? 'Empty Data' : result.rows
	    	});
		});
	},

	insertShipment: function(req, res, next){
		if(req.body.id_order == undefined || req.body.shipment_status == undefined || req.body.operator == undefined )
			return res.status(400).send({
				'success': false, 
				'message': 'Data not completed'
			});
	
		Shipment.insertShipment(req.body, function(err,result){
			if (err) return res.status(400).send({
				'success' : false,
				'message' : 'Bad Request'
			});

			//Update status order
			var status = "Shipped"
			var id_order = req.body.id_order;
			Order.updateStatusOrder(id_order, status, function(err,result){
				if (err) return res.status(400).send({
					'success' : false,
					'message' : 'Bad Request'
				});
		    	return res.status(201).send({
					'success': true, 
					'message': 'Shipment Submitted'
				});
			});
		});
	},



}

module.exports = ShipmentController