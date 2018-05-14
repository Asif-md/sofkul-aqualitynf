
//schema for customer
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var auotoIncrement = require ('mongoose-auto-increment');

exports.customerSchema = new Schema({

    //_id : getNextSequence("invoiceid"),
    username: { type: String, unique: true, dropDups: true },
    gstno : { type: String },
    nid: { type: String },
    email: String,
    fullname: String,
    customer_currency: String,
    mobile_primary: String,
    mobile_secondary: String,
    website: String,
    country: String,
    location: String,
    ship_addr : String,
    area: String,
    city: String,
    state : String,
    description: String,
    postal_code: Number,
    status: Boolean,
    isGenerateInvoiceMonthly: { type: Boolean, default: false },
    productList: [String],
    created_on: { type: Date, default: Date.now },
    normalized: String
});
