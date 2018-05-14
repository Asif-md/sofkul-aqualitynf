import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {DeliveryService} from '../delivery.service';
import {Delivery} from '../delivery';
import {Customer} from '../../customer/customer';
import {Invoice} from '../../invoice/invoice';
import {Product} from '../../product/product';
import {AreaService} from '../../area/area.service';
import {CustomerService} from '../../customer/customer.service';
import {InvoiceService} from '../../invoice/invoice.service';
import {ProductService} from '../../product/product.service';
import * as _ from 'underscore';

@Component({
  selector: 'app-delivery-all',
  templateUrl: './delivery-all.component.html',
  styleUrls: ['./delivery-all.component.css']
})
export class DeliveryAllComponent implements OnInit {

  public deliveryList: Delivery[] = [];
  public partialDelivery: Delivery;
  totalDeliveryCount: number = 0;
  public paginator = 1;
  public delDelivery: Delivery;
  public showRemoveConfirmation: boolean = false;

  constructor(private customerService: CustomerService, private router: Router, private invoiceService: InvoiceService ,private deliveryService: DeliveryService, private productService: ProductService, private areaService: AreaService) {
  }

  ngOnInit() {
    this.deliveryService.getAllDeliveryCount()
      .subscribe(
        (res) => {
          this.totalDeliveryCount = res.count;
        }
      );
    this.getAllDelivery();

  }

  
  getAllDelivery() {
  
    this.deliveryList = [];
    this.deliveryService.getAllDelivery(this.paginator)
      .subscribe(
        (res: Delivery[]) => {
          if (res.length == 0) {
            this.deliveryList = [];
          } else {
            _.each(res, (delivery: Delivery) => {
              let customer: Customer;
              this.customerService.getCustomerDetails(delivery.customer_id)
                .subscribe(
                  (res: Customer) => {
                    customer = res;
                    customer.productData = [];
                    if (delivery.productList2.length > 0) {
                      _.each(delivery.productList2, (element) => {
                        this.deliveryService.getDeliveryByCustomerId(element)
                          .subscribe(
                            (res: Delivery) => {
                              customer['productList2'].push(res);
                            }
                          )
                      });
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
                )
            });
          }
        },
        (err) => {
          console.log('ERROR in getAllDelivery');
        }
      )
  }

  toggleSearchStatus(event: any) {
    console.log(event);
  }

  filterChange(event: any) {

  }

  quickSearch(event: any) {

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

    delivery['type'] = 'all';

    this.deliveryService.changeDeliveryStatus(delivery)
      .subscribe(
        (res) => {

        }
      )
  }

  //  for pagination
  onPaginate(event: any) {
    this.paginator = event;
    this.getAllDelivery();
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
