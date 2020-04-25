const mongoose = require('mongoose');
let ObjectId = mongoose.Schema.ObjectId;

let transaction = new mongoose.Schema({
		transactionLogs: Array,
		transactionDate: Date,
		saveAmount: Number,
		saveDate: Date,
		sentAmount: Number,
		sentDate: Date,
		receiverNumber: Number,
		user: {
			type: mongoose.Schema.Types.ObjectId, ref:"ecx"
		},
		totalSave: Number,
		totalSent: Number

},{timestamps: true},{collection: "transaction"});

module.exports = mongoose.model('transaction',transaction), mongoose.set('useFindAndModify', false)