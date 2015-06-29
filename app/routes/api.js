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
		/booking/create


Notes:
	Vallery, I moved the code around 
		/user after user authentication because I think user without logging in should not
		be able to look at the list of users

	/api
		/user (after user authentication middleware)
			/login
			/register
			/<userid>
		/booking
			/create

*/

var bodyParser = require('body-parser'); 	// get body-parser
var User       = require('../models/schemas/user');
var Booking    = require('../models/schemas/booking');
var jwt        = require('jsonwebtoken');
var config     = require('../../config');
var databaseFacade = require('../models/database-facade.js');

// secret for creating tokens
var secret = config.secret;



module.exports = function(app, express) {

	var apiRouter = express.Router();


	// test route to make sure everything is working 
	// accessed at GET http://localhost:8080/api
	apiRouter.get('/', function(req, res) {
		res.json({ message: 'Welcome to the User API for Lab 7' });	
	});





	// /user =========================================================


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

			databaseFacade.userRegister(res, user);
		})





	apiRouter.route('/user/login')

		.post(function(req, res) {
			databaseFacade.userLogin(res, req.body.userid, req.body.password);
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


	// on routes that end in /user
	// ----------------------------------------------------
	apiRouter.route('/user')

		 // get all the users (accessed at GET http://localhost:8080/api/user)
		.get(function(req, res) {
			databaseFacade.getUsers(res);
		});



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


	// /booking =========================================================


	apiRouter.route('/booking')
		.get(function(req, res) {
            Booking.find({ userid: req.decoded.userid }, function(err, bookings) {
                if(err) {
                    res.send(err);
                    return;
                }
                res.json(bookings);
            });
        });

	
	// on routes that end in /booking/create
	// ----------------------------------------------------
	//create booking
    apiRouter.route('/booking/create')
    
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
        });
    


    // on routes that end in /booking/:booking_id
	// ----------------------------------------------------
	apiRouter.route('/booking/:booking_id')

		// get the booking with that id
		.get(function(req, res) {
			Booking.findById(req.params.booking_id, function(err, booking) {
				if (err) res.send(err);

				// return that booking
				res.json(booking);
			});
		})

		// update the booking with this id
		.put(function(req, res) {
			Booking.findById(req.params.booking_id, function(err, booking) {

				if (err) res.send(err);

				// set the new booking information if it exists in the request
				if (req.body.roomId) booking.roomId = req.body.roomId;
				if (req.body.startTime) booking.startTime = req.body.startTime;

				// save the user
				booking.save(function(err) {
					if (err) res.send(err);

					// return a message
					res.json({ message: 'Booking updated!' });
				});
			});
		})

		// delete the user with this id
		.delete(function(req, res) {
			Booking.remove({
				_id: req.params.booking_id
			}, function(err, booking) {
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
