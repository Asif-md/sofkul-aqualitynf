import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Input,
  SimpleChanges,
  OnChanges,
  AfterContentInit,
  AfterViewInit
} from '@angular/core';

import {QuotationService} from '../quotation.service';
import {ActivatedRoute} from '@angular/router';
import {Subscription} from "rxjs";
import {Quotation} from '../quotation';
import {CustomerService} from '../../customer/customer.service';
import {ProductService} from '../../product/product.service';
import {GeneralService} from '../../general/general.service';
import * as _ from 'underscore';
import {DatePipe} from '@angular/common';
import {UploadService} from '../../upload.service';
import {Router} from '@angular/router';

declare let jsPDF;
declare let html2canvas;

@Component({
  selector: 'app-quotation-html',
  templateUrl: './quotation-html.component.html',
  styleUrls: ['./quotation-html.component.css']
})
export class QuotationHtmlComponent implements OnInit, AfterViewInit {

  @ViewChild('quotationBox') quotationBox: ElementRef;
  @Input() autoQuotation: any;
  private id: any;
  private subscription: Subscription;
  public quotation: Quotation;
  private subTotal;
  private type = '';
  private finalTotal;
  private finalTotalWords;
  public currentDate: number = Date.now();
  public datePipe: DatePipe = new DatePipe('en-US');
  public tempQuotation: Quotation;
  public isAutoQuotation: boolean = false;

  constructor(private generalService: GeneralService, private router: Router, private productService: ProductService, private customerService: CustomerService, private quotationService: QuotationService, private route: ActivatedRoute) {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['autoQuotation']) {
      this.isAutoQuotation = true;
      this.tempQuotation = changes['autoQuotation'].currentValue;
    }
  }

 
  
  ngOnInit() {
    //this.generalService.displaySidebar(false);
    this.subscription = this.route.params.subscribe(params => {
      this.id = params['id'];
      this.type = params['type']; 
      if (!this.isAutoQuotation) {
        this.getQuotationById(params['id']);
      } else {
        this.quotation = this.tempQuotation;
        this.quotation['created_on'] = this.currentDate;
        this.subTotal = this.quotation.total;
        this.finalTotal = this.quotation.amount_due - this.quotation.discount;
        this.finalTotalWords = this.numberToEnglish(this.quotation.total, '');
      }
    });

  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  ngAfterContentInit() {
    // if (this.isAutoQuotation) {
    //   this.downloadPDF();
    //
    // }
  }

  ngAfterViewInit(){
    if (this.isAutoQuotation) {
      this.downloadPDF();
    }
  }

  downloadPDF() {
    html2canvas(document.getElementById('quotation_body'), {
      onrendered: (canvas) => {
        var imgData = canvas.toDataURL("image/jpeg", 1.0);
        var pdf = new jsPDF("p", "mm", "a4");
        pdf.addImage(imgData, 'JPEG', 0, 0, 210, 200);
        if (this.isAutoQuotation) {
          var pdf = pdf.output('datauristring');
          let data = {
            pdf: pdf,
            label: this.quotation.customerData.username + "_" + this.datePipe.transform(Date.now(), 'MMMM')
          }

          console.log(data);

          this.quotationService.saveAutoQuotation(data)
            .subscribe(
              (res) => {
                console.log(res);
              },
              (err) => {
                console.log("Error in auto pilot");
              }
            )
        } else {
          pdf.save(this.quotation.customerData.username + "_" + this.datePipe.transform(Date.now(), 'MMMM') + ".pdf");
        }
      }
    });
  }


  getQuotationById(id: string) {
    this.quotationService.getQuotationById(this.type, id)
      .subscribe(
        (res) => {
          this.quotation = res;
          this.quotation.total = 0;
          
          this.quotation.productData = [];
          // get product data
          _.each(this.quotation.productList, (item) => {
            this.productService.getProductById(item)
              .subscribe(
                (res) => {
                  
                  res['amount_with_vat'] = res['rate'] + (res['rate'] * (res['vat'] / 100));
                  //res['subtotal'] = res['rate'] ;
                  this.quotation.productData.push(res);
                  this.quotation.total = this.quotation.total + res['amount_with_vat'];
                  this.quotation.amount_due = this.quotation.total;
                  
                  
                }, (err) => {

                }, () => {
                 // if (this.quotation.amount_partially_paid.length > 0) {
                  //  _.each(this.quotation.amount_partially_paid, (data) => {
                //      this.quotation.amount_due = this.quotation.amount_due - data['amount'];
                 //   });
                 // }
                  if (this.quotation.status == 'Paid') {
                    this.quotation.amount_due = 0;
                  }
                  this.finalTotal = this.quotation.amount_due - this.quotation.discount;
                  this.finalTotalWords = this.numberToEnglish(this.quotation.total, '');
                }
              )
          });


          //get customer data
          this.customerService.getCustomerDetails(this.quotation.customer_id)
            .subscribe(
              (res) => {
                this.quotation.customerData = res;
              },
              (err) => {

              },
              () => {
                console.log(this.quotation);
              }
            )
        },
        (err) => {
          console.log(err);
        }
      )
  }

  numberToEnglish(n, custom_join_character) {

    var string = n.toString(),
      units, tens, scales, start, end, chunks, chunksLen, chunk, ints, i, word, words;

    var and = custom_join_character || 'and';

    /* Is number zero? */
    if (parseInt(string) === 0) {
      return 'zero';
    }

    /* Array of units as words */
    units = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];

    /* Array of tens as words */
    tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

    /* Array of scales as words */
    scales = ['', 'thousand', 'million', 'billion', 'trillion', 'quadrillion', 'quintillion', 'sextillion', 'septillion', 'octillion', 'nonillion', 'decillion', 'undecillion', 'duodecillion', 'tredecillion', 'quatttuor-decillion', 'quindecillion', 'sexdecillion', 'septen-decillion', 'octodecillion', 'novemdecillion', 'vigintillion', 'centillion'];

    /* Split user arguemnt into 3 digit chunks from right to left */
    start = string.length;
    chunks = [];
    while (start > 0) {
      end = start;
      chunks.push(string.slice((start = Math.max(0, start - 3)), end));
    }

    /* Check if function has enough scale words to be able to stringify the user argument */
    chunksLen = chunks.length;
    if (chunksLen > scales.length) {
      return '';
    }
    /* Stringify each integer in each chunk */
    words = [];
    for (i = 0; i < chunksLen; i++) {
      chunk = parseInt(chunks[i]);
      if (chunk) {
        /* Split chunk into array of individual integers */
        ints = chunks[i].split('').reverse().map(parseFloat);

        /* If tens integer is 1, i.e. 10, then add 10 to units integer */
        if (ints[1] === 1) {
          ints[0] += 10;
        }

        /* Add scale word if chunk is not zero and array item exists */
        if ((word = scales[i])) {
          words.push(word);
        }

        /* Add unit word if array item exists */
        if ((word = units[ints[0]])) {
          words.push(word);
        }

        /* Add tens word if array item exists */
        if ((word = tens[ints[1]])) {
          words.push(word);
        }

        /* Add 'and' string after units or tens integer if: */
        if (ints[0] || ints[1]) {
          /* Chunk has a hundreds integer or chunk is the first of multiple chunks */
          if (ints[2] || !i && chunksLen) {
            words.push(and);
          }
        }

        /* Add hundreds word if array item exists */
        if ((word = units[ints[2]])) {
          words.push(word + ' hundred');
        }
      }
    }
    return words.reverse().join(' ');
  }
}
