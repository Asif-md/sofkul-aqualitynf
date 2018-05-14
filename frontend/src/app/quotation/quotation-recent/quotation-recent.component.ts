import {Router} from '@angular/router';
import {Product} from '../../product/product';
import {Component, OnInit} from '@angular/core';
import {QuotationService} from '../quotation.service';
import {Customer} from '../../customer/customer';
import * as _ from 'underscore';
import {Quotation} from '../quotation';
import {ProductService} from '../../product/product.service';
import {AreaService} from '../../area/area.service';
import {CustomerService} from '../../customer/customer.service';

@Component({
  selector: 'app-quotation-recent',
  templateUrl: './quotation-recent.component.html',
  styleUrls: ['./quotation-recent.component.css']
})
export class QuotationRecentComponent implements OnInit {
  public currentDate: number = Date.now();
  public quotationList: Quotation[] = [];
  public searchMode = 'username';
  public partialQuotation: Quotation;
  public paymentStatus: string;
  public partialPay: any;
  public isQuotationSaved: boolean = false;
  public isQuotationError: boolean = false;
  public showRemoveConfirmation: boolean = false;
  public delQuotation: any;
  public paginator = 1;
  totalCustomerCount: number = 0;

  constructor(private customerService: CustomerService, private router: Router, private quotationService: QuotationService, private productService: ProductService, private areaService: AreaService) {
  }

  ngOnInit() {
    this.customerService.getTotalCustomerCount()
      .subscribe(
        (res) => {
          this.totalCustomerCount = res.count;
        }
      )
    this.getRecentQuotationDB();
    // this.wakeUpQuotationDemon();
  }

  //useless shitty method
  wakeUpQuotationDemon() {
    this.quotationService.cleanQuotation()
      .subscribe(
        (res) => {
          if (res.status) {
            this.generateNewQuotation();
          } else {
            this.getRecentQuotationDB();
          }
        }
      )
  }

  //useless shitty method
  generateNewQuotation() {
    this.quotationService.dropRecentQuotation()
      .subscribe(
        (res) => {
          this.buildAndSaveRecentQuotation();
        }
      )
  }

  getRecentQuotationDB() {
    this.quotationList = [];
    this.quotationService.getRecentQuotationDB(this.paginator)
      .subscribe(
        (res: Quotation[]) => {
          _.each(res, (quotation: Quotation) => {
            let customer: Customer;
            this.customerService.getCustomerDetails(quotation.customer_id)
              .subscribe(
                (res: Customer) => {
                  if (res['status']) {
                    customer = res;
                    customer.productData = [];
                    if (quotation.productList.length > 0) {
                      _.each(quotation.productList, (element) => {
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
                    quotation.customerData = customer;
                    this.quotationList.push(quotation);
                  }
                }
              )
          });
        },
        (err) => {

        },
        () => {
          for (let i = 0; i < this.quotationList.length; i++) {
            console.log("Hello World");
          }
        }
      )
  }

  buildAndSaveRecentQuotation() {
    this.quotationService.buildAndSaveRecentQuotation()
      .subscribe(
        (res) => {
          this.getRecentQuotationDB();
        },
        (err) => {
          console.log('Error in build and save');
        }
      )
  }

  saveRecentQuotation(quotation: Quotation) {
    this.quotationService.saveRecentQuotation(quotation)
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
      this.getRecentQuotationDB();
      return;
    }
    let reg = new RegExp(event, "i");
    let resArray = [];
    if (this.searchMode == 'username') {
      _.each(this.quotationList, (item) => {
        if (reg.test(item['customerData']['username'])) {
          resArray.push(item);
        }
      });
      this.quotationList = resArray;
    }
    else if (this.searchMode == 'mobile_number') {
      _.each(this.quotationList, (item) => {
        if (reg.test(item['customerData']['mobile_primary'])) {
          resArray.push(item);
        }
      });
      this.quotationList = resArray;
    }
    else if (this.searchMode == 'area') {
      _.each(this.quotationList, (item) => {
        if (reg.test(item['customerData']['areaData']['name'])) {
          resArray.push(item);
        }
      });
      this.quotationList = resArray;
    }
  }

  changeStatus(status: string, quotation: Quotation) {
    if (status == 'Paid') {
      this.setPaidDateCounter(quotation);
      quotation.status = 'Paid';
     // quotation.paid_date = Date.now();
      quotation.amount_due = 0;
    } else if (status == 'Due') {
      quotation.status = 'Due';
      quotation.amount_due = quotation.total;
      //quotation.amount_partially_paid = [];
    } else if (status == 'Partially Paid') {
      this.partialQuotation = quotation;
    }

    quotation['type'] = 'recent';
    this.quotationService.changeQuotationStatus(quotation)
      .subscribe(
        (res) => {
        }
      )
  }

  setPaidDateCounter(quotation: Quotation) {
    this.quotationService.setPaidDateCounter(quotation)
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
    this.getRecentQuotationDB();
    this.paymentStatus = event.target.value;
    if (this.paymentStatus == 'All') {
      return;
    }
    let resArray = [];
    _.each(this.quotationList, (item) => {
      if (_.isEqual(item.status, this.paymentStatus)) {
        resArray.push(item);
      }
    });
    this.quotationList = resArray;
  }

  /*savePartialPay() {
    let data = {
      id: this.partialQuotation['_id'],
      amount_partially_paid: this.partialPay
    }

    this.quotationService.savePartialPay(data)
      .subscribe(
        (res) => {
          if (res['status']) {
            this.partialPay = 0;
            this.getRecentQuotationDB();
          }
        },
        (err) => {

        }
      )
  }*/

  remove(delQuotation) {
    this.showRemoveConfirmation = true;
    this.delQuotation = delQuotation;
  }

  removeConfirmation(status) {
    if (status) {
      this.quotationService.deleteQuotation(this.delQuotation)
        .subscribe(
          (res) => {
            if (res['status']) {
              this.quotationList = _.without(this.quotationList, _.findWhere(this.quotationList, {
                _id: this.delQuotation['_id']
              }));
              this.showRemoveConfirmation = false;
            }
          },
          (err) => {
          }
        )
    } else {
      this.delQuotation = undefined;
      this.showRemoveConfirmation = false;
    }
  }

  //  for pagination
  onPaginate(event: any) {
    this.paginator = event;
    this.getRecentQuotationDB();
  }

}
