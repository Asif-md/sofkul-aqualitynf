
/*
* model for Delivery
*/
var mongoose = require("mongoose");
var delivery_schema_1 = require("../schema/delivery.schema");
exports.AllDeliveryModel = mongoose.model('all_delivery', delivery_schema_1.deliverySchema);
exports.RecentDeliveryModel = mongoose.model('recent_delivery', delivery_schema_1.deliverySchema);
