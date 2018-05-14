
//schema for invoice
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
exports.invoiceSchema = new Schema({
    id: String,
    recent_id: String,
    customer_id: String,
    invoice_number: String,
    po_number : String,
    payment_due_date: String,
    amount_due: Number,
    vdate: { type: Date },
    //qty: Number,
    status: String, 
    total: Number,
    //discount: Number,
    disc: Number,
    paid_date: String,
    amount_partially_paid: [{ date: Date, amount: Number }],
    productList: [String],
    productList2: [{ id: String, name:String, rate: String, qty : String, hsn_code: String }],
    type: String,
    created_on: { type: Date, default: Date.now },
    remarks : String,
    tnc : String,
    normalized: String,
    //name : String,
    taxPercent : Number,
    tax : Number,
    subTotal: Number,
    grantTotal : Number,
   // cost: Number,
});
