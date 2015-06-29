var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
//var bcrypt 		 = require('bcrypt-nodejs');

// booking schema 
var BookingSchema   = new Schema({
	//id: { type: String, index: { unique: true }},
	// bookedBy: { type: String, required: true, select: true },
	bookedBy: { type: Schema.Types.ObjectId, ref: 'User', select: true },
	// startTime: { type: Date, required: true },
	startTime: { type: Date, default: Date.now },
	duration: Number,
	roomId: { type: String, required: true },
	projectorId: Number,
	laptopId: Number
});

BookingSchema.index({ roomId: 1, startTime: 1}, { unique: true });


// return the model
module.exports = mongoose.model('Booking', BookingSchema);
