import {Component, OnInit, ElementRef} from '@angular/core';
import {FormGroup, FormBuilder, NgModel, Validators, FormsModule, ReactiveFormsModule } from "@angular/forms";
import {CustomerService} from '../customer.service';
import * as _ from 'underscore';
import {Customer} from '../customer';
import {ProductService} from '../../product/product.service';
import {AreaService} from '../../area/area.service';

@Component({
  selector: 'app-customer-create',
  templateUrl: './customer-create.component.html',
  styleUrls: ['./customer-create.component.css']
})
export class CustomerCreateComponent implements OnInit {

  
  showSuccess: boolean = false;
  showError: boolean = false;
  public customerCreateForm: FormGroup;
  public productList: any[] = [];
  public areaList: any[] = [];
  public allProductCounter = 1;
  public allProducts: any[] = [];

  public selectedObjId: any;


  constructor(private fb: FormBuilder, private customerService: CustomerService, private productService: ProductService, private areaService: AreaService) {
  }

  ngOnInit() {
    this.buildForm();
    this.getProductList();
    this.getAreaList();
  }

  buildForm() {
    this.customerCreateForm = this.fb.group({
      username: [''],
      gstno: [''],
      nid: [''],
      email: ['', Validators.required],
      fullname: ['', Validators.required],
      mobile_primary: ['+91'],
      mobile_secondary: ['+91'],
      website: [''],
      location: [''],
      ship_addr : [''],
      area: [''],
      city: ['Hyderabad'],
      state : ['Telangana'],
      country : ['India'],
      description: [''],
      postal_code: [''],
      status: [''],
      product: ['']
    });
  }

  submitCustomerCreateForm() {
    this.showSuccess = false;
    this.showError = false;
    this.allProducts = _.uniq(this.allProducts);

    let data: Customer = {
      username: this.customerCreateForm.value.username,
      gstno : this.customerCreateForm.value.gstno,
      nid: this.customerCreateForm.value.nid,
      email: this.customerCreateForm.value.email,
      fullname: this.customerCreateForm.value.fullname,
      customer_currency: 'INR',
      mobile_primary: this.customerCreateForm.value.mobile_primary,
      mobile_secondary: this.customerCreateForm.value.mobile_secondary,
      website: this.customerCreateForm.value.website,
      country: 'India',
      location: this.customerCreateForm.value.location,
      ship_addr : this.customerCreateForm.value.ship_addr,
      area: this.customerCreateForm.value.area,
      city: this.customerCreateForm.value.city,
      state : this.customerCreateForm.value.state,
      description: this.customerCreateForm.value.description,
      postal_code: this.customerCreateForm.value.postal_code,
      status: this.customerCreateForm.value.status,
      productList: this.allProducts,
      
    };


    this.customerService.createNewCustomer(data)
      .subscribe(
        (res) => {
          if (res.status) {
            this.showSuccess = true;
            this.customerCreateForm.reset();
          } else {
            this.showError = true;
          }
        },
        (err) => {
          this.showError = true;
          console.log("Error in createNewCustomer");
        }
      )
  }

  getProductList() {
    this.productList = [];
    this.productService.getAllProduct()
      .subscribe(
        (res) => {
          _.each(res, (item) => {
            if (item['status']) {
              this.productList.push(item);
            }
          });
        },
        (err) => {
          console.log("ERROR from productList");
        },
        () => {
          this.allProducts.push(this.productList[0]._id);
        }
      )
  }

  getAreaList() {
    this.areaList = [];
    this.areaService.getAllArea()
      .subscribe(
        (res) => {
          _.each(res, (item) => {
            if (item['status']) {
              this.areaList.push(item);
            }
          });
        },
        (err) => {
          console.log("ERROR from getAreaList");
        }
      )
  }

  removeProduct(index) {
    this.allProductCounter--;
    this.allProducts.splice(index, 1);
  }

  addProduct() {
    this.allProductCounter++;
    let newProduct = this.productList[0]._id;
    this.allProducts.push(newProduct);
  }

  onProductChange(event: any, index) {
    this.allProducts[index] = event.target.value;
  }

 

  createRange(number) {
    let items: number[] = [];
    for (let i = 1; i <= number; i++) {
      items.push(i);
    }
    return items;
  }

}
