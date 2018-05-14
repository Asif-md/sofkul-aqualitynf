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
  unit = '';
  qty = '';
  cost = '';
  total = 0;
}

@Component({
  selector: 'app-invoice-create',
  templateUrl: './invoice-create.component.html',
  styleUrls: ['./invoice-create.component.css']
})
export class InvoiceCreateComponent implements OnInit {


 

  public productList: any[] = [];
  showSuccess: boolean = false;
  showError: boolean = false;

 // form: FormGroup;
  public invoiceCreateForm: FormGroup;

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
   // this.addItem();
  }

  toggleLogo() {}
  editLogo() {}


  /*createForm() {
    this.invoiceCreateForm = this.fb.group({
      invoiceName: ['', Validators.required ],
      invoiceItems: this.fb.array([]),
      subTotal:[{value: 0, disabled: true}],
      taxPercent:[],
      tax: [0],
   //  grantTotal:[{value: 0, disabled: true}],
    });

    
   this.invoiceCreateForm.valueChanges.subscribe(data => this.updateForm(data));

  }
  */
 
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
      area: [''],
      city: [''],
      mobile_primary: [''],
      mobile_secondary: [''],
      amount_due: [''],
      invoice_number : [''],
      discount: [0],
      date: [date],
      remarks: [''],
      status: ['Due'],
      productList: [],
     // qty : [],
      invoiceName: ['', Validators.required ],
      invoiceItems: this.fb.array([]),
      subTotal:[{value: 0, disabled: true}],
      taxPercent:[],
      tax: [0],
      stt : '',
      name :'',
      unit : '',
      qty : '',
      cost : '',
      total : 0,
    });
    
    this.invoiceCreateForm.valueChanges.subscribe(data => this.updateForm(data));

  }



    
  addItem(product: any) {
    this.invoiceItems.push(this.fb.group(new Invoice()));
   // this.allProductCounter++;
    let newProduct = this.productList[0];
    this.allProducts.push(newProduct);
  }

  removeItem(item, index) {

   // this.allProductCounter--;
    this.allProducts.splice(index, 1);
   // this.allProducts.splice(index, 1);
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
    const tax = sub * (this.invoiceCreateForm.value.taxPercent / 100);
    this.invoiceCreateForm.value.tax = tax;
    this.invoiceCreateForm.value.grantTotal = sub + tax;
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
      city: this.resCustomer.city,
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
    this.productList.forEach(product => { product.quantity = 0 });
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
            
            total: this.productList[0].rate
            
          })
        }
      )
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


  //  let invoice_list = this.invoiceItems;

   /* this.form.patchValue({
      invoiceItems: this.form.value.invoiceItems,
      subTotal: this.form.value.subTotal,
      taxPercent : this.form.value.taxPercent,
      tax : this.form.value.tax,
      grantTotal: this.form.value.grantTotal,
    });
*/

   
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
      //grantTotal: 22000
    }); 
   
  
     /*  
this.form.patchValue({
      invoiceItems: this.invoiceCreateForm.value.invoiceItems,
      subTotal: this.invoiceCreateForm.value.subTotal,
      taxPercent : this.invoiceCreateForm.value.taxPercent,
      //tax : this.form.value.tax,
      grantTotal: this.invoiceCreateForm.value.grantTotal,
      //grantTotal: 22000
    });*/ 
   

//details
 /*var AllItems=this.invoiceItems;*/ 




 /*
var l=AllItems.length;
alert("aaa"+AllItems+"\n ln-->"+l);
for(var i=0;i<l;i++)
{
var itm=AllItems[i].controls;


alert(i+"-->"+itm);

}
 */
 /*this.Allform.push(this.invoiceCreateForm.value);
this.Allform.push(this.form.value);*/ 



 /*
this.invoiceService.createNewInvoice(this.invoiceCreateForm.value)
      .subscribe(
        (res) => {
          this.resultInvoice = res;
          this.isSaved = true;
        }
      )
*/ 

//var itm_dec="nokiaaa";

//var productList=this.form.value.invoiceItems;
//this.form.value.itm=itm_dec;
//his.form.value.productList=productList;
//var f1=this.form.value;

//this.form.value.tax=3;


//var s="";

this.invoiceService.createNewInvoice(this.invoiceCreateForm.value)
      .subscribe(
        (res) => {
          this.resultInvoice = res;
          this.isSaved = true;
        }
      )
  }


 /* updatePayments() {
    let total = 0;
    _.each(this.allProductsAdd, (item) => {
      let product = _.findWhere(this.productList, {_id: item});
      total +=  product.rate * product.quantity;
     
    });

    this.invoiceDetailForm.patchValue({
      total: total,
      discount: 0,
      amount_due: total
    });
  }
    
  }*/


  

}
