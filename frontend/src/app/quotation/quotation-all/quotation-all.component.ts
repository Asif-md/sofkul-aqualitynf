import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {QuotationService} from '../quotation.service';
import {Quotation} from '../quotation';
import {Customer} from '../../customer/customer';
import {Product} from '../../product/product';
import {AreaService} from '../../area/area.service';
import {CustomerService} from '../../customer/customer.service';
import {ProductService} from '../../product/product.service';
import * as _ from 'underscore';

@Component({
  selector: 'app-quotation-all',
  templateUrl: './quotation-all.component.html',
  styleUrls: ['./quotation-all.component.css']
})
export class QuotationAllComponent implements OnInit {

  public quotationList: Quotation[] = [];
  public partialQuotation: Quotation;
  totalQuotationCount: number = 0;
  public paginator = 1;
  public delQuotation: Quotation;
  public showRemoveConfirmation: boolean = false;

  constructor(private customerService: CustomerService, private router: Router, private quotationService: QuotationService, private productService: ProductService, private areaService: AreaService) {
  }
 
  ngOnInit() {
    this.quotationService.getAllQuotationCount()
      .subscribe(
        (res) => {
          this.totalQuotationCount = res.count;
        }
      );
    this.getAllQuotation();

  }

  getAllQuotation() {
    this.quotationList = [];
    this.quotationService.getAllQuotation(this.paginator)
      .subscribe(
        (res: Quotation[]) => {
          if (res.length == 0) {
            this.quotationList = [];
          } else {
            _.each(res, (quotation: Quotation) => {
              let customer: Customer;
              this.customerService.getCustomerDetails(quotation.customer_id)
                .subscribe(
                  (res: Customer) => {
                    customer = res;
                    customer.productData = [];
                    if (quotation.productList.length > 0) {
                      _.each(quotation.productList, (element) => {
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
                    quotation.customerData = customer;
                    this.quotationList.push(quotation);
                  }
                )
            });
          }
        },
        (err) => {
          console.log('ERROR in getAllQuotation');
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

  /*changeStatus(status: string, quotation: Quotation) {
    if (status == 'Paid') {
      this.setPaidDateCounter(quotation);
      quotation.status = 'Paid';
      //quotation.paid_date = Date.now();
      quotation.amount_due = 0;
    } else if (status == 'Due') {
      quotation.status = 'Due';
      //quotation.amount_due = quotation.total;
      //quotation.amount_partially_paid = [];
    } else if (status == 'Partially Paid') {
      this.partialQuotation = quotation;
    }

    quotation['type'] = 'all';

    this.quotationService.changeQuotationStatus(quotation)
      .subscribe(
        (res) => {

        }
      )
  }*/

  //  for pagination
  onPaginate(event: any) {
    this.paginator = event;
    this.getAllQuotation();
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

  remove(delivery: Quotation) {
    this.showRemoveConfirmation = true;
    this.delQuotation = delivery;
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
