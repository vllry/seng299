var express = require('express'),
	morgan = require('morgan'),
	bodyParser = require('body-parser'),
	config = require('./config');

var app = express();

app.use(bodyParser.urlencoded({extended: true }));
app.use(bodyParser.json());
app.use(morgan('dev'));

app.listen(config.port, function(err) {
	if(err) {
		console.log(err);
	} else {
		console.log("Server is running on port " + config.port + " ...");
	}
});

