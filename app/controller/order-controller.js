var Order = require('../model/order');
var Coupon = require('../model/coupon');
var Product = require('../model/product');
var OrderProduct = require('../model/order_product');
var Utils = require('../utils');
var moment = require('moment');

var OrderController = {
	getAllOrders: function(req, res, next) {
		Order.getAllOrder(function(err,result){
			if (err) return res.status(400).send({
				'success' : false,
				'message' : 'Bad Request'
			});
	    	return res.status(200).send({
	    		'success': true, 
	    		'data': (result.rows.length == 0) ? 'Empty Data' : Utils._makeOrderJson(result.rows)
	    	});
		})
	},

	getOrderById: function(req, res, next){
		Order.getOrderById(req.params.id, function(err,result){
			if (err) return res.status(400).send({
				'success' : false,
				'message' : 'Bad Request'
			});
			return res.status(200).send({
	    		'success'	: true, 
	    		'data'		: (result.rows.length == 0) ? 'Empty Data' : Utils._makeOrderByIdJson(result.rows)
	    	});
		});
	},

	getOrderByUserId: function(req, res, next) {
		Order.getOrderByUserId(req.decoded.id_user, function(err,result){
			if (err) return res.status(400).send({
				'success' : false,
				'message' : 'Bad Request'
			});
	    	return res.status(200).send({
	    		'success'	: true, 
	    		'data'		: (result.rows.length == 0) ? 'Empty Data' : Utils._makeOrderJson(result.rows)
	    	});
		});
	},

	updateStatusOrder: function(req, res, next){
		if(req.body.status == undefined) return res.status(400).send({
			'success': false, 
			'message': 'Data not completed'
		});

		Order.updateStatusOrder(req.params.id, req.body.status, function(err,result){
			if (err) return res.status(400).send({
				'success' : false,
				'message' : 'Bad Request'
			});
	    	return res.status(201).send({
				'success': true, 
				'message': 'Status Updated'
			});
		})
	},

	insertOrder: function(req, res, next){
		if(req.body.id_user === undefined || req.body.products === undefined || req.body.name === undefined || req.body.phone_number === undefined || req.body.email === undefined || req.body.address === undefined)
			return res.status(400).send({
				'success': false, 
				'message': 'Data not completed'
			});
	
		//Check if customer applied coupon
		if(req.body.id_coupon !== undefined && req.body.id_coupon !== null){
			Coupon.getCouponById(req.body.id_coupon, function(err,result){		
				if(result.rows.length == 0)
					return res.status(400).send({
						'success': false, 
						'message': 'Id Coupon not found'
					});
				//Check if coupon valid
				var now = moment();
				if(result.rows[0].quantity > 0 && moment(result.rows[0].date_started).isBefore(now) && moment(result.rows[0].date_ended).isAfter(now)){
					var discount = result.rows[0].discount;
					
					//Check product quantity
					Product.getAllProduct(function(err,result){
						var products = req.body.products;
						for(var i=0; i<products.length; i++){
							var pr = result.rows.find(function(res){
								return res['id'] == products[i].id_product;
							});
							if(products[i].total > pr.quantity){
								return res.status(202).send({
									'success': false, 
									'message': 'Product ordered exceed quantity'
								});
							} else {
								products[i]['price'] = pr.price;
								products[i]['quantity'] = pr.quantity;
							}
						}

						//Insert Order
						req.body.status = "Submitted";
						req.body.total_price = Utils._calculatePrice(products, discount);
						Order.insertOrder(req.body, function(err,result){
							if (err) return res.status(400).send({
								'success': false, 
								'message': 'Bad Request'
							});
							
							//Insert Order-Product
							OrderProduct.insertOrderProduct(result.rows[0].id, products, function(err,result){
								if (err) return res.status(400).send({
									'success': false, 
									'message': 'Bad Request'
								});

								//Decrease coupon
								Coupon.decreaseCoupon(req.body.id_coupon, function(err,result){
									if (err) return res.status(400).send({
										'success': false, 
										'message': 'Bad Request'
									});

									//Decrease product
									Product.decreaseProduct(products, function(err, result){
										if (err) return res.status(400).send({
											'success': false, 
											'message': 'Bad Request'
										});

										return res.status(201).send({
											'success': true, 
											'message': 'Order Submitted'
										});
									})
								})
							})
						})
					})	
				}
				else {
					return res.status(202).send({
						'success': false, 
						'message': 'Coupon not valid'
					});
				}
			})
		} else {
			Product.getAllProduct(function(err,result) {
				var products = req.body.products;
				for(var i=0; i<products.length; i++){
					var pr = result.rows.find(function(res){
						return res['id'] == products[i].id_product;
					});
					if(products[i].total > pr.quantity){
						return res.status(202).send({
							'success': false, 
							'message': 'Product ordered exceed quantity'
						});
					} else {
						products[i]['price'] = pr.price;
						products[i]['quantity'] = pr.quantity;
					}
				}

				//Insert Order
				req.body.status = "Submitted";
				req.body.total_price = Utils._calculatePrice(products, 0);
				Order.insertOrder(req.body, function(err,result){
					if (err) return res.status(400).send({
						'success': false, 
						'message': 'Bad Request'
					});
					
					//Insert Order-Product
					OrderProduct.insertOrderProduct(result.rows[0].id, products, function(err,result){
						if (err) return res.status(400).send({
							'success': false, 
							'message': 'Bad Request'
						});

						//Decrease product
						Product.decreaseProduct(products, function(err, result){
							if (err) return res.status(400).send({
								'success': false, 
								'message': 'Bad Request'
							});
							return res.status(201).send({
								'success': true, 
								'message': 'Order Submitted'
							});
						})
						
					})
					
				})
				
			});
		}
	},




}

module.exports = OrderController;
