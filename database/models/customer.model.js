
/*
* model for Customer
*/
var mongoose = require("mongoose");
var customer_schema_1 = require("../schema/customer.schema");
exports.CustomerModel = mongoose.model('customer', customer_schema_1.customerSchema);
