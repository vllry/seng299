var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
//var bcrypt 		 = require('bcrypt-nodejs');

// study room schema 
var EquipmentSchema   = new Schema({
	id: { type: Number, index: true },
	type: { type: String, enum: ['laptop', 'projector']} //This would be indexed if we had more types. As-is, an index isn't worth the overhead.
});

EquipmentSchema.index({ id: 1, type: 1}, { unique: true }); //Force unique ids for each type

// return the model
module.exports = mongoose.model('Equipment', EquipmentSchema);
