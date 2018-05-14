
var product_model_1 = require("../database/models/product.model");
var _ = require("underscore");



var ProductController = /** @class */ (function () {
    function ProductController() {
    }


    //create new product
    ProductController.create = function (res, data) {
        var product = new product_model_1.ProductModel({
            name: data.name,
            rate: data.rate,
            quantity: data.quantity,
            hsn_code : data.hsn_code,
            description: data.description,
            status: data.status,
            vat: data.vat
        }); 
        product.save(function (err) {
            if (err) {
                res.send({ status: false });
            }
            else {
                res.send({ status: true });
            }
        });
    };
    //get all product
    ProductController.getAllProduct = function (res) {
        product_model_1.ProductModel.find({}, function (err, products) {
            if (!err) {
                res.send(products);
            }
        });
    };

    ProductController.getAllProductCount = function (res) {
        product_model_1.ProductModel.count(function (err, c) {
            if (!err) {
                res.send({ count: c });
            }
            else
                {
                    res.send({ count: 0 });
                }
                    
        });
    };

    //changing status - active/inactive
    ProductController.changeStatus = function (res, data) {
        product_model_1.ProductModel.update({ _id: data.id }, { $set: { status: data.status } }, function (err) {
            if (err) {
                res.send({ status: false });
            }
            else {
                res.send({ status: true });
            }
        });
    };
    //get product by _id
    ProductController.getProductById = function (res, id) {
        product_model_1.ProductModel.findOne({ _id: id }, function (err, data) {
            res.send(data);
        });
    };
    //update product
    ProductController.update = function (res, data) {
        product_model_1.ProductModel.update({ _id: data.id }, {
            $set: {
                name: data.name,
                rate: data.rate,
                quantity: data.quantity,
                hsn_code : data.hsn_code,
                description: data.description,
                status: data.status,
                vat: data.vat
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
    //search products list by name
    ProductController.searchByName = function (res, data) {
        product_model_1.ProductModel.find({ "name": { $regex: ".*" + data.text + ".*", $options: 'i' } }, function (err, data) {
            if (!err) {
                res.send(data);
            }
        });
    };
    // get total of all products of productList
    ProductController.getTotal = function (res, data) {
        var total = 0;
        product_model_1.ProductModel.find({ "_id": { "$in": data['productList'] } }, function (err, docs) {
            _.each(docs, function (item) {
                total += item['rate'];
            });
            res.send({ total: total });
        });
    };

    ProductController.deleteProduct = function (res, data) {
        product_model_1.ProductModel.deleteProduct({ _id: data.id }, {
            $set: {
                name: data.name,
                rate: data.rate,
                quantity: data.quantity,
                hsn_code : data.hsn_code,
                description: data.description,
                status: data.status,
                vat: data.vat
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

  /*  ProductController.deleteProduct = function (res, data) {
        if (data['type'] === 'recent') {
            product_model_1.RecentProductModel.find({ _id: data['_id'] }).remove(function (err) {
                if (!err) {
                    res.send({ status: true });
                }
                else {
                    res.send({ status: false });
                }
            });
        }
        else {
            product_model_1.AllProductModel.find({ _id: data['_id'] }).remove(function (err) {
                if (!err) {
                    res.send({ status: true });
                }
                else {
                    res.send({ status: false });
                }
            });
        }
    }; */
    return ProductController;
}());
exports.ProductController = ProductController;
