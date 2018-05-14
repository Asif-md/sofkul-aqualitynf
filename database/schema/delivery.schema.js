
//schema for delivery
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
exports.deliverySchema = new Schema({
    id: String,
    invoice_id : String,
    recent_id: String,
    customer_id: String,
    invoice_number: String, 
    transport: String,
   // po_number : String,
   // payment_due_date: String,
   // amount_due: Number,
    //qty: Number,
    status: String,
    //total: Number,
    //discount: Number,
   // disc: Number,
  //  paid_date: String,
  //  amount_partially_paid: [{ date: Date, amount: Number }],
    created_on : String,
    productList: [String],
    productList2: [{ id: String, name:String, rate: String, qty : String, hsn_code: String }],
    type: String,
    delivery_created_date: { type: Date, default: Date.now },
    remarks : String,
    tnc : String,
    normalized: String,
    //name : String,
    taxPercent : Number,
    tax : Number,
    subTotal: Number,
    grantTotal : Number,
    vdate : { type: Date}
});
