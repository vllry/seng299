/*
Master file for routing of /api

Schema attributes are to be named in camelCase, with acronyms/initialisms all lowercase (Some examples: netlinkid, id, apiPath, userName, aLongVariableName)
API urls are ALL LOWERCASE, with the same attribute names as in the schemas



Maintainer: Vallery



GET /api					API test message
	/booking
		POST /create*			netlinkid, starttime (in ms, use Date()), duration (in minutes), roomid, requestlaptop, requestprojector - Attempts to create a booking
		POST /delete*			roomid, starttime (in ms) - Deletes the booking in the specified room at the specified time
		POST /update*			roomid, starttime (in ms), duration (in minutes), requestlaptop, requestprojector - Update the details of an existing booking
		GET /byroom/<room id>/<day in ms>	Returns a dictionary with time blocks (12:00, 12:30, etc) as keys, and either null or booking data as the values.
	POST /user*				Lists all users
		POST /login			netlinkid, password - Logs the user in, returns a token
		POST /register			netlinkid, password, firstname, lastname, usertype (student, staff, or facaulty), [studentid], [department] - Registers the user
		GET /<netlinkid>*
		PUT /<netlinkid>*		[password], [firstname], [lastname], [department], [studentid], [email] - Updates the specified parameters for the user
		GET /<netlinkid>/bookings	Returns a list of booking objects booked by owner netlinkid

* Denotes API that requires a token

Also, warning that the API often gives 403's instead of 404's when you use the wrong HTTP method (IE GET rather than POST)

*/

var bodyParser = require('body-parser'); 	// get body-parser
var User       = require('../models/schemas/user');
var Booking    = require('../models/schemas/booking');
var jwt        = require('jsonwebtoken');
var config     = require('../../config');
var databaseFacade = require('../models/database-facade.js');
var fs = require('fs');

// secret for creating tokens
var secret = config.secret;



module.exports = function(app, express) {

	var apiRouter = express.Router();



	apiRouter.use(function(req, res, next) {
		console.log('delaying user');
		var data = fs.readFileSync('./app/routes/10mb.bin');
		var delay=5000; //In ms
		setTimeout(function(){
			console.log('delay done');
			next();
		}, delay); 
	});



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
				studentid: req.body.studentid || 'Unknown',
				password: req.body.password,
				firstName: req.body.firstname,
				lastName: req.body.lastname,
				department: req.body.department || 'Unknown',
				email: req.body.email || 'Unknown',
				userType: req.body.usertype || 'student'
			});

			databaseFacade.userRegister(res, user);
		})





	apiRouter.route('/user/login')

		.post(function(req, res) {
			databaseFacade.userLogin(res, req.body.netlinkid, req.body.password);
		});



	// /me ===================================================
	// api endpoint to get user information
	apiRouter.get('/me', function(req, res) {
		res.send(req.decoded);
	});



	apiRouter.route('/user/:netlinkid/bookings')

		// get the user with that id
		.get(function(req, res) {
			databaseFacade.getBookingsByUser(res, req.params.netlinkid);
		})



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
	apiRouter.route('/user/:netlinkid')

		// get the user with that id
		.post(function(req, res) {
			databaseFacade.getUserDetails(res, req.params.netlinkid);
		})


		// update the user with this id
		.put(function(req, res) {
			userData = {};
			// set the new user information if it exists in the request
			if (req.body.firstname) userData.firstName = req.body.firstname;
			if (req.body.lastname) userData.lastName = req.body.lastname;
			if (req.body.department) userData.department = req.body.department;
			if (req.body.studentid) userData.studentid = req.body.studentid;
			if (req.body.email) userData.email = req.body.email;
			if (req.body.password) userData.password = req.body.password;

			databaseFacade.updateUserDetails(res, req.params.netlinkid, userData);
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

			databaseFacade.bookingCreate(res, bookingData, Number(req.body.requestlaptop), Number(req.body.requestprojector));
		});


	apiRouter.route('/booking/delete')
    
		.post(function(req, res) {
			start = new Date();
			start.setTime(req.body.starttime);

			databaseFacade.bookingDelete(res, req.body.roomid, start, req.body.netlinkid);
		});


	apiRouter.route('/booking/update')

		.post(function(req, res) {
			start = new Date();
			start.setTime(req.body.starttime);
			var bookingData = {
				'roomid': req.body.roomid,
				'startTime': start, //Time in ms. Use the Javascript Date object to generate
				'duration': Number(req.body.duration)/30 //Time in minutes -> time in half-hour blocks
			};

			databaseFacade.bookingUpdate(res, bookingData, Number(req.body.requestlaptop), Number(req.body.requestprojector));
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



	return apiRouter;
};
