var Utils = {
	_makeOrderJson : function(data){
		var result = [];
		for(var i=0; i<data.length; i++){
			var order = {};
			var product = {};
			
			product['id_product'] = data[i].id_product;
			product['name'] = data[i].name;
			product['total'] = data[i].total;
			product['price'] = data[i].price;

			var or = result.find(function(res){
				return res['id'] == data[i].id_order
			});
			
			if(or === undefined){
				var arr_product = [];
				arr_product.push(product)
				order['id'] = data[i].id_order;
				order['id_coupon'] = data[i].id_coupon;
				order['id_user'] = data[i].id_user;
				order['status'] = data[i].status;
				order['product'] = arr_product;
				order['total_price'] = data[i].total_price;
				result.push(order);
			} else {
				var arr_product = or['product'];
				arr_product.push(product);
				or['product'] = arr_product;
			}
				
		}
		return result;
	},

	_makeOrderByIdJson : function(data){
		var order = {};
		var arr_product = [];
		if(data.length != 0) {
			order['id'] = data[0].id_order;
			order['id_coupon'] = data[0].id_coupon;
			order['id_user'] = data[0].id_user;
			order['status'] = data[0].status;
			order['product'] = arr_product;
			order['total_price'] = data[0].total_price;
			order['product'] = arr_product;

			for(var i=0; i<data.length; i++){		
				var product = {};
				
				product['id_product'] = data[i].id_product;
				product['name'] = data[i].name;
				product['total'] = data[i].total;
				product['price'] = data[i].price;

				arr_product = order['product'];
				arr_product.push(product)			
			}
		}
		
		return order;
	},

	_calculatePrice : function(data){
		var sum = 0;
		for(var i=0; i<data.length; i++){
			sum += data[i].total * data[i].price;
		}
		return sum;
	},

	_generateOrderProduct: function(id, data){
		var result = [];
		for(var i=0; i<data.length; i++){
			var arr_result = [];
			arr_result.push(id);
			arr_result.push(data[i].id_product);
			arr_result.push(data[i].total);
			result.push(arr_result)
		}
		return result;
	},

	_generateUpdateProducts: function(data){
		var result = [];
		for(var i=0; i<data.length; i++){
			var obj = {};
			obj['id'] = data[i].id_product;
			obj['quantity'] = data[i].quantity - data[i].total;
			result.push(obj);
		}
		return result;
		
	}
};

module.exports = Utils;
