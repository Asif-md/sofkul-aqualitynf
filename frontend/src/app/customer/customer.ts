import {Product} from '../product/product';
import {Area} from '../area/area';
import {Invoice} from '../invoice/invoice';

export class Customer {
  id?: string;
  username?: string;
  gstno? : string;
  nid?: string;
  email?: string;
  fullname?: string;
  customer_currency?: string;
  mobile_primary?: string;
  mobile_secondary?: string;
  website?: string;
  country?: string;
  location?: string;
  ship_addr? : string;
  area?: string;
  city?: string;
  state?: string;
  invoice_number?: string;
  description?: String;
  postal_code?: string;
  status?: boolean;
  productList?: any[] = [];
  invoiceList?: any[] = [];
  areaData?: Area;
  productData?: Product[] = [];
  invoiceData?: Invoice[] = [];
  isGenerateInvoiceMonthly?: boolean = false;
}
