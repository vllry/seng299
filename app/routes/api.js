/*
Master file for routing of /api

Schema attributes are to be named in camelCase, with acronyms/initialisms all lowercase (Some examples: netlinkid, id, apiPath, userName, aLongVariableName)
API urls are ALL LOWERCASE, with the same attribute names as in the schemas



Maintainer: Vallery
Maintainer: Frances
Note to editors of this file: Please LOOK AT THE SCHEMAS in app/models/schemas before referring to them! Mongo may not give an error if you use the wrong name, and it can mess up the database.



GET /api					API test message
	GET /booking
		POST /create*			netlinkid, starttime (in ms, use Date()), duration (in minutes), roomid - Attempts to create a booking
		GET /byroom/<room id>/<day in ms>	Returns a dictionary with time blocks (12:00, 12:30, etc) as keys, and either null or booking data as the values.
	POST /user*				Lists all users
		POST /login			netlinkid, password - Logs the user in, returns a token
		POST /register			netlinkid, password, firstname, lastname, usertype (student, staff, or facaulty), [studentid], [department] - Registers the user
		POST /<netlinkid>*

* Denotes API that requires a token
Also, warning that the API often gives 403's instead of 404's when you use the wrong HTTP method (IE GET /user rather than POST /user)


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
		res.json({ success : true, message: 'The API is running' });	
	});



	apiRouter.route('/booking/id/:booking_id')

		// get the booking with that id
		.get(function(req, res) {
			Booking.findById(req.params.booking_id, function(err, booking) {
				if (err) res.send(err);

				// return that booking
				res.json(booking);
			});
		});



	apiRouter.route('/booking/byroom/:roomid/:dayInms')

		// get the booking with that id
		.get(function(req, res) {
			databaseFacade.scheduleByRoomAndDay(req.params.roomid, Number(req.params.dayInms), function(schedule) {
				res.json(schedule);
			});
		});



	// /user =========================================================


	apiRouter.route('/user/register')

		// create a user (accessed at POST /user/register)
		.post(function(req, res) {
			var user = new User({
				netlinkid: req.body.netlinkid,
				studentid: req.body.studentid,
				password: req.body.password,
				firstName: req.body.firstname,
				lastName: req.body.lastname,
				department: req.body.department,
				userType: req.body.usertype
			});

			databaseFacade.userRegister(res, user);
		})





	apiRouter.route('/user/login')

		.post(function(req, res) {
			databaseFacade.userLogin(res, req.body.netlinkid, req.body.password);
		});




	// user authentication middleware
	// Anything  BELOW THIS POINT requires a token to access
	apiRouter.use(function(req, res, next) {
        //console.log("Somebody just came to our app!");
        var token = req.body.token || req.param('token') || req.headers['x-access-token'];
        if(token) {
            jwt.verify(token, secret, function(err, decoded) {
                if(err) {
                    res.status(403).send({ success: false, message: "Token not valid"});
                } else {
                    req.decoded = decoded;
                    next();
                }
            });
        } else {
            res.status(403).send({ success: false, message: "No token provided"});
        }
    });



	// on routes that end in /user
	// ----------------------------------------------------
	apiRouter.route('/user')

		 // get all the users (accessed at GET http://localhost:8080/api/user)
		.post(function(req, res) {
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
				if (req.body.id) user.netlinkid = req.body.id;
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
	
	// on routes that end in /booking/create
	// ----------------------------------------------------
	//create booking
    apiRouter.route('/booking/create')
    
		.post(function(req, res) {
			start = new Date();
			start.setTime(req.body.starttime);
			var bookingData = {
				bookedBy: req.body.netlinkid,
				startTime: start, //Time in ms. Use the Javascript Date object to generate
				duration: Number(req.body.duration)/30, //Time in minutes -> time in half-hour blocks
				roomid: req.body.roomid
            };

		databaseFacade.bookingCreate(res, bookingData);
        });


    apiRouter.route('/booking/byuser')
		.get(function(req, res) {
            Booking.find({ netlinkid: req.decoded.netlinkid }, function(err, bookings) {
                if(err) {
                    res.send(err);
                    return;
                }
                res.json(bookings);
            });
        });

    


    // on routes that end in /booking/:booking_id
	// ----------------------------------------------------
	apiRouter.route('/booking/id/:booking_id')

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

		// delete the booking with this id
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
