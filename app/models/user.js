var mongoose = require('mongoose');

var booking = require('./booking');

var Schema = mongoose.Schema;

var UserSchema = new Schema({

	user_id: { type: String, required: true, index: { unique: true }},
	user_password: { type: String, required: true, select: false},
	name_first: String,
	name_last: String,
	user_type: Number,
	department: Number,
	admin_status: Boolean,
	booking_restriction: Date,
	booking_list:[booking]

});

module.export = mongoose.model('User', UserSchema);