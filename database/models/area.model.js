
/*
* model for Area
*/
var mongoose = require("mongoose");
var area_schema_1 = require("../schema/area.schema");

//var autoIncrement = require ('mongoose-auto-increment');
//var db_config_1 = require("../database/db.config");

//autoIncrement.initialize(mongoose);


//area_schema_1.areaSchema.plugin(autoIncrement.plugin, 'area');



exports.AreaModel = mongoose.model('area', area_schema_1.areaSchema);
