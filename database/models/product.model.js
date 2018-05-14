
/*
* model for Customer
*/
var mongoose = require("mongoose");
var product_schema_1 = require("../schema/product.schema");
exports.ProductModel = mongoose.model('product', product_schema_1.productSchema);
