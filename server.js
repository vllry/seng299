var express = require('express'),
	morgan = require('morgan'),
	bodyParser = require('body-parser'),
	config = require('./config'),
	mongoose = require('mongoose');

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

