/* Run server & Connect to database */

var mongoose = require('mongoose');

var app = require('./app'),
	config = require('./application/models/config'); // get database, port info


mongoose.connect(config.database, function(err) {
	if(err) {
		console.log(err);
	} else {
		console.log('Connecting to the database ...');
	}
});


app.listen(config.port, function(err) {
	if(err) {
		console.log(err);
	} else {
		console.log("Server is running on port " + config.port + " ...");
	}
});

