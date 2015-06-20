var mongoose = require('mongoose');

var booking = require('./booking');

var Schema = mongoose.Schema;

var StudyRoomSchema = new Schema({

	room_id: { type: String, index: { unique: true }},
	room_capacity: { type: Number, require: true},
	room_location: { type: String},
	room_details: [String],
	booking_list: [booking]

});

module.export = mongoose.model('StudyRoom', StudyRoomSchema);