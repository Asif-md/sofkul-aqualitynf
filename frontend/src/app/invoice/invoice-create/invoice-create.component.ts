import {Component, OnInit, Input, OnChanges} from '@angular/core';
import {FormGroup, FormBuilder , FormArray , Validators } from "@angular/forms";
import {ProductService} from '../../product/product.service';
import {AreaService} from '../../area/area.service';
import {CustomerService} from '../../customer/customer.service';
import {Customer} from '../../customer/customer';
import * as _ from 'underscore';
import {Product} from '../../product/product';
import {Area} from "../../area/area";
import {Subscription} from "rxjs";
import {Invoice} from '../invoice';
import {InvoiceService} from '../invoice.service';

export class InvoiceItem {
  
  stt = '';
  name = ''; 
  pname = '';
  unit = '';
  qty = '';
  cost = '';
  hsn_code = '';
  discount = '';
  gst = '';
  total = 0;
  taxPercent = '';
}

@Component({
  selector: 'app-invoice-create',
  templateUrl: './invoice-create.component.html',
  styleUrls: ['./invoice-create.component.css']
})
export class InvoiceCreateComponent implements OnInit {


 

  public productList: any[] = [];
  public productList2: any[] = [];
  showSuccess: boolean = false;
  showError: boolean = false;

 // form: FormGroup;
   invoiceCreateForm: FormGroup;

  Allform: [''];
  public customerList: Customer[] = [];
  public resCustomer: Customer; 
  private subscription: Subscription;
  public invoice: Invoice;
  public allProductCounter = 1;
  public allProducts: any[] = [];
  public isSaved: boolean = false;
  public resultInvoice;
  public allProductsAdd: any[] = [];
  public invoiceDetailForm: FormGroup;
  public invoice1 = [ 'name', 'qty' , 'cost' , 'total'];


  constructor(private invoiceService: InvoiceService, private fb: FormBuilder, private customerService: CustomerService, private productService: ProductService, private areaService: AreaService) {

  }


  get invoiceItems(): FormArray {
    return this.invoiceCreateForm.get('invoiceItems') as FormArray;
  };

  

  ngOnInit() {
    this.buildForm();
    this.getProductList();
    this.getAllCustomers();
   // this.createForm();
    this.addItem();
  }

  toggleLogo() {}
  editLogo() {}
 
  buildForm() {

    let date = Date.now();
    this.invoiceCreateForm = this.fb.group({
      customer_id: [''],
      username: [''],
      nid : [''],
      gstno :[''],
      email: [''],
      fullname: [''],
      location: [''],
      ship_addr:[''],
      area: [''],
      city: [''],
      state:[''],
      country:[''],
      mobile_primary: [''],
      mobile_secondary: [''],
      amount_due: [''],
      invoice_number : [''],
      po_number :[''],
      discount: [0],
      tnc: [''],
      date: [date],
      vdate : [],
      remarks: [''],
      status: ['Due'],
      productList: [],
      qty : [],
      invoiceName: ['', Validators.required ],
      invoiceItems: this.fb.array([]),
      subTotal:[{value: 0, disabled: true}],
      taxPercent:[],
      iGstPercent:[],
      disc :[],
      tax: [0],
      igst : [0],
    });
    
    this.invoiceCreateForm.valueChanges.subscribe(data => this.updateForm(data));

  }

  removeProduct(index) {
    this.allProductCounter--;
    this.allProducts.splice(index, 1);
  }

  addProduct(product: any) {
    this.allProductCounter++;
    let newProduct = this.productList[0];
    this.allProducts.push(newProduct);
    //
  }


  onProductChange(event: any, index) {
    let result = _.find(this.productList, function (item) {
      return item['_id'] == event.target.value;
    })
    this.allProducts[index] = result;
    
  }


  createRange(number) {
    let items: number[] = [];
    for (let i = 1; i <= number; i++) {
      items.push(i);
    }
    return items;
  }

    
  addItem() {

    this.invoiceItems.push(this.fb.group(new InvoiceItem()));
    
   // let newProduct = this.productList[0];
   // this.allProducts.push(newProduct);
  }


  removeItem(item) {

    let i = this.invoiceItems.controls.indexOf(item);

    if(i != -1) {
      
    	this.invoiceItems.controls.splice(i, 1);
      let items = this.invoiceCreateForm.get('invoiceItems') as FormArray;
    	let data = {invoiceItems: items};
    	this.updateForm(data);
    }
  }

  

  updateForm(data) {
    const items = data.invoiceItems;
    let sub = 0;

    for(let i of items)
    {
      i.total = i.qty*i.cost;
      sub += i.total;
  
    }  
    this.invoiceCreateForm.value.subTotal = sub;
    const tax = sub * (this.invoiceCreateForm.value.taxPercent / 100) ;
    this.invoiceCreateForm.value.tax = tax;
    this.invoiceCreateForm.value.grantTotal = sub + tax - this.invoiceCreateForm.value.disc;

  }



