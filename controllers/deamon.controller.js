
var _ = require("underscore");
var invoice_model_1 = require("../database/models/invoice.model");
var DeamonController = /** @class */ (function () {
    function DeamonController() {
    }
    DeamonController.autoGenerateInvoice = function () {
        /*
         clean recent invoice and push data into all invoice
         */
        invoice_model_1.RecentInvoiceModel.find({}, function (err, data) {
            _.each(data, function (invoice) {
                //save to all InvoiceDB
                var newInvoice = new invoice_model_1.AllInvoiceModel({
                    customer_id: invoice["customer_id"],
                    payment_due_date: invoice["payment_due_date"],
                    amount_due: invoice["amount_due"],
                    status: invoice["status"],
                    subTotal : ["subTotal"],
                    grantTotal : ["grantTotal"],
                    taxPercent : ["taxPercent"],
                    tax : invoice["tax"],
                    disc : invoice["disc"],
                    total: invoice["total"],
                    discount: invoice["discount"],
                    invoice_created_date: invoice["invoice_created_date"],
                    paid_date: invoice["paid_date"],
                    productList: invoice["productList"],
                    amount_partially_paid: invoice["amount_partially_paid"],
                    type: "all"
                });
                newInvoice.save(function (err, newData) {
                    if (err) {
                        console.log("Error in allInvoice save");
                    }
                    else {
                        invoice_model_1.RecentInvoiceModel.find({ _id: invoice['_id'] }).remove(function (err) {
                            if (!err) {
                                console.log("removed recent invoice");
                            }
                        });
                    }
                });
            });
        });
    };
    return DeamonController;
}());
exports.DeamonController = DeamonController;
