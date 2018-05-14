
var _ = require("underscore");
var customer_model_1 = require("../database/models/customer.model");
var proforma_model_1 = require("../database/models/proforma.model");
var product_model_1 = require("../database/models/product.model");
var path = require("path");
var fs = require("fs");
var ProformaController = /** @class */ (function () {
    function ProformaController() {
    }
    ProformaController.removeProforma = function (res, data) {
        res.send(data);
    };
    ProformaController.createNewProforma = function (res, data) {
        var proforma = new proforma_model_1.AllProformaModel({
            customer_id: data.customer_id,
           // invoice_number: data.invoice_number,
           // po_number : data.po_number,
            payment_due_date: data.date,
            paid_date : data.paid_date,
            amount_due: data.total,
            status: data.status,
            total: data.total,
            discount: data.discount,
            disc : data.disc,
            qty : data.qty,
            proforma_created_date: data.date,
            remarks: data.remarks,
            tnc: data.tnc,
            productList: data.productList,
            productList2: data.productList2,
            created_on: data.date,
            vdate : data.vdate,
            type: "all",
            name: data.name,
            taxPercent : data.taxPercent,
            tax : data.tax,
            subTotal : data.subTotal,
            grantTotal : data.grantTotal,
        });
        proforma.save(function (err, data) {
            if (!err) {
                res.send(data);
            }
            else {
                res.send({ status: false });
            }
        });
    };
    ProformaController.getProformaByCustomerId = function (res, id) {
        var res_data = [];
        proforma_model_1.AllProformaModel.find({ customer_id: id }, function (err, data) {
            if (!err) {
                var res_data_1 = data;
                proforma_model_1.RecentProformaModel.findOne({ customer_id: id }, function (err, data) {
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
    ProformaController.globalSearchByCustomer = function (res, text) {
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
    ProformaController.saveAutoProforma = function (res, req) {
        var base64Data = req.body.pdf;
        var imageBuffer = ProformaController.decodeBase64Image(base64Data);
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
    ProformaController.decodeBase64Image = function (dataString) {
        var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/), response = {};
        if (matches.length !== 3) {
            return new Error('Invalid input string');
        }
        response['type'] = matches[1];
        response['data'] = new Buffer(matches[2], 'base64');
        return response;
    };
    ProformaController.getAllProformaCount = function (res) {
        proforma_model_1.AllProformaModel.count(function (err, c) {
            if (!err) {
                res.send({ count: c });
            }
            else {
                res.send({ count: 0 });
            }
        });
    };
    ProformaController.getRecentProformaCustomers = function (res) {
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
    ProformaController.storeProforma = function (res, data) {
        var proforma = new proforma_model_1.AllProformaModel({
            customer_id: data.customer_id,
           // nid : data.nid,
           // invoice_number: data.invoice_number,
           // po_number : data.po_number,
            payment_due_date: data.date,
            paid_date : data.paid_date,
            amount_due: data.total,
            status: data.status,
            total: data.total,
            discount: data.discount,
            disc : data.disc,
            qty : data.qty,
            proforma_created_date: data.date,
            remarks: data.remarks,
            tnc: data.tnc,
            productList: data.productList,
            productList2: data.productList2,
            created_on: data.date,
            vdate : data.date,
            type: "all",
            name: data.name,
            taxPercent : data.taxPercent,
            tax : data.tax,
            subTotal : data.subTotal,
            grantTotal : data.grantTotal,
        });
        proforma.save(function (err, data) {
            if (err) {
                res.send({ status: false });
            }
            else {
                res.send({ status: true, id: data._id });
            }
        });
    };
    ProformaController.generateProforma = function (res, data) {
        res.send(data);
    };
    ProformaController.getProformaById = function (res, type, id) {
        if (type == 'recent') {
            proforma_model_1.RecentProformaModel.findById(id, function (err, data) {
                res.send(data);
            });
        }
        else if (type == 'all') {
            proforma_model_1.AllProformaModel.findById(id, function (err, data) {
                res.send(data);
            });
        }
        else {
            res.send({ status: false });
        }
    };
    ProformaController.searchByUsername = function (res, data) {
        proforma_model_1.AllProformaModel.find({ "username": { $regex: ".*" + data.text + ".*", $options: 'i' } }, function (err, data) {
            if (!err) {
                res.send(data);
            }
        });
    };
    ProformaController.saveRecentProforma = function (res, data) {
        var proforma = new proforma_model_1.RecentProformaModel({
            customer_id: data.customer_id,
           
            payment_due_date: data.date,
            paid_date : data.paid_date,
            amount_due: data.total,
            status: data.status,
            total: data.total,
            discount: data.discount,
            disc : data.disc,
            qty : data.qty,
            proforma_created_date: data.date,
            remarks: data.remarks,
            tnc: data.tnc,
            productList: data.productList,
            productList2: data.productList2,
            created_on: data.date,
            vdate : data.date,
            type: "recent",
            name: data.name,
            taxPercent : data.taxPercent,
            tax : data.tax,
            subTotal : data.subTotal,
            grantTotal : data.grantTotal,
        });
        proforma.save(function (err, data) {
            if (err) {
                res.send({ status: false });
            }
            else {
                res.send({ status: true, id: data._id });
            }
        });
    };
    ProformaController.dropRecentProformaAll = function (res) {
        if (proforma_model_1.RecentProformaModel.collection.drop()) {
            res.send({ status: true });
        }
        else {
            res.send({ status: false });
        }
    };
    ProformaController.checkRecentProformaExists = function (res) {
        proforma_model_1.RecentProformaModel.count({}, function (err, count) {
            res.send({ "count": count });
        });
    };
    ProformaController.getRecentProformaDB = function (res, paginationCount) {
        var skip_count = (paginationCount - 1) * 30;
        proforma_model_1.RecentProformaModel.find({}).skip(skip_count).limit(30).exec(function (err, data) {
            if (!err) {
                res.send(data);
            }
            else {
                res.send({ status: false });
            }
        });
    };
    ProformaController.cleanProforma = function (res) {
        var isClean = false;
        var date = new Date();
        var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        proforma_model_1.RecentProformaModel.find({
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
                var proforma = new proforma_model_1.AllProformaModel({
                    recent_id: obj['_id'],
                    customer_id: obj['customer_id'],
                    payment_due_date: obj['payment_due_date'],
                    vdate : obj['vdate'],
                    amount_due: obj['amount_due'],
                    status: obj['status'],
                    qty : obj['qty'],
                    total: obj['total'],
                    discount: obj['discount'],
                    disc : obj['disc'],
                    invoice_created_date: obj['invoice_created_date'],
                    remarks: obj ['remarks'],
                    paid_date: obj['paid_date'],
                    remarks: obj['remarks'],
                    tnc : obj['tnc'],
                    amount_partially_paid: obj['amount_partially_paid'],
                    productList: obj['productList'],
                    productList2: obj['productList2'],
                    created_on: obj['created_on'],
                    name: obj ['name'],
                    taxPercent : obj ['taxPercent'],
                    tax : obj ['tax'],
                    subTotal : obj ['subTotal'],
                    grantTotal : obj ['grantTotal'],
                    hsn_code : obj['hsn_code']
                });
                proforma.save(function (err, newData) {
                    if (!err) {
                        proforma_model_1.RecentProformaModel.findOne({ '_id': newData['recent_id'] }).remove(function (err) {
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
                                        var newProforma_1 = new proforma_model_1.RecentProformaModel({
                                            customer_id: customer['_id'],
                                            payment_due_date: firstDay_1,
                                            paid_date : '',
                                            vdate : [],
                                            amount_due: 0,
                                            status: 'Due',
                                            total: 0,
                                            qty : 0,
                                            discount: 0,
                                            disc:0,
                                            remarks:[],
                                            tnc : [],
                                            amount_partially_paid: [],
                                            productList: customer['productList'],
                                            productList2: customer['productList2'],
                                            name : [],
                                            taxPercent : [],
                                            tax : [],
                                            subTotal : [],
                                            grantTotal : [],
                                            cost : [],
                                            hsn_code :[],
                                        });
                                        product_model_1.ProductModel.find({ "_id": { "$in": customer['productList'] } }, function (err, docs) {
                                            _.each(docs, function (item) {
                                                newProforma_1['total'] += item['rate'];
                                            });
                                            newProforma_1['amount_due'] = newProforma_1['total'];
                                            newProforma_1.save(function () {
                                                // console.log(data);
                                            });
                                        });
                                    }
                                });
                            }
                        });
                    }
                    else {
                        res.send({ status: 'error in proforma save' });
                    }
                });
            });
        }, function () {
            res.send({ "status": isClean });
        });
    };
    ProformaController.changeStatus = function (res, data) {
        if (data['type'] == 'recent') {
            proforma_model_1.RecentProformaModel.update({ _id: data['_id'] }, {
                $set: {
                    customer_id: data['customer_id'],
                    payment_due_date: data['payment_due_date'],
                    vdate : data['vdate'],
                    amount_due: data['amount_due'],
                    status: data['status'],
                    qty: data['qty'] ,
                    total: data['total'],
                    discount: data['discount'],
                    disc : data['disc'],
                    invoice_created_date: data['invoice_created_date'],
                    remarks : data ['remarks'],
                    tnc : data['tnc'],
                    paid_date: data['paid_date'],
                    amount_partially_paid: data['amount_partially_paid'],
                    productList: data['productList'],
                    productList2: data['productList2'],
                    name : data['name'],
                    taxPercent : data['taxPercent'],
                    tax : data['tax'],
                    subTotal : data['subTotal'],
                    grantTotal : data['grantTotal'],
                    cost : data['cost'],
                    hsn_code : data['hsn_code'],
                    type: "recent"
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
            proforma_model_1.AllProformaModel.update({ _id: data['_id'] }, {
                $set: {
                    customer_id: data['customer_id'],
                    nid : data ['nid'],
                    invoice_number : data['invoice_number'],
                    po_number : data ['po_number'],
                    payment_due_date: data['payment_due_date'],
                    vdate : data ['vdate'],
                    amount_due: data['amount_due'],
                    status: data['status'],
                    qty : data['qty'],
                    total: data['total'],
                    discount: data['discount'],
                    disc : data['disc'],
                    invoice_created_date: data['invoice_created_date'],
                    remarks : data ['remarks'],
                    tnc : data [''],
                    paid_date: data['paid_date'],
                    amount_partially_paid: data['amount_partially_paid'],
                    productList: data['productList'],
                    productList2: data['productList2'],
                    type: "all", 
                    name : data['name'],
                    taxPercent : data['taxPercent'],
                    tax : data['tax'],
                    subTotal: data['subTotal'],
                    grantTotal : data['grantTotal'],
                    cost : data['cost'],
                    hsn_code : data['hsn_code'],


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
    ProformaController.buildAndSaveRecentProforma = function (res) {
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
                var proforma = new proforma_model_1.RecentProformaModel({
                    customer_id: customer['_id'],
                    payment_due_date: firstDay,
                    vdate : [],
                    amount_due: 0, 
                    status: 'Due',
                    total: 0,
                    qty: 0,
                    discount: 0,
                    disc : 0,
                    remarks : [''],
                    tnc : [''],
                    amount_partially_paid: [],
                    productList: customer['productList'],
                    productList2: customer['productList2'],
                    type: 'recent',
                    name : [],
                    taxPercent : [],
                    tax : [],
                    subTotal: [],
                    grantTotal : [],
                    cost : [],
                });
                product_model_1.ProductModel.find({ "_id": { "$in": customer['productList'] } }, function (err, docs) {
                    _.each(docs, function (item) {
                        proforma['total'] += item['rate'];
                    });
                    proforma['amount_due'] = proforma['total'];
                    proforma.save(function () {
                        // console.log(data);
                    });
                });
            });
            res.send({ status: true });
        });
    };
    ProformaController.savePartialPay = function (res, data) {
        var pay_data = {
            date: Date.now(),
            amount: data['amount_partially_paid']
        };
        proforma_model_1.RecentProformaModel.findByIdAndUpdate(data['id'], { $push: { "amount_partially_paid": { date: pay_data['date'], amount: pay_data['amount'] } } }, { safe: true, upsert: true, new: true }, function (err, docs) {
            var total_partial_pay = 0;
            _.each(docs['amount_partially_paid'], function (item) {
                total_partial_pay += item['amount'];
            });
            if (total_partial_pay >= docs['total']) {
                proforma_model_1.RecentProformaModel.update({ _id: data['id'] }, {
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
                proforma_model_1.RecentProformaModel.update({ _id: data['id'] }, {
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
    ProformaController.preGenerateUpdate = function (res, data) {
        if (data['type'] == 'recent') {
            proforma_model_1.RecentProformaModel.update({ _id: data.id }, {
                $set: {
                    amount_due: data.amount_due,
                    invoice_number : data.invoice_number,
                    po_number : data.po_number,
                    discount: data.discount,
                    disc : data.disc,
                    remarks: data.remarks,
                    tnc : data.tnc,
                    productList: data.productList,
                    productList2: data.productList2,
                    qty : data.qty,
                    total: data.total,
                    vdate : data.vdate,
                    amount_partially_paid: data.amount_partially_paid,
                    name : data.name,
                    taxPercent : data.taxPercent,
                    tax : data.tax,
                    subTotal: data.subTotal,
                    grantTotal : data.grantTotal,
                    cost: data.cost,
                    hsn_code : data.hsn_code
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
            proforma_model_1.AllProformaModel.update({ _id: data.id }, {
                $set: {
                    amount_due: data.amount_due,
                    invoice_number : data.invoice_number,
                    po_number : data.po_number,
                    remarks : data.remarks,
                    tnc : data.tnc,
                    vdate : data.vdate,
                    discount: data.discount,
                    disc : data.discount,
                    qty : data.qty,
                    productList: data.productList,
                    productList2: data.productList2,
                    total: data.total,
                    amount_partially_paid: data.amount_partially_paid,
                    name : data.name,
                    taxPercent : data.taxPercent,
                    tax : data.tax,
                    subTotal: data.subTotal,
                    grantTotal : data.grantTotal,
                    cost: data.cost,
                    hsn_code : data.hsn_code
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
    ProformaController.deleteProforma = function (res, data) {
        if (data['type'] === 'recent') {
            proforma_model_1.RecentProformaModel.find({ _id: data['_id'] }).remove(function (err) {
                if (!err) {
                    res.send({ status: true });
                }
                else {
                    res.send({ status: false });
                }
            });
        }
        else {
            proforma_model_1.AllProformaModel.find({ _id: data['_id'] }).remove(function (err) {
                if (!err) {
                    res.send({ status: true });
                }
                else {
                    res.send({ status: false });
                }
            });
        }
    };
    ProformaController.getAllProformas = function (res, paginationCount) {
        var skip_count = (paginationCount - 1) * 30;
        proforma_model_1.AllProformaModel.find({}).skip(skip_count).limit(30).exec(function (err, data) {
            if (!err) {
                res.send(data);
            }
            else {
                res.send({ status: false });
            }
        });
    };
    return ProformaController;
}());
exports.ProformaController = ProformaController;
