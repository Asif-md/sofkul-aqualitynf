import {Injectable} from '@angular/core';
import {CustomHttpService} from "../custom-http.service";
import {environment} from "../../environments/environment";
import 'rxjs/add/operator/map';

@Injectable()
export class ProformaService {

  private proformaUrl = environment.api_server + 'proforma/';

  constructor(private http: CustomHttpService) {
  }

  removeProforma(proforma) {
    let url = this.proformaUrl + 'remove-proforma';
    return this.http.post(url, proforma).map((res) => res.json());
  }

  getProformaByCustomerId(id) {
    let url = this.proformaUrl + 'by-customer-id/' + id;
    return this.http.get(url).map((res) => res.json());
  }

  globalProformaSearchByCustomer(query) {
    let url = this.proformaUrl + 'global-search-by-customer/' + query;
    return this.http.get(url).map((res) => res.json());
  }

  saveAutoProforma(data) {
    let url = this.proformaUrl + 'save-auto-proforma';
    return this.http.post(url, data).map((res) => res.json());
  }

  getAllProforma(paginator) {
    let url = this.proformaUrl + 'all/page=' + paginator;
    return this.http.get(url).map((res) => res.json());
  }

  getRecentProforma() {
    let url = this.proformaUrl + 'recent';
    return this.http.get(url).map((res) => res.json());
  }

  storeProforma(data: any) {
    let url = this.proformaUrl + 'create';
    return this.http.post(url, data).map((res) => res.json());
  }

  downloadPDF(data: any) {
    let url = this.proformaUrl + 'generate/pdf';
    return this.http.post(url, data).map((res) => res.json());
  }

  getProformaById(type: string, id: string) {
    let url = this.proformaUrl + type + '/id/' + id;
    return this.http.get(url).map((res) => res.json());
  }

  searchByUsername(data: any) {
    let url = this.proformaUrl + 'search/username/';
    return this.http.post(url, data).map((res) => res.json());
  }

  saveRecentProforma(data: any) {
    let url = this.proformaUrl + 'recent/save';
    return this.http.post(url, data).map((res) => res.json());
  }

  dropRecentProforma() {
    let url = this.proformaUrl + 'drop/recent/all';
    return this.http.get(url).map(res => res.json());
  }

  checkIfRecentProformaExists() {
    let url = this.proformaUrl + 'recent_proforma/exists';
    return this.http.get(url).map(res => res.json());
  }

  getRecentProformaDB(paginator: number) {
    let url = this.proformaUrl + 'recent_proforma_db/paginator=' + paginator;
    return this.http.get(url).map(res => res.json());
  }

  cleanProforma() {
    let url = this.proformaUrl + 'clean_proforma';
    return this.http.get(url).map(res => res.json());
  }

  changeProformaStatus(data: any) {
    let url = this.proformaUrl + 'change_status';
    return this.http.put(url, data).map((res) => res.json());
  }

  //get total of all products in product list
  getTotal(data: any) {
    let url = this.proformaUrl + 'product_list/total';
    return this.http.post(url, data).map((res) => res.json());
  }

  buildAndSaveRecentProforma() {
    let url = this.proformaUrl + 'recent/build_and_save';
    return this.http.get(url).map((res) => res.json());
  }

  savePartialPay(data: any) {
    let url = this.proformaUrl + 'recent/partial_pay/save';
    return this.http.post(url, data).map((res) => res.json());
  }

  preGenerateProformaUpdate(data: any) {
    let url = this.proformaUrl + 'pre_generate_update';
    return this.http.post(url, data).map((res) => res.json());
  }

  deleteProforma(proforma) {
    let url = this.proformaUrl + 'delete';
    return this.http.post(url, proforma).map((res) => res.json());
  }

  setPaidDateCounter(proforma) {
    let url = this.proformaUrl + 'set_paid_date_counter';
    return this.http.post(url, proforma).map((res) => res.json());
  }

  getPaidDateCounter() {
    let url = this.proformaUrl + 'get_paid_date_counter';
    return this.http.get(url).map((res) => res.json());
  }

  getAllProformaCount() {
    let url = this.proformaUrl + 'all_proforma_count';
    return this.http.get(url).map((res) => res.json());
  }

  createNewProforma(data: any) {
    let url = this.proformaUrl + 'create/new';
    return this.http.post(url, data).map((res) => res.json());
  }
}
