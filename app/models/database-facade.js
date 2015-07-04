/*
Facade for interacting with the database.

Maintainer: Vallery
*/

var jwt				= require('jsonwebtoken');
var promise			= require('bluebird');

var config			= require('../../config');
var schemaUserTest		= promise.promisifyAll(require('./schemas/user'));
var schemaUser		= require('./schemas/user');
var schemaBooking	= require('./schemas/booking');



//Callback function for sending results from mongo operation
//res is the express resource, err is the error callback value, responses is an array of possible error responses, and success is the response if there is no error.
function mongoCallback(res, err, responses, success) {
	if (err) {
		for (var key in responses) {
			if (key == err.code) {
				res.json(responses[key]);
				return;
			}
		}
		res.send(err); //catchall
		console.log("Unexpected mongo error: " + err);
		return;
	}
	res.json(success);
}



function createToken(user) {
	var token = jwt.sign(user, config.secret, {
			expiresInMinutes: 1440 //24 hours
	});
	return token;
}



function checkIfBookingAtTime(roomid, datetime) {
	schemaUser.find({}, function(err, users) {
		mongoCallback(res, err, {}, users);
	});
}



function test(user) {
	console.log('in test()');
	return schemaUser.findById(user).exec();
}



function bookingValidate(bookingData) {
	//Check that the start time is valid
	dayOfWeek = bookingData.startTime.getDay();
	var earliest = 8; //Earliest weekday time is 8:00 am
	var latest = 22; //Latest weekday time is 10:00 pm
	if (dayOfWeek == 0 || dayOfWeek == 6) {
		earliest = 11; //Earliest weekend time is 11:00 am
		latest = 18; //Latest weekend time is 6:00 pm
	}
	var durationInHalfHours = bookingData.duration;
	var hour = bookingData.startTime.getHours()
	if (hour < earliest || hour + (durationInHalfHours/2) > latest) {
		return {'success' : false, 'message' : 'Booking must be between ' + earliest.toString() + ':00 and ' + latest.toString() + ':00'}
	}
	var minutes = bookingData.startTime.getMinutes();
	if (!(minutes == 0 || minutes == 30) || bookingData.startTime.getSeconds()) {
		return {'success' : false, 'message' : 'Booking must start on the hour or on the half hour.'}
	}

	//Check that the duration is valid
	if (!(durationInHalfHours % 1 === 0)) { //If duration is not an int
		return {'success' : 'false', 'message' : 'Duration must be a multiple of 30 minutes.'}
	}
	if (durationInHalfHours > 6) {
		return {'success' : 'false', 'message' : 'No user may create a booking for longer than 3 hours.'}
	}
	else if (durationInHalfHours > 2) {
		var bookedBy = bookingData.bookedBy;     
		test(bookedBy)
			.then(function(data) {
				console.log(data);
			});
	}

	return null; //Indicates no errors
}



//Internal functions, intended for use in this file only, are above this point
//Exported functions, IE functions called by api.js, are below this point



exports.getUsers = function(res) {
	schemaUser.find({}, function(err, users) {
		mongoCallback(res, err, {}, users);
	});
};



exports.userRegister = function(res, user) {
	user.save(function(err) {
		var errors = {11000 : { success: false, message: 'A user with that netlinkid already exists'}};
		mongoCallback(res, err, errors, { success : true, message: 'User created' });
	});
};



exports.bookingCreate = function(res, bookingData) {
	var status = bookingValidate(bookingData);
	if (status) {
		res.json(status);
		return;
	}

	var booking = new schemaBooking(bookingData);
	booking.save(function(err) {
		var errors = {11000 : { success: false, message: 'A booking at that time already exists'}};
		mongoCallback(res, err, errors, { success : true, message: 'Booking created' });
	});
};



exports.userLogin = function(res,netlinkid,password) {
	console.log(netlinkid + ' is attempting to log in');
	schemaUser.findOne({
		'netlinkid': netlinkid
	}).select('password').exec(function(err, user) {
		if(err) throw err;
		if(!user) {
			res.send({ message: "User does not exist" });
		} else if (user) {
			var validPassword = user.comparePassword(password);
			if(!validPassword) {
				res.send({ message: "Invalid password" });
			} else {
				var token = createToken(user);
				res.json({
					success: true,
					message: "Logged in",
					token: token
				});
			}
		}
	});
};
