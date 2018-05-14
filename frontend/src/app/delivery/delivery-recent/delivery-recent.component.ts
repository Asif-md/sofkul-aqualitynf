import {Router} from '@angular/router';
import {Product} from '../../product/product';
import {Component, OnInit} from '@angular/core';
import {DeliveryService} from '../delivery.service';
import {Customer} from '../../customer/customer';
import * as _ from 'underscore';
import {Delivery} from '../delivery';
import {ProductService} from '../../product/product.service';
import {AreaService} from '../../area/area.service';
import {CustomerService} from '../../customer/customer.service';

@Component({
  selector: 'app-delivery-recent',
  templateUrl: './delivery-recent.component.html',
  styleUrls: ['./delivery-recent.component.css']
})
export class DeliveryRecentComponent implements OnInit {
  public currentDate: number = Date.now();
  public deliveryList: Delivery[] = [];
  public searchMode = 'username';
  public partialDelivery: Delivery;
  public paymentStatus: string;
  public partialPay: any;
  public isDeliverySaved: boolean = false;
  public isDeliveryError: boolean = false;
  public showRemoveConfirmation: boolean = false;
  public delDelivery: any;
  public paginator = 1;
  totalCustomerCount: number = 0;

  constructor(private customerService: CustomerService, private router: Router, private deliveryService: DeliveryService, private productService: ProductService, private areaService: AreaService) {
  }

  ngOnInit() {
    this.customerService.getTotalCustomerCount()
      .subscribe(
        (res) => {
          this.totalCustomerCount = res.count;
        }
      )
    this.getRecentDeliveryDB();
    // this.wakeUpDeliveryDemon();
  }

  //useless shitty method
  wakeUpDeliveryDemon() {
    this.deliveryService.cleanDelivery()
      .subscribe(
        (res) => {
          if (res.status) {
            this.generateNewDelivery();
          } else {
            this.getRecentDeliveryDB();
          }
        }
      )
  }

  //useless shitty method
  generateNewDelivery() {
    this.deliveryService.dropRecentDelivery()
      .subscribe(
        (res) => {
          this.buildAndSaveRecentDelivery();
        }
      )
  }

  getRecentDeliveryDB() {
    this.deliveryList = [];
    this.deliveryService.getRecentDeliveryDB(this.paginator)
      .subscribe(
        (res: Delivery[]) => {
          _.each(res, (delivery: Delivery) => {
            let customer: Customer;
            this.customerService.getCustomerDetails(delivery.customer_id)
              .subscribe(
                (res: Customer) => {
                  if (res['status']) {
                    customer = res;
                    customer.productData = [];
                    if (delivery.productList.length > 0) {
                      _.each(delivery.productList, (element) => {
                        this.productService.getProductById(element)
                          .subscribe(
                            (res: Product) => {
                              customer["productData"].push(res);
                            }
                          )
                      });
                    }
                    this.areaService.getAreaById(customer.area)
                      .subscribe(
                        (res) => {
                          customer["areaData"] = res;
                        },
                      )
                      delivery.customerData = customer;
                    this.deliveryList.push(delivery);
                  }
                }
              )
          });
        },
        (err) => {

        },
        () => {
          for (let i = 0; i < this.deliveryList.length; i++) {
            console.log("Hello World");
          }
        }
      )
  }

  buildAndSaveRecentDelivery() {
    this.deliveryService.buildAndSaveRecentDelivery()
      .subscribe(
        (res) => {
          this.getRecentDeliveryDB();
        },
        (err) => {
          console.log('Error in build and save');
        }
      )
  }

  saveRecentDelivery(delivery: Delivery) {
    this.deliveryService.saveRecentDelivery(delivery)
      .subscribe(
        (res) => {
        },
        (err) => {

        }
      )
  }

  filterChange(event: any) {
    this.searchMode = event;
  }

  quickSearch(event: any) {
    if (event == '') {
      this.getRecentDeliveryDB();
      return;
    }
    let reg = new RegExp(event, "i");
    let resArray = [];
    if (this.searchMode == 'username') {
      _.each(this.deliveryList, (item) => {
        if (reg.test(item['customerData']['username'])) {
          resArray.push(item);
        }
      });
      this.deliveryList = resArray;
    }
    else if (this.searchMode == 'mobile_number') {
      _.each(this.deliveryList, (item) => {
        if (reg.test(item['customerData']['mobile_primary'])) {
          resArray.push(item);
        }
      });
      this.deliveryList = resArray;
    }
    else if (this.searchMode == 'area') {
      _.each(this.deliveryList, (item) => {
        if (reg.test(item['customerData']['areaData']['name'])) {
          resArray.push(item);
        }
      });
      this.deliveryList = resArray;
    }
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

    delivery['type'] = 'recent';
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
          console.log(res);
        },
        (err) => {
          console.log("Error in setpaiddatecounter");
        }
      )
  }

  toggleSearchStatus(event: any) {
    this.getRecentDeliveryDB();
    this.paymentStatus = event.target.value;
    if (this.paymentStatus == 'All') {
      return;
    }
    let resArray = [];
    _.each(this.deliveryList, (item) => {
      if (_.isEqual(item.status, this.paymentStatus)) {
        resArray.push(item);
      }
    });
    this.deliveryList = resArray;
  }

  savePartialPay() {
    let data = {
      id: this.partialDelivery['_id'],
      amount_partially_paid: this.partialPay
    }

    this.deliveryService.savePartialPay(data)
      .subscribe(
        (res) => {
          if (res['status']) {
            this.partialPay = 0;
            this.getRecentDeliveryDB();
          }
        },
        (err) => {

        }
      )
  }

  remove(delDelivery) {
    this.showRemoveConfirmation = true;
    this.delDelivery = delDelivery;
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

  //  for pagination
  onPaginate(event: any) {
    this.paginator = event;
    this.getRecentDeliveryDB();
  }

}
