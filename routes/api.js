var express = require('express');
var router = express.Router();
var Shipment = require('../app/model/shipment');

var UserController = require('../app/controller/user-controller');
var OrderController = require('../app/controller/order-controller');
var PaymentController = require('../app/controller/payment-controller');
var ShipmentController = require('../app/controller/shipment-controller');

require('dotenv').config()


/************* USER API **************/
router.post('/login', function(req, res, next) {  
	UserController.authenticate(req, res, next);
});

router.use(function(req, res, next) {
	UserController.validate(req, res, next);
});


/************* ORDER API **************/
router.route('/order')
.get(function(req, res, next) {
	if(req.decoded.admin == 1){
		OrderController.getAllOrders(req, res, next);
	} else {
		OrderController.getOrderByUserId(req, res, next);
	}
})
.post(function(req,res,next){
	if(req.decoded.admin != 0){
		return res.status(403).send({
			'success' 	: false,
			'message'	: 'You dont have permission to access'
		});
	}
	OrderController.insertOrder(req, res, next);
});

router.route('/order/:id')
.get(function(req, res, next) {
	if(req.decoded.admin != 1){
		return res.status(403).send({
			'success' 	: false,
			'message'	: 'You dont have permission to access'
		});
	}
	OrderController.getOrderById(req, res, next);
})
.put(function(req, res, next) {
	if(req.decoded.admin != 1){
		return res.status(403).send({
			'success' 	: false,
			'message'	: 'You dont have permission to access'
		});
	}
	OrderController.updateStatusOrder(req, res, next);
});



/************* PAYMENT API **************/
router.route('/payment')
.get(function(req, res, next) {
	if(req.decoded.admin != 1){
		return res.status(403).send({
			'success' 	: false,
			'message'	: 'You dont have permission to access'
		});
	}
	if(req.query.id_order === undefined){
		PaymentController.getAllPayment(req, res, next)
	} else {
		PaymentController.getPaymentByOrderId(req, res, next)
	}	
})
.post(function(req, res, next) {
	if(req.decoded.admin != 0){
		return res.status(403).send({
			'success' 	: false,
			'message'	: 'You dont have permission to access'
		});
	}
	PaymentController.insertPayment(req, res, next);
});

router.route('/payment/:id')
.get(function(req, res, next) {
	if(req.decoded.admin != 1){
		return res.status(403).send({
			'success' 	: false,
			'message'	: 'You dont have permission to access'
		});
	}
	PaymentController.getPaymentById(req, res, next);
});



/************* SHIPMENT API **************/
router.route('/shipment')
.get(function(req, res, next) {
	if(req.decoded.admin == 1){
		if(req.query.id_order === undefined){
			ShipmentController.getAllShipment(req, res, next);
		} else {
			ShipmentController.getShipmentByOrderId(req, res, next);
		}			
	} else {
		ShipmentController.getShipmentByUserId(req, res, next);
	}
	
})
.post(function(req, res, next) {
	if(req.decoded.admin != 1){
		return res.status(403).send({
			'success' 	: false,
			'message'	: 'You dont have permission to access'
		});
	}
	ShipmentController.insertShipment(req, res, next)
});

router.route('/shipment/:id')
.get(function(req, res, next) {
	if(req.decoded.admin != 1){
		return res.status(403).send({
			'success' 	: false,
			'message'	: 'You dont have permission to access'
		});
	}
	ShipmentController.getShipmentById(req, res, next);
});


module.exports = router;