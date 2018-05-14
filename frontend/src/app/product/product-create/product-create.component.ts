import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Product } from '../product';
import { ProductService } from '../product.service';

@Component({
  selector: 'app-product-create',
  templateUrl: './product-create.component.html',
  styleUrls: ['./product-create.component.css']
})
export class ProductCreateComponent implements OnInit {
  

  public products: Product[] = [];
  public productCreateForm: FormGroup;
  showSuccess: boolean = false;
  showError: boolean = false;
  editMode: boolean = false;
  createMode: boolean = false;
  private id: any;
  updateSuccess: boolean = false;
  test: any = "";
  name: string = 'abcd';
  sname:string='';
  srate:string='';
  sqty:string='';
  sqty2:string='';
  sdesc:string='';
  sgst:string='';
  sgst2:string='';
  sqr:any='';

  constructor(private fb: FormBuilder, private productService: ProductService) { }

  ngOnInit() {
    this.buildForm();
    this.getAllProduct();
  // product.q 
  }


 setValue2()
  { 
    var str = 'p2-xyz,r2-300,q2-5,g-6%,d2-this xyz product companyyy';
   this.f_GetByQrCode(str);
  }
  setValue()
  { 
    var str = 'p-xyz,r-300,q-5,g-6%,d-this xyz product companyyy'
   this.f_GetByQrCode(str);
  }
  setValue3()
  { 
  //  var s = this.sqr;
    var q2 = this.sqty2;
   // var q1 = this.sqty;
   // alert("q2 "+q2+"\n q1="+q1);
   this.f_GetByQrCode(q2);
  }
  fmakeQr()
  {

  }
fqr()
{
//  var s=this.sqr;
//alert("qr value "+s);
alert("qr value chng");
}


f_GetByQrCode(str)
{
//alert(str);
var str_array = str.split(',');
    
    for(var i = 0; i < str_array.length; i++)
     {
      str_array[i] = str_array[i].replace(/^\s*/, "").replace(/\s*$/, "");
      ///  alert(str_array[i]+"\n i="+i);
        if(i==0)//name
        {
           this.sname=str_array[i].toString();
         }
        else if(i==1)//rate
        {
 this.srate=str_array[i].toString();
        }
        else if(i==2)//qty
        {
    this.sqty=str_array[i].toString();
 
        }
        else if(i==3)//gst
        {
 this.sgst=str_array[i].toString();
        }
        else if(i==4)//desc
        {
 this.sdesc=str_array[i].toString();
        }
      }
}


  buildForm() {
    this.productCreateForm = this.fb.group({
      name: ['', Validators.required],
      rate: ['', Validators.required],
      quantity: ['', Validators.required],
      hsn_code : ['', Validators.required],
      description: [''],
      status: [true],
      vat: [''],
      tb:['value on build'],
      test:['hh']
    });
  }

  submitCreateProductForm() {
    this.showError = false;
    this.showSuccess = false;
    // console.log(this.productCreateForm.value);
    let data = {
      id: this.id,
      name: this.productCreateForm.value.name,
      rate: this.productCreateForm.value.rate,
      quantity: this.productCreateForm.value.quantity,
      hsn_code : this.productCreateForm.value.hsn_code,
      description: this.productCreateForm.value.description,
      status: true,
      vat: this.productCreateForm.value.vat
    }

    if (!this.editMode) {
      this.productService.createProduct(data)
        .subscribe(
        (res) => {
          if (res.status) {
            this.getAllProduct();
            this.showSuccess = true;
            this.productCreateForm.reset();
          } else {
            this.showError = true;
          }
        },
        (err) => {
          console.log("ERROR from createProduct");
          this.showError = true;
        }
        )
    } else {
      this.productService.updateProduct(data)
        .subscribe(
        (res) => {
          // console.log(res);
          this.getAllProduct();
          this.productCreateForm.reset();
          this.editMode = false;
        },
        (err) => {

        }
        )
    }
  }
  

  getAllProduct() {
    this.productService.getAllProduct()
      .subscribe(
      (res) => {
        this.products = res;
      },
      (err) => {
        console.log("Error in getAllProduct");
      }
      )
  }

  statusChanged(event: any) {
    this.getAllProduct();
  }

  showEditForm(event) {
    this.editMode = true;
    this.createMode = false;
    this.id = event;
    this.productService.getProductById(event)
      .subscribe(
      (res) => {
        this.productCreateForm.patchValue({
          name: res.name,
          rate: res.rate,
          quantity: res.quantity,
          hsn_code : res.hsn_code,
          description: res.description,
          status: res.status,
          vat: res.vat
        });
      },
      (err) => {

      }
      )
  }


  cancelEdit() {
    this.editMode = false;
    this.createMode = false;
    this.productCreateForm.reset();
    this.getAllProduct();
  }

 

  createModeOn(){
    this.editMode = false;
    this.createMode = true;
    this.productCreateForm.reset();
  }
}