var mongoose = require('mongoose'),
	bcrypt = require('bcrypt-nodejs'); // for password hashing

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

UserSchema.pre('save', function(next) {

	var user = this;
	if(!user.isModified('user_password')) return next();
	bcrypt.hash(user.user_password, null, null, function(err, hash) {
		if(err) return next(err);
		user.user_password = hash;
		next();
	});

});

module.export = mongoose.model('User', UserSchema);