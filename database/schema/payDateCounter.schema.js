
//schema for invoice
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
exports.payDateCounterSchema = new Schema({
    date: { type: Date },
    invoice_id: [String],
    amount: Number
});
