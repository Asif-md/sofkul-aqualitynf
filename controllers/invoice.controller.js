
var _ = require("underscore");
var customer_model_1 = require("../database/models/customer.model");
var invoice_model_1 = require("../database/models/invoice.model");
var product_model_1 = require("../database/models/product.model");
var path = require("path");
var fs = require("fs");
var InvoiceController = /** @class */ (function () {
    function InvoiceController() {
    }
    InvoiceController.removeInvoice = function (res, data) {
        res.send(data);
    };
    InvoiceController.createNewInvoice = function (res, data) {
        var invoice = new invoice_model_1.AllInvoiceModel({
            customer_id: data.customer_id,
            nid : data.nid,
            invoice_number: data.invoice_number,
            po_number : data.po_number,
            payment_due_date: data.date,
            paid_date : data.paid_date,
            amount_due: data.total,
            status: data.status,
            total: data.total,
            discount: data.discount,
            disc : data.disc,
            qty : data.qty,
            invoice_created_date: data.date,
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
        invoice.save(function (err, data) {
            if (!err) {
                res.send(data);
            }
            else {
                res.send({ status: false });
            }
        });
    };
    InvoiceController.getInvoiceByCustomerId = function (res, id) {
        var res_data = [];
        invoice_model_1.AllInvoiceModel.find({ customer_id: id }, function (err, data) {
            if (!err) {
                var res_data_1 = data;
                invoice_model_1.RecentInvoiceModel.findOne({ customer_id: id }, function (err, data) {
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
    InvoiceController.globalSearchByCustomer = function (res, text) {
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
    InvoiceController.saveAutoInvoice = function (res, req) {
        var base64Data = req.body.pdf;
        var imageBuffer = InvoiceController.decodeBase64Image(base64Data);
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
    InvoiceController.decodeBase64Image = function (dataString) {
        var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/), response = {};
        if (matches.length !== 3) {
            return new Error('Invalid input string');
        }
        response['type'] = matches[1];
        response['data'] = new Buffer(matches[2], 'base64');
        return response;
    };

    InvoiceController.getAllInvoiceCount = function (res) {
        invoice_model_1.AllInvoiceModel.count(function (err, c) {
            if (!err) {
                res.send({ count: c });
            }
            else {
                res.send({ count: 0 });
            }
        });
    };
    
    InvoiceController.getRecentInvoiceCustomers = function (res) {
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
    InvoiceController.storeInvoice = function (res, data) {
        var invoice = new invoice_model_1.AllInvoiceModel({
            customer_id: data.customer_id,
            nid: data.nid,
            invoice_number: data.invoice_number,
            po_number : data.po_number,
            payment_due_date: data.payment_due_date,
            amount_due: data.amount_due,
            status: data.status,
            total: data.total,
            qty : data.qty,
            discount: data.discount,
            disc : data.disc,
            invoice_created_date: data.invoice_created_date,
            remarks: data.remarks,
            tnc : data.tnc,
            paid_date: data.paid_date,
            vdate : data.vdate,
            amount_partially_paid: data.amount_partially_paid,
            productList: data.productList,
            productList2: data.productList2,
            type: "all",
            name: data.name,
            taxPercent : data.taxPercent,
            tax : data.tax,
            subTotal : data.subTotal,
            grantTotal : data.grantTotal,
            cost : data.cost,
            hsn_code : data.hsn_code
        });
        invoice.save(function (err, data) {
            if (err) {
                res.send({ status: false });
            }
            else {
                res.send({ status: true, id: data._id });
            }
        });
    };
    InvoiceController.generateInvoice = function (res, data) {
        res.send(data);
    };
    InvoiceController.getInvoiceById = function (res, type, id) {
        if (type == 'recent') {
            invoice_model_1.RecentInvoiceModel.findById(id, function (err, data) {
                res.send(data);
            });
        }
        else if (type == 'all') {
            invoice_model_1.AllInvoiceModel.findById(id, function (err, data) {
                res.send(data);
            });
        }
        else {
            res.send({ status: false });
        }
    };
    InvoiceController.searchByUsername = function (res, data) {
        invoice_model_1.AllInvoiceModel.find({ "username": { $regex: ".*" + data.text + ".*", $options: 'i' } }, function (err, data) {
            if (!err) {
                res.send(data);
            }
        });
    };
    InvoiceController.saveRecentInvoice = function (res, data) {
        var invoice = new invoice_model_1.RecentInvoiceModel({
            customer_id: data.customer_id,
            invoice_number: data.invoice_number,
            po_number : data.po_number,
            payment_due_date: data.payment_due_date,
            amount_due: data.amount_due,
            status: data.status,
            remarks: data.remarks,
            tnc : data.tnc,
            total: data.total,
            qty : data.qty,
            discount: data.discount,
            disc : data.disc,
            paid_date: data.paid_date,
            vdate : data.vdate,
            remarks: data.remarks,
            amount_partially_paid: data.amount_partially_paid,
            productList: data.productList,
            productList2: data.productList2,
            type: "recent",
            name: data.name,
            taxPercent : data.taxPercent,
            tax : data.tax,
            subTotal : data.subTotal,
            grantTotal : data.grantTotal,
            cost : data.cost,
            hsn_code : data.hsn_code
        });
        invoice.save(function (err, data) {
            if (err) {
                res.send({ status: false });
            }
            else {
                res.send({ status: true, id: data._id });
            }
        });
    };
    InvoiceController.dropRecentInvoiceAll = function (res) {
        if (invoice_model_1.RecentInvoiceModel.collection.drop()) {
            res.send({ status: true });
        }
        else {
            res.send({ status: false });
        }
    };
    InvoiceController.checkRecentInvoiceExists = function (res) {
        invoice_model_1.RecentInvoiceModel.count({}, function (err, count) {
            res.send({ "count": count });
        });
    };
    InvoiceController.getRecentInvoiceDB = function (res, paginationCount) {
        var skip_count = (paginationCount - 1) * 30;
        invoice_model_1.RecentInvoiceModel.find({}).skip(skip_count).limit(30).exec(function (err, data) {
            if (!err) {
                res.send(data);
            }
            else {
                res.send({ status: false });
            }
        });
    };
    InvoiceController.cleanInvoice = function (res) {
        var isClean = false;
        var date = new Date();
        var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        invoice_model_1.RecentInvoiceModel.find({
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
                var invoice = new invoice_model_1.AllInvoiceModel({
                    recent_id: obj['_id'],
                    customer_id: obj['customer_id'],
                    invoice_number: obj['invoice_number'],
                    po_number : obj['po_number'],
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
                    cost : data.cost,
                    hsn_code : obj['hsn_code']
                });
                invoice.save(function (err, newData) {
                    if (!err) {
                        invoice_model_1.RecentInvoiceModel.findOne({ '_id': newData['recent_id'] }).remove(function (err) {
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
                                        var newInvoice_1 = new invoice_model_1.RecentInvoiceModel({
                                            customer_id: customer['_id'],
                                            invoice_number : [''],
                                            po_number : [''],
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
                                        product_model_1.ProductModel.find({ "_id": { "$in": customer['productList', 'productList2'] } }, function (err, docs) {
                                            _.each(docs, function (item) {
                                                newInvoice_1['total'] += item['rate'];
                                            });
                                            newInvoice_1['amount_due'] = newInvoice_1['total'];
                                            newInvoice_1.save(function () {
                                                // console.log(data);
                                            });
                                        });
                                    }
                                });
                            }
                        });
                    }
                    else {
                        res.send({ status: 'error in invoice save' });
                    }
                });
            });
        }, function () {
            res.send({ "status": isClean });
        });
    };
    InvoiceController.changeStatus = function (res, data) {
        if (data['type'] == 'recent') {
            invoice_model_1.RecentInvoiceModel.update({ _id: data['_id'] }, {
                $set: {
                    customer_id: data['customer_id'],
                    nid : data ['nid'],
                    invoice_number : data ['invoice_number'],
                    po_number : datra['po_number'],
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
                    hsn_code : data['hsn_code']
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
            invoice_model_1.AllInvoiceModel.update({ _id: data['_id'] }, {
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
    InvoiceController.buildAndSaveRecentInvoice = function (res) {
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
                var invoice = new invoice_model_1.RecentInvoiceModel({
                    customer_id: customer['_id'],
                    invoice_number: [''],
                    po_number : [''],
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
                    hsn_code : [],

                });
                product_model_1.ProductModel.find({ "_id": { "$in": customer['productList', 'productList2'] } }, function (err, docs) {
                    _.each(docs, function (item) {
                        invoice['total'] += item['rate'];
                    });
                    invoice['amount_due'] = invoice['total'];
                    invoice.save(function () {
                        // console.log(data);
                    });
                });
            });
            res.send({ status: true });
        });
    };
    InvoiceController.savePartialPay = function (res, data) {
        var pay_data = {
            date: Date.now(),
            amount: data['amount_partially_paid'] 
        };
        invoice_model_1.RecentInvoiceModel.findByIdAndUpdate(data['id'], { $push: { "amount_partially_paid": { date: pay_data['date'], amount: pay_data['amount'] } } }, { safe: true, upsert: true, new: true }, function (err, docs) {
            var total_partial_pay = 0;
            _.each(docs['amount_partially_paid'], function (item) {
                total_partial_pay += item['amount'];
            });
            if (total_partial_pay >= docs['grantTotal']) {
                invoice_model_1.RecentInvoiceModel.update({ _id: data['id'] }, {
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
                invoice_model_1.RecentInvoiceModel.update({ _id: data['id'] }, {
                    $set: {
                        status: 'Partially Paid',
                        amount_due: docs['grantTotal'] - total_partial_pay
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
    InvoiceController.preGenerateUpdate = function (res, data) {
        if (data['type'] == 'recent') {
            invoice_model_1.RecentInvoiceModel.update({ _id: data.id }, {
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
            invoice_model_1.AllInvoiceModel.update({ _id: data.id }, {
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
    InvoiceController.deleteInvoice = function (res, data) {
        if (data['type'] === 'recent') {
            invoice_model_1.RecentInvoiceModel.find({ _id: data['_id'] }).remove(function (err) {
                if (!err) {
                    res.send({ status: true });
                }
                else {
                    res.send({ status: false });
                }
            });
        }
        else {
            invoice_model_1.AllInvoiceModel.find({ _id: data['_id'] }).remove(function (err) {
                if (!err) {
                    res.send({ status: true });
                }
                else {
                    res.send({ status: false });
                }
            });
        }
    };
    InvoiceController.getAllInvoices = function (res, paginationCount) {
        var skip_count = (paginationCount - 1) * 30;
        invoice_model_1.AllInvoiceModel.find({}).skip(skip_count).limit(30).exec(function (err, data) {
            if (!err) {
                res.send(data);
            }
            else {
                res.send({ status: false });
            }
        });
    };
    return InvoiceController;
}());
exports.InvoiceController = InvoiceController;
