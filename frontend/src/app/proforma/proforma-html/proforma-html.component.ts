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

import {ProformaService} from '../proforma.service';
import {ActivatedRoute} from '@angular/router';
import {Subscription} from "rxjs";
import {Proforma} from '../proforma';
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
  selector: 'app-proforma-html',
  templateUrl: './proforma-html.component.html',
  styleUrls: ['./proforma-html.component.css']
})
export class ProformaHtmlComponent implements OnInit, AfterViewInit {

  @ViewChild('proformaBox') proformaBox: ElementRef;
  @Input() autoProforma: any;
  private id: any;
  private subscription: Subscription;
  public proforma: Proforma;
  private type = '';
  private finalTotal;
  private finalTotalWords;
  public currentDate: number = Date.now();
  public datePipe: DatePipe = new DatePipe('en-US');
  public tempProforma: Proforma;
  public isAutoProforma: boolean = false;

  constructor(private generalService: GeneralService,private router: Router , private productService: ProductService, private customerService: CustomerService, private proformaService: ProformaService, private route: ActivatedRoute) {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['autoProforma']) {
      this.isAutoProforma = true;
      this.tempProforma = changes['autoProforma'].currentValue;
    }
  }

  ngOnInit() {
    //this.generalService.displaySidebar(false);
    this.subscription = this.route.params.subscribe(params => {
      this.id = params['id'];
      this.type = params['type']; 
      if (!this.isAutoProforma) {
        this.getProformaById(params['id']);
      } else {
        this.proforma = this.tempProforma;
        this.proforma['created_on'] = this.currentDate;
        this.finalTotal = this.proforma.amount_due - this.proforma.discount;
        this.finalTotalWords = this.numberToEnglish(this.proforma.total, '');
      }
    });

  }


  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  ngAfterContentInit() {
    // if (this.isAutoproforma) {
    //   this.downloadPDF();
    //
    // }
  }

  ngAfterViewInit(){
    if (this.isAutoProforma) {
      this.downloadPDF();
    }
  }

  downloadPDF() {
    html2canvas(document.getElementById('proforma_body'), {
      onrendered: (canvas) => {
        var imgData = canvas.toDataURL("image/jpeg", 1.0);
        var pdf = new jsPDF("p", "mm", "a4");
        pdf.addImage(imgData, 'JPEG', 0, 0, 210, 200);
        if (this.isAutoProforma) {
          var pdf = pdf.output('datauristring');
          let data = {
            pdf: pdf,
            label: this.proforma.customerData.username + "_" + this.datePipe.transform(Date.now(), 'MMMM')
          }

          console.log(data);

          this.proformaService.saveAutoProforma(data)
            .subscribe(
              (res) => {
                console.log(res);
              },
              (err) => {
                console.log("Error in auto pilot");
              }
            )
        } else {
          pdf.save(this.proforma.customerData.username + "_" + this.datePipe.transform(Date.now(), 'MMMM') + ".pdf");
        }
      }
    });
  }


  getProformaById(id: string) {
    this.proformaService.getProformaById(this.type, id)
      .subscribe(
        (res) => {
          this.proforma = res;
          this.proforma.total = 0;
          this.proforma.productData = [];
          // get product data
          _.each(this.proforma.productList, (item) => {
            this.productService.getProductById(item)
              .subscribe(
                (res) => {
                  res['amount_with_vat'] = res['rate'] + (res['rate'] * (res['vat'] / 100));
                  this.proforma.productData.push(res);
                  this.proforma.total = this.proforma.total + res['amount_with_vat'];
                  this.proforma.amount_due = this.proforma.total;
                }, (err) => {

                }, () => {
                  if (this.proforma.amount_partially_paid.length > 0) {
                    _.each(this.proforma.amount_partially_paid, (data) => {
                      this.proforma.amount_due = this.proforma.amount_due - data['amount'];
                    });
                  }
                  if (this.proforma.status == 'Paid') {
                    this.proforma.amount_due = 0;
                  }
                  this.finalTotal = this.proforma.amount_due - this.proforma.discount;
                  this.finalTotalWords = this.numberToEnglish(this.proforma.total, '');
                }
              )
          });


          //get customer data
          this.customerService.getCustomerDetails(this.proforma.customer_id)
            .subscribe(
              (res) => {
                this.proforma.customerData = res;
              },
              (err) => {

              },
              () => {
                console.log(this.proforma);
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

