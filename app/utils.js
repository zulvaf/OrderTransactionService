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

	_calculatePrice : function(data, coupon){
		var sum = 0;
		for(var i=0; i<data.length; i++){
			sum += data[i].total * data[i].price;
		}
		if(coupon != 0){
			return sum - (sum * coupon);
		}
		return sum;
	},

	_generateOrderStatement : function(id, data){
		var params = [];
		var chunks = [];
		for(var i = 0; i < data.length; i++) {
		    var row = data[i];
		    var valueClause = [];
		    params.push(id);
		    valueClause.push('$' + params.length);
		    params.push(row.id_product);
		    valueClause.push('$' + params.length);
		    params.push(row.total)
		    valueClause.push('$' + params.length)
		    chunks.push('(' + valueClause.join(', ') + ')')
	  	}
	  	return {
	    	text: 'INSERT INTO order_product (id_order, id_product, total) VALUES ' + chunks.join(', '),
	    	values: params
	  	}
	},

	_generateProductStatement: function(data) {
		var result = [];
		for(var i=0; i<data.length; i++){
			var values = [];
			values.push(data[i].id_product);
			values.push(data[i].quantity - data[i].total);
			result.push('(' + values.join(', ') + ')')
		}
		return {
			text: 'UPDATE product as p SET quantity = s.quantity FROM (VALUES' + result.join(',') + ')as s (id, quantity) WHERE p.id = s.id'
		}
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
