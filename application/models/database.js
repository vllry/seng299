var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var EquipmentSchema = new Schema({
	device_id: { type: String, index: { unique: true }},
	device_type: String
});

var Model = mongoose.model('Equipment', EquipmentSchema);

mongoose.connect('mongodb://admin:123123@ds047722.mongolab.com:47722/library_booking');
var db = mongoose.connection;
var dbCollection = db.collections;
