/*
Facade for interacting with the database.

Maintainer: Vallery
*/

var config			= require('../../config');
var schemaUser       = require('./schemas/user');
var schemaBooking       = require('./schemas/booking');

var jwt				= require('jsonwebtoken');



//Callback function for sending results from mongo operation
// res is the express resource, err is the error callback value, responses is an array of possible error responses, and success is the response if there is no error.
function mongoCallback(res, err, responses, success) {
	if (err) {
		for (var key in responses) {
			if (key == err.code) {
				res.json(responses[key]);
				return;
			}
		}
		res.send(err); //catchall
		//console.log("Unexpected mongo error");
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



exports.bookingCreate = function(res, booking) {
	//Check that the time is valid
	dayOfWeek = booking.startTime.getDay();
	var earliest = 8; //Earliest weekday time is 8:00 am
	var latest = 22;
	if (dayOfWeek == 0 || dayOfWeek == 6) {
		earliest = 11;
		latest = 18;
	}
	var hour = booking.startTime.getHour()
	if (hour < earliest || hour + (duration/2) > latest) {
		//err
	}

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
