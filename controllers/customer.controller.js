
var customer_model_1 = require("../database/models/customer.model");
var _ = require("underscore");
var area_model_1 = require("../database/models/area.model");
var invoice_model_1 = require("../database/models/invoice.model");
var product_model_1 = require("../database/models/product.model");
var textract = require('textract');
var packageData = {
  /*  "512Kbps": 500,
    "1Mbps": 1000,
    "2Mbps": 1500,
    "3Mbps": 2000*/
};
/*
 * Controller to handle request to api/customer/
 */
var CustomerController = /** @class */ (function () {
    function CustomerController() {
    }
    CustomerController.searchAllCustomer = function (res, text) {
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
    CustomerController.getFileContents = function (res, req) {
        var fileBuffer = req.file.buffer;
        var allData = fileBuffer.toString('utf-8').split(/\r\n|\n/);
        var isDataInserted = false;
        var _loop_1 = function (i) {
            var data = allData[i].split(',');
            if (_.isEmpty(data[0]) || _.isUndefined(data[0]) || data[0] == '') {
                return "continue";
            }
            if (data[14] == '1900') {
                return "continue";
            }
            var timestamp = Date.now();
            var status_1 = false;
            if (data[15] == 1) {
                status_1 = true;
            }
            area_model_1.AreaModel.findOneAndUpdate({ name: data[10] }, {
                $set: {
                    name: data[10]
                }
            }, {
                upsert: true,
                new: true
            }, function (err, docs) {
                if (!err) {
                    var area_id_1 = docs['_id'];
                    //get product id
                    var product_name = "";
                    if (!_.isUndefined(data[14])) {
                        product_name = data[14];
                        product_name = product_name.trim();
                    }
                    if (data[14] == '1900') {
                        product_name = '';
                    }
                    product_model_1.ProductModel.findOneAndUpdate({ name: product_name }, {
                        $set: {
                            name: data[14],
                            rate: packageData[product_name],
                            description: '',
                            status: true,
                            vat: 0
                        }
                    }, {
                        upsert: true,
                        new: true
                    }, function (err, pdocs) {
                        if (!err) {
                            var product_id = pdocs['_id'];
                            var customer = new customer_model_1.CustomerModel({
                                username: data[0],
                                gstno : "",
                                nid: "",
                                email: data[1],
                                fullname: data[2] + " " + data[3],
                                customer_currency: data[4],
                                mobile_primary: '+91' + data[5],
                                mobile_secondary: '+91' + data[6],
                                website: data[7],
                                country: data[8],
                                location: "",
                                ship_addr: "",
                                area: area_id_1,
                                city: data[12],
                                state : data[13],
                                postal_code: data[14],
                                description: data[15],
                                status: status_1,
                                productList: [product_id]
                            });
                            customer.save(function (err, newData) {
                                if (!err) {
                                    if (newData['status'] == 'true') {
                                        // generate invoice for recentDB
                                        isDataInserted = true;
                                        var date = new Date();
                                        var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
                                        var invoice_1 = new invoice_model_1.RecentInvoiceModel({
                                            customer_id: newData['_id'],
                                            payment_due_date: firstDay,
                                            amount_due: 0,
                                            status: 'Due',
                                            total: 0,
                                            discount: 0,
                                            amount_partially_paid: [],
                                            productList: newData['productList'],
                                            type: 'recent'
                                        });
                                        product_model_1.ProductModel.find({ "_id": { "$in": newData['productList'] } }, function (err, docs) {
                                            _.each(docs, function (item) {
                                                invoice_1['total'] += item['rate'];
                                            });
                                            invoice_1['amount_due'] = invoice_1['total'];
                                            invoice_1.save(function (err) {
                                                if (!err) {
                                                    console.log('Invoice created allright');
                                                }
                                            });
                                        });
                                    }
                                }
                                else {
                                    isDataInserted = false;
                                }
                            });
                        }
                    });
                }
            });
        };
        for (var i = 1; i < allData.length; i++) {
            _loop_1(i);
        }
        res.send({ status: isDataInserted });
    };
    CustomerController.uploadFile = function (res, data) {
        res.send(true);
    };
    //create a new customer
    CustomerController.createNewCustomer = function (res, data) {
        var isDataInserted = false;
        var timestamp = Date.now();
        var customer = new customer_model_1.CustomerModel({
            username: data.username,
            gstno : data.gstno,
            nid: data.nid,
            email: data.email,
            fullname: data.fullname,
            customer_currency: data.customer_currency,
            mobile_primary: data.mobile_primary,
            mobile_secondary: data.mobile_secondary,
            website: data.website,
            country: data.country,
            location: data.location,
            ship_addr : data.ship_addr,
            area: data.area,
            city: data.city,
            state : data.state,
            description: data.description,
            postal_code: data.postal_code,
            status: data.status,
            productList: data.productList
        });
        customer.save(function (err, newData) {
            if (err) {
                res.send({ status: false });
            }
            else {
                if (newData['status'] == 'true') {
                    var date = new Date();
                    var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
                    var invoice_2 = new invoice_model_1.RecentInvoiceModel({
                        customer_id: newData['_id'],
                        payment_due_date: firstDay,
                        amount_due: 0,
                        status: 'Due',
                        total: 0,
                        discount: 0,
                        amount_partially_paid: [],
                        productList: newData['productList'],
                        type: 'recent'
                    });
                    product_model_1.ProductModel.find({ "_id": { "$in": data['productList'] } }, function (err, docs) {
                        _.each(docs, function (item) {
                            invoice_2['total'] += item['rate'];
                        });
                        invoice_2['amount_due'] = invoice_2['total'];
                        invoice_2.save(function (err) {
                            if (!err) {
                                console.log('Invoice created allright');
                            }
                        });
                    });
                }
            }
            res.send({ status: true });
        });
    };
    //get all customers
    CustomerController.getAllCustomers = function (res, paginationCount) {
        if (paginationCount == 'all') {
            customer_model_1.CustomerModel.find({}, function (err, data) {
                res.send(data);
            });
        }
        else {
            var skip_count = (paginationCount - 1) * 40;
            customer_model_1.CustomerModel.find({}).sort('normalize').skip(skip_count).limit(40).exec(function (err, customers) {
                var allCustomers = [];
                if (!err) {
                    _.each(customers, function (item) {
                        if (item.username != 'user_name') {
                            allCustomers.push(item);
                        }
                    });
                    res.send(allCustomers);
                }
            });
        }
    };
    //changing status - active/inactive
    CustomerController.changeStatus = function (res, data) {
        customer_model_1.CustomerModel.update({ _id: data.id }, { $set: { status: data.status } }, function (err) {
            if (err) {
                res.send({ status: false });
            }
            else {
                res.send({ status: true });
            }
        });
    };
    //get details of a customer by id
    CustomerController.getCustomerDetails = function (res, id) {
        customer_model_1.CustomerModel.findById(id, function (err, data) {
            if (!err) {
                res.send(data);
            }
        });
    };
    //update customer details data
    CustomerController.updateCustomerDetails = function (res, data) {
        customer_model_1.CustomerModel.update({ _id: data.id }, {
            $set: {
                username: data.username,
                gstno: data.gstno,
                nid: data.nid,
                email: data.email,
                fullname: data.fullname,
                customer_currency: data.customer_currency,
                mobile_primary: data.mobile_primary,
                mobile_secondary: data.mobile_secondary,
                website: data.website,
                country: data.country,
                location: data.location,
                ship_addr: data.ship_addr,
                area: data.area,
                city: data.city,
                state : data.state,
                description: data.description,
                postal_code: data.postal_code,
                status: data.status,
                productList: data.productList
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
    //search customers list by username
    CustomerController.searchByUsername = function (res, data) {
        customer_model_1.CustomerModel.find({ "username": { $regex: ".*" + data.text + ".*", $options: 'i' } }, function (err, data) {
            if (!err) {
                res.send(data);
            }
        });
    };
    //search customers list by mobile number
    CustomerController.searchByMobileNumber = function (res, data) {
        customer_model_1.CustomerModel.find({ "mobile_primary": { $regex: ".*" + data.text + ".*", $options: 'i' } }, function (err, data) {
            if (!err) {
                res.send(data);
            }
        });
    };
    //search customers list by area
    CustomerController.searchByArea = function (res, data) {
        area_model_1.AreaModel.find({ "name": { $regex: ".*" + data.text + ".*", $options: 'i' } }, function (err, data) {
            if (!err) {
                res.send(data);
            }
        });
    };
    CustomerController.customerByArea = function (res, data) {
        customer_model_1.CustomerModel.find({ "area": data.text }, function (err, data) {
            if (!err) {
                res.send(data);
            }
        });
    };
    CustomerController.getIdByUsername = function (res, username) {
        customer_model_1.CustomerModel.find({ "username": { $regex: ".*" + username + ".*", $options: 'i' } }, function (err, data) {
            if (!err) {
                res.send(data);
            }
        });
    };
    CustomerController.setCheckGenerateInvoice = function (res, data) {
        customer_model_1.CustomerModel.update({ _id: data.id }, { $set: { isGenerateInvoiceMonthly: data.isGenerateInvoiceMonthly } }, function (err) {
            if (err) {
                res.send({ status: false });
            }
            else {
                res.send({ status: true });
            }
        });
    };
    CustomerController.getTotalCustomerCount = function (res) {
        customer_model_1.CustomerModel.count(function (err, c) {
            if (!err) {
                res.send({ count: c });
            }
            else
                [
                    res.send({ count: 0 })
                ];
        });
    };
    CustomerController.generateAutoInvoice = function (res, id) {
        customer_model_1.CustomerModel.findOne({ _id: id }, function (err, data) {
            if (!err) {
                var invoice_3 = {
                    customerData: data,
                    total: 0,
                    productData: [],
                    amount_due: 0,
                    status: 'Due',
                    discount: 0
                };
                product_model_1.ProductModel.find({ "_id": { "$in": invoice_3.customerData['productList'] } }, function (err, pdata) {
                    _.each(pdata, function (item) {
                        item['amount_with_vat'] = item['rate'] + (item['rate'] * (item['vat'] / 100));
                        invoice_3.productData.push(item);
                        invoice_3.total = invoice_3.total + item['amount_with_vat'];
                        invoice_3.amount_due = invoice_3.total;
                    });
                    res.send(invoice_3);
                });
            }
            else {
                res.send({ status: false });
            }
        });
    };
    CustomerController.getAutoGenerateCustomerList = function (res) {
        var query = customer_model_1.CustomerModel.find({ isGenerateInvoiceMonthly: true }).select('_id');
        query.exec(function (err, data) {
            if (!err) {
                res.send(data);
            }
            else {
                res.send({ status: false });
            }
        });
    };
    return CustomerController;
}());
exports.CustomerController = CustomerController;
