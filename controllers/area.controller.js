var area_model_1 = require("../database/models/area.model");
var AreaController = /** @class */ (function () {
    function AreaController() {
    }
    //create new areas
    AreaController.create = function (res, data) {
        var area = new area_model_1.AreaModel({
            name: data.name,
            status: true
        });
        area.save(function (err) {
            if (err) {
                res.send({ status: false });
            }
            else {
                res.send({ status: true });
            }
        });
    };
    //get all areas
    AreaController.getAllArea = function (res) {
        area_model_1.AreaModel.find({}, function (err, areas) {
            if (!err) {
                res.send(areas);
            }
        });
    };
    //changing status - active/inactive
    AreaController.changeStatus = function (res, data) {
        area_model_1.AreaModel.update({ _id: data.id }, { $set: { status: data.status } }, function (err) {
            if (err) {
                res.send({ status: false });
            }
            else {
                res.send({ status: true });
            }
        });
    };
    //get area by _id
    AreaController.getAreaById = function (res, id) {
        area_model_1.AreaModel.findById(id, function (err, data) {
            if (!err) {
                res.send(data);
            }
        });
    };
    //update area
    AreaController.update = function (res, data) {
        area_model_1.AreaModel.update({ _id: data.id }, {
            $set: {
                name: data.name,
                status: true
            }
        }, function (err) {
            if (err) {
                res.send({ status: false });
            }
            else {
                res.send({ status: true });
            }
        });
    };
    return AreaController;
}());
exports.AreaController = AreaController;
