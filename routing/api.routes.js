/*
 * API endpoints are defined here
 * all routes start with /api
 */
var express_1 = require("express");
//const session = require('express-session');

var customer_controller_1 = require("../controllers/customer.controller");
var product_controller_1 = require("../controllers/product.controller");
var area_controller_1 = require("../controllers/area.controller");
var invoice_controller_1 = require("../controllers/invoice.controller");
var quotation_controller_1 = require("../controllers/quotation.controller");
var proforma_controller_1 = require("../controllers/proforma.controller");
var delivery_controller_1 = require("../controllers/delivery.controller");
var payDateCounter_controller_1 = require("../controllers/payDateCounter.controller");
var report_controller_1 = require("../controllers/report.controller");
var router = express_1.Router();
var multer = require('multer');
var upload = multer();
var passport = require('passport');
var jwt = require('jsonwebtoken');
const config = require('../database/config');
var db_config_1 = require('../database/db.config');
var User = require('../database/models/user.model');



var type = upload.single('csvFile');



router.get('/', function (req, res) {
  //  res.send("Welcome to API routes");
    if(req.session.page_views){
        req.session.page_views++;
        res.send("You visited this page " + req.session.page_views + " times");
     } else {
        req.session.page_views = 1;
        res.send("Welcome to this page for the first time!");
     }
});




//customer file upload
router.post('/customer/create', function (req, res) {
    customer_controller_1.CustomerController.createNewCustomer(res, req.body);
});
//all customers
router.get('/customer/all/page=:paginator', function (req, res) {
    customer_controller_1.CustomerController.getAllCustomers(res, req.params.paginator);
});
//set active/inactive status
router.put('/customer/status_change', function (req, res) {
    customer_controller_1.CustomerController.changeStatus(res, req.body);
});
//get details of specific customer by id
router.get('/customer/details/:id', function (req, res) {
    customer_controller_1.CustomerController.getCustomerDetails(res, req.params.id);
});
//update customer details
router.put('/customer/details/update', function (req, res) {
    customer_controller_1.CustomerController.updateCustomerDetails(res, req.body);
});
// create new product
router.post('/product/create', function (req, res) {
    product_controller_1.ProductController.create(res, req.body);
});
// get all product
router.get('/product/all', function (req, res) {
    product_controller_1.ProductController.getAllProduct(res);
});

   router.get('/product/product-count', function (req, res) {
    product_controller_1.ProductController.getAllProductCount(res);
    });
//get product by id
router.get('/product/id/:id', function (req, res) {
    product_controller_1.ProductController.getProductById(res, req.params.id);
});
//set active/inactive status
router.put('/product/status_change', function (req, res) {
    product_controller_1.ProductController.changeStatus(res, req.body);
});
//update product
router.put('/product/update', function (req, res) {
    product_controller_1.ProductController.update(res, req.body);
});

//delete product
router.post('/product/delete', function (req, res) {
    product_controller_1.ProductController.deleteProduct(res, req.body);
});


//create a new area
router.post('/area/create', function (req, res) {
    area_controller_1.AreaController.create(res, req.body);
});
//get all areas
router.get('/area/all', function (req, res) {
    area_controller_1.AreaController.getAllArea(res);
});
//set active/inactive status
router.put('/area/status_change', function (req, res) {
    area_controller_1.AreaController.changeStatus(res, req.body);
});
//get area by id
router.get('/area/id/:id', function (req, res) {
    area_controller_1.AreaController.getAreaById(res, req.params.id);
});
//update area
router.put('/area/update', function (req, res) {
    area_controller_1.AreaController.update(res, req.body);
});
//search all customers data by username
router.post('/customer/search/username', function (req, res) {
    customer_controller_1.CustomerController.searchByUsername(res, req.body);
});
//search all customers data by mobile number
router.post('/customer/search/mobile_number', function (req, res) {
    customer_controller_1.CustomerController.searchByMobileNumber(res, req.body);
});
//search all customers data by area
router.post('/customer/search/area', function (req, res) {
    customer_controller_1.CustomerController.searchByArea(res, req.body);
});
//search all customers data by area id
router.post('/customer/search/customerByArea', function (req, res) {
    customer_controller_1.CustomerController.customerByArea(res, req.body);
});
router.get('/customer/id/username=:username', function (req, res) {
    customer_controller_1.CustomerController.getIdByUsername(res, req.params.username);
});
//get recent invoices (this month)
router.get('/invoice/recent/customers', function (req, res) {
    invoice_controller_1.InvoiceController.getRecentInvoiceCustomers(res);
});
//search all products data by name
router.post('/product/search/name', function (req, res) {
    product_controller_1.ProductController.searchByName(res, req.body);
});




