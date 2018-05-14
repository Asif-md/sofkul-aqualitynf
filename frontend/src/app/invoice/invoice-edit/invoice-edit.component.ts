import {DatePipe} from '@angular/common';
import {FormGroup, FormBuilder , FormArray , Validators } from "@angular/forms";
import {Component, OnInit, ElementRef, ViewChild, Input, OnChanges} from '@angular/core';
import {InvoiceService} from '../invoice.service';
import {ActivatedRoute} from '@angular/router';
import {Subscription} from "rxjs";

import {Invoice} from '../invoice';
import {Router} from "@angular/router";
import {ProductService} from '../../product/product.service';
import {CustomerService} from '../../customer/customer.service';
import * as _ from 'underscore';
import {AreaService} from '../../area/area.service';

export class InvoiceItem {
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
  selector: 'app-invoice-edit',
  templateUrl: './invoice-edit.component.html',
  styleUrls: ['./invoice-edit.component.css']
})
export class InvoiceEditComponent implements OnInit {
  @ViewChild('productSelectBox') productSelectBox: ElementRef;

  public productList: any[] = [];
  public productList2: any[] = [];
  public additionalProducts: any[] = [];
  public addProductCounter: number = 0;
  public allProductsAdd: any[] = [];


  public productSuggestions: any[] = [];

  private subscription: Subscription;
  public invoiceDetailForm: FormGroup;
  private id: any;
  public invoice: Invoice;
  public currentDate: number = Date.now();
  public datePipe: DatePipe = new DatePipe('en-US');
  public paymentStatus: string = 'Due';
  public showForm: boolean = false;
  private type: string;

  constructor(private areaService: AreaService, private customerService: CustomerService, private elementRef: ElementRef, private productService: ProductService, private fb: FormBuilder, private invoiceService: InvoiceService, private route: ActivatedRoute, private router: Router) {

  }

  

  ngOnInit() {
  // this.addItem();
    this.getProductList2();
    this.subscription = this.route.params.subscribe(params => {
      this.id = params['id'];
      this.type = params['type'];
      if (this.id) {
        this.invoiceService.getInvoiceById(this.type, this.id)
          .subscribe(
            (res) => {
              this.invoice = res;
           
             this.buildForm();
             this.allProductsAdd = this.invoice.productList2;
          //    this.getInvoiceById(params['id']);


            },
            (err) => {

            }
          )
      }
    });
  }

 get invoiceItems(): FormArray {
    return this.invoiceDetailForm.get('invoiceItems') as FormArray;
  };

  addItem() {
    this.invoiceItems.push(this.fb.group(new Invoice()));
  }

  removeItem(item) {

    let i = this.invoiceItems.controls.indexOf(item);

    if(i != -1) {
    	this.invoiceItems.controls.splice(i, 1);
      let items = this.invoiceDetailForm.get('invoiceItems') as FormArray;
    	let data = {invoiceItems: items};
      this.updateForm(data);
    }
  }

 updateForm(data) {
    const items = data.invoiceItems;
    let sub = 0;

    for(let i of items)
    {
      i.total = i.qty*i.cost - i.discount;
      sub += i.total;
  
    }  
    this.invoiceDetailForm.value.subTotal = sub;
    const tax = sub * (this.invoiceDetailForm.value.taxPercent / 100) ;
    this.invoiceDetailForm.value.tax = tax;
    this.invoiceDetailForm.value.grantTotal = sub + tax;
  } 
 


