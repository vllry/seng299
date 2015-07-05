/*
Facade for interacting with the database.

Maintainer: Vallery
*/

var async		= require('async');
var jwt			= require('jsonwebtoken');
var mongoose		= require('mongoose');

var config		= require('../../config');
var schemaBooking	= require('./schemas/booking');
var schemaUser		= require('./schemas/user');



//Callback function for sending results from mongo operation
//res is the express resource, err is the error callback value, responses is an array of possible error responses, and success is the response if there is no error.
function mongoCallback(res, err, responses, success) {
	if (err) {
		console.log(err);
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



function getUseridFromNetlinkid(netlinkid, fn) {
	schemaUser.findOne({
		'netlinkid' : netlinkid
	}).select('_id').exec(function(err, user) {
		fn(user._id);
	});
}



function bookingValidate(bookingData, fn) {
	console.log(bookingData.roomid);
	if (!bookingData.roomid) {
		fn({'success' : false, 'message' : '\'' + bookingData.roomid + '\' is not a valid roomid'});
		return;
	}

	var durationInHalfHours = bookingData.duration;
	var hours = bookingData.startTime.getHours()
	var dayOfWeek = bookingData.startTime.getDay();
	var earliest = 8; //Earliest weekday time is 8:00 am
	var latest = 22; //Latest weekday time is 10:00 pm
	if (dayOfWeek == 0 || dayOfWeek == 6) {
		earliest = 11; //Earliest weekend time is 11:00 am
		latest = 18; //Latest weekend time is 6:00 pm
	}

	if (hours < earliest || hours + (durationInHalfHours/2) > latest) {
		fn({'success' : false, 'message' : 'Booking must be between ' + earliest.toString() + ':00 and ' + latest.toString() + ':00'});
		return;
	}

	var minutes = bookingData.startTime.getMinutes();
	if (!(minutes == 0 || minutes == 30) || bookingData.startTime.getSeconds()) {
		fn({'success' : false, 'message' : 'Booking must start on the hour or on the half hour.'});
		return;
	}

	if (!(durationInHalfHours % 1 === 0)) {
		fn({'success' : false, 'message' : 'Duration must be a multiple of 30 minutes.'});
		return;
	}
	else if (durationInHalfHours > 6) {
		fn({'success' : false, 'message' : 'No user may create a booking for longer than 3 hours.'});
		return;
	}


	//Do the checks that involve queries.
	async.parallel([
		//Check that the user has the right to book for the length they have
		function (callback) {
			if (durationInHalfHours <= 2) { //Only staff and facaulty may book for longer than an hour
				callback(null, {'success' : true});
				return;
			}
			schemaUser.findById(bookingData.bookedBy, 'userType', function(err,data) {
				if (data['userType'] == 'student') {
					callback(null, {'success' : false, 'message' : 'Students are limited to a booking length of 1 hour'});
				}
				else {
					callback(null, {'success' : true});
				}
			});
		},

		//Check that this doesn't overlap with the previous booking
		function (callback) {
			var q = schemaBooking.find({ //Get the previous booking in the same room
				'roomid' : bookingData.roomid,
				'startTime' : {$lt : bookingData.startTime}
			}).lean().sort({'startTime': -1}).limit(1);
			q.exec(function(err, data) {
				//console.log(data);
				if (data.length) {
					var start = data[0]['startTime'];
					console.log("Previous booking starts at " + start + " and has length " + data[0]['duration']);
					var durationInms = data[0]['duration'] * 30 * 60 * 1000 - 1000;
					var endOfPrevious = new Date();
					endOfPrevious.setTime(start.getTime() + durationInms);
					console.log("Previous booking ends at " + endOfPrevious);
					if (endOfPrevious > bookingData.startTime) {
						callback(null, {'success' : false, 'message' : 'The start time overlaps with the previous booking'});
						return;
					}
				}
				callback(null, {'success' : true}); //If there is no previous booking, there can't be a conflict
			});
		},

		//Check that this doesn't overlap with the next booking
		function (callback) {
			var q = schemaBooking.find({ //Get the next booking in the same room
				'roomid' : bookingData.roomid,
				'startTime' : {$gt : bookingData.startTime}
			}).lean().sort({'startTime': 1}).limit(1);
			q.exec(function(err, data) {
				//console.log(data);
				if (data.length) {
					var duration = data[0]['duration'];
					var startOfNext = data[0].startTime;
					console.log("Next booking starts at " + startOfNext);
					endOfNew = new Date();
					endOfNew.setTime(bookingData.startTime.getTime() + bookingData['duration'] * 30 * 60 * 1000 - 1000); //Start time + duration - 1 second (just in case of ms rounding issues)
					console.log("New booking ends at " + endOfNew);
					if (startOfNext < endOfNew) {
						callback(null, {'success' : false, 'message' : 'The end time overlaps with the next booking'});
						return;
					}
				}
				callback(null, {'success' : true}); //If there is no previous booking, there can't be a conflict
			});
		},
	],

	function(err, results){ //Wait until all queries finish before evaluating results
		if (!results[0]['success']) {
			fn(results[0]);
		}
		else if (!results[1]['success']) {
			fn(results[1]);
		}
		else if (!results[2]['success']) {
			fn(results[2]);
		}
		else {
			fn({'success' : true});
		}
	});

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
	getUseridFromNetlinkid(bookingData.bookedBy, function(userid) {
		bookingData.bookedBy = userid;
		bookingValidate(bookingData, function(result) {
			if (result['success']) {
				var booking = new schemaBooking(bookingData);
				booking.save(function(err) {
					var errors = {11000 : { success: false, message: 'A booking at that time already exists'}};
					mongoCallback(res, err, errors, { success : true, message: 'Booking created' });
				});
			}
			else {
				res.json(result);
			}
		});
	});
};



exports.scheduleByRoomAndDay = function(roomid, dayInms, fn) {
	console.log(dayInms);
	var dayStart = new Date();
	dayStart.setTime(dayInms);
	dayStart.setHours(0);
	dayStart.setMinutes(0);
	dayStart.setSeconds(0);
	dayStart.setMilliseconds(0);
	var dayEnd = new Date();
	dayEnd.setTime(dayStart.getTime());
	dayEnd.setDate(dayStart.getDate()+1); //TODO: account for end of month/year
	dayEnd.setTime(dayEnd.getTime()-1000);
	//console.log(dayStart);
	//console.log(dayEnd);

	schemaBookings.find({'roomid' : roomid, 'startTime' : {$lt : dayEnd, $gt : dayStart}}, function(err, bookings) {
		
	});
}



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
