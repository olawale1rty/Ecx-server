const mongoose = require('mongoose');
let ObjectId = mongoose.Schema.ObjectId;

let ecxSchema = new mongoose.Schema({
	  	// _id: mongoose.Schema.Types.ObjectId,
	  	// _id: Number,
		email: String,
		username: String,
		names: Array,
		password: String,
		phoneNumber: {
			type: Number,
			unique: true,
		},
		transactionPin: Number,
		lastlogin: Date,
		transaction: [{type: mongoose.Schema.Types.ObjectId, ref:"transaction"}]


},{timestamps: true},{collection: "user"});

module.exports = mongoose.model('ecx',ecxSchema), mongoose.set('useFindAndModify', false)