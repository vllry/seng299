/*
Master file for routing of /api

Maintainer: Vallery
Maintainer: Frances
*/

var bodyParser = require('body-parser'); 	// get body-parser
var User       = require('../models/schemas/user');
var jwt        = require('jsonwebtoken');
var config     = require('../../config');
var databaseFacade = require('../models/database-facade.js');

// secret for creating tokens
var secret = config.secret;

function createToken(user) {
	var token = jwt.sign({
		id: user.id,
		username: user.username,
		firstName: user.firstName,
		lastName: user.lastName,
		type: user.type,
		department: user.department
		}, secret, {
			expirtesInMinute: 1440
	});
	return token;
}

module.exports = function(app, express) {

	var apiRouter = express.Router();


	// test route to make sure everything is working 
	// accessed at GET http://localhost:8080/api
	apiRouter.get('/', function(req, res) {
		res.json({ message: 'Welcome to the User API for Lab 7' });	
	});





	// /users =========================================================

	// on routes that end in /users
	// ----------------------------------------------------
	apiRouter.route('/users')

		// create a user (accessed at POST http://localhost:8080/users)
		.post(function(req, res) {
			var user = new User();		// create a new instance of the User model
			user.name = req.body.name;  // set the users name (comes from the request)
			user.username = req.body.username;  // set the users username (comes from the request)
			user.password = req.body.password;  // set the users password (comes from the request)c
			
			/*var user = new User({
				userid: req.body.id;
				password: req.body.password,
				firstName: req.body.firstName,
				lastName: req.body.lastName,
				usertype: req.body.usertype,
				department: req.body.department
			});		// create a new instance of the User model
*/

			user.save(function(err) {
				if (err) {
					// duplicate entry
					if (err.code == 11000) 
						return res.json({ success: false, message: 'A user with that username already exists. '});
					else 
						return res.send(err);
				}
				// return a message
				res.json({ message: 'User created!' });
			});
		})

		/* // get all the users (accessed at GET http://localhost:8080/api/users)
		.get(function(req, res) {
			User.find({}, function(err, users) {
				if (err) res.send(err);
				// return the users
				res.json(users);
			});
		});*/

		 // get all the users (accessed at GET http://localhost:8080/api/users)
		.get(function(req, res) {
			databaseFacade.get_users(res);
		});
		
	apiRouter.route('/users/login')
		
		
		.post(function(req, res) {
			User.findOne({
				username: req.body.username
			}).select('password').exec(function(err, user) {
				if(err) throw err;
				if(!user) {
					res.send({ message: "User does not exist!" });
				} else if (user) {
					var validPassword = user.comparePassword(req.body.password);
					if(!validPassword) {
						res.send({ message: "Invalid Password!" });
					} else {
						var token = createToken(user);
						res.json({
							success: true,
							message: "Successfully login!",
							token: token
						});
					}
				}
			});
		});


	// user authentication middleware
	apiRouter.use(function(req, res, next) {
        console.log("Somebody just came to our app!");
        var token = req.body.token || req.param('token') || req.headers['x-access-token'];
        if(token) {
            jwt.verify(token, secret, function(err, decoded) {
                if(err) {
                    res.status(403).send({ success: false, message: "Failed to authenticate user"});
                } else {
                    req.decoded = decoded;
                    next();
                }
            });
        } else {
            res.status(403).send({ success: false, message: "No Token Provided"});
        }
    });



	// on routes that end in /users/:user_id
	// ----------------------------------------------------
	apiRouter.route('/users/:user_id')

		// get the user with that id
		.get(function(req, res) {
			User.findById(req.params.user_id, function(err, user) {
				if (err) res.send(err);

				// return that user
				res.json(user);
			});
		})

		// update the user with this id
		.put(function(req, res) {
			User.findById(req.params.user_id, function(err, user) {

				if (err) res.send(err);

				// set the new user information if it exists in the request
				if (req.body.name) user.name = req.body.name;
				if (req.body.username) user.username = req.body.username;
				if (req.body.password) user.password = req.body.password;

				// save the user
				user.save(function(err) {
					if (err) res.send(err);

					// return a message
					res.json({ message: 'User updated!' });
				});
			});
		})

		// delete the user with this id
		.delete(function(req, res) {
			User.remove({
				_id: req.params.user_id
			}, function(err, user) {
				if (err) res.send(err);
				res.json({ message: 'Successfully deleted' });
			});
		});




	// /me ===================================================
	// api endpoint to get user information
	apiRouter.get('/me', function(req, res) {
		res.send(req.decoded);
	});

	return apiRouter;
};
