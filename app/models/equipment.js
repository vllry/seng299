var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var EquipmentSchema = new Schema({

	device_id: { type: String, index: { unique: true }},
	device_id: String,
	device_availability: [String]

});

module.export = mongoose.model('Equipment', EquipmentSchema);