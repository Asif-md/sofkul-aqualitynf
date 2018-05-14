
var customer_model_1 = require("../database/models/customer.model");
var _ = require("underscore");
var invoice_model_1 = require("../database/models/invoice.model");
var Report = /** @class */ (function () {
    function Report() {
        this.current_due = 0;
        this.previous_due = 0;
        this.total_due = 0;
    }
    return Report;
}());
var ReportController = /** @class */ (function () {
    function ReportController() {
    }
    ReportController.getCustomerByArea = function (res, id) {
        customer_model_1.CustomerModel.find({
            $and: [
                {
                    'area': id
                },
                {
                    'status': true
                }
            ]
        }, function (err, data) {
            if (!err) {
                res.send(data);
            }
            else {
                res.send({ status: false });
            }
        });
    };
    ReportController.getReportForCustomers = function (res, id) {
        var result = {
            current_due: 0,
            previous_due: 0,
            total_due: 0
        };
        invoice_model_1.RecentInvoiceModel.findOne({
            $and: [
                {
                    customer_id: id
                },
                {
                    status: {
                        $ne: "Paid"
                    }
                }
            ]
        }, function (err, recentInvoice) {
            if (!err) {
                if (!_.isNull(recentInvoice)) {
                    result['current_due'] = recentInvoice['grantTotal'];
                }
            }
            else {
                res.send({ status: false });
            }
            invoice_model_1.AllInvoiceModel.find({
                $and: [
                    {
                        customer_id: id
                    },
                    {
                        status: { 
                            $ne: "Paid"
                        }
                    }
                ]
            }, function (err, allInvoice) {
                if (!err) {
                    _.each(allInvoice, function (item) {
                        if (!_.isNull(item)) {
                            result['previous_due'] += item['grantTotal'];
                        }
                    });
                }
                else {
                    res.send({ status: false });
                }
                result['total_due'] = result['previous_due'] + result['current_due'];
                res.send(result);
            });
        });
    };
    return ReportController;
}());
exports.ReportController = ReportController;
