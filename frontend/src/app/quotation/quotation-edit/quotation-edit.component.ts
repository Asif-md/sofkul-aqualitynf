import {DatePipe} from '@angular/common';
import {Component, OnInit, ElementRef, ViewChild} from '@angular/core';
import {QuotationService} from '../quotation.service';
import {ActivatedRoute} from '@angular/router';
import {Subscription} from "rxjs";
import {Quotation} from '../quotation';
import {Router} from "@angular/router";
import {FormGroup, FormBuilder} from "@angular/forms";
import {ProductService} from '../../product/product.service';
import {CustomerService} from '../../customer/customer.service';
import * as _ from 'underscore';
import {AreaService} from '../../area/area.service';

@Component({
  selector: 'app-quotation-edit',
  templateUrl: './quotation-edit.component.html',
  styleUrls: ['./quotation-edit.component.css']
})
export class QuotationEditComponent implements OnInit {
  @ViewChild('productSelectBox') productSelectBox: ElementRef;

  public productList: any[] = [];
  public additionalProducts: any[] = [];
  public addProductCounter: number = 0;
  public allProductsAdd: any[] = [];


  public productSuggestions: any[] = [];

  private subscription: Subscription;
  public quotationDetailForm: FormGroup;
  private id: any;
  public quotation: Quotation;
  public currentDate: number = Date.now();
  public datePipe: DatePipe = new DatePipe('en-US');
  public paymentStatus: string = 'Due';
  public showForm: boolean = false;
  private type: string;

  constructor(private areaService: AreaService, private customerService: CustomerService, private elementRef: ElementRef, private productService: ProductService, private fb: FormBuilder, private quotationService: QuotationService, private route: ActivatedRoute, private router: Router) {

  }

  ngOnInit() {
    this.getProductList();
    this.subscription = this.route.params.subscribe(params => {
      this.id = params['id'];
      this.type = params['type'];
      if (this.id) {
        this.quotationService.getQuotationById(this.type, this.id)
          .subscribe(
            (res) => {
              this.quotation = res;
              this.allProductsAdd = this.quotation.productList;
              this.buildForm();
            },
            (err) => {

            }
          )
      }
    });
  }

  buildForm() {
    this.customerService.getCustomerDetails(this.quotation.customer_id)
      .subscribe(
        (res) => {
          this.quotation.customerData = res;
          this.quotation.customerData.productData = [];
         // let total_partially_paid = 0;
          _.each(this.quotation.productList, (item) => {
            this.productService.getProductById(item)
              .subscribe(
                (res) => {
                  this.quotation.customerData.productData.push(res);
                }
              )
          //  total_partially_paid += item['amount'];
          });

          this.quotationDetailForm = this.fb.group({
            username: [res['username']],
            nid : [res['nid']],
            email: [res['email']],
            fullname: [res['fullname']],
            location: [res['location']],
            area: [''],
            city: [res['city']],
            mobile_primary: [res['mobile_primary']],
            mobile_secondary: [res['mobile_secondary']],
            payment_due_date: [this.quotation['payment_due_date']],
            amount_due: [this.quotation['amount_due']],
            status: [this.quotation['status']],
            total: [this.quotation['total']],
            quotedesc : [this.quotation['quotedesc']],
            discount: [this.quotation['discount']],
            quotation_created_date: [this.quotation['quotation_created_date']],
            paid_date: [this.quotation['paid_date']],
           // amount_partially_paid: total_partially_paid
          });

          this.areaService.getAreaById(res['area'])
            .subscribe(
              (res) => {
                this.quotationDetailForm.patchValue({
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
      index = index + this.quotation.customerData.productData.length;
    }
    this.allProductsAdd[index] = event.target.value;
    this.updatePayments();
  }

  submitQuotationEditForm() {
    let data = {};
    data = {
      id: this.id,
      amount_due: this.quotationDetailForm.value.amount_due,
      total: this.quotationDetailForm.value.total,
      quotedesc : this.quotationDetailForm.value.quotedesc,
      discount: this.quotationDetailForm.value.discount,
      productList: this.allProductsAdd,
      //amount_partially_paid: this.quotation.amount_partially_paid,
      type: this.type
    }

    this.quotationService.preGenerateQuotationUpdate(data)
      .subscribe(
        (res) => {
          this.router.navigate(['dashboard/quotation/display', this.type, this.id]);
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
      this.quotationDetailForm.patchValue({
        paid_date: currentDate
      });
    }
  }

  getPartiallyPaid(event: any) {
    this.quotationDetailForm.patchValue({
      amount_partially_paid: event.target.value,
      amount_due: this.quotation.amount_due - event.target.value
    });
  }

  getDiscount(event: any) {
    this.quotationDetailForm.patchValue({
      total: this.quotationDetailForm.value.amount_due - event.target.value
    });
  }

  

  updatePayments() {
    let total = 0;
    _.each(this.allProductsAdd, (item) => {
      let product = _.findWhere(this.productList, {_id: item});
      total += product.rate;
    });

    this.quotationDetailForm.patchValue({
      total: total,
      discount: 0,
      amount_due: total
    });
  }
}
