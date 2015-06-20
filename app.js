var express = require('express'),
	morgan = require('morgan'),
	bodyParser = require('body-parser'),
	mongoose = require('mongoose');

var user = require('./application/models/user'), // store user schema
	booking = require('./application/models/booking'), // store booking schema
	equipment = require('./application/models/equipment'), // store equipment schema
	studyRoom = require('./application/models/studyRoom'); // store studyRoom schema

var app = express();

app.use(bodyParser.urlencoded({extended: true }));
app.use(bodyParser.json());
app.use(morgan('dev')); // log all the requests

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/public/views/index.html');
});

module.exports = app;