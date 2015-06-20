var express = require('express'),
	morgan = require('morgan'),
	bodyParser = require('body-parser'),
	mongoose = require('mongoose');

var config = require('./config'), // store info about database, port  
	user = require('./app/models/user'), // store user schema
	booking = require('./app/models/booking'), // store booking schema
	equipment = require('./app/models/equipment'), // store equipment schema
	studyRoom = require('./app/models/studyRoom'); // store studyRoom schema

var app = express();

mongoose.connect(config.database, function(err) {
	if(err) {
		console.log(err);
	} else {
		console.log('Connecting to the database ...');
	}
});

app.use(bodyParser.urlencoded({extended: true }));
app.use(bodyParser.json());
app.use(morgan('dev')); // log all the requests

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/public/views/index.html');
});

app.listen(config.port, function(err) {
	if(err) {
		console.log(err);
	} else {
		console.log("Server is running on port " + config.port + " ...");
	}
});

