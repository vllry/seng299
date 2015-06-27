/*
Facade for interacting with the database.

Maintainer: Vallery
*/

var schemaUser       = require('./schemas/user');



//Callback function for returning results from query
//Invoke with: function(err, users) {callback(res, err,users);});
function callback(res, err, data) {
	if (err) res.send(err);
	res.json(data);
}



exports.get_users = function(res) {
	schemaUser.find({}, function(err, users) {
		callback(res, err,users);
	});
};
