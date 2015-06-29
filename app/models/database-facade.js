/*
Facade for interacting with the database.

Maintainer: Vallery
*/

var config			= require('../../config');
var schemaUser       = require('./schemas/user');

var jwt				= require('jsonwebtoken');



//Callback function for sending results from mongo operation
function mongoCallback(res, err, responses, success) {
	if (err) {
		for (var key in responses) {
			if (key == err.code) {
				res.json(responses[key]);
				return;
			}
		}
		res.send(err); //catchall
		return;
		//console.log("Unexpected mongo error");
	}
	res.json(success);
}



function createToken(user) {
	var token = jwt.sign({
		id: user.userid,
		firstName: user.firstName,
		lastName: user.lastName,
		type: user.type,
		department: user.department
		}, config.secret, {
			expirtesInMinute: 1440
	});
	return token;
}





exports.getUsers = function(res) {
	schemaUser.find({}, function(err, users) {
		mongoCallback(res, err, {}, users);
	});
};



exports.userRegister = function(res, user) {
	user.save(function(err) {
		var errors = {11000 : { success: false, message: 'A user with that userid already exists!'}};
		mongoCallback(res, err, errors, { message: 'User created!' });
	});
};



exports.userLogin = function(res,userid,password) {
	schemaUser.findOne({
		'userid': userid
	}).select('password').exec(function(err, user) {
		if(err) throw err;
		if(!user) {
			res.send({ message: "User does not exist!" });
		} else if (user) {
			var validPassword = user.comparePassword(password);
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
};
