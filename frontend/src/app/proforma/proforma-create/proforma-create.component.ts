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
import {Proforma} from '../proforma';
import {ProformaService} from '../proforma.service';

export class ProformaItem {
  stt = '';
  name = '';
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
  selector: 'app-proforma-create',
  templateUrl: './proforma-create.component.html',
  styleUrls: ['./proforma-create.component.css']
})
export class ProformaCreateComponent implements OnInit {

  public productList: any[] = [];
  public productList2: any[] = [];
  showSuccess: boolean = false;
  showError: boolean = false;
  public proformaCreateForm: FormGroup;
  public customerList: Customer[] = [];
  public resCustomer: Customer;
  private subscription: Subscription;
  public proforma: Proforma;
  public allProductCounter = 1;
  public allProducts: any[] = [];
  public isSaved: boolean = false;
  public resultProforma;


  constructor(private proformaService: ProformaService, private fb: FormBuilder, private customerService: CustomerService, private productService: ProductService, private areaService: AreaService) {
  }

  get proformaItems(): FormArray {
    return this.proformaCreateForm.get('proformaItems') as FormArray;
  };


  ngOnInit() {
    this.buildForm();
    this.getProductList();
    this.getAllCustomers();
    this.addItem();
  }

  buildForm() {
    let date = Date.now();
    this.proformaCreateForm = this.fb.group({
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
     // invoice_number : [''],
     // po_number :[''],
      discount: [0],
      tnc: [''],
      date: [date],
      vdate : [date],
      remarks: [''],
      status: ['Due'],
      productList: [],
      productList2: [],
      qty : [],
      proformaName: ['', Validators.required ],
      proformaItems: this.fb.array([]),
      subTotal:[{value: 0, disabled: true}],
      taxPercent:[],
      disc :[],
      tax: [0]
    });

    this.proformaCreateForm.valueChanges.subscribe(data => this.updateForm(data));

  }



  addItem() {
    this.proformaItems.push(this.fb.group(new ProformaItem()));
  }


  removeItem(item) {

    let i = this.proformaItems.controls.indexOf(item);

    if(i != -1) {
    	this.proformaItems.controls.splice(i, 1);
      let items = this.proformaCreateForm.get('proformaItems') as FormArray;
    	let data = {proformaItems: items};
    	this.updateForm(data);
    }
  }

  

  updateForm(data) {
    const items = data.proformaItems;
    let sub = 0;

    for(let i of items)
    {
      i.total = i.qty*i.cost;
      sub += i.total;
  
    }  
    this.proformaCreateForm.value.subTotal = sub;
    const tax = sub * (this.proformaCreateForm.value.taxPercent / 100) ;
    this.proformaCreateForm.value.tax = tax;
    this.proformaCreateForm.value.grantTotal = sub + tax - this.proformaCreateForm.value.disc;

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

    this.proformaCreateForm.patchValue({
      username: this.resCustomer.username,
      nid : this.resCustomer.nid,
      gstno : this.resCustomer.gstno,
      email: this.resCustomer.email,
      fullname: this.resCustomer.fullname,
      location: this.resCustomer.location,
      ship_addr : this.resCustomer.ship_addr,
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
            this.proformaCreateForm.patchValue({
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
          this.proformaCreateForm.patchValue({
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
    this.proformaCreateForm.patchValue({
      total: total
    })
  } 


  submitProformaCreateForm() {
  
    let product_list = _.pluck(this.allProducts, '_id');
   
   this.proformaCreateForm.patchValue({
      
      productList: product_list,
      remarks : this.proformaCreateForm.value.remarks,
      //proforma_number : this.proformaCreateForm.value.proforma_number,
      date : this.proformaCreateForm.value.date,
      customer_id: this.resCustomer['_id'],
      proformaItems: this.proformaCreateForm.value.proformaItems,
      subTotal: this.proformaCreateForm.value.subTotal,
      taxPercent : this.proformaCreateForm.value.taxPercent,
      tax : this.proformaCreateForm.value.tax,
      grantTotal: this.proformaCreateForm.value.grantTotal,
     
    }); 
   
  var p=this.proformaCreateForm.value;
 // p["remarks"]="xyz";//remarks

var iv = p.proformaItems;
var a=iv[0];
var q=a["qty"];
var name=a["name"];
var hsn=a["hsn_code"];
var discount = a["discount"];



var inv={};
//inv["proforma_number"]=p.proforma_number;
//inv["po_number"]=p.po_number;
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

var s="";


this.proformaService.createNewProforma(inv)
      .subscribe(
        (res) => {
          this.resultProforma = res;
          this.isSaved = true;
        }
      )
  }
}