  getAllCustomers() {
    this.customerService.getAllCustomers('all')
      .subscribe(
        (res) => {
          this.customerList = res;
        },
        (err) => {

        }
      );
  }


  getCustomer(event: any) {
    this.resCustomer = _.find(this.customerList, function (item) {
      return item['_id'] == event.target.value;
    });
    this.invoiceCreateForm.patchValue({
      username: this.resCustomer.username,
      gstno : this.resCustomer.gstno,
      nid: this.resCustomer.nid,
      email: this.resCustomer.email,
      fullname: this.resCustomer.fullname,
      location: this.resCustomer.location,
      ship_addr: this.resCustomer.ship_addr,
      city: this.resCustomer.city,
      state: this.resCustomer.state,
      country : this.resCustomer.country,
      mobile_primary: this.resCustomer.mobile_primary,
      mobile_secondary: this.resCustomer.mobile_secondary,
    });

    this.resCustomer.productData = [];
    if (this.resCustomer.area) {
      this.areaService.getAreaById(this.resCustomer.area)
        .subscribe(
          (res: Area) => {
            this.resCustomer.areaData = res;
            this.invoiceCreateForm.patchValue({
              area: this.resCustomer.areaData.name
            });
          },
          (err) => {

          }
        )
    }
  }

 getProductList() {
    this.productList.forEach(product => { product.name });
    this.productList = [];
    this.productService.getAllProduct()
      .subscribe(
        (res) => {
          _.each(res, (item) => {
            if (item['status']) {
              this.productList.push(item);
            }
          });
        },
        (err) => {
          console.log("ERROR from productList");
        },
        () => {
          this.allProducts.push(this.productList[0]);
          this.invoiceCreateForm.patchValue({
            
            name : this.productList[0].name
            
          })
        }
      )
  }


 
 

 /* updateTotal() {
    let total = 0;
    _.each(this.allProducts, (product) => {
       //product.total = product.qty * product.rate;
      total += product['rate'];
    });
    this.invoiceCreateForm.patchValue({
      total: total
    })
  }*/
 

  submitInvoiceCreateForm() {
  
    let product_list = _.pluck(this.allProducts, '_id');
   
   this.invoiceCreateForm.patchValue({
      
      productList: product_list,
      remarks : this.invoiceCreateForm.value.remarks,
      invoice_number : this.invoiceCreateForm.value.invoice_number,
      date : this.invoiceCreateForm.value.date,
      customer_id: this.resCustomer['_id'],
      invoiceItems: this.invoiceCreateForm.value.invoiceItems,
      subTotal: this.invoiceCreateForm.value.subTotal,
      taxPercent : this.invoiceCreateForm.value.taxPercent,
      tax : this.invoiceCreateForm.value.tax,
      grantTotal: this.invoiceCreateForm.value.grantTotal,
     
    }); 
   
  var p=this.invoiceCreateForm.value;
 // p["remarks"]="xyz";//remarks

var iv = p.invoiceItems;
var a=iv[0];
var q=a["qty"];
var name=a["name"];
var hsn=a["hsn_code"];
var discount = a["discount"];



var inv={};
inv["invoice_number"]=p.invoice_number;
inv["po_number"]=p.po_number;
inv["remarks"]=p.remarks;
inv["tnc"]=p.tnc;
inv["customer_id"]=p.customer_id;
inv["subTotal"]=p.subTotal;
inv["taxPercent"]=p.taxPercent;
inv["tax"]=p.tax;
inv["disc"]=p.disc;
inv["grantTotal"]=p.grantTotal;//date
inv["date"]=p.date;//date
inv["vdate"]=p.vdate
var productList2=[];

for(var i=0;i<iv.length;i++)
{
  var aa=iv[i];
  var qq=aa["qty"];
  
  var pro={};
  pro["name"]=aa["name"];
  pro["qty"]=qq; 
  pro["rate"]=aa["cost"];
  pro["hsn_code"]=aa["hsn_code"];
  pro["discount"]=aa["discount"];
  
  productList2.push(pro);
}

inv["productList2"]=productList2;



this.invoiceService.createNewInvoice(inv)
      .subscribe(
        (res) => { 
          this.resultInvoice = res;
          this.isSaved = true;
        }
      )
  }

  /*
  updatePayments() {
    let total = 0;
    _.each(this.allProductsAdd, (item) => {
      let product = _.findWhere(this.productList2, {_id: item});
      total +=  product.rate;
     
    });

    this.invoiceDetailForm.patchValue({
      total: total,
      discount: 0,
      amount_due: total
    });
  }
    */

  


}


  


