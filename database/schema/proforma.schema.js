
//schema for proforma
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
exports.proformaSchema = new Schema({
    id: String,
    recent_id: String,
    customer_id: String,
    payment_due_date: String,
    vdate: { type: Date },
    amount_due: Number,
    status: String, 
    total: Number,
    discount: Number,
    paid_date: String,
    amount_partially_paid: [{ date: Date, amount: Number }],
    productList: [String],
    type: String,
    created_on: { type: Date, default: Date.now },
    normalized: String,
    disc: Number,
    productList2: [{ id: String, name:String, rate: String, qty : String, hsn_code: String }],
    remarks : String,
    tnc : String,
    taxPercent : Number,
    tax : Number,
    subTotal: Number,
    grantTotal : Number
});

