var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

// booking schema 
var BookingSchema   = new Schema({
	//id: { type: String, index: { unique: true }},
	bookedBy: { type: Schema.Types.ObjectId, ref: 'User', select: true },
	startTime: { type: Date, required: true },
	duration: Number,
	roomid: { type: String, required: true },
	projectorid: Number,
	laptopid: Number
});

BookingSchema.index({ roomId: 1, startTime: 1}, { unique: true });



BookingSchema.pre('save', function(next) {
	var booking = this;

	// hash the password only if the password has been changed or user is new
	if (booking.duration > 10) {
		return next();
	}

});



// return the model
module.exports = mongoose.model('Booking', BookingSchema);
