import {Injectable} from '@angular/core';
import {CustomHttpService} from "../custom-http.service";
import {environment} from "../../environments/environment";
import 'rxjs/add/operator/map';

@Injectable()
export class QuotationService {

  private quotationUrl = environment.api_server + 'quotation/';

  constructor(private http: CustomHttpService) {
  }

  removeQuotation(quotation) {
    let url = this.quotationUrl + 'remove-quotation';
    return this.http.post(url, quotation).map((res) => res.json());
  }

  getQuotationByCustomerId(id) {
    let url = this.quotationUrl + 'by-customer-id/' + id;
    return this.http.get(url).map((res) => res.json());
  }

  globalQuotationSearchByCustomer(query) {
    let url = this.quotationUrl + 'global-search-by-customer/' + query;
    return this.http.get(url).map((res) => res.json());
  }

  saveAutoQuotation(data) {
    let url = this.quotationUrl + 'save-auto-quotation';
    return this.http.post(url, data).map((res) => res.json());
  }

  getAllQuotation(paginator) {
    let url = this.quotationUrl + 'all/page=' + paginator;
    return this.http.get(url).map((res) => res.json());
  }

  getRecentQuotation() {
    let url = this.quotationUrl + 'recent';
    return this.http.get(url).map((res) => res.json());
  }

  storeQuotation(data: any) {
    let url = this.quotationUrl + 'create';
    return this.http.post(url, data).map((res) => res.json());
  }

  downloadPDF(data: any) {
    let url = this.quotationUrl + 'generate/pdf';
    return this.http.post(url, data).map((res) => res.json());
  }

  getQuotationById(type: string, id: string) {
    let url = this.quotationUrl + type + '/id/' + id;
    return this.http.get(url).map((res) => res.json());
  }

  searchByUsername(data: any) {
    let url = this.quotationUrl + 'search/username/';
    return this.http.post(url, data).map((res) => res.json());
  }

  saveRecentQuotation(data: any) {
    let url = this.quotationUrl + 'recent/save';
    return this.http.post(url, data).map((res) => res.json());
  }

  dropRecentQuotation() {
    let url = this.quotationUrl + 'drop/recent/all';
    return this.http.get(url).map(res => res.json());
  }

  checkIfRecentQuotationExists() {
    let url = this.quotationUrl + 'recent_quotation/exists';
    return this.http.get(url).map(res => res.json());
  }

  getRecentQuotationDB(paginator: number) {
    let url = this.quotationUrl + 'recent_quotation_db/paginator=' + paginator;
    return this.http.get(url).map(res => res.json());
  }

  cleanQuotation() {
    let url = this.quotationUrl + 'clean_quotation';
    return this.http.get(url).map(res => res.json());
  }

  changeQuotationStatus(data: any) {
    let url = this.quotationUrl + 'change_status';
    return this.http.put(url, data).map((res) => res.json());
  }

  //get total of all products in product list
  getTotal(data: any) {
    let url = this.quotationUrl + 'product_list/total';
    return this.http.post(url, data).map((res) => res.json());
  }

  buildAndSaveRecentQuotation() {
    let url = this.quotationUrl + 'recent/build_and_save';
    return this.http.get(url).map((res) => res.json());
  }

 /* savePartialPay(data: any) {
    let url = this.quotationUrl + 'recent/partial_pay/save';
    return this.http.post(url, data).map((res) => res.json());
  }*/

  preGenerateQuotationUpdate(data: any) {
    let url = this.quotationUrl + 'pre_generate_update';
    return this.http.post(url, data).map((res) => res.json());
  }

  deleteQuotation(quotation) {
    let url = this.quotationUrl + 'delete';
    return this.http.post(url, quotation).map((res) => res.json());
  }

  setPaidDateCounter(quotation) {
    let url = this.quotationUrl + 'set_paid_date_counter';
    return this.http.post(url, quotation).map((res) => res.json());
  }

  getPaidDateCounter() {
    let url = this.quotationUrl + 'get_paid_date_counter';
    return this.http.get(url).map((res) => res.json());
  }

  getAllQuotationCount() {
    let url = this.quotationUrl + 'all_quotation_count';
    return this.http.get(url).map((res) => res.json());
  }

  createNewQuotation(data: any) {
    let url = this.quotationUrl + 'create/new';
    return this.http.post(url, data).map((res) => res.json());
  }
}