// post invoice
router.post('/invoice/create', function (req, res) {
    invoice_controller_1.InvoiceController.storeInvoice(res, req.body);
});
// generate invoice as PDF
router.post('/invoice/generate/pdf', function (req, res) {
    invoice_controller_1.InvoiceController.generateInvoice(res, req.body);
});
// get invoice by id
router.get('/invoice/:type/id/:id', function (req, res) {
    invoice_controller_1.InvoiceController.getInvoiceById(res, req.params.type, req.params.id);
});
//search all customers data by username
router.post('/invoice/search/username', function (req, res) {
    invoice_controller_1.InvoiceController.searchByUsername(res, req.body);
});
// insert recent invoice into DB
router.post('/invoice/recent/save', function (req, res) {
    invoice_controller_1.InvoiceController.saveRecentInvoice(res, req.body);
});
//drop all recent invoices
router.get('/invoice/drop/recent/all', function (req, res) {
    invoice_controller_1.InvoiceController.dropRecentInvoiceAll(res);
});
//check if recent invoices exists
router.get('/invoice/recent_invoice/exists', function (req, res) {
    invoice_controller_1.InvoiceController.checkRecentInvoiceExists(res);
});
// get invoice from db
router.get('/invoice/recent_invoice_db/paginator=:paginator', function (req, res) {
    invoice_controller_1.InvoiceController.getRecentInvoiceDB(res, req.params.paginator);
});
// clean and nuke recent invoices
router.get('/invoice/clean_invoice', function (req, res) {
    invoice_controller_1.InvoiceController.cleanInvoice(res);
});
router.put('/invoice/change_status', function (req, res) {
    invoice_controller_1.InvoiceController.changeStatus(res, req.body);
});
router.post('/invoice/product_list/total', function (req, res) {
    product_controller_1.ProductController.getTotal(res, req.body);
});
router.get('/invoice/recent/build_and_save', function (req, res) {
    invoice_controller_1.InvoiceController.buildAndSaveRecentInvoice(res);
});
//////////////////////
/*router.get('/quotation/recent/build_and_save', (req: Request, res: Response) => {
    QuotationController.buildAndSaveRecentQuotation(res);
});
*/
router.post('/invoice/recent/partial_pay/save', function (req, res) {
    invoice_controller_1.InvoiceController.savePartialPay(res, req.body);
});
router.post('/invoice/pre_generate_update', function (req, res) {
    invoice_controller_1.InvoiceController.preGenerateUpdate(res, req.body);
});
router.post('/quotation/pre_generate_update', function (req, res) {
    quotation_controller_1.QuotationController.preGenerateUpdate(res, req.body);
});
///
router.post('/invoice/delete', function (req, res) {
    invoice_controller_1.InvoiceController.deleteInvoice(res, req.body);
});
// get all invoices
router.get('/invoice/all/page=:paginator', function (req, res) {
    invoice_controller_1.InvoiceController.getAllInvoices(res, req.params.paginator);
});
// create new invoice
router.post('/invoice/create/new', function (req, res) {
    invoice_controller_1.InvoiceController.createNewInvoice(res, req.body);
});
//pay date coounter clean
router.get('/home/pay-date-counter/clean-build', function (req, res) {
    payDateCounter_controller_1.PayDateCounterController.checkAndCleanPayDateCounter(res);
});
//set pay date counter
router.post('/invoice/set_paid_date_counter', function (req, res) {
    payDateCounter_controller_1.PayDateCounterController.setPayDateCounter(res, req.body);
});
// get pay date counter
router.get('/invoice/get_paid_date_counter', function (req, res) {
    payDateCounter_controller_1.PayDateCounterController.getPayDateCounter(res);
});
// get all invoice count
router.get('/invoice/all_invoice_count', function (req, res) {
    invoice_controller_1.InvoiceController.getAllInvoiceCount(res);
});
// save auto invoive
router.post('/invoice/save-auto-invoice', function (req, res) {
    invoice_controller_1.InvoiceController.saveAutoInvoice(res, req);
});
// global invoice search by customer
router.get('/invoice/global-search-by-customer/:query', function (req, res) {
    invoice_controller_1.InvoiceController.globalSearchByCustomer(res, req.params.query);
});
//get invoice by customer id
router.get('/invoice/by-customer-id/:id', function (req, res) {
    invoice_controller_1.InvoiceController.getInvoiceByCustomerId(res, req.params.id);
});
// remove Invoice
router.post('/invoice/remove-invoice', function (req, res) {
    invoice_controller_1.InvoiceController.removeInvoice(res, req.body);
});


