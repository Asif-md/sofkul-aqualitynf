import { Component, OnInit, Output, Input, SimpleChange, EventEmitter } from '@angular/core';
import { ProductService } from '../product.service';
import { Product } from '../product';
import * as _ from 'underscore';

@Component({
  selector: 'app-product-all',
  templateUrl: './product-all.component.html',
  styleUrls: ['./product-all.component.css']
})
export class ProductAllComponent implements OnInit {
  @Input() products: Product[] = [];
  @Output() statusChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() showEditForm: EventEmitter<string> = new EventEmitter<string>();

  public productList: Product[] = [];
  public delProduct: Product;
  public showRemoveConfirmation: boolean = false;

  constructor(private productService: ProductService) { }

  ngOnInit() {
  }


  toggleStatus(id, status) {
    let data = {
      id: id,
      status: !status
    };

    this.productService.setStatus(data)
      .subscribe(
      (res) => {
        if (res.status) {
          this.statusChange.emit(true);
        } else {
          this.statusChange.emit(false);
        }
      },
      (err) => {
        console.log('Error in toggleStatus');
      }
      )
  }


  editProduct(id){
    this.showEditForm.emit(id);
  }

  remove(product: Product) { 
    this.showRemoveConfirmation = true;
    this.delProduct = product;
  }


  removeConfirmation(status) {
    if (status) {
      this.productService.deleteProduct(this.delProduct)
        .subscribe(
          (res) => {
            if (res['status']) {
              this.productList = _.without(this.productList, _.findWhere(this.productList, {
                _id: this.delProduct['_id']
              }));
              this.showRemoveConfirmation = false;
            }
          },
          (err) => {

          }
        )
    } else {
      this.delProduct = undefined;
      this.showRemoveConfirmation = false;
    }
  }


}
