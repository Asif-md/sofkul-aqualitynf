import {Component, OnInit} from '@angular/core';
import {Quotation} from '../quotation';
import {QuotationService} from '../quotation.service';
import {Customer} from '../../customer/customer';
import {Product} from '../../product/product';
import {AreaService} from '../../area/area.service';
import {CustomerService} from '../../customer/customer.service';
import {ProductService} from '../../product/product.service';
import * as _ from 'underscore';

@Component({
  selector: 'app-quotation-search',
  templateUrl: './quotation-search.component.html',
  styleUrls: ['./quotation-search.component.css']
})
export class QuotationSearchComponent implements OnInit {
  public searchText: string;
  public searchResults: any[] = [];
  public quotationList: Quotation[] = [];
  public partialQuotation: Quotation;
  public partialPay: any;
  public delQuotation: Quotation;
  public showRemoveConfirmation: boolean = false;

  constructor(private customerService: CustomerService, private quotationService: QuotationService, private productService: ProductService, private areaService: AreaService) {
  }

  ngOnInit() {
  }


  getSearchText(event: any) {
    this.quotationList = [];
    this.searchResults = [];
    this.searchText = event.target.value;
    this.getGlobalQuotationSearchByCustomer();
  }


  getGlobalQuotationSearchByCustomer() {
    this.quotationService.globalQuotationSearchByCustomer(this.searchText)
      .subscribe(
        (res) => {
          this.searchResults = res;
        }
      )
  }

  getSearchDetails(data) {
    let id = data['_id'];
    this.quotationList = [];
    this.quotationService.getQuotationByCustomerId(id)
      .subscribe(
        (res) => {
          _.each(res, (quotation: Quotation) => {
            let customer: Customer;

            if (quotation['type']=='') {
              quotation['type'] = 'recent';
            }

            this.customerService.getCustomerDetails(quotation.customer_id)
              .subscribe(
                (res: Customer) => {
                  customer = res;
                  if (customer['status']) {
                    customer.productData = [];
                    if (quotation.productList.length > 0) {
                      _.each(quotation.productList, (element) => {
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
                      quotation.customerData = customer;
                    this.quotationList.push(quotation);
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


  changeStatus(status: string, quotation: Quotation) {
    if (status == 'Paid') {
      this.setPaidDateCounter(quotation);
      quotation.status = 'Paid';
      //quotation.paid_date = Date.now();
      quotation.amount_due = 0;
    } else if (status == 'Due') {
      quotation.status = 'Due';
      quotation.amount_due = quotation.total;
     // quotation.amount_partially_paid = [];
    } else if (status == 'Partially Paid') {
      this.partialQuotation = quotation;
    }

    if (quotation['type'] != 'recent') {
      quotation['type'] = 'all';
    }
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
          // console.log(res);
        },
        (err) => {
          console.log("Error in setpaiddatecounter");
        }
      )
  }

 /* savePartialPay(quotation: Quotation) {
    let data = {
      id: this.partialQuotation['_id'],
      amount_partially_paid: this.partialPay
    }

    this.quotationService.savePartialPay(data)
      .subscribe(
        (res) => {
          if (res['status']) {
            this.partialPay = 0;
            this.getSearchDetails({_id: quotation.customer_id});
          }
        },
        (err) => {

        }
      )
  }*/

  remove(quotation: Quotation) {
    this.showRemoveConfirmation = true;
    this.delQuotation = quotation;
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


}
