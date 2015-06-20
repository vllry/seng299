var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var BookingSchema = new Schema({

	booking_id: { type: String, index: { unique: true }},
	booked_by: { type: String, required: true},
	start_time: { type: Date},
	end_time: { type: Date},
	room_id: { type: String, required: true},
	projector_used: Number,
	laptop_used: Number

});

module.export = mongoose.model('Booking', BookingSchema);