
/*
* model for Invoice
*/
var mongoose = require("mongoose");
var quotation_schema_1 = require("../schema/quotation.schema");
exports.AllQuotationModel = mongoose.model('all_quotation', quotation_schema_1.quotationSchema);
exports.RecentQuotationModel = mongoose.model('recent_quotation', quotation_schema_1.quotationSchema);
