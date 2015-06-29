/*
Master file for routing of /api

Please LOOK AT THE SCHEMAS in app/models/schemas before referring to them! Mongo will not give an error if you use the wrong name, and it can mess up the database.



Maintainer: Vallery
Maintainer: Frances



/api
	/user
		/login
		/register
		/<userid>
*/

var bodyParser = require('body-parser'); 	// get body-parser
var User       = require('../models/schemas/user');
var Booking    = require('../models/schemas/booking');
var jwt        = require('jsonwebtoken');
var config     = require('../../config');
var databaseFacade = require('../models/database-facade.js');

// secret for creating tokens
var secret = config.secret;

function createToken(user) {
	var token = jwt.sign({
		id: user.userid,
		/*firstName: user.firstName,
		lastName: user.lastName,
		type: user.type,
		department: user.department */
		}, secret, {
			expirtesInMinute: 1440
	});
	return token;
}

module.exports = function(app, express) {

	var apiRouter = express.Router();


	// test route to make sure everything is working 
	// accessed at GET http://localhost:8080/api
	/*
	apiRouter.get('/', function(req, res) {
		res.json({ message: 'Welcome to the User API for Lab 7' });	
	});
	*/





	// /user =========================================================

	// on routes that end in /user
	// ----------------------------------------------------
	apiRouter.route('/user')

		 // get all the users (accessed at GET http://localhost:8080/api/user)
		.get(function(req, res) {
			databaseFacade.get_users(res);
		});





	apiRouter.route('/user/register')

		// create a user (accessed at POST /user/register)
		.post(function(req, res) {
			var user = new User({
				userid: req.body.userid,
				password: req.body.password,
				/*firstName: req.body.firstname,
				lastName: req.body.lastname,
				userType: req.body.usertype,
				department: req.body.department*/
			});

			databaseFacade.register_user(res, user);
		})





	apiRouter.route('/user/login')

		.post(function(req, res) {
			User.findOne({
				userid: req.body.userid
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



	//create booking
	
    apiRouter.route('/')
    
        .post(function(req, res) {
            var booking = new Booking({
                bookedBy: req.decoded.userid,
                startTime: req.body.startTime,
                roomId: req.body.roomId
            });
            booking.save(function(err) {
                if(err) {
                    res.send(err);
                    return;
                }
                res.json({ message: "New Booking Created!" });
            });
        })
    
        .get(function(req, res) {
            Booking.find({ creator: req.decoded.userid }, function(err, bookings) {
                if(err) {
                    res.send(err);
                    return;
                }
                res.json(bookings);
            });
        })








	// on routes that end in /user/:user_id
	// ----------------------------------------------------
	apiRouter.route('/user/:user_id')

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
				if (req.body.id) user.userid = req.body.id;
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
