var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

// booking schema 
var BookingSchema   = new Schema({
	//id: { type: String, index: { unique: true }},
	bookedBy: { type: Schema.Types.ObjectId, ref: 'User', select: true, required: true}, //index: true
	startTime: { type: Date, required: true },
	endTime: { type: Date, required: true },
	duration: {type: Number, min: 1, max: 6}, //Represents length of time in half-hour blocks (IE, duration:3 is 1.5 hours)
	roomid: { type: String, required: true },
	projector: String,
	laptop: String
});

BookingSchema.index({ roomid: 1, startTime: 1}, { unique: true }); 



// return the model
module.exports = mongoose.model('Booking', BookingSchema);
