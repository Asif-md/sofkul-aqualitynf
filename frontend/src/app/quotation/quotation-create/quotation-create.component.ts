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
import {Quotation} from '../quotation';
import {QuotationService} from '../quotation.service';
import {Invoice} from '../../invoice/invoice';


export class QuotationItem {
  stt = '';
  name = '';
  unit = '';
  qty = '';
  cost = '';
  hsn_code = '';
  discount = '';
  gst = '';
  total = 0;
}                    

@Component({
  selector: 'app-quotation-create',
  templateUrl: './quotation-create.component.html',
  styleUrls: ['./quotation-create.component.css']
})
export class QuotationCreateComponent implements OnInit {

  public productList: any[] = [];
  public productList2: any[] = [];
  showSuccess: boolean = false;
  showError: boolean = false;
  public quotationCreateForm: FormGroup;
  public invoiceList: Invoice[] = [];
  public customerList: Customer[] = [];
  public resCustomer: Customer;
  private subscription: Subscription;
  public quotation: Quotation;
  public allProductCounter = 1;
  public allProducts: any[] = [];
  public isSaved: boolean = false;
  public resultQuotation;


  constructor(private quotationService: QuotationService, private fb: FormBuilder, private customerService: CustomerService, private productService: ProductService, private areaService: AreaService) {
  }

  ngOnInit() {
    this.buildForm();
    this.getProductList();
    this.getAllCustomers(); 
    this.addItem();
  }

  buildForm() {
    let date = Date.now();
    this.quotationCreateForm = this.fb.group({
      customer_id: [''],
      invoice_id : [''],
      gstno : [''],
      nid : [''],
      remarks :[''],
      tnc : [''],
      vdate : [''],
      quotation_number : [''],
      username: [''],
      email: [''],
      fullname: [''],
      location: [''],
      ship_addr :[''],
      area: [''],
      city: [''],
      state : [''],
      country : [''],
      mobile_primary: [''],
      mobile_secondary: [''],
      amount_due: [''],
      total: [''],
      discount: [0],
      date: [date],
      status: ['Due'],
      productList: [],
      quotationName: ['', Validators.required ],
      quotationItems: this.fb.array([]),
      subTotal:[{value: 0, disabled: true}],
      taxPercent:[],
      transport :[],
      tax: [0],
    });

    this.quotationCreateForm.valueChanges.subscribe(data => this.updateForm(data));
  }


  get quotationItems(): FormArray {
    return this.quotationCreateForm.get('quotationItems') as FormArray;
  };


  addItem() {
    this.quotationItems.push(this.fb.group(new QuotationItem()));
  }


  removeItem(item) {

    let i = this.quotationItems.controls.indexOf(item);

    if(i != -1) {
    	this.quotationItems.controls.splice(i, 1);
      let items = this.quotationCreateForm.get('quotationItems') as FormArray;
    	let data = {quotationItems: items};
    	this.updateForm(data);
    }
  }

  updateForm(data) {
    const items = data.quotationItems;
    let sub = 0;

    for(let i of items)
    {
      i.total = i.qty*i.cost;
      sub += i.total;
  
    }  
    this.quotationCreateForm.value.subTotal = sub;
    const tax = sub * (this.quotationCreateForm.value.taxPercent / 100) ;
    this.quotationCreateForm.value.tax = tax;
    this.quotationCreateForm.value.grantTotal = sub + tax + this.quotationCreateForm.value.transport;

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

    this.quotationCreateForm.patchValue({
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
            this.quotationCreateForm.patchValue({
              area: this.resCustomer.areaData.name
            });
          },
          (err) => {

          }
        )
    }
  }

  getProductList() {
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
          this.quotationCreateForm.patchValue({
            total: this.productList[0].rate
          })
        }
      )
  }


  removeProduct(index) {
    this.allProductCounter--;
    this.allProducts.splice(index, 1);
  }

  addProduct() {
    this.allProductCounter++;
    let newProduct = this.productList[0];
    this.allProducts.push(newProduct);
    this.updateTotal();
  }

  onProductChange(event: any, index) {
    let result = _.find(this.productList, function (item) {
      return item['_id'] == event.target.value;
    })
    this.allProducts[index] = result;
    this.updateTotal();
  }

  createRange(number) {
    let items: number[] = [];
    for (let i = 1; i <= number; i++) {
      items.push(i);
    }
    return items;
  }

  updateTotal() {
    let total = 0;
    _.each(this.allProducts, (product) => {
      total += product['rate'];
    });
    this.quotationCreateForm.patchValue({
      total: total
    })
  }

  submitQuotationCreateForm() {
  
    let product_list = _.pluck(this.allProducts, '_id');

   
   this.quotationCreateForm.patchValue({
      
      productList: product_list,
      remarks : this.quotationCreateForm.value.remarks,
      tnc : this.quotationCreateForm.value.tnc,
      transport : this.quotationCreateForm.value.transport,
     // invoice_number : this.quotationCreateForm.value.invoice_number,
      date : this.quotationCreateForm.value.date,
      customer_id: this.resCustomer['_id'],
      quotationItems: this.quotationCreateForm.value.quotationItems,
      subTotal: this.quotationCreateForm.value.subTotal,
      taxPercent : this.quotationCreateForm.value.taxPercent,
      tax : this.quotationCreateForm.value.tax,
      grantTotal: this.quotationCreateForm.value.grantTotal,
     
    }); 
   
  var p = this.quotationCreateForm.value;
 // p["remarks"]="xyz";//remarks

var iv = p.quotationItems;
var a=iv[0];
var q=a["qty"];
var name=a["name"];
var hsn=a["hsn_code"];
var discount = a["discount"];



var inv={};
inv["quotation_number"]=p.quotation_number;
//inv["po_number"]=p.po_number;
inv["remarks"]=p.remarks;
inv["tnc"]=p.tnc;
inv["customer_id"]=p.customer_id;
inv["subTotal"]=p.subTotal;
inv["taxPercent"]=p.taxPercent;
inv["tax"]=p.tax;
inv["transport"]=p.transport;
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

this.quotationService.createNewQuotation(inv)
      .subscribe(
        (res) => {
          this.resultQuotation = res;
          this.isSaved = true;
        }
      )
  }
}
