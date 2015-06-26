var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
//var bcrypt 		 = require('bcrypt-nodejs');

// booking schema 
var BookingSchema   = new Schema({
	//id: { type: String, index: { unique: true }},
	bookedBy: { type: String, required: true },
	startTime: { type: Date, required: true },
	duration: Number,
	roomId: { type: String, required: true },
	projectorId: Number,
	laptopId: Number
});

BookingSchema.index({ roomId: 1, startTime: 1}, { unique: true });


// return the model
module.exports = mongoose.model('Booking', BookingSchema);
