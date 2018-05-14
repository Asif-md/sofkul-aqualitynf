
/*
* model for Invoice
*/
var mongoose = require("mongoose");
var invoice_schema_1 = require("../schema/invoice.schema");
exports.AllInvoiceModel = mongoose.model('all_invoice', invoice_schema_1.invoiceSchema);
exports.RecentInvoiceModel = mongoose.model('recent_invoice', invoice_schema_1.invoiceSchema);
