var express = require('express');
var moment = require('moment');
var router = express.Router();
var Utils = require('../utils')
var Order = require('../app/model/order');
var Coupon = require('../app/model/coupon');
var Product = require('../app/model/product');
var OrderProduct = require('../app/model/order_product');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


/* ORDER API */
router.route('/order')
.get(function(req, res, next) {
	Order.getAllOrder(function(err,result){
		if (err) res.status(400).send(err);
    	res.send({"status": 200, "error": null, "response": Utils._makeOrderJson(result)});
	})
})
.post(function(req,res,next){
	if(req.body.id_user === undefined || req.body.products === undefined || req.body.name === undefined || req.body.phone_number === undefined || req.body.email === undefined || req.body.address === undefined)
		return res.send({"status": 400, "error": "Data not completed"});
	//Check if customer applied coupon
	if(req.body.id_coupon !== undefined && req.body.id_coupon !== null){
		Coupon.getQuantityDate(req.body.id_coupon, function(err,result){		
			//Check if coupon valid
			var now = moment();
			if(result[0].quantity > 0 && moment(result[0].date_started).isBefore(now) && moment(result[0].date_ended).isAfter(now)){
				
				//Check product quantity
				Product.getAllProduct(function(err,result){
					var products = req.body.products;
					for(var i=0; i<products.length; i++){
						var pr = result.find(function(res){
							return res['id'] == products[i].id_product;
						});
						if(products[i].total > pr.quantity){
							return res.send({"status": 400, "error": "Product ordered exceed quantity"});
						} else {
							products[i]['price'] = pr.price;
							products[i]['quantity'] = pr.quantity;
						}
					}

					//Insert Order
					req.body.status = "Submitted";
					req.body.total_price = Utils._calculatePrice(products);
					Order.insertOrder(req.body, function(err,result){
						if (err) return res.status(400).send(err);
						
						//Insert Order-Product
						var arr_op = Utils._generateOrderProduct(result.insertId, products);
						OrderProduct.insertOrderProduct(arr_op, function(err,result){
							if (err) return res.status(400).send(err);

							//Decrease coupon
							Coupon.decreaseCoupon(req.body.id_coupon, function(err,result){
								if (err) return res.status(400).send(err);

								//Decrease product
								var arr_prod = Utils._generateUpdateProducts(products);
								Product.decreaseProduct(arr_prod, function(err, result){
									if (err) return res.status(400).send(err);
									return res.send({"status": 200, "error": null, "response": "Order Submitted"});
								})
							})

						})
						
					})
					
				})	
			}
			else
				return res.send({"status": 400, "error": "Coupon not valid"});
		})
	} else {
		Product.getAllProduct(function(err,result) {
			var products = req.body.products;
			for(var i=0; i<products.length; i++){
				var pr = result.find(function(res){
					return res['id'] == products[i].id_product;
				});
				if(products[i].total > pr.quantity){
					return res.send({"status": 400, "error": "Product ordered exceed quantity"});
				} else {
					products[i]['price'] = pr.price;
					products[i]['quantity'] = pr.quantity;
				}
			}

			//Insert Order
			req.body.status = "Submitted";
			req.body.total_price = Utils._calculatePrice(products);
			Order.insertOrder(req.body, function(err,result){
				if (err) return res.status(400).send(err);
				
				//Insert Order-Product
				var arr_op = Utils._generateOrderProduct(result.insertId, products);
				OrderProduct.insertOrderProduct(arr_op, function(err,result){
					if (err) return res.status(400).send(err);

					//Decrease product
					var arr_prod = Utils._generateUpdateProducts(products);
					Product.decreaseProduct(arr_prod, function(err, result){
						if (err) return res.status(400).send(err);
						return res.send({"status": 200, "error": null, "response": "Order Submitted"});
					})
					
				})
				
			})
			
		});
	}

});


module.exports = router;
