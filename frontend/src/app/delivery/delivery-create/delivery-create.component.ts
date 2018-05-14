import {Component, OnInit, Input, OnChanges} from '@angular/core';
import {FormGroup, FormBuilder , FormArray , Validators } from "@angular/forms";
import {ProductService} from '../../product/product.service';
import {AreaService} from '../../area/area.service';
import {CustomerService} from '../../customer/customer.service';
import {InvoiceService} from '../../invoice/invoice.service';
import {Customer} from '../../customer/customer';
import {Invoice} from '../../invoice/invoice';
import * as _ from 'underscore';
import {Product} from '../../product/product';
import {Area} from "../../area/area";
import {Subscription} from "rxjs";
import {Delivery} from '../delivery';
import {DeliveryService} from '../delivery.service';



export class DeliveryItem {
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
  selector: 'app-delivery-create',
  templateUrl: './delivery-create.component.html',
  styleUrls: ['./delivery-create.component.css']
})
export class DeliveryCreateComponent implements OnInit {

  public productList: any[] = [];
  public productList2: any[] = [];
  showSuccess: boolean = false;
  showError: boolean = false;
  public deliveryCreateForm: FormGroup;
  public invoiceCreateForm: FormGroup;
  public customerList: Customer[] = [];
  public invoiceList: Invoice[] = [];
  public resCustomer: Customer;
  public resInvoice: Invoice;
  private subscription: Subscription;
  public delivery: Delivery;
  public allProductCounter = 1;
  public allProducts: any[] = [];
  public isSaved: boolean = false;
  public resultDelivery;


  constructor(private deliveryService: DeliveryService, private fb: FormBuilder, private customerService: CustomerService, private invoiceService : InvoiceService , private productService: ProductService, private areaService: AreaService) {
  }

  ngOnInit() {
    this.buildForm();
    this.getProductList();
    this.getAllCustomers();
    this.addItem();
  }

 
  buildForm() {
    let date = Date.now();
    this.deliveryCreateForm = this.fb.group({
      customer_id: [''],
      invoice_id : [''],
      gstno : [''],
      nid : [''],
      remarks :[''],
      tnc : [''],
      vdate : [''],
      invoice_number : [''],
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
      deliveryName: ['', Validators.required ],
      deliveryItems: this.fb.array([]),
      subTotal:[{value: 0, disabled: true}],
      taxPercent:[],
      transport :[],
      tax: [0],
    });

    this.deliveryCreateForm.valueChanges.subscribe(data => this.updateForm(data));
  }

 
  get deliveryItems(): FormArray {
    return this.deliveryCreateForm.get('deliveryItems') as FormArray;
  };


  addItem() {
    this.deliveryItems.push(this.fb.group(new DeliveryItem()));
  }


  removeItem(item) {

    let i = this.deliveryItems.controls.indexOf(item);

    if(i != -1) {
    	this.deliveryItems.controls.splice(i, 1);
      let items = this.deliveryCreateForm.get('deliveryItems') as FormArray;
    	let data = {deliveryItems: items};
    	this.updateForm(data);
    }
  }

  updateForm(data) {
    const items = data.deliveryItems;
    let sub = 0;

    for(let i of items)
    {
      i.total = i.qty*i.cost;
      sub += i.total;
  
    }  
    this.deliveryCreateForm.value.subTotal = sub;
    const tax = sub * (this.deliveryCreateForm.value.taxPercent / 100) ;
    this.deliveryCreateForm.value.tax = tax;
    this.deliveryCreateForm.value.grantTotal = sub + tax + this.deliveryCreateForm.value.transport;

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

    this.deliveryCreateForm.patchValue({
      username: this.resCustomer.username,
      nid : this.resCustomer.nid,
      gstno : this.resCustomer.gstno,
      //invoice_number : this.resInvoice.invoice_number,
      email: this.resCustomer.email,
      fullname: this.resCustomer.fullname,
      location: this.resCustomer.location,
      city: this.resCustomer.city,
      //billto : this.resCustomer.billto,
      mobile_primary: this.resCustomer.mobile_primary,
      mobile_secondary: this.resCustomer.mobile_secondary,
    });


    

    this.resCustomer.productData = [];
    if (this.resCustomer.area) {
      this.areaService.getAreaById(this.resCustomer.area)
        .subscribe(
          (res: Area) => {
            this.resCustomer.areaData = res;
            this.deliveryCreateForm.patchValue({
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
          this.deliveryCreateForm.patchValue({
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
    this.deliveryCreateForm.patchValue({
      total: total
    })
  }

  submitDeliveryCreateForm() {
  
    let product_list = _.pluck(this.allProducts, '_id');

   
   this.deliveryCreateForm.patchValue({
      
      productList: product_list,
      remarks : this.deliveryCreateForm.value.remarks,
      tnc : this.deliveryCreateForm.value.tnc,
      transport : this.deliveryCreateForm.value.transport,
     // invoice_number : this.deliveryCreateForm.value.invoice_number,
      date : this.deliveryCreateForm.value.date,
      customer_id: this.resCustomer['_id'],
      deliveryItems: this.deliveryCreateForm.value.deliveryItems,
      subTotal: this.deliveryCreateForm.value.subTotal,
      taxPercent : this.deliveryCreateForm.value.taxPercent,
      tax : this.deliveryCreateForm.value.tax,
      grantTotal: this.deliveryCreateForm.value.grantTotal,
     
    }); 
   
  var p = this.deliveryCreateForm.value;
 // p["remarks"]="xyz";//remarks

var iv = p.deliveryItems;
var a=iv[0];
var q=a["qty"];
var name=a["name"];
var hsn=a["hsn_code"];
var discount = a["discount"];



var inv={};
//inv["invoice_number"]=p.invoice_number;
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

this.deliveryService.createNewDelivery(inv)
      .subscribe(
        (res) => {
          this.resultDelivery = res;
          this.isSaved = true;
        }
      )
  }

}
