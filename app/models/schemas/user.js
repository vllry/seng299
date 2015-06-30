var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
var bcrypt 		 = require('bcrypt-nodejs');

// user schema 
var UserSchema   = new Schema({
	netlinkid: { type: String, required: true, index: { unique: true }},
	studentid: { type: String }, //Cannot require:true because not everyone is a student -> not everyone has a V-number
	password: { type: String, required: true, select: false },
	firstName: String,
	lastName: String,
	userType: Number,
	department: Number,
	adminStatus: Number,
	bookingRestriction: Date
});

// hash the password before the user is saved
UserSchema.pre('save', function(next) {
	var user = this;
	console.log(user.netlinkid);

	// hash the password only if the password has been changed or user is new
	if (!user.isModified('password')) return next();

	// generate the hash
	bcrypt.hash(user.password, null, null, function(err, hash) {
		if (err) return next(err);

		// change the password to the hashed version
		user.password = hash;
		next();
	});
});

// method to compare a given password with the database hash
UserSchema.methods.comparePassword = function(password) {
	var user = this;

	return bcrypt.compareSync(password, user.password);
};

module.exports = mongoose.model('User', UserSchema);
