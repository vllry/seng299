/*
Facade for interacting with the database.

Maintainer: Vallery
*/

var schemaUser       = require('./schemas/user');



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
		//console.log("Unexpected mongo error");
	}
	res.json(success);
}



exports.get_users = function(res) {
	schemaUser.find({}, function(err, users) {
		mongoCallback(res, err, {}, users);
	});
};



exports.register_user = function(res, user) {
	user.save(function(err) {
		var errors = {11000 : { success: false, message: 'A user with that userid already exists!'}};
		mongoCallback(res, err, errors, { message: 'User created!' });
	});
};
