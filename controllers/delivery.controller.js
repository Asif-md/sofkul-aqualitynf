
var _ = require("underscore");
var customer_model_1 = require("../database/models/customer.model");
var delivery_model_1 = require("../database/models/delivery.model");
var product_model_1 = require("../database/models/product.model");
var invoice_model_1 = require("../database/models/invoice.model");
var path = require("path");
var fs = require("fs");
var DeliveryController = /** @class */ (function () {
    function DeliveryController() {
    }
    DeliveryController.removeDelivery = function (res, data) {
        res.send(data);
    };
    DeliveryController.createNewDelivery = function (res, data) {
        var delivery = new delivery_model_1.AllDeliveryModel({
            customer_id: data.customer_id,
            invoice_id : data.customer_id,
            invoice_number: data.invoice_number,
            payment_due_date: data.date,
            vdate:data.vdate,
            remarks: data.remarks,
            tnc: data.tnc,
            amount_due: data.total,
            billto: data.billto,
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
        delivery.save(function (err, data) {
            if (!err) {
                res.send(data);
            }
            else {
                res.send({ status: false });
            }
        });
    };
    DeliveryController.getDeliveryByCustomerId = function (res, id) {
        var res_data = [];
        delivery_model_1.AllDeliveryModel.find({ customer_id: id }, function (err, data) {
            if (!err) {
                var res_data_1 = data;
                delivery_model_1.RecentDeliveryModel.findOne({ customer_id: id }, function (err, data) {
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


    DeliveryController.globalSearchByCustomer = function (res, text) {
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
    DeliveryController.saveAutoDelivery = function (res, req) {
        var base64Data = req.body.pdf;
        var imageBuffer = DeliveryController.decodeBase64Image(base64Data);
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
                res.send({ status: true });
            }
            else {
                res.send({ status: false });
            }
        });
    };
    DeliveryController.decodeBase64Image = function (dataString) {
        var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/), response = {};
        if (matches.length !== 3) {
            return new Error('Invalid input string');
        }
        response['type'] = matches[1];
        response['data'] = new Buffer(matches[2], 'base64');
        return response;
    };
    DeliveryController.getAllDeliveryCount = function (res) {
        delivery_model_1.AllDeliveryModel.count(function (err, c) {
            if (!err) {
                res.send({ count: c });
            }
            else {
                res.send({ count: 0 });
            }
        });
    };
    DeliveryController.getRecentDeliveryCustomers = function (res) {
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
    DeliveryController.storeDelivery = function (res, data) {
        var delivery = new delivery_model_1.AllDeliveryModel({
            customer_id: data.customer_id,
            invoice_id : data.invoice_id,
            invoice_number : data.invoice_number,
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
        delivery.save(function (err, data) {
            if (err) {
                res.send({ status: false });
            }
            else {
                res.send({ status: true, id: data._id });
            }
        });
    };
    DeliveryController.generateDelivery = function (res, data) {
        res.send(data);
    };
    DeliveryController.getDeliveryById = function (res, type, id) {
        if (type == 'recent') {
            delivery_model_1.RecentDeliveryModel.findById(id, function (err, data) {
                res.send(data);
            });
        }
        else if (type == 'all') {
            delivery_model_1.AllDeliveryModel.findById(id, function (err, data) {
                res.send(data);
            });
        }
        else {
            res.send({ status: false });
        }
    };
    DeliveryController.searchByUsername = function (res, data) {
        delivery_model_1.AllDeliveryModel.find({ "username": { $regex: ".*" + data.text + ".*", $options: 'i' } }, function (err, data) {
            if (!err) {
                res.send(data);
            }
        });
    };
    DeliveryController.saveRecentDelivery = function (res, data) {
        var delivery = new delivery_model_1.RecentDeliveryModel({
            customer_id: data.customer_id,
            invoice_id : data.invoice_id,
            invoice_number : data.invoice_number,
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
        delivery.save(function (err, data) {
            if (err) {
                res.send({ status: false });
            }
            else {
                res.send({ status: true, id: data._id });
            }
        });
    };
    DeliveryController.dropRecentDeliveryAll = function (res) {
        if (delivery_model_1.RecentDeliveryModel.collection.drop()) {
            res.send({ status: true });
        }
        else {
            res.send({ status: false });
        }
    };
    DeliveryController.checkRecentDeliveryExists = function (res) {
        delivery_model_1.RecentDeliveryModel.count({}, function (err, count) {
            res.send({ "count": count });
        });
    };
    DeliveryController.getRecentDeliveryDB = function (res, paginationCount) {
        var skip_count = (paginationCount - 1) * 30;
        delivery_model_1.RecentDeliveryModel.find({}).skip(skip_count).limit(30).exec(function (err, data) {
            if (!err) {
                res.send(data);
            }
            else {
                res.send({ status: false });
            }
        });
    };
    DeliveryController.cleanDelivery = function (res) {
        var isClean = false;
        var date = new Date();
        var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        delivery_model_1.RecentDeliveryModel.find({
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
                var delivery = new delivery_model_1.AllDeliveryModel({
                    recent_id: obj['_id'],
                    customer_id: obj['customer_id'],
                    invoice_id : obj['invoice_id'],
                    invoice_number : obj['invoice_number'],
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
                delivery.save(function (err, newData) {
                    if (!err) {
                        delivery_model_1.RecentDeliveryModel.findOne({ '_id': newData['recent_id'] }).remove(function (err) {
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
                                        var newDelivery_1 = new delivery_model_1.RecentDeliveryModel({
                                            customer_id: customer['_id'],
                                            invoice_id : invoice['_id'],
                                            payment_due_date: firstDay_1,
                                            amount_due: 0,
                                            status: 'Due',
                                            billto:'',
                                            total: 0,
                                            discount: 0,
                                            amount_partially_paid: [],
                                            remarks : [],
                                            tnc : [],
                                            transport : [],
                                            vdate : [], 
                                            productList: customer['productList'],
                                            productList2 : customer['productList2']
                                        });
                                        product_model_1.ProductModel.find({ "_id": { "$in": customer['productList'] } }, function (err, docs) {
                                            _.each(docs, function (item) {
                                                newDelivery_1['total'] += item['rate'];
                                            });
                                            newDelivery_1['amount_due'] = newDelivery_1['total'];
                                            newDelivery_1.save(function () {
                                                // console.log(data);
                                            });
                                        });
                                    }
                                });
                            }
                        });
                    }
                    else {
                        res.send({ status: 'error in delivery save' });
                    }
                });
            });
        }, function () {
            res.send({ "status": isClean });
        });
    };
    DeliveryController.changeStatus = function (res, data) {
        if (data['type'] == 'recent') {
            delivery_model_1.RecentDeliveryModel.update({ _id: data['_id'] }, {
                $set: {
                    customer_id: data['customer_id'],
                    invoice_id : data['invoice_id'],
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
                    created_on: obj['created_on'],
                    productList2: obj['productList2'],
                    remarks : obj['remarks'],
                    tnc : obj['tnc'],
                    transport : obj['transport'],
                    vdate : obj['vdate'],
                    taxPercent : obj['taxPercent'],
                    subTotal : obj['subTotal'],
                    grantTotal : obj['grantTotal'],
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
            delivery_model_1.AllDeliveryModel.update({ _id: data['_id'] }, {
                $set: {
                    customer_id: data['customer_id'],
                    invoice_id : data ['invoice_id'],
                    invoice_number : data['invoice_number'],
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
                    created_on: obj['created_on'],
                    productList2: obj['productList2'],
                    remarks : obj['remarks'],
                    tnc : obj['tnc'],
                    transport : obj['transport'],
                    vdate : obj['vdate'],
                    taxPercent : obj['taxPercent'],
                    subTotal : obj['subTotal'],
                    grantTotal : obj['grantTotal'],
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
    DeliveryController.buildAndSaveRecentDelivery = function (res) {
        customer_model_1.CustomerModel.find({
            $and: [
                {
                    productList: {
                        $exists: true, $not: { $size: 0 }
                    }
                },
                {
                    status: true
                }
            ]
        }, function (err, data) {
            var date = new Date();
            var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
            _.each(data, function (customer) {
                var delivery = new delivery_model_1.RecentDeliveryModel({
                    customer_id: customer['_id'],
                    invoice_id : invoice['_id'],
                    invoice_number : invoice['invoice_number'],
                    payment_due_date: firstDay,
                    amount_due: 0,
                    status: 'Due',
                    billto: '',
                    total: 0,
                    discount: 0,
                    amount_partially_paid: [],
                    productList: customer['productList'],
                    type: 'recent'
                });
                product_model_1.ProductModel.find({ "_id": { "$in": customer['productList'] } }, function (err, docs) {
                    _.each(docs, function (item) {
                        delivery['total'] += item['rate'];
                    });
                    delivery['amount_due'] = delivery['total'];
                    delivery.save(function () {
                        // console.log(data);
                    });
                });
            });
            res.send({ status: true });
        });
    };
    DeliveryController.savePartialPay = function (res, data) {
        var pay_data = {
            date: Date.now(),
            amount: data['amount_partially_paid']
        };
        delivery_model_1.RecentDeliveryModel.findByIdAndUpdate(data['id'], { $push: { "amount_partially_paid": { date: pay_data['date'], amount: pay_data['amount'] } } }, { safe: true, upsert: true, new: true }, function (err, docs) {
            var total_partial_pay = 0;
            _.each(docs['amount_partially_paid'], function (item) {
                total_partial_pay += item['amount'];
            });
            if (total_partial_pay >= docs['total']) {
                delivery_model_1.RecentDeliveryModel.update({ _id: data['id'] }, {
                    $set: {
                        status: 'Paid',
                        amount_due: 0,
                        paid_date: Date.now()
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
                delivery_model_1.RecentDeliveryModel.update({ _id: data['id'] }, {
                    $set: {
                        status: 'Partially Paid',
                        amount_due: docs['total'] - total_partial_pay
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
        });
    };
    DeliveryController.preGenerateUpdate = function (res, data) {
        if (data['type'] == 'recent') {
            delivery_model_1.RecentDeliveryModel.update({ _id: data.id }, {
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
            delivery_model_1.AllDeliveryModel.update({ _id: data.id }, {
                $set: {
                    amount_due: data.amount_due,
                    discount: data.discount,
                    productList: data.productList,
                    total: data.total,
                    amount_partially_paid: data.amount_partially_paid,
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
    DeliveryController.deleteDelivery = function (res, data) {
        if (data['type'] === 'recent') {
            delivery_model_1.RecentDeliveryModel.find({ _id: data['_id'] }).remove(function (err) {
                if (!err) {
                    res.send({ status: true });
                }
                else {
                    res.send({ status: false });
                }
            });
        } 
        else {
            delivery_model_1.AllDeliveryModel.find({ _id: data['_id'] }).remove(function (err) {
                if (!err) {
                    res.send({ status: true });
                }
                else {
                    res.send({ status: false });
                }
            });
        }
    };
    DeliveryController.getAllDeliveries = function (res, paginationCount) {
        var skip_count = (paginationCount - 1) * 30;
        delivery_model_1.AllDeliveryModel.find({}).skip(skip_count).limit(30).exec(function (err, data) {
            if (!err) {
                res.send(data);
            }
            else {
                res.send({ status: false });
            }
        });
    };
    return DeliveryController;
}());
exports.DeliveryController = DeliveryController;