  buildForm() {

    

    this.customerService.getCustomerDetails(this.invoice.customer_id)
      .subscribe(
        (res) => {
          this.invoice.customerData = res;
          this.invoice.customerData.productData = [];
          let total_partially_paid = 0;
          _.each(this.invoice.productList2, (item) => {
            this.productService.getProductById(item)
              .subscribe(
                (res) => {
                  this.invoice.customerData.productData.push(res);
                }
              )
            total_partially_paid += item['amount'];
          });

          this.invoiceDetailForm = this.fb.group({
            username: [res['username']],
            gstno : [res['gstno']],
            nid: [res['nid']],
            email: [res['email']],
            fullname: [res['fullname']],
            location: [res['location']],
            ship_addr:[res['ship_addr']],
            area: [''],
            city: [res['city']],
            state:[res['state']],
            country : [res['country']],
            mobile_primary: [res['mobile_primary']],
            mobile_secondary: [res['mobile_secondary']],
            payment_due_date: [this.invoice['payment_due_date']],
            amount_due: [this.invoice['amount_due']],
            status: [this.invoice['status']],
            total: [this.invoice['total']],
            invoice_number : [this.invoice['invoice_number']],
            po_number : [this.invoice['po_number']],
            remarks: [this.invoice['remarks']],
            tnc : [this.invoice['tnc']],
            discount: [this.invoice['discount']],
            invoice_created_date: [this.invoice['invoice_created_date']],
            paid_date: [this.invoice['paid_date']],
            taxPercent : [this.invoice['taxPercent']],
            tax : [this.invoice['tax']],
            subTotal : [this.invoice['subTotal']],
            grantTotal : [this.invoice['grantTotal']],
            amount_partially_paid: total_partially_paid
          });

        this.invoiceDetailForm.valueChanges.subscribe(data => this.updateForm(data));

          this.areaService.getAreaById(res['area'])
            .subscribe(
              (res) => {
                this.invoiceDetailForm.patchValue({
                  area: res['name']
                });
              }
            )
          this.showForm = true;
        }
      )

  
  
  
    }



  getInvoiceById(id: string) {
    this.invoiceService.getInvoiceById(this.type, id) .subscribe((res) => {
         
          this.invoice = res;

     

          //get customer data
          this.customerService.getCustomerDetails(this.invoice.customer_id)
            .subscribe(
              (res) => {
                this.invoice.customerData = res;
              },
              (err) => {

              },
              () => {
                console.log(this.invoice);
              }
            )
        },
        (err) => {
          console.log(err);
        }
      )
  }




  getProductSuggestions(event: any) {
    let data = {
      text: event.query
    }

    this.productService.searchByName(data)
      .subscribe(
        (res) => {
          this.productSuggestions = res;
        },
        (err) => {

        }
      )
  }

  getProductList2() {
    this.productList2 = [];
    
    /*this.productService.getAllProduct()
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
        }
      )*/
  }

  addProduct() {
    let newProduct = this.productList[0];
    this.additionalProducts.push(newProduct);
    this.allProductsAdd.push(newProduct._id);
    this.updatePayments();
  }

  removeProduct(index) {
    let delIndex = this.allProductsAdd.indexOf(this.additionalProducts[index]);
    this.allProductsAdd.splice(delIndex, 1);
    this.additionalProducts.splice(index, 1);
    this.updatePayments();
  }

  onProductChange(event: any, index, mode) {
    if (mode != 'my') {
      index = index + this.invoice.customerData.productData.length;
    }
    this.allProductsAdd[index] = event.target.value;
    this.updatePayments();
  }

  submitInvoiceEditForm() {
    let data = {};
    data = {
      id: this.id,
      invoice_number: this.invoiceDetailForm.value.invoice_number,
      po_number : this.invoiceDetailForm.value.po_number,
      amount_due: this.invoiceDetailForm.value.amount_due,
      total: this.invoiceDetailForm.value.total,
      remarks: this.invoiceDetailForm.value.remarks,
      discount: this.invoiceDetailForm.value.discount,
      tnc : this.invoiceDetailForm.value.tnc ,
      productList: this.allProductsAdd,
      amount_partially_paid: this.invoice.amount_partially_paid,
      type: this.type
    }

    this.invoiceService.preGenerateInvoiceUpdate(data)
      .subscribe(
        (res) => {
          this.router.navigate(['dashboard/invoice/display', this.type, this.id]);
        },
        (err) => {
          console.log('Error in Pre Generator');
        }
      )
  }


  changeStatus(event: any) {
    this.paymentStatus = event.target.value;
    if (this.paymentStatus == 'Paid') {
      let currentDate = this.datePipe.transform(Date.now(), 'y-MM-dd');
      this.invoiceDetailForm.patchValue({
        paid_date: currentDate
      });
    }
  }

  getPartiallyPaid(event: any) {
    this.invoiceDetailForm.patchValue({
      amount_partially_paid: event.target.value,
      amount_due: this.invoice.amount_due - event.target.value
    });
  }

  getDiscount(event: any) {
    this.invoiceDetailForm.patchValue({
      total: this.invoiceDetailForm.value.amount_due - event.target.value
    });
  }

  updatePayments() {
    let total = 0;
    _.each(this.allProductsAdd, (item) => {
      let product = _.findWhere(this.productList, {_id: item});
      total += product.rate;
    });

    this.invoiceDetailForm.patchValue({
      total: total,
      discount: 0,
      amount_due: total
    });
  }
}
