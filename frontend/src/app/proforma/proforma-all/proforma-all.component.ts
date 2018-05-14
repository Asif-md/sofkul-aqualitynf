import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {ProformaService} from '../proforma.service';
import {Proforma} from '../proforma';
import {Customer} from '../../customer/customer';
import {Product} from '../../product/product';
import {AreaService} from '../../area/area.service';
import {CustomerService} from '../../customer/customer.service';
import {ProductService} from '../../product/product.service';
import * as _ from 'underscore';

@Component({
  selector: 'app-proforma-all',
  templateUrl: './proforma-all.component.html',
  styleUrls: ['./proforma-all.component.css']
})
export class ProformaAllComponent implements OnInit {

  public proformaList: Proforma[] = [];
  public partialProforma: Proforma;
  totalProformaCount: number = 0;
  public paginator = 1;
  public delProforma: Proforma;
  public showRemoveConfirmation: boolean = false;

  constructor(private customerService: CustomerService, private router: Router, private proformaService: ProformaService, private productService: ProductService, private areaService: AreaService) {
  }

  ngOnInit() {
    this.proformaService.getAllProformaCount()
      .subscribe(
        (res) => {
          this.totalProformaCount = res.count;
        }
      );
    this.getAllProforma();

  }

  getAllProforma() {
    this.proformaList = [];
    this.proformaService.getAllProforma(this.paginator)
      .subscribe(
        (res: Proforma[]) => {
          if (res.length == 0) {
            this.proformaList = [];
          } else {
            _.each(res, (proforma: Proforma) => {
              let customer: Customer;
              this.customerService.getCustomerDetails(proforma.customer_id)
                .subscribe(
                  (res: Customer) => {
                    customer = res;
                    customer.productData = [];
                    if (proforma.productList.length > 0) {
                      _.each(proforma.productList, (element) => {
                        this.productService.getProductById(element)
                          .subscribe(
                            (res: Product) => {
                              customer['productData'].push(res);
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
                      proforma.customerData = customer;
                    this.proformaList.push(proforma);
                  }
                )
            });
          }
        },
        (err) => {
          console.log('ERROR in getAllProforma');
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

 /* changeStatus(status: string, proforma: Proforma) {
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

    proforma['type'] = 'all';

    this.proformaService.changeProformaStatus(proforma)
      .subscribe(
        (res) => {

        }
      )
  }*/

  //  for pagination
  onPaginate(event: any) {
    this.paginator = event;
    this.getAllProforma();
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
