var Payment = require('../model/payment');
var Order = require('../model/order');

var PaymentController = {
	getAllPayment: function(req, res, next) {
		Payment.getAllPayment(function(err,result){
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

	getPaymentById: function(req, res, next){
		Payment.getPaymentById(req.params.id, function(err,result){
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

	getPaymentByOrderId: function(req, res, next){
		Payment.getPaymentByOrderId(req.query.id_order, function(err,result){
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

	insertPayment: function(req, res, next){
		if(req.body.id_order == undefined || req.body.total_payment == undefined || req.body.payment_date == undefined )
		return res.status(400).send({
			'success': false, 
			'message': 'Data not completed'
		});
	
		Payment.insertPayment(req.body, function(err,result){
			if (err) return res.status(400).send({
				'success' : false,
				'message' : 'Bad Request'
			});

			//Update status order
			var status = "Paid"
			var id_order = req.body.id_order;
			Order.updateStatusOrder(id_order, status, function(err,result){
				if (err) return res.status(400).send({
					'success' : false,
					'message' : 'Bad Request'
				});
		    	return res.status(201).send({
					'success': true, 
					'message': 'Payment Submitted'
				});
			});
		});
	}
}

module.exports = PaymentController