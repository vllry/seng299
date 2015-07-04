var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
//var bcrypt 		 = require('bcrypt-nodejs');

// study room schema 
var EquipmentSchema   = new Schema({
	id: { type: Number, index: { unique: true }},
	type: String,
	availability: [String]
});

// return the model
module.exports = mongoose.model('Equipment', EquipmentSchema);
