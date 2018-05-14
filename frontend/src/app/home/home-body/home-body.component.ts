import {Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import {HomeService} from '../home.service';
import {GeneralService} from '../../general/general.service';
import {InvoiceService} from '../../invoice/invoice.service';
import {ProformaService} from '../../proforma/proforma.service';
import {CustomerService} from '../../customer/customer.service';
import {ProductService} from '../../product/product.service';
import {ReportService} from '../../report/report.service';
import {Report} from '../../report/report';

import * as _ from 'underscore';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-home-body',
  templateUrl: './home-body.component.html',
  styleUrls: ['./home-body.component.css'],
  providers: [GeneralService]
})
export class HomeBodyComponent implements OnInit {

  public datePipe = new DatePipe('en-US');
  totalInvoiceCount: number = 0;
  totalCustomerCount: number = 0;
  totalProductCount: number = 0;
  totalProformaCount : number = 0;

  public report: Report;
  public reportList: Report[] = [];

  constructor(private generalService: GeneralService, private router: Router, private homeService: HomeService, private invoiceService: InvoiceService, private customerService: CustomerService, private productService:ProductService, private reportService : ReportService, private proformaService : ProformaService) {
  }

 

  ngOnInit() {
    this.generalService.displaySidebar(true);
    this.wakeUpPayDateCounter();
    

    this.invoiceService.getAllInvoiceCount()
    .subscribe(
      (res) => {
        this.totalInvoiceCount = res.count;
      }
    );

    this.proformaService.getAllProformaCount()
    .subscribe(
      (res) => {
        this.totalProformaCount = res.count;
      }
    );

    this.customerService.getTotalCustomerCount()
      .subscribe(
        (res) => {
          this.totalCustomerCount = res.count;
        }
      )

    this.productService.getAllProductCount()
    .subscribe(
      (res) => {
        this.totalProductCount = res.count;
      }
    );


    
  
  } 

  filterChange(id) {
    this.reportList = [];
    this.reportService.getCustomerByArea(id)
      .subscribe(
        (res) => {
          _.each(res, (customer) => {
            let report = new Report();
            this.reportService.getReport(customer['_id'])
              .subscribe(
                (res) => {
                  report.current_due = res['current_due'];
                  report.previous_due = res['previous_due'];
                  report.total_due = res['total_due'];
                  if (res['total_due'] != 0) {
                    this.reportList.push(report);
                  }
                },
                (err) => {
                  console.log("Error in getReport");
                }
              )
          })
        },
        (err) => {
        },
        () => {
          // console.log(this.reportList);
        }
      )
  }

  cx () {
     this.router.navigate(['/dashboard/customer/all']);
   }

   p () {
    this.router.navigate(['/dashboard/product']);
  }

   invoice (){
    this.router.navigate(['/dashboard/invoice/all']);
   }

   proforma() {
    this.router.navigate(['/dashboard/proforma/all']);
   }

  wakeUpPayDateCounter() {
    this.homeService.buildPayDateCounter()
      .subscribe(
        (res) => {
          // console.log(res);
        },
        (err) => {
          console.log("error in buildPayDateCounter");
        }
      )
  }

 /* getPayDateCounter() {
    this.invoiceService.getPaidDateCounter()
      .subscribe(
        (res) => {
          _.each(res, (element) => {
            for (let i = 0; i < this.column_ChartData.length; i++) {
              if (this.column_ChartData[i][0].split('/')[0] == this.datePipe.transform(element['date'], 'dd/MM/yyyy').split('/')[0]) {
                this.column_ChartData[i][1] = element['amount'];
                this.column_ChartData[i][2] = element['invoice_id'].length;
                break;
              }
            }
          });
        },
        (err) => {
        }
      )
  }*/

}
