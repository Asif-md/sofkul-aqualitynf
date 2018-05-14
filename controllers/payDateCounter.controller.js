
var payDateCounter_model_1 = require("../database/models/payDateCounter.model");
var PayDateCounterController = /** @class */ (function () {
    function PayDateCounterController() {
    }
    PayDateCounterController.setPayDateCounter = function (res, invoice) {
        var date = new Date();
        var current_date = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        payDateCounter_model_1.PayDateCounterModel.findOne({
            "date": {
                $eq: current_date
            }
        }, function (err, data) {
            if (!data) {
                var payDataCounter = new payDateCounter_model_1.PayDateCounterModel({
                    date: current_date,
                    invoice_id: [invoice["_id"]],
                    amount: invoice["grantTotal"]
                });
                payDataCounter.save(function (err, docs) {
                    if (!err) {
                        res.send({ status: true });
                    }
                    else {
                        res.send({ status: false });
                    }
                });
            }
            else {
                payDateCounter_model_1.PayDateCounterModel.update({ date: current_date }, {
                    $addToSet: { invoice_id: data["_id"] },
                    amount: data["amount"] + invoice["grantTotal"]
                }, function (err, docs) {
                    if (!err) {
                        res.send({ status: true });
                    }
                    else {
                        res.send({ status: false });
                    }
                });
            }
        });
    };
    PayDateCounterController.checkAndCleanPayDateCounter = function (res) {
        var date = new Date();
        var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        payDateCounter_model_1.PayDateCounterModel.find({
            "date": {
                $lt: firstDay
            }
        }).remove().exec(function (err, data) {
            res.send({ "remove_count": data });
        });
    };
    PayDateCounterController.getPayDateCounter = function (res) {
        var date = new Date();
        var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        payDateCounter_model_1.PayDateCounterModel.find({
            "date": { 
                $gt: firstDay
            }
        }, function (err, data) {
            if (!err) {
                res.send(data);
            }
            else {
                res.send({ status: false });
            }
        });
    };
    return PayDateCounterController;
}());
exports.PayDateCounterController = PayDateCounterController;
