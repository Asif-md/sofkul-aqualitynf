import {Component, OnInit} from '@angular/core';
import {Delivery} from '../delivery';
import {DeliveryService} from '../delivery.service';
import {Customer} from '../../customer/customer';
import {Invoice} from '../../invoice/invoice';
import {Product} from '../../product/product';
import {AreaService} from '../../area/area.service';
import {CustomerService} from '../../customer/customer.service';
import {InvoiceService} from '../../invoice/invoice.service';
import {ProductService} from '../../product/product.service';
import * as _ from 'underscore';

@Component({
  selector: 'app-delivery-search',
  templateUrl: './delivery-search.component.html',
  styleUrls: ['./delivery-search.component.css']
})
export class DeliverySearchComponent implements OnInit {
  public searchText: string;
  public searchResults: any[] = [];
  public deliveryList: Delivery[] = [];
  public partialDelivery: Delivery;
  public partialPay: any;
  public delDelivery: Delivery;
  public showRemoveConfirmation: boolean = false;

  constructor(private customerService: CustomerService, private deliveryService: DeliveryService, private invoiceService: InvoiceService , private productService: ProductService, private areaService: AreaService) {
  }

  ngOnInit() {
  }


  getSearchText(event: any) {
    this.deliveryList = [];
    this.searchResults = [];
    this.searchText = event.target.value;
    this.getGlobalDeliverySearchByCustomer();
  }


  getGlobalDeliverySearchByCustomer() {
    this.deliveryService.globalDeliverySearchByCustomer(this.searchText)
      .subscribe(
        (res) => {
          this.searchResults = res;
        }
      )
  }

  getSearchDetails(data) {
    let id = data['_id'];
    this.deliveryList = [];
    this.deliveryService.getDeliveryByCustomerId(id)
      .subscribe(
        (res) => {
          _.each(res, (delivery: Delivery) => {
            let customer: Customer;

            if (delivery['type']=='') {
              delivery['type'] = 'recent';
            }

            this.customerService.getCustomerDetails(delivery.customer_id)
              .subscribe(
                (res: Customer) => {
                  customer = res;
                  if (customer['status']) {
                    customer.productData = [];
                    if (delivery.productList.length > 0) {
                      _.each(delivery.productList, (element) => {
                        this.productService.getProductById(element)
                          .subscribe(
                            (res: Product) => {
                              customer['productData'].push(res);
                            }
                          )
                      })
                    }

                    this.areaService.getAreaById(customer.area)
                      .subscribe(
                        (res) => {
                          customer['areaData'] = res;
                        }
                      )
                      delivery.customerData = customer;
                    this.deliveryList.push(delivery);
                  }
                }
              )
          })
        },
        (err) => {
          console.log('Error in getSearchDetails');
        }
      )
  }


  changeStatus(status: string, delivery: Delivery) {
    if (status == 'Paid') {
      this.setPaidDateCounter(delivery);
      delivery.status = 'Paid';
      delivery.paid_date = Date.now();
      delivery.amount_due = 0;
    } else if (status == 'Due') {
      delivery.status = 'Due';
      delivery.amount_due = delivery.total;
      delivery.amount_partially_paid = [];
    } else if (status == 'Partially Paid') {
      this.partialDelivery = delivery;
    }

    if (delivery['type'] != 'recent') {
      delivery['type'] = 'all';
    }
    this.deliveryService.changeDeliveryStatus(delivery)
      .subscribe(
        (res) => {

        }
      )
  }

  setPaidDateCounter(delivery: Delivery) {
    this.deliveryService.setPaidDateCounter(delivery)
      .subscribe(
        (res) => {
          // console.log(res);
        },
        (err) => {
          console.log("Error in setpaiddatecounter");
        }
      )
  }

  savePartialPay(delivery: Delivery) {
    let data = {
      id: this.partialDelivery['_id'],
      amount_partially_paid: this.partialPay
    }

    this.deliveryService.savePartialPay(data)
      .subscribe(
        (res) => {
          if (res['status']) {
            this.partialPay = 0;
            this.getSearchDetails({_id: delivery.customer_id});
          }
        },
        (err) => {

        }
      )
  }

  remove(delivery: Delivery) {
    this.showRemoveConfirmation = true;
    this.delDelivery = delivery;
  }


  removeConfirmation(status) {
    if (status) {
      this.deliveryService.deleteDelivery(this.delDelivery)
        .subscribe(
          (res) => {
            if (res['status']) {
              this.deliveryList = _.without(this.deliveryList, _.findWhere(this.deliveryList, {
                _id: this.delDelivery['_id']
              }));
              this.showRemoveConfirmation = false;
            }
          },
          (err) => {

          }
        )
    } else {
      this.delDelivery = undefined;
      this.showRemoveConfirmation = false;
    }
  }


}
