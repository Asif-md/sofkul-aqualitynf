import {DatePipe} from '@angular/common';
import {Component, OnInit, ElementRef, ViewChild} from '@angular/core';
import {ProformaService} from '../proforma.service';
import {ActivatedRoute} from '@angular/router';
import {Subscription} from "rxjs";
import {Proforma} from '../proforma';
import {Router} from "@angular/router";
import {FormGroup, FormBuilder} from "@angular/forms";
import {ProductService} from '../../product/product.service';
import {CustomerService} from '../../customer/customer.service';
import * as _ from 'underscore';
import {AreaService} from '../../area/area.service';

@Component({
  selector: 'app-proforma-edit',
  templateUrl: './proforma-edit.component.html',
  styleUrls: ['./proforma-edit.component.css']
})
export class ProformaEditComponent implements OnInit {
  @ViewChild('productSelectBox') productSelectBox: ElementRef;

  public productList: any[] = [];
  public additionalProducts: any[] = [];
  public addProductCounter: number = 0;
  public allProductsAdd: any[] = [];


  public productSuggestions: any[] = [];

  private subscription: Subscription;
  public proformaDetailForm: FormGroup;
  private id: any;
  public proforma: Proforma;
  public currentDate: number = Date.now();
  public datePipe: DatePipe = new DatePipe('en-US');
  public paymentStatus: string = 'Due';
  public showForm: boolean = false;
  private type: string;

  constructor(private areaService: AreaService, private customerService: CustomerService, private elementRef: ElementRef, private productService: ProductService, private fb: FormBuilder, private proformaService: ProformaService, private route: ActivatedRoute, private router: Router) {

  }

  ngOnInit() {
    this.getProductList();
    this.subscription = this.route.params.subscribe(params => {
      this.id = params['id'];
      this.type = params['type'];
      if (this.id) {
        this.proformaService.getProformaById(this.type, this.id)
          .subscribe(
            (res) => {
              this.proforma = res;
              this.allProductsAdd = this.proforma.productList;
              this.buildForm();
            },
            (err) => {

            }
          )
      }
    });
  }

  buildForm() {
    this.customerService.getCustomerDetails(this.proforma.customer_id)
      .subscribe(
        (res) => {
          this.proforma.customerData = res;
          this.proforma.customerData.productData = [];
         // let total_partially_paid = 0;
          _.each(this.proforma.productList, (item) => {
            this.productService.getProductById(item)
              .subscribe(
                (res) => {
                  this.proforma.customerData.productData.push(res);
                }
              )
           // total_partially_paid += item['amount'];
          });

          this.proformaDetailForm = this.fb.group({
            username: [res['username']],
            email: [res['email']],
            fullname: [res['fullname']],
            location: [res['location']],
            area: [''],
            city: [res['city']],
            mobile_primary: [res['mobile_primary']],
            mobile_secondary: [res['mobile_secondary']],
            payment_due_date: [this.proforma['payment_due_date']],
            amount_due: [this.proforma['amount_due']],
            status: [this.proforma['status']],
            total: [this.proforma['total']],
            discount: [this.proforma['discount']],
            proforma_created_date: [this.proforma['proforma_created_date']],
            paid_date: [this.proforma['paid_date']],
           // amount_partially_paid: total_partially_paid
          });

          this.areaService.getAreaById(res['area'])
            .subscribe(
              (res) => {
                this.proformaDetailForm.patchValue({
                  area: res['name']
                });
              }
            )
          this.showForm = true;
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
        }
      )
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
      index = index + this.proforma.customerData.productData.length;
    }
    this.allProductsAdd[index] = event.target.value;
    this.updatePayments();
  }

  submitProformaEditForm() {
    let data = {};
    data = {
      id: this.id,
      amount_due: this.proformaDetailForm.value.amount_due,
      total: this.proformaDetailForm.value.total,
      discount: this.proformaDetailForm.value.discount,
      productList: this.allProductsAdd,
     // amount_partially_paid: this.proforma.amount_partially_paid,
      type: this.type
    }

    this.proformaService.preGenerateProformaUpdate(data)
      .subscribe(
        (res) => {
          this.router.navigate(['dashboard/proforma/display', this.type, this.id]);
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
      this.proformaDetailForm.patchValue({
        paid_date: currentDate
      });
    }
  }

  getPartiallyPaid(event: any) {
    this.proformaDetailForm.patchValue({
      amount_partially_paid: event.target.value,
      amount_due: this.proforma.amount_due - event.target.value
    });
  }

  getDiscount(event: any) {
    this.proformaDetailForm.patchValue({
      total: this.proformaDetailForm.value.amount_due - event.target.value
    });
  }

  updatePayments() {
    let total = 0;
    _.each(this.allProductsAdd, (item) => {
      let product = _.findWhere(this.productList, {_id: item});
      total += product.rate;
    });

    this.proformaDetailForm.patchValue({
      total: total,
      discount: 0,
      amount_due: total
    });
  }
}
