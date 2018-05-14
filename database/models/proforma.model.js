
/*
* model for Proforma
*/
var mongoose = require("mongoose");
var proforma_schema_1 = require("../schema/proforma.schema");
exports.AllProformaModel = mongoose.model('all_proforma', proforma_schema_1.proformaSchema);
exports.RecentProformaModel = mongoose.model('recent_proforma', proforma_schema_1.proformaSchema);
