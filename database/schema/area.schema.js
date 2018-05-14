var mongoose = require("mongoose");
var Schema = mongoose.Schema;
//var db_config_1 = require("../database/db.config");
//var autoIncrement = require ('mongoose-auto-increment');




exports.areaSchema = new Schema({
    id: String,
    name: { type: String, unique: true, dropDups: true },
    status: { type: Boolean, default: true }
});



