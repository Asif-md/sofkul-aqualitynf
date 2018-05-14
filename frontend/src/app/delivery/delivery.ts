import {Product} from '../product/product';
import {Customer} from '../customer/customer';
import {Invoice} from '../invoice/invoice';

export class Delivery {
  id?: string;
  customerData?: Customer;
  qty ? : number;
  invoiceData?: Invoice;
  customer_id?: string;
  productList?: any[] = [];
  productList2?: any[] = [];
  productData?: Product[] = [];
  payment_due_date?: any;
  paid_date?: any;
  amount_due?: number;
  billto?: string;
  status?: string;    //Due / Paid / Partially Paid
  total?: number;
  discount?: number;
  Delivery_created_date?: any;
  amount_partially_paid?: any[] = [];
  type?: string = ''; 
  vdate? : any;
  taxPercent? : number;
  tax? : number;
  tnc? : string;
  subTotal? : number;
  grantTotal? : number;
  name?: string;
  cost? : number;
  transport ? : number;
   
}