//get customer by area
router.get('/report/customer_by_area/:id', function (req, res) {
    report_controller_1.ReportController.getCustomerByArea(res, req.params.id);
});
// generate report for a list of customers\

router.get('/report/report_for_customers/:id', function (req, res) {
    report_controller_1.ReportController.getReportForCustomers(res, req.params.id);
});




// check status change for generate invoice monthly
router.post('/customer/check_change_generate_invoice_monthly', function (req, res) {
    customer_controller_1.CustomerController.setCheckGenerateInvoice(res, req.body);
});
router.post('/upload-file', function (req, res) {
    customer_controller_1.CustomerController.uploadFile(res, req.body);
});
router.post('/customer/upload-file-contents', type, function (req, res, next) {
    customer_controller_1.CustomerController.getFileContents(res, req);
});
router.get('/customer/customer-count', function (req, res) {
    customer_controller_1.CustomerController.getTotalCustomerCount(res);
});
router.get('/customer/generate-auto-invoice/:id', function (req, res) {
    customer_controller_1.CustomerController.generateAutoInvoice(res, req.params.id);
});
router.get('/customer/global-search/:query', function (req, res) {
    customer_controller_1.CustomerController.searchAllCustomer(res, req.params.query);
});
router.get('/customer/get-auto-generate-list', function (req, res) {
    customer_controller_1.CustomerController.getAutoGenerateCustomerList(res);
});
//get recent quotations (this month)
router.get('/quotation/recent/customers', function (req, res) {
    quotation_controller_1.QuotationController.getRecentQuotationCustomers(res);
});
// post quotation
router.post('/quotation/create', function (req, res) {
    quotation_controller_1.QuotationController.storeQuotation(res, req.body);
});
// generate quotation as PDF
router.post('/quotation/generate/pdf', function (req, res) {
    quotation_controller_1.QuotationController.generateQuotation(res, req.body);
});
// get quotation by id
router.get('/quotation/:type/id/:id', function (req, res) {
    quotation_controller_1.QuotationController.getQuotationById(res, req.params.type, req.params.id);
});
//search all customers data by username
router.post('/quotation/search/username', function (req, res) {
    quotation_controller_1.QuotationController.searchByUsername(res, req.body);
});
// insert recent quotation into DB
router.post('/quotation/recent/save', function (req, res) {
    quotation_controller_1.QuotationController.saveRecentQuotation(res, req.body);
});
//drop all recent quotations
router.get('/quotation/drop/recent/all', function (req, res) {
    quotation_controller_1.QuotationController.dropRecentQuotationAll(res);
});
//check if recent quotations exists
router.get('/quotation/recent_quotation/exists', function (req, res) {
    quotation_controller_1.QuotationController.checkRecentQuotationExists(res);
});
// get Quotation from db
router.get('/quotation/recent_quotation_db/paginator=:paginator', function (req, res) {
    quotation_controller_1.QuotationController.getRecentQuotationDB(res, req.params.paginator);
});
// clean and nuke recent quotations
router.get('/quotation/clean_quotation', function (req, res) {
    quotation_controller_1.QuotationController.cleanQuotation(res);
});
router.put('/quotation/change_status', function (req, res) {
    quotation_controller_1.QuotationController.changeStatus(res, req.body);
});
router.post('/quotation/product_list/total', function (req, res) {
    product_controller_1.ProductController.getTotal(res, req.body);
});
router.post('/quotation/delete', function (req, res) {
    quotation_controller_1.QuotationController.deleteQuotation(res, req.body);
});
// get all quotations
router.get('/quotation/all/page=:paginator', function (req, res) {
    quotation_controller_1.QuotationController.getAllQuotations(res, req.params.paginator);
});
// create new quotation
router.post('/quotation/create/new', function (req, res) {
    quotation_controller_1.QuotationController.createNewQuotation(res, req.body);
});
//set pay date counter
router.post('/quotation/set_paid_date_counter', function (req, res) {
    payDateCounter_controller_1.PayDateCounterController.setPayDateCounter(res, req.body);
});
// get pay date counter
router.get('/quotation/get_paid_date_counter', function (req, res) {
    payDateCounter_controller_1.PayDateCounterController.getPayDateCounter(res);
});
// get all quotation count
router.get('/quotation/all_quotation_count', function (req, res) {
    quotation_controller_1.QuotationController.getAllQuotationCount(res);
});
// global quotation search by customer
router.get('/quotation/global-search-by-customer/:query', function (req, res) {
    quotation_controller_1.QuotationController.globalSearchByCustomer(res, req.params.query);
});
//get quotation by customer id
router.get('/quotation/by-customer-id/:id', function (req, res) {
    quotation_controller_1.QuotationController.getQuotationByCustomerId(res, req.params.id);
});
// remove Quotation
router.post('/quotation/remove-quotation', function (req, res) {
    quotation_controller_1.QuotationController.removeQuotation(res, req.body);
});





