var express = require('express');
var moment = require('moment');
var router = express.Router();
var jwt = require('jsonwebtoken'); 
var Utils = require('../app/utils');
var User = require('../app/model/users');
var Order = require('../app/model/order');
var Coupon = require('../app/model/coupon');
var Product = require('../app/model/product');
var OrderProduct = require('../app/model/order_product');
var Payment = require('../app/model/payment');
var Shipment = require('../app/model/shipment');

require('dotenv').config()


router.post('/login', function(req, res, next) {
  
  if(req.body.username == undefined || req.body.password == undefined)
		return res.send({"status": 400, "error": "Data not completed"});
  // find the user	
  User.getUserById(req.body.username, function(err, result) {
    if (err) return res.status(400).send(err.toString());
    if (result.rows.length == 0) {
      return res.json({ success: false, message: 'Authentication failed. User not found.' });
    } else {
      // check if password matches
      if (result.rows[0].password != req.body.password) {
        return res.json({ success: false, message: 'Authentication failed. Wrong password.' });
      } else {
	    const payload = {
	      admin: result.rows[0].is_admin,
	      id_user:  result.rows[0].id
	    };
        var token = jwt.sign(payload, process.env.SECRET_KEY, {
          expiresIn: '1h' // expires in 24 hours
        });

        res.json({
          success: true,
          message: 'Enjoy your token!',
          token: token
        });
      }   
    }
  });
});

router.use(function(req, res, next) {
  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  if (token) {
    // verifies secret and checks exp
    jwt.verify(token, process.env.SECRET_KEY, function(err, decoded) {      
      if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token.' });    
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded; 
        console.log(req.decoded);   
        next();
      }
    });

  } else {
    return res.status(403).send({ 
        success: false, 
        message: 'No token provided.' 
    });

  }
});


