var User = require('../model/users');
var jwt = require('jsonwebtoken'); 

var UserController = {
	authenticate : function(req, res, next) {
		if(req.body.username == undefined || req.body.password == undefined)
			return res.status(400).send({
				'success': false, 
				'message': 'Data not completed'
			});

		User.getUserById(req.body.username, function(err, result) {
			if (err) return res.status(400).send({
				'success' : false,
				'message' : 'Bad Request'
			});

			if (result.rows.length == 0) {
				return res.status(401).send({ 
					'success': false, 
					'message': 'Authentication failed. User not found' 
				});
			} else {
			  // check if password matches
			  if (result.rows[0].password != req.body.password) {
			  	return res.status(401).send({ 
					'success': false, 
					'message': 'Authentication failed. Wrong password' 
				});

			  } else {
			    const payload = {
			      admin: result.rows[0].is_admin,
			      id_user:  result.rows[0].id
			    };
			    var token = jwt.sign(payload, process.env.SECRET_KEY, {
			      expiresIn: '5h' // expires in 24 hours
			    });

			    return res.status(200).send({ 
					'success': true, 
					'token': token 
				});
			  }   
			}
		});
	},

	validate: function(req, res, next) {
		var token = req.body.token || req.query.token || req.headers['x-access-token'];

		if (token) {
			jwt.verify(token, process.env.SECRET_KEY, function(err, decoded) {      
				if (err) {
					return res.status(401).send({ 
						'success': false, 
						'message': 'Failed to authenticate token' 
					});    
				} else {
					req.decoded = decoded; 
					next();
				}
			});

		} else {
			return res.status(401).send({ 
				'success': false, 
				'message': 'No token provided.' 
			});
		}
	}
}

module.exports = UserController