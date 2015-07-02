var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

// booking schema 
var BookingSchema   = new Schema({
	//id: { type: String, index: { unique: true }},
	bookedBy: { type: Schema.Types.ObjectId, ref: 'User', select: true },
	startTime: { type: Date, required: true },
	duration: {type: Number, min: 1, max: 6}, //Represents length of time in half-hour blocks (IE, duration:3 is 1.5 hours)
	roomid: { type: String, required: true },
	projectorid: Number,
	laptopid: Number
});

BookingSchema.index({ roomId: 1, startTime: 1}, { unique: true });



/*
//Testing middleware
BookingSchema.pre('save', function (next) {
	var q = mongoose.model('Booking').find({roomid:1}).lean().sort({'startTime': -1}).limit(1);
	q.exec(function(err, data) {
		var length = parseInt(data[0]['duration']);
		console.log(length);
		if (length == 60) {
			console.log('if');
			next(new Error('beep'));
		}
	});
	next();
});*/



// return the model
module.exports = mongoose.model('Booking', BookingSchema);
