import {DatePipe} from '@angular/common';
import {Component, OnInit, ElementRef, ViewChild} from '@angular/core';
import {DeliveryService} from '../delivery.service';
import {ActivatedRoute} from '@angular/router';
import {Subscription} from "rxjs";
import {Delivery} from '../delivery';
import {Router} from "@angular/router";
import {FormGroup, FormBuilder} from "@angular/forms";
import {ProductService} from '../../product/product.service';
import {CustomerService} from '../../customer/customer.service';
import * as _ from 'underscore';
import {AreaService} from '../../area/area.service';

@Component({
  selector: 'app-delivery-edit',
  templateUrl: './delivery-edit.component.html',
  styleUrls: ['./delivery-edit.component.css']
})
export class DeliveryEditComponent implements OnInit {
  @ViewChild('productSelectBox') productSelectBox: ElementRef;

  public productList: any[] = [];
  public additionalProducts: any[] = [];
  public addProductCounter: number = 0;
  public allProductsAdd: any[] = [];


  public productSuggestions: any[] = [];

  private subscription: Subscription;
  public deliveryDetailForm: FormGroup;
  private id: any;
  public delivery: Delivery;
  public currentDate: number = Date.now();
  public datePipe: DatePipe = new DatePipe('en-US');
  public paymentStatus: string = 'Due';
  public showForm: boolean = false;
  private type: string;

  constructor(private areaService: AreaService, private customerService: CustomerService, private elementRef: ElementRef, private productService: ProductService, private fb: FormBuilder, private deliveryService: DeliveryService, private route: ActivatedRoute, private router: Router) {

  }

  ngOnInit() {
    this.getProductList();
    this.subscription = this.route.params.subscribe(params => {
      this.id = params['id'];
      this.type = params['type'];
      if (this.id) {
        this.deliveryService.getDeliveryById(this.type, this.id)
          .subscribe(
            (res) => {
              this.delivery = res;
              this.allProductsAdd = this.delivery.productList;
              this.buildForm();
            },
            (err) => {

            }
          )
      }
    });
  }

  buildForm() {
    this.customerService.getCustomerDetails(this.delivery.customer_id)
      .subscribe(
        (res) => {
          this.delivery.customerData = res;
          this.delivery.customerData.productData = [];
          let total_partially_paid = 0;
          _.each(this.delivery.productList, (item) => {
            this.productService.getProductById(item)
              .subscribe(
                (res) => {
                  this.delivery.customerData.productData.push(res);
                }
              )
            total_partially_paid += item['amount'];
          });

          this.deliveryDetailForm = this.fb.group({
            username: [res['username']],
            email: [res['email']],
            nid : [res['nid']],
            gstno : [res['gstno']],
            fullname: [res['fullname']],
            location: [res['location']],
            area: [''],
            city: [res['city']],
            mobile_primary: [res['mobile_primary']],
            mobile_secondary: [res['mobile_secondary']],
            payment_due_date: [this.delivery['payment_due_date']],
            amount_due: [this.delivery['amount_due']],
            status: [this.delivery['status']],
            total: [this.delivery['total']],
            discount: [this.delivery['discount']],
            delivery_created_date: [this.delivery['delivery_created_date']],
            paid_date: [this.delivery['paid_date']],
            amount_partially_paid: total_partially_paid
          });

          this.areaService.getAreaById(res['area'])
            .subscribe(
              (res) => {
                this.deliveryDetailForm.patchValue({
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
      index = index + this.delivery.customerData.productData.length;
    }
    this.allProductsAdd[index] = event.target.value;
    this.updatePayments();
  }

  submitDeliveryEditForm() {
    let data = {};
    data = {
      id: this.id,
      amount_due: this.deliveryDetailForm.value.amount_due,
      total: this.deliveryDetailForm.value.total,
      discount: this.deliveryDetailForm.value.discount,
      productList: this.allProductsAdd,
      amount_partially_paid: this.delivery.amount_partially_paid,
      type: this.type
    }

    this.deliveryService.preGenerateDeliveryUpdate(data)
      .subscribe(
        (res) => {
          this.router.navigate(['dashboard/delivery/display', this.type, this.id]);
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
      this.deliveryDetailForm.patchValue({
        paid_date: currentDate
      });
    }
  }

  getPartiallyPaid(event: any) {
    this.deliveryDetailForm.patchValue({
      amount_partially_paid: event.target.value,
      amount_due: this.delivery.amount_due - event.target.value
    });
  }

  getDiscount(event: any) {
    this.deliveryDetailForm.patchValue({
      total: this.deliveryDetailForm.value.amount_due - event.target.value
    });
  }

  updatePayments() {
    let total = 0;
    _.each(this.allProductsAdd, (item) => {
      let product = _.findWhere(this.productList, {_id: item});
      total += product.rate;
    });

    this.deliveryDetailForm.patchValue({
      total: total,
      discount: 0,
      amount_due: total
    });
  }
}
