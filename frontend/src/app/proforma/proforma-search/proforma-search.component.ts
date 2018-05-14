import {Component, OnInit} from '@angular/core';
import {Proforma} from '../proforma';
import {ProformaService} from '../proforma.service';
import {Customer} from '../../customer/customer';
import {Product} from '../../product/product';
import {AreaService} from '../../area/area.service';
import {CustomerService} from '../../customer/customer.service';
import {ProductService} from '../../product/product.service';
import * as _ from 'underscore';

@Component({
  selector: 'app-proforma-search',
  templateUrl: './proforma-search.component.html',
  styleUrls: ['./proforma-search.component.css']
})
export class ProformaSearchComponent implements OnInit {
  public searchText: string;
  public searchResults: any[] = [];
  public proformaList: Proforma[] = [];
  public partialProforma: Proforma;
  public partialPay: any;
  public delProforma: Proforma;
  public showRemoveConfirmation: boolean = false;

  constructor(private customerService: CustomerService, private proformaService: ProformaService, private productService: ProductService, private areaService: AreaService) {
  }

  ngOnInit() {
  }


  getSearchText(event: any) {
    this.proformaList = [];
    this.searchResults = [];
    this.searchText = event.target.value;
    this.getGlobalProformaSearchByCustomer();
  }


  getGlobalProformaSearchByCustomer() {
    this.proformaService.globalProformaSearchByCustomer(this.searchText)
      .subscribe(
        (res) => {
          this.searchResults = res;
        }
      )
  }

  getSearchDetails(data) {
    let id = data['_id'];
    this.proformaList = [];
    this.proformaService.getProformaByCustomerId(id)
      .subscribe(
        (res) => {
          _.each(res, (proforma: Proforma) => {
            let customer: Customer;

            if (proforma['type']=='') {
              proforma['type'] = 'recent';
            }

            this.customerService.getCustomerDetails(proforma.customer_id)
              .subscribe(
                (res: Customer) => {
                  customer = res;
                  if (customer['status']) {
                    customer.productData = [];
                    if (proforma.productList.length > 0) {
                      _.each(proforma.productList, (element) => {
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
                      proforma.customerData = customer;
                    this.proformaList.push(proforma);
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


  changeStatus(status: string, proforma: Proforma) {
    if (status == 'Paid') {
      this.setPaidDateCounter(proforma);
      proforma.status = 'Paid';
      proforma.paid_date = Date.now();
      proforma.amount_due = 0;
    } else if (status == 'Due') {
      proforma.status = 'Due';
      proforma.amount_due = proforma.total;
      proforma.amount_partially_paid = [];
    } else if (status == 'Partially Paid') {
      this.partialProforma = proforma;
    }

    if (proforma['type'] != 'recent') {
      proforma['type'] = 'all';
    }
    this.proformaService.changeProformaStatus(proforma)
      .subscribe(
        (res) => {

        }
      )
  }

  setPaidDateCounter(proforma: Proforma) {
    this.proformaService.setPaidDateCounter(proforma)
      .subscribe(
        (res) => {
          // console.log(res);
        },
        (err) => {
          console.log("Error in setpaiddatecounter");
        }
      )
  }

  savePartialPay(proforma: Proforma) {
    let data = {
      id: this.partialProforma['_id'],
      amount_partially_paid: this.partialPay
    }

    this.proformaService.savePartialPay(data)
      .subscribe(
        (res) => {
          if (res['status']) {
            this.partialPay = 0;
            this.getSearchDetails({_id: proforma.customer_id});
          }
        },
        (err) => {

        }
      )
  }

  remove(proforma: Proforma) {
    this.showRemoveConfirmation = true;
    this.delProforma = proforma;
  }


  removeConfirmation(status) {
    if (status) {
      this.proformaService.deleteProforma(this.delProforma)
        .subscribe(
          (res) => {
            if (res['status']) {
              this.proformaList = _.without(this.proformaList, _.findWhere(this.proformaList, {
                _id: this.delProforma['_id']
              }));
              this.showRemoveConfirmation = false;
            }
          },
          (err) => {

          }
        )
    } else {
      this.delProforma = undefined;
      this.showRemoveConfirmation = false;
    }
  }


}
