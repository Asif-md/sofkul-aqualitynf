import {Product} from '../product/product';
import {Customer} from '../customer/customer';

export class Invoice {
  id?: string;
  customerData?: Customer;
  customer_id?: string;
  qty? : number;
  quantity : number;
  invoice_number? : string;
  po_number? : string;
  productList?: any[] = [];
  productList2?: any[] = [];
  productData?: Product[] = [];
  payment_due_date?: any;
  paid_date?: any;
  amount_due?: number;
  status?: string;    //Due / Paid / Partially Paid
  total?: number;
  discount?: number;
  invoice_created_date?: any;
  vdate? : any;
  amount_partially_paid?: any[] = [];
  type?: string = '';
  taxPercent? : number;
  tax? : number;
  tnc? : string;
  subTotal? : number;
  grantTotal? : number;
  name?: string;
  cost? : number;
  disc? : number;
  
  
  /*taxPercent? : number;
  cost? : number;
  subTotal? : number;
  grantTotal? : number;
  qty? : number;
  name? : number; */
  

/*stt = '';
  name = '';
  unit = '';
  qty = '';
  cost = '';
  total = 0;*/ 
}
