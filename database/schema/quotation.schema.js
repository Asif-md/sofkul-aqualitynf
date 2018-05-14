
//schema for quotation
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
exports.quotationSchema = new Schema({
    id: String,
    recent_id: String,
    quotation_number : String, 
    customer_id: String,
    payment_due_date: String,
    amount_due: Number,
    status: String,
    total: Number,
    discount: Number,
    paid_date: String,
    quotedesc : String,
    amount_partially_paid: [{ date: Date, amount: Number }],
    productList: [String],
    productList2: [{ id: String, name:String, rate: String, qty : String, hsn_code: String }],
    type: String,
    created_on: { type: Date, default: Date.now },
    normalized: String,
    transport: String,
    taxPercent : Number,
    tax : Number,
    subTotal: Number,
    grantTotal : Number,
    vdate : { type: Date},
    remarks : String,
    tnc : String,
});
 
