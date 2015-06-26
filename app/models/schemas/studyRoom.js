var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
//var bcrypt 		 = require('bcrypt-nodejs');

// study room schema 
var StudyRoomSchema   = new Schema({
	id: { type: String, index: { unique: true }},
	capacity: { type: Number, required: true },
	location: { type: String, required: true },
	details: [String],
	//bookingList
});

// return the model
module.exports = mongoose.model('StudyRoom', StudyRoomSchema);