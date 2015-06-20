var express = require('express'),
	morgan = require('morgan'),
	bodyParser = require('body-parser'),
	mongoose = require('mongoose')
	path = require('path'),
	cons = require('consolidate');

var user = require('./application/models/user'), // store user schema
	booking = require('./application/models/booking'), // store booking schema
	equipment = require('./application/models/equipment'), // store equipment schema
	studyRoom = require('./application/models/studyRoom'); // store studyRoom schema



var app = express();

app.use(bodyParser.urlencoded({extended: true }));
app.use(bodyParser.json());
app.use(morgan('dev')); // log all the requests
app.use(express.static(path.join(__dirname, 'public')));

app.engine('html', cons.swig);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');



var routes = require('./routes/index');
var users = require('./routes/users');
app.use('/', routes);
app.use('/users', users);


app.use('/static', express.static(__dirname + '/views/static'));


module.exports = app;