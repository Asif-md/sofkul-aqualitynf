
var _ = require("underscore");
var customer_model_1 = require("../database/models/customer.model");
var quotation_model_1 = require("../database/models/quotation.model");
var product_model_1 = require("../database/models/product.model");
var QuotationController = /** @class */ (function () {
    function QuotationController() {
    }
    QuotationController.removeQuotation = function (res, data) {
        res.send(data);
    };
    QuotationController.createNewQuotation = function (res, data) {
        var quotation = new quotation_model_1.AllQuotationModel({
            customer_id: data.customer_id,
            invoice_id : data.customer_id,
            quotation_number: data.quotation_number,
            payment_due_date: data.date,
            vdate:data.vdate,
            remarks: data.remarks,
            tnc: data.tnc,
            amount_due: data.total,
            status: data.status,
            total: data.total,
            discount: data.discount,
            delivery_created_date: data.date,
            productList2: data.productList2,
            created_on: data.date,
            transport : data.transport,
            subTotal : data.subTotal,
            grantTotal: data.grantTotal,
            taxPercent : data.taxPercent,
            tax : data.tax,
            type: "all"
        });
        quotation.save(function (err, data) {
            if (!err) {
                res.send(data);
            }
            else {
                res.send({ status: false });
            }
        });
    };
    QuotationController.getQuotationByCustomerId = function (res, id) {
        var res_data = [];
        quotation_model_1.AllQuotationModel.find({ customer_id: id }, function (err, data) {
            if (!err) {
                var res_data_1 = data;
                quotation_model_1.RecentQuotationModel.findOne({ customer_id: id }, function (err, data) {
                    if (!err) {
                        res_data_1.push(data);
                        res.send(res_data_1);
                    }
                    else {
                        res.send({ status: false });
                    }
                });
            }
            else {
                res.send({ status: false });
            }
        });
    };
    QuotationController.globalSearchByCustomer = function (res, text) {
        //get customer name from ids
        var query = customer_model_1.CustomerModel.find({
            $or: [
                {
                    "username": {
                        $regex: ".*" + text + ".*",
                        $options: "i"
                    }
                },
                {
                    "fullname": {
                        $regex: ".*" + text + ".*",
                        $options: "i"
                    }
                }
            ]
        }, ["username", "fullname"]);
        query.exec(function (err, data) {
            if (!err) {
                res.send(data);
            }
            else {
                res.send({ status: false });
            }
        });
    };
    /* static saveAutoQuotation(res: Response, req: Request) {
         var base64Data = req.body.pdf;
         var imageBuffer = QuotationController.decodeBase64Image(base64Data);
         var filename = req.body.label + '.pdf';
 
         //get current month name and make dir
         var d = new Date();
         var month = new Array();
         month[0] = "January";
         month[1] = "February";
         month[2] = "March";
         month[3] = "April";
         month[4] = "May";
         month[5] = "June";
         month[6] = "July";
         month[7] = "August";
         month[8] = "September";
         month[9] = "October";
         month[10] = "November";
         month[11] = "December";
         var dirname = month[d.getMonth()];
 
         var dir_path = path.join(__dirname, "../../../", dirname);
 
         if (!fs.existsSync(dir_path)) {
             fs.mkdirSync(dir_path);
         }
 
         var saveTo = path.join(__dirname, "../../../", dirname, filename);
         fs.writeFile(saveTo, imageBuffer["data"], function (err) {
             if (!err) {
                 res.send({status: true});
             } else {
                 res.send({status: false});
             }
         });
     }
 
     static decodeBase64Image(dataString) {
         var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
             response = {};
         if (matches.length !== 3) {
             return new Error('Invalid input string');
         }
         response['type'] = matches[1];
         response['data'] = new Buffer(matches[2], 'base64');
         return response;
     }*/
    QuotationController.getAllQuotationCount = function (res) {
        quotation_model_1.AllQuotationModel.count(function (err, c) {
            if (!err) {
                res.send({ count: c });
            }
            else {
                res.send({ count: 0 });
            }
        });
    };
    QuotationController.getRecentQuotationCustomers = function (res) {
        customer_model_1.CustomerModel.find({
            $and: [
                { status: true },
                {
                    productList: {
                        $exists: true, $not: { $size: 0 }
                    }
                }
            ]
        }, function (err, data) {
            if (!err) {
                res.send(data);
            }
        });
    };
    QuotationController.storeQuotation = function (res, data) {
        var quotation = new quotation_model_1.AllQuotationModel({
            customer_id: data.customer_id,
            invoice_id : data.invoice_id,
            quotation_number : data.quotation_number,
            payment_due_date: data.payment_due_date,
            amount_due: data.amount_due,
            status: data.status,
            total: data.total,
            discount: data.discount,
            billto : data.billto,
            delivery_created_date: data.delivery_created_date,
            paid_date: data.paid_date,
            amount_partially_paid: data.amount_partially_paid,
            productList: data.productList,
            productList2: data.productList2,
            remarks : data.remarks,
            tnc : data.tnc,
            transport : data.transport,
            vdate : data.vdate,
            taxPercent : data.taxPercent,
            subTotal : data.subTotal,
            grantTotal : data.grantTotal,
            type: "all"
        });
        quotation.save(function (err, data) {
            if (err) {
                res.send({ status: false });
            }
            else {
                res.send({ status: true, id: data._id });
            }
        });
    };
    QuotationController.generateQuotation = function (res, data) {
        res.send(data);
    };
    QuotationController.getQuotationById = function (res, type, id) {
        if (type == 'recent') {
            quotation_model_1.RecentQuotationModel.findById(id, function (err, data) {
                res.send(data);
            });
        }
        else if (type == 'all') {
            quotation_model_1.AllQuotationModel.findById(id, function (err, data) {
                res.send(data);
            });
        }
        else {
            res.send({ status: false });
        }
    };
    QuotationController.searchByUsername = function (res, data) {
        quotation_model_1.AllQuotationModel.find({ "username": { $regex: ".*" + data.text + ".*", $options: 'i' } }, function (err, data) {
            if (!err) {
                res.send(data);
            }
        });
    };
    QuotationController.saveRecentQuotation = function (res, data) {
        var quotation = new quotation_model_1.RecentQuotationModel({
            customer_id: data.customer_id,
            invoice_id : data.invoice_id,
            quotation_number : data.quotation_number,
            payment_due_date: data.payment_due_date,
            amount_due: data.amount_due,
            billto : data.billto,
            status: data.status,
            total: data.total,
            discount: data.discount,
            paid_date: data.paid_date,
            amount_partially_paid: data.amount_partially_paid,
            productList: data.productList,
            productList2: data.productList2,
            remarks : data.remarks,
            tnc : data.tnc,
            transport : data.transport,
            vdate : data.vdate,
            taxPercent : data.taxPercent,
            subTotal : data.subTotal,
            grantTotal : data.grantTotal,
            type: "recent"
        });
        quotation.save(function (err, data) {
            if (err) {
                res.send({ status: false });
            }
            else {
                res.send({ status: true, id: data._id });
            }
        });
    };
    QuotationController.dropRecentQuotationAll = function (res) {
        if (quotation_model_1.RecentQuotationModel.collection.drop()) {
            res.send({ status: true });
        }
        else {
            res.send({ status: false });
        }
    };
    QuotationController.checkRecentQuotationExists = function (res) {
        quotation_model_1.RecentQuotationModel.count({}, function (err, count) {
            res.send({ "count": count });
        });
    };
    QuotationController.getRecentQuotationDB = function (res, paginationCount) {
        var skip_count = (paginationCount - 1) * 30;
        quotation_model_1.RecentQuotationModel.find({}).skip(skip_count).limit(30).exec(function (err, data) {
            if (!err) {
                res.send(data);
            }
            else {
                res.send({ status: false });
            }
        });
    };
    QuotationController.cleanQuotation = function (res) {
        var isClean = false;
        var date = new Date();
        var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        quotation_model_1.RecentQuotationModel.find({
            "created_on": {
                $lt: firstDay
            }
        }, function (err, data) {
            if (data.length <= 0) {
                res.send({ "status": false });
            }
            _.each(data, function (obj) {
                // clean from recent and push to all
                isClean = true;
                var quotation = new quotation_model_1.AllQuotationModel({
                    recent_id: obj['_id'],
                    customer_id: obj['customer_id'],
                    invoice_id : obj['invoice_id'],
                    quotation_number : obj['quotation_number'],
                    payment_due_date: obj['payment_due_date'],
                    amount_due: obj['amount_due'],
                    status: obj['status'],
                    billto : obj['billto'],
                    total: obj['total'],
                    discount: obj['discount'],
                    delivery_created_date: obj['delivery_created_date'],
                    paid_date: obj['paid_date'],
                    amount_partially_paid: obj['amount_partially_paid'],
                    productList: obj['productList'],
                    created_on: obj['created_on'],
                    productList2: obj['productList2'],
                    remarks : obj['remarks'],
                    tnc : obj['tnc'],
                    transport : obj['transport'],
                    vdate : obj['vdate'],
                    taxPercent : obj['taxPercent'],
                    subTotal : obj['subTotal'],
                    grantTotal : obj['grantTotal'],
                });
                quotation.save(function (err, newData) {
                    if (!err) {
                        quotation_model_1.RecentQuotationModel.findOne({ '_id': newData['recent_id'] }).remove(function (err) {
                            if (!err) {
                                isClean = true;
                                customer_model_1.CustomerModel.findOne({
                                    $and: [
                                        {
                                            '_id': newData['customer_id']
                                        },
                                        {
                                            'status': true
                                        }
                                    ]
                                }, function (err, customer) {
                                    if (customer) {
                                        var date_1 = new Date();
                                        var firstDay_1 = new Date(date_1.getFullYear(), date_1.getMonth(), 1);
                                        var newQuotation_1 = new quotation_model_1.RecentQuotationModel({
                                            customer_id: customer['_id'],
                                            payment_due_date: firstDay_1,
                                            amount_due: 0,
                                            status: 'Due',
                                            total: 0,
                                            discount: 0,
                                            amount_partially_paid: [],
                                            productList: customer['productList'],
                                            remarks : [],
                                            tnc : [],
                                            transport : [],
                                            vdate : [], 
                                            productList2 : customer['productList2']
                                        });
                                        product_model_1.ProductModel.find({ "_id": { "$in": customer['productList'] } }, function (err, docs) {
                                            _.each(docs, function (item) {
                                                newQuotation_1['total'] += item['rate'];
                                            });
                                            newQuotation_1['amount_due'] = newQuotation_1['total'];
                                            newQuotation_1.save(function () {
                                                // console.log(data);
                                            });
                                        });
                                    }
                                });
                            }
                        });
                    }
                    else {
                        res.send({ status: 'error in quotation save' });
                    }
                });
            });
        }, function () {
            res.send({ "status": isClean });
        });
    };
    QuotationController.changeStatus = function (res, data) {
        if (data['type'] == 'recent') {
            quotation_model_1.RecentQuotationModel.update({ _id: data['_id'] }, {
                $set: {
                    customer_id: data['customer_id'],
                    invoice_id : data['invoice_id'],
                    payment_due_date: data['payment_due_date'],
                    amount_due: data['amount_due'],
                    status: data['status'],
                    quotation_number : data['quotation_number'],
                    total: data['total'],
                    discount: data['discount'],
                    delivery_created_date: data['delivery_created_date'],
                    paid_date: data['paid_date'],
                    amount_partially_paid: data['amount_partially_paid'],
                    productList: data['productList'],
                    created_on: data['created_on'],
                    productList2: data['productList2'],
                    remarks : data['remarks'],
                    tnc : data['tnc'],
                    transport : data['transport'],
                    vdate : data['vdate'],
                    taxPercent : data['taxPercent'],
                    subTotal : data['subTotal'],
                    grantTotal : data['grantTotal'],
                }
            }, function (err) {
                if (err) {
                    res.send({ status: false });
                }
                else {
                    res.send({ status: true });
                }
            });
        }
        else {
            quotation_model_1.AllQuotationModel.update({ _id: data['_id'] }, {
                $set: {
                    customer_id: data['customer_id'],
                    invoice_id : data ['invoice_id'],
                    quotation_number : data['quotation_number'],
                    payment_due_date: data['payment_due_date'],
                    amount_due: data['amount_due'],
                    status: data['status'],
                    billto : data['billto'],
                    total: data['total'],
                    discount: data['discount'],
                    delivery_created_date: data['delivery_created_date'],
                    paid_date: data['paid_date'],
                    amount_partially_paid: data['amount_partially_paid'],
                    productList: data['productList'],
                    created_on: data['created_on'],
                    productList2: data['productList2'],
                    remarks : data['remarks'],
                    tnc : data['tnc'],
                    transport : data['transport'],
                    vdate : data['vdate'],
                    taxPercent : data['taxPercent'],
                    subTotal : data['subTotal'],
                    grantTotal : data['grantTotal'],
                    type: "all"
                }
            }, function (err) {
                if (err) {
                    res.send({ status: false });
                }
                else {
                    res.send({ status: true });
                }
            });
        }
    };
    /*static buildAndSaveRecentQuotation(res: Response) {
        CustomerModel.find({
                $and: [
                    {
                        productList: {
                            $exists: true, $not: {$size: 0}
                        }
                    },
                    {
                        status: true
                    }
                ]
            },
            function (err, data) {
                let date = new Date();
                let firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
                _.each(data, (customer) => {
                    let quotation = new RecentQuotationModel({
                        customer_id: customer['_id'],
                        payment_due_date: firstDay,
                        amount_due: 0,
                        status: 'Due',
                        total: 0,
                        discount: 0,
                        amount_partially_paid: [],
                        productList: customer['productList'],
                        type: 'recent'
                    });

                    ProductModel.find({"_id": {"$in": customer['productList']}}, function (err, docs) {
                        _.each(docs, (item) => {
                            quotation['total'] += item['rate'];
                        });
                        quotation['amount_due'] = quotation['total'];
                        quotation.save(function () {
                            // console.log(data);
                        });
                    });
                });
                res.send({status: true});
            }
    }*/
    /* static savePartialPay(res: Response, data: any) {
         let pay_data = {
             date: Date.now(),
             amount: data['amount_partially_paid']
         };
         RecentQuotationModel.findByIdAndUpdate(
             data['id'],
             {$push: {"amount_partially_paid": {date: pay_data['date'], amount: pay_data['amount']}}},
             {safe: true, upsert: true, new: true},
             function (err, docs) {
                 let total_partial_pay = 0;
                 _.each(docs['amount_partially_paid'], (item) => {
                     total_partial_pay += item['amount'];
                 });
                 if (total_partial_pay >= docs['total']) {
                     RecentQuotationModel.update({_id: data['id']}, {
                         $set: {
                             status: 'Paid',
                             amount_due: 0,
                             paid_date: Date.now()
                         }
                     }, function (err) {
                         if (err) {
                             res.send({status: false});
                         } else {
                             res.send({status: true});
                         }
                     });
                 } else {
                     RecentQuotationModel.update({_id: data['id']}, {
                         $set: {
                             status: 'Partially Paid',
                             amount_due: docs['total'] - total_partial_pay
                         }
                     }, function (err) {
                         if (err) {
                             res.send({status: false});
                         } else {
                             res.send({status: true});
                         }
                     });
                 }
 
             }
         );
     }
 */
    QuotationController.preGenerateUpdate = function (res, data) {
        if (data['type'] == 'recent') {
            quotation_model_1.RecentQuotationModel.update({ _id: data.id }, {
                $set: {
                    amount_due: data.amount_due,
                    discount: data.discount,
                    productList: data.productList,
                    productList2 : data.productList2,
                    grantTotal : data.grantTotal,
                    subTotal : data.subTotal,
                    tax : data.tax,
                    taxPercent : data.taxPercent,
                    total: data.total,
                    amount_partially_paid: data.amount_partially_paid
                }
            }, function (err) {
                if (err) {
                    res.send({ status: false });
                }
                else {
                    res.send({ status: true });
                }
            });
        }
        else if (data['type'] == 'all') {
            quotation_model_1.AllQuotationModel.update({ _id: data.id }, {
                $set: {
                    amount_due: data.amount_due,
                    discount: data.discount,
                    productList: data.productList,
                    productList2 : data.productList2,
                    grantTotal : data.grantTotal,
                    subTotal : data.subTotal,
                    tax : data.tax,
                    taxPercent : data.taxPercent,
                    total: data.total,
                    amount_partially_paid: data.amount_partially_paid
                }
            }, function (err) {
                if (err) {
                    res.send({ status: false });
                }
                else {
                    res.send({ status: true });
                }
            });
        }
        else {
            res.send({ status: false });
        }
    };
    QuotationController.deleteQuotation = function (res, data) {
        if (data['type'] === 'recent') {
            quotation_model_1.RecentQuotationModel.find({ _id: data['_id'] }).remove(function (err) {
                if (!err) {
                    res.send({ status: true });
                }
                else {
                    res.send({ status: false });
                }
            });
        }
        else {
            quotation_model_1.AllQuotationModel.find({ _id: data['_id'] }).remove(function (err) {
                if (!err) {
                    res.send({ status: true });
                }
                else {
                    res.send({ status: false });
                }
            });
        }
    };
    QuotationController.getAllQuotations = function (res, paginationCount) {
        var skip_count = (paginationCount - 1) * 30;
        quotation_model_1.AllQuotationModel.find({}).skip(skip_count).limit(30).exec(function (err, data) {
            if (!err) {
                res.send(data);
            }
            else {
                res.send({ status: false });
            }
        });
    };
    return QuotationController;
}());
exports.QuotationController = QuotationController;