// Proforma
//get recent proformas (this month)
router.get('/proforma/recent/customers', function (req, res) {
    proforma_controller_1.ProformaController.getRecentProformaCustomers(res);
});
// post proforma
router.post('/proforma/create', function (req, res) {
    proforma_controller_1.ProformaController.storeProforma(res, req.body);
});
// generate proforma as PDF
router.post('/proforma/generate/pdf', function (req, res) {
    proforma_controller_1.ProformaController.generateProforma(res, req.body);
});
// get proforma by id
router.get('/proforma/:type/id/:id', function (req, res) {
    proforma_controller_1.ProformaController.getProformaById(res, req.params.type, req.params.id);
});
//search all customers data by username
router.post('/proforma/search/username', function (req, res) {
    proforma_controller_1.ProformaController.searchByUsername(res, req.body);
});
// insert recent proforma into DB
router.post('/proforma/recent/save', function (req, res) {
    proforma_controller_1.ProformaController.saveRecentProforma(res, req.body);
});
//drop all recent proformas
router.get('/proforma/drop/recent/all', function (req, res) {
    proforma_controller_1.ProformaController.dropRecentProformaAll(res);
});
//check if recent proformas exists
router.get('/proforma/recent_proforma/exists', function (req, res) {
    proforma_controller_1.ProformaController.checkRecentProformaExists(res);
});
// get Proforma from db
router.get('/proforma/recent_proforma_db/paginator=:paginator', function (req, res) {
    proforma_controller_1.ProformaController.getRecentProformaDB(res, req.params.paginator);
});
// clean and nuke recent proformas
router.get('/proforma/clean_proforma', function (req, res) {
    proforma_controller_1.ProformaController.cleanProforma(res);
});
router.put('/proforma/change_status', function (req, res) {
    proforma_controller_1.ProformaController.changeStatus(res, req.body);
});
router.post('/proforma/product_list/total', function (req, res) {
    product_controller_1.ProductController.getTotal(res, req.body);
});
router.get('/proforma/recent/build_and_save', function (req, res) {
    proforma_controller_1.ProformaController.buildAndSaveRecentProforma(res);
});
router.post('/proforma/delete', function (req, res) {
    proforma_controller_1.ProformaController.deleteProforma(res, req.body);
});
// get all proformas
router.get('/proforma/all/page=:paginator', function (req, res) {
    proforma_controller_1.ProformaController.getAllProformas(res, req.params.paginator);
});
// create new proforma
router.post('/proforma/create/new', function (req, res) {
    proforma_controller_1.ProformaController.createNewProforma(res, req.body);
});
//set pay date counter
router.post('/proforma/set_paid_date_counter', function (req, res) {
    payDateCounter_controller_1.PayDateCounterController.setPayDateCounter(res, req.body);
});
// get pay date counter
router.get('/proforma/get_paid_date_counter', function (req, res) {
    payDateCounter_controller_1.PayDateCounterController.getPayDateCounter(res);
});
// get all proforma count
router.get('/proforma/all_proforma_count', function (req, res) {
    proforma_controller_1.ProformaController.getAllProformaCount(res);
});
// global proforma search by customer
router.get('/proforma/global-search-by-customer/:query', function (req, res) {
    proforma_controller_1.ProformaController.globalSearchByCustomer(res, req.params.query);
});
//get proforma by customer id
router.get('/proforma/by-customer-id/:id', function (req, res) {
    proforma_controller_1.ProformaController.getProformaByCustomerId(res, req.params.id);
});
// remove Proforma
router.post('/proforma/remove-proforma', function (req, res) {
    proforma_controller_1.ProformaController.removeProforma(res, req.body);
});
router.get('/proforma/recent/build_and_save', function (req, res) {
    proforma_controller_1.ProformaController.buildAndSaveRecentProforma(res);
});
router.post('/proforma/pre_generate_update', function (req, res) {
    proforma_controller_1.ProformaController.preGenerateUpdate(res, req.body);
});
//Delivery
//get recent deliverys (this month)
router.get('/delivery/recent/customers', function (req, res) {
    delivery_controller_1.DeliveryController.getRecentDeliveryCustomers(res);
});
// post delivery
router.post('/delivery/create', function (req, res) {
    delivery_controller_1.DeliveryController.storeDelivery(res, req.body);
});
// generate delivery as PDF
router.post('/delivery/generate/pdf', function (req, res) {
    delivery_controller_1.DeliveryController.generateDelivery(res, req.body);
});
// get delivery by id
router.get('/delivery/:type/id/:id', function (req, res) {
    delivery_controller_1.DeliveryController.getDeliveryById(res, req.params.type, req.params.id);
});
//search all customers data by username
router.post('/delivery/search/username', function (req, res) {
    delivery_controller_1.DeliveryController.searchByUsername(res, req.body);
});
// insert recent delivery into DB
router.post('/delivery/recent/save', function (req, res) {
    delivery_controller_1.DeliveryController.saveRecentDelivery(res, req.body);
});
//drop all recent deliverys
router.get('/delivery/drop/recent/all', function (req, res) {
    delivery_controller_1.DeliveryController.dropRecentDeliveryAll(res);
});
//check if recent deliverys exists
router.get('/delivery/recent_delivery/exists', function (req, res) {
    delivery_controller_1.DeliveryController.checkRecentDeliveryExists(res);
});
// get delivery from db
router.get('/delivery/recent_delivery_db/paginator=:paginator', function (req, res) {
    delivery_controller_1.DeliveryController.getRecentDeliveryDB(res, req.params.paginator);
});
// clean and nuke recent deliverys
router.get('/delivery/clean_delivery', function (req, res) {
    delivery_controller_1.DeliveryController.cleanDelivery(res);
});
router.put('/delivery/change_status', function (req, res) {
    delivery_controller_1.DeliveryController.changeStatus(res, req.body);
});
router.post('/delivery/product_list/total', function (req, res) {
    product_controller_1.ProductController.getTotal(res, req.body);
});
router.get('/delivery/recent/build_and_save', function (req, res) {
    delivery_controller_1.DeliveryController.buildAndSaveRecentDelivery(res);
});
router.post('/delivery/delete', function (req, res) {
    delivery_controller_1.DeliveryController.deleteDelivery(res, req.body);
});
// get all deliverys
router.get('/delivery/all/page=:paginator', function (req, res) {
    delivery_controller_1.DeliveryController.getAllDeliveries(res, req.params.paginator);
});
// create new delivery
router.post('/delivery/create/new', function (req, res) {
    delivery_controller_1.DeliveryController.createNewDelivery(res, req.body);
});
//set pay date counter
router.post('/delivery/set_paid_date_counter', function (req, res) {
    payDateCounter_controller_1.PayDateCounterController.setPayDateCounter(res, req.body);
});
// get pay date counter
router.get('/delivery/get_paid_date_counter', function (req, res) {
    payDateCounter_controller_1.PayDateCounterController.getPayDateCounter(res);
});
// get all delivery count
router.get('/delivery/all_delivery_count', function (req, res) {
    delivery_controller_1.DeliveryController.getAllDeliveryCount(res);
});
// global delivery search by customer
router.get('/delivery/global-search-by-customer/:query', function (req, res) {
    delivery_controller_1.DeliveryController.globalSearchByCustomer(res, req.params.query);
});
//get delivery by customer id
router.get('/delivery/by-customer-id/:id', function (req, res) {
    delivery_controller_1.DeliveryController.getDeliveryByCustomerId(res, req.params.id);
});
// remove delivery
router.post('/delivery/remove-delivery', function (req, res) {
    delivery_controller_1.DeliveryController.removeDelivery(res, req.body);
});
router.get('/delivery/recent/build_and_save', function (req, res) {
    delivery_controller_1.DeliveryController.buildAndSaveRecentDelivery(res);
});
router.post('/delivery/pre_generate_update', function (req, res) {
    delivery_controller_1.DeliveryController.preGenerateUpdate(res, req.body);
});


