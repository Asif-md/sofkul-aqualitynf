
/*
 * model for Area
 */
var mongoose = require("mongoose");
var payDateCounter_schema_1 = require("../schema/payDateCounter.schema");
exports.PayDateCounterModel = mongoose.model('payDateCounter', payDateCounter_schema_1.payDateCounterSchema);