/* ORDER API */
router.route('/order')
.get(function(req, res, next) {
	if(req.decoded.admin == 1){
		Order.getAllOrder(function(err,result){
			if (err) return res.status(400).send(err.toString());
	    	return res.send({"status": 200, "error": null, "data": Utils._makeOrderJson(result.rows)});
		})
	} else {
		Order.getOrderByUserId(req.decoded.id_user, function(err,result){
			if (err) return res.status(400).send(err.toString());
	    	return res.send({"status": 200, "error": null, "data": Utils._makeOrderJson(result.rows)});
		})
	}
	
})
.post(function(req,res,next){
	if(req.decoded.admin != 0){
		return res.status(403).send({"message":"You dont have permission to access"});
	}
	if(req.body.id_user === undefined || req.body.products === undefined || req.body.name === undefined || req.body.phone_number === undefined || req.body.email === undefined || req.body.address === undefined)
		return res.send({"status": 400, "error": "Data not completed"});
	//Check if customer applied coupon
	if(req.body.id_coupon !== undefined && req.body.id_coupon !== null){
		Coupon.getQuantityDate(req.body.id_coupon, function(err,result){		
			//Check if coupon valid
			var now = moment();
			if(result.rows[0].quantity > 0 && moment(result.rows[0].date_started).isBefore(now) && moment(result.rows[0].date_ended).isAfter(now)){
				
				//Check product quantity
				Product.getAllProduct(function(err,result){
					var products = req.body.products;
					for(var i=0; i<products.length; i++){
						var pr = result.rows.find(function(res){
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
						if (err) return res.status(400).send(err.toString());
						
						//Insert Order-Product
						OrderProduct.insertOrderProduct(result.rows[0].id, products, function(err,result){
							if (err) return res.status(400).send(err.toString());

							//Decrease coupon
							Coupon.decreaseCoupon(req.body.id_coupon, function(err,result){
								if (err) return res.status(400).send(err.toString());

								//Decrease product
								Product.decreaseProduct(products, function(err, result){
									if (err) return res.status(400).send(err.toString());
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
				var pr = result.rows.find(function(res){
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
				if (err) return res.status(400).send(ererr.toString());
				
				//Insert Order-Product
				OrderProduct.insertOrderProduct(result.rows[0].id, products, function(err,result){
					if (err) return res.status(400).send(err.toString());

					//Decrease product
					Product.decreaseProduct(products, function(err, result){
						if (err) return res.status(400).send(err.toString());
						return res.send({"status": 200, "error": null, "response": "Order sucessfully submitted"});
					})
					
				})
				
			})
			
		});
	}

});

router.route('/order/:id')
.get(function(req, res, next) {
	if(req.decoded.admin != 1){
		return res.status(403).send({"message":"You dont have permission to access"});
	}
	Order.getOrderById(req.params.id, function(err,result){
		if (err) return res.status(400).send(err.toString());
		else return res.send({"status": 200, "error": null, "data": Utils._makeOrderByIdJson(result.rows[0])});	
	})
})
.put(function(req, res, next) {
	if(req.body.status == undefined)
		return res.send({"status": 400, "error": "Data not completed"});

	if(req.decoded.admin != 1){
		return res.status(403).send({"message":"You dont have permission to access"});
	}
	Order.updateStatusOrder(req.params.id, req.body.status, function(err,result){
		if (err) return res.status(400).send(err.toString());
    	return res.send({"status": 200, "error": null, "response": "Status sucessfully updated"});
	})
});

/* PAYMENT API */
router.route('/payment')
.get(function(req, res, next) {
	if(req.decoded.admin != 1){
		return res.status(403).send({"message":"You dont have permission to access"});
	}
	if(req.query.id_order === undefined){
		Payment.getAllPayment(function(err,result){
			if (err) return res.status(400).send(err.toString());
			return res.send({"status": 200, "error": null, "data": result.rows});
		})
	} else {
		Payment.getPaymentByOrderId(req.query.id_order, function(err,result){
			if (err) return res.status(400).send(err.toString());
    		return res.send({"status": 200, "error": null, "data": result.rows});
		})
	}	
})
.post(function(req, res, next) {
	if(req.body.id_order == undefined || req.body.total_payment == undefined || req.body.payment_date == undefined )
		return res.send({"status": 400, "error": "Data not completed"});

	if(req.decoded.admin != 0){
		return res.status(403).send({"message":"You dont have permission to access"});
	}
	Payment.insertPayment(req.body, function(err,result){
		if (err) return res.status(400).send(err.toString());

		//Update status order
		var status = "Paid"
		var id_order = req.body.id_order;
		Order.updateStatusOrder(id_order, status, function(err,result){
			if (err) return res.status(400).send(err.toString());
	    	return res.send({"status": 200, "error": null, "response": "Payment sucessfully submitted"});
		})
	})
});

router.route('/payment/:id')
.get(function(req, res, next) {
	if(req.decoded.admin != 1){
		return res.status(403).send({"message":"You dont have permission to access"});
	}
	Payment.getPaymentById(req.params.id, function(err,result){
		if (err) return res.status(400).send(err.toString());
		return res.send({"status": 200, "error": null, "data": result.rows});
	});
});

/* SHIPMENT API */
router.route('/shipment')
.get(function(req, res, next) {
	if(req.decoded.admin != 1){
		console.log(req.decoded);
		Shipment.getShipmentByUserId(req.decoded.id_user, function(err, result){
			if (err) return res.status(400).send(err.toString());
			return res.send({"status": 200, "error": null, "data": result.rows});
		})
	} else {
		if(req.query.id_order === undefined){
			Shipment.getAllShipment(function(err,result){
				if (err) return res.status(400).send(err.toString());
				return res.send({"status": 200, "error": null, "data": result.rows});
			})
		} else {
			Shipment.getShipmentByOrderId(req.query.id_order, function(err,result){
				if (err) return res.status(400).send(err.toString());
	    		return res.send({"status": 200, "error": null, "data": result.rows});
			})
		}	
	}
	
})
.post(function(req, res, next) {
	if(req.body.id_order == undefined || req.body.shipment_status == undefined || req.body.operator == undefined )
		return res.send({"status": 400, "error": "Data not completed"});
	if(req.decoded.admin != 1){
		return res.status(403).send({"message":"You dont have permission to access"});
	}
	Shipment.insertShipment(req.body, function(err,result){
		if (err) return res.status(400).send(err.toString());

		//Update status order
		var status = "Shipped"
		var id_order = req.body.id_order;
		Order.updateStatusOrder(id_order, status, function(err,result){
			if (err) return res.status(400).send(err.toString());
	    	return res.send({"status": 200, "error": null, "response": "Shipment sucessfully submitted"});
		})
	})
});

router.route('/shipment/:id')
.get(function(req, res, next) {
	if(req.decoded.admin != 1){
		return res.status(403).send({"message":"You dont have permission to access"});
	}
	Shipment.getShipmentById(req.params.id, function(err,result){
		if (err) return res.status(400).send(err.toString());
		return res.send({"status": 200, "error": null, "data": result.rows});
	});
});


module.exports = router;