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
db.open(function(err, db) {
  var collection = db.collection("bookings");
  // Insert a single document
  collection.insert({hello:'world_no_safe'});
 }

/*var Db = require('mongodb').Db,
    MongoClient = require('mongodb').MongoClient,
    Server = require('mongodb').Server,
    ReplSetServers = require('mongodb').ReplSetServers,
    ObjectID = require('mongodb').ObjectID,
    Binary = require('mongodb').Binary,
    GridStore = require('mongodb').GridStore,
    Grid = require('mongodb').Grid,
    Code = require('mongodb').Code,
    //BSON = require('mongodb').pure().BSON,
    assert = require('assert');

var mongoclient = new MongoClient(new Server("ds047722.mongolab.com", 47722), {native_parser: true});
var db = new Db('test', new Server('ds047722.mongolab.com', 47722));
// Fetch a collection to insert document into
db.open(function(err, db) {
  var collection = db.collection("bookings");
  // Insert a single document
  collection.insert({hello:'world_no_safe'});

  // Wait for a second before finishing up, to ensure we have written the item to disk
  setTimeout(function() {

    // Fetch the document
    collection.findOne({hello:'world_no_safe'}, function(err, item) {
      assert.equal(null, err);
      assert.equal('world_no_safe', item.hello);
      db.close();
    })
  }, 100);
});*/