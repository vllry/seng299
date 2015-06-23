/* Run server & Connect to database */

var mongoose = require('mongoose');

var app = require('./app'),
  config = require('./application/models/config'); // get database, port info


/*mongoose.connect(config.database, function(err) {
  if(err) {
    console.log(err);
  } else {
    console.log('Connecting to the database ...');
  }
});*/


app.listen(config.port, function(err) {
  if(err) {
    console.log(err);
  } else {
    console.log("Server is running on port " + config.port + " ...");
  }
});

var uriUtil = require('mongodb-uri');
var options = { server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } }, 
                replset: { socketOptions: { keepAlive: 1, connectTimeoutMS : 30000 } } }; 

var mongodbUri = 'mongodb://admin:123123@ds047722.mongolab.com:47722/library_booking';
var mongooseUri = uriUtil.formatMongoose(mongodbUri);

mongoose.connect(mongooseUri, options);

var db = mongoose.connection;
var collection = db.collection("bookings");
  // Insert a single document
  collection.insert({hello:'world_no_safe'});
/*db.open(function(err, db) {
  var collection = db.collection("bookings");
  // Insert a single document
  collection.insert({hello:'world_no_safe'});
 });*/