// Register
router.post('/register', (req, res, next) => {
    let newUser = new User ({
      name: req.body.name,
      email: req.body.email,
      username: req.body.username,
      password: req.body.password
    });
  
    User.addUser(newUser, (err, user) => {
      if(err) {
        res.json({success: false, msg: 'Failed to register user'});
      } else {
        res.json({success: true, msg: 'User registered'});
      }
    });
  });
  
  // Authenticate
  router.post('/authenticate', (req, res, next) => {

    const username = req.body.username;
    const password = req.body.password;
  
    User.getUserByUsername(username, (err, user) => {
      if(err) throw err;
      if(!user) {
        return res.json({success: false, msg: 'User not found'});
      }
  
      User.comparePassword(password, user.password, (err, isMatch) => {
        if(err) throw err;
        if(isMatch) {
          const token = jwt.sign({data: user}, config.secret, {
            expiresIn: 604800 // 1 week
          });
          res.json({
            success: true,
            token: 'JWT '+token,
            user: {
              id: user._id,
              name: user.name,
              username: user.username,
              email: user.email
            }
          })
        } else {
          return res.json({success: false, msg: 'Wrong password, please enter the correct password!'});
        }
      });
    });
  });
  
  // Profile
  router.get('/profile', passport.authenticate('jwt', {session:false}), (req, res, next) => {
    res.json({user: req.user});
  });


exports.ApiRoute = router;
