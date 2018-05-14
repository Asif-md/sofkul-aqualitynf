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

import {DeliveryService} from '../delivery.service';
import {InvoiceService} from '../../invoice/invoice.service';
import {ActivatedRoute} from '@angular/router';
import {Subscription} from "rxjs";
import {Delivery} from '../delivery';
import {CustomerService} from '../../customer/customer.service';
import {ProductService} from '../../product/product.service';
import {GeneralService} from '../../general/general.service';
import * as _ from 'underscore';
import {DatePipe} from '@angular/common';
import {UploadService} from '../../upload.service';

declare let jsPDF;
declare let html2canvas;

@Component({
  selector: 'app-delivery-html',
  templateUrl: './delivery-html.component.html',
  styleUrls: ['./delivery-html.component.css']
})
export class DeliveryHtmlComponent implements OnInit, AfterViewInit {

  @ViewChild('deliveryBox') deliveryBox: ElementRef;
  @Input() autoDelivery: any;
  private id: any;
  private subscription: Subscription;
  public delivery: Delivery;
  private type = '';
  private finalTotal;
  private finalTotalWords;
  public currentDate: number = Date.now();
  public datePipe: DatePipe = new DatePipe('en-US');
  public tempDelivery: Delivery;
  public isAutoDelivery: boolean = false;

  constructor(private generalService: GeneralService, private invoiceService : InvoiceService ,private productService: ProductService, private customerService: CustomerService, private deliveryService: DeliveryService, private route: ActivatedRoute) {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['autoDelivery']) {
      this.isAutoDelivery = true;
      this.tempDelivery = changes['autoDelivery'].currentValue;
    }
  }
  

  ngOnInit() {
    //this.generalService.displaySidebar(false);
    this.subscription = this.route.params.subscribe(params => {
      this.id = params['id'];
      this.type = params['type'];
      if (!this.isAutoDelivery) {
        this.getDeliveryById(params['id']);
      } else {
        this.delivery = this.tempDelivery;
        this.delivery['created_on'] = this.currentDate;
        this.finalTotal = this.delivery.amount_due - this.delivery.discount;
        this.finalTotalWords = this.numberToEnglish(this.delivery.total, '');
      }
    });

  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  ngAfterContentInit() {
    // if (this.isAutoDelivery) {
    //   this.downloadPDF();
    //
    // }
  }

  ngAfterViewInit(){
    if (this.isAutoDelivery) {
      this.downloadPDF();
    }
  }

  downloadPDF() {
    html2canvas(document.getElementById('delivery_body'), {
      onrendered: (canvas) => {
        var imgData = canvas.toDataURL("image/jpeg", 1.0);
        var pdf = new jsPDF("p", "mm", "a4");
        pdf.addImage(imgData, 'JPEG', 0, 0, 210, 200);
        if (this.isAutoDelivery) {
          var pdf = pdf.output('datauristring');
          let data = {
            pdf: pdf,
            label: this.delivery.customerData.username + "_" + this.datePipe.transform(Date.now(), 'MMMM')
          }

          console.log(data);

          this.deliveryService.saveAutoDelivery(data)
            .subscribe(
              (res) => {
                console.log(res);
              },
              (err) => {
                console.log("Error in auto pilot");
              }
            )
        } else {
          pdf.save(this.delivery.customerData.username + "_" + this.datePipe.transform(Date.now(), 'MMMM') + ".pdf");
        }
      }
    });
  }


  

  getDeliveryById(id: string) {
    this.deliveryService.getDeliveryById(this.type, id)
      .subscribe(
        (res) => {
          this.delivery = res;
          this.delivery.total = 0;
          this.delivery.productData = [];
         
          //get customer data
          this.customerService.getCustomerDetails(this.delivery.customer_id)
            .subscribe(
              (res) => {
                this.delivery.customerData = res;
              },
              (err) => {

              },
              () => {
                console.log(this.delivery);
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
