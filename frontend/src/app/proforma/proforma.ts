import {Product} from '../product/product';
import {Customer} from '../customer/customer';

export class Proforma {
  id?: string;
  customerData?: Customer;
  
  customer_id?: string;
  productList?: any[] = [];
  productData?: Product[] = [];
  payment_due_date?: any;
  paid_date?: any; 
  amount_due?: number;
  status?: string;    //Due / Paid / Partially Paid
  total?: number;
  discount?: number;
  proforma_created_date?: any;
  amount_partially_paid?: any[] = [];
  type?: string = '';
  qty? : number;
  productList2?: any[] = [];
  vdate? : any;
  taxPercent? : number;
  tax? : number;
  tnc? : string;
  subTotal? : number;
  grantTotal? : number;
  name?: string;
  cost? : number;
  disc? : number;
}
