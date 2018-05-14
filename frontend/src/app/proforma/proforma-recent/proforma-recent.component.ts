import {Router} from '@angular/router';
import {Product} from '../../product/product';
import {Component, OnInit} from '@angular/core';
import {ProformaService} from '../proforma.service';
import {Customer} from '../../customer/customer';
import * as _ from 'underscore';
import {Proforma} from '../proforma';
import {ProductService} from '../../product/product.service';
import {AreaService} from '../../area/area.service';
import {CustomerService} from '../../customer/customer.service';

@Component({
  selector: 'app-proforma-recent',
  templateUrl: './proforma-recent.component.html',
  styleUrls: ['./proforma-recent.component.css']
})
export class ProformaRecentComponent implements OnInit {
  public currentDate: number = Date.now();
  public proformaList: Proforma[] = [];
  public searchMode = 'username';
  public partialProforma: Proforma;
  public paymentStatus: string;
  public partialPay: any;
  public isProformaSaved: boolean = false;
  public isProformaError: boolean = false;
  public showRemoveConfirmation: boolean = false;
  public delProforma: any;
  public paginator = 1;
  totalCustomerCount: number = 0;

  constructor(private customerService: CustomerService, private router: Router, private proformaService: ProformaService, private productService: ProductService, private areaService: AreaService) {
  }

  ngOnInit() {
    this.customerService.getTotalCustomerCount()
      .subscribe(
        (res) => {
          this.totalCustomerCount = res.count;
        }
      )
    this.getRecentProformaDB();
    // this.wakeUpProformaDemon();
  }

  //useless shitty method
  wakeUpProformaDemon() {
    this.proformaService.cleanProforma()
      .subscribe(
        (res) => {
          if (res.status) {
            this.generateNewProforma();
          } else {
            this.getRecentProformaDB();
          }
        }
      )
  }

  //useless shitty method
  generateNewProforma() {
    this.proformaService.dropRecentProforma()
      .subscribe(
        (res) => {
          this.buildAndSaveRecentProforma();
        }
      )
  }

  getRecentProformaDB() {
    this.proformaList = [];
    this.proformaService.getRecentProformaDB(this.paginator)
      .subscribe(
        (res: Proforma[]) => {
          _.each(res, (proforma: Proforma) => {
            let customer: Customer;
            this.customerService.getCustomerDetails(proforma.customer_id)
              .subscribe(
                (res: Customer) => {
                  if (res['status']) {
                    customer = res;
                    customer.productData = [];
                    if (proforma.productList.length > 0) {
                      _.each(proforma.productList, (element) => {
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
                      proforma.customerData = customer;
                    this.proformaList.push(proforma);
                  }
                }
              )
          });
        },
        (err) => {

        },
        () => {
          for (let i = 0; i < this.proformaList.length; i++) {
            console.log("Hello World");
          }
        }
      )
  }

  buildAndSaveRecentProforma() {
    this.proformaService.buildAndSaveRecentProforma()
      .subscribe(
        (res) => {
          this.getRecentProformaDB();
        },
        (err) => {
          console.log('Error in build and save');
        }
      )
  }

  saveRecentProforma(proforma: Proforma) {
    this.proformaService.saveRecentProforma(proforma)
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
      this.getRecentProformaDB();
      return;
    }
    let reg = new RegExp(event, "i");
    let resArray = [];
    if (this.searchMode == 'username') {
      _.each(this.proformaList, (item) => {
        if (reg.test(item['customerData']['username'])) {
          resArray.push(item);
        }
      });
      this.proformaList = resArray;
    }
    else if (this.searchMode == 'mobile_number') {
      _.each(this.proformaList, (item) => {
        if (reg.test(item['customerData']['mobile_primary'])) {
          resArray.push(item);
        }
      });
      this.proformaList = resArray;
    }
    else if (this.searchMode == 'area') {
      _.each(this.proformaList, (item) => {
        if (reg.test(item['customerData']['areaData']['name'])) {
          resArray.push(item);
        }
      });
      this.proformaList = resArray;
    }
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

    proforma['type'] = 'recent';
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
          console.log(res);
        },
        (err) => {
          console.log("Error in setpaiddatecounter");
        }
      )
  }

  toggleSearchStatus(event: any) {
    this.getRecentProformaDB();
    this.paymentStatus = event.target.value;
    if (this.paymentStatus == 'All') {
      return;
    }
    let resArray = [];
    _.each(this.proformaList, (item) => {
      if (_.isEqual(item.status, this.paymentStatus)) {
        resArray.push(item);
      }
    });
    this.proformaList = resArray;
  }

  savePartialPay() {
    let data = {
      id: this.partialProforma['_id'],
      amount_partially_paid: this.partialPay
    }

    this.proformaService.savePartialPay(data)
      .subscribe(
        (res) => {
          if (res['status']) {
            this.partialPay = 0;
            this.getRecentProformaDB();
          }
        },
        (err) => {

        }
      )
  }

  remove(delProforma) {
    this.showRemoveConfirmation = true;
    this.delProforma = delProforma;
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

  //  for pagination
  onPaginate(event: any) {
    this.paginator = event;
    this.getRecentProformaDB();
  }

}
