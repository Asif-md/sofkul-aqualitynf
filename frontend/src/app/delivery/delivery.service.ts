import {Injectable} from '@angular/core';
import {CustomHttpService} from "../custom-http.service";
import {environment} from "../../environments/environment";
import 'rxjs/add/operator/map';

@Injectable()
export class DeliveryService {

  private deliveryUrl = environment.api_server + 'delivery/';

  constructor(private http: CustomHttpService) {
  }

  removeDelivery(delivery) {
    let url = this.deliveryUrl + 'remove-delivery';
    return this.http.post(url, delivery).map((res) => res.json());
  }

  getDeliveryByCustomerId(id) {
    let url = this.deliveryUrl + 'by-customer-id/' + id;
    return this.http.get(url).map((res) => res.json());
  }

  globalDeliverySearchByCustomer(query) {
    let url = this.deliveryUrl + 'global-search-by-customer/' + query;
    return this.http.get(url).map((res) => res.json());
  }

  saveAutoDelivery(data) {
    let url = this.deliveryUrl + 'save-auto-delivery';
    return this.http.post(url, data).map((res) => res.json());
  }

  getAllDelivery(paginator) {
    let url = this.deliveryUrl + 'all/page=' + paginator;
    return this.http.get(url).map((res) => res.json());
  }

  getRecentDelivery() {
    let url = this.deliveryUrl + 'recent';
    return this.http.get(url).map((res) => res.json());
  }

  storeDelivery(data: any) {
    let url = this.deliveryUrl + 'create';
    return this.http.post(url, data).map((res) => res.json());
  }

  downloadPDF(data: any) {
    let url = this.deliveryUrl + 'generate/pdf';
    return this.http.post(url, data).map((res) => res.json());
  }

  getDeliveryById(type: string, id: string) {
    let url = this.deliveryUrl + type + '/id/' + id;
    return this.http.get(url).map((res) => res.json());
  }

  searchByUsername(data: any) {
    let url = this.deliveryUrl + 'search/username/';
    return this.http.post(url, data).map((res) => res.json());
  }

  saveRecentDelivery(data: any) {
    let url = this.deliveryUrl + 'recent/save';
    return this.http.post(url, data).map((res) => res.json());
  }

  dropRecentDelivery() {
    let url = this.deliveryUrl + 'drop/recent/all';
    return this.http.get(url).map(res => res.json());
  }

  checkIfRecentDeliveryExists() {
    let url = this.deliveryUrl + 'recent_delivery/exists';
    return this.http.get(url).map(res => res.json());
  }

  getRecentDeliveryDB(paginator: number) {
    let url = this.deliveryUrl + 'recent_delivery_db/paginator=' + paginator;
    return this.http.get(url).map(res => res.json());
  }

  cleanDelivery() {
    let url = this.deliveryUrl + 'clean_delivery';
    return this.http.get(url).map(res => res.json());
  }

  changeDeliveryStatus(data: any) {
    let url = this.deliveryUrl + 'change_status';
    return this.http.put(url, data).map((res) => res.json());
  }

  //get total of all products in product list
  getTotal(data: any) {
    let url = this.deliveryUrl + 'product_list/total';
    return this.http.post(url, data).map((res) => res.json());
  }

  buildAndSaveRecentDelivery() {
    let url = this.deliveryUrl + 'recent/build_and_save';
    return this.http.get(url).map((res) => res.json());
  }

  savePartialPay(data: any) {
    let url = this.deliveryUrl + 'recent/partial_pay/save';
    return this.http.post(url, data).map((res) => res.json());
  }

  preGenerateDeliveryUpdate(data: any) {
    let url = this.deliveryUrl + 'pre_generate_update';
    return this.http.post(url, data).map((res) => res.json());
  }

  deleteDelivery(delivery) {
    let url = this.deliveryUrl + 'delete';
    return this.http.post(url, delivery).map((res) => res.json());
  }

  setPaidDateCounter(delivery) {
    let url = this.deliveryUrl + 'set_paid_date_counter';
    return this.http.post(url, delivery).map((res) => res.json());
  }

  getPaidDateCounter() {
    let url = this.deliveryUrl + 'get_paid_date_counter';
    return this.http.get(url).map((res) => res.json());
  }

  getAllDeliveryCount() {
    let url = this.deliveryUrl + 'all_delivery_count';
    return this.http.get(url).map((res) => res.json());
  }

  createNewDelivery(data: any) {
    let url = this.deliveryUrl + 'create/new';
    return this.http.post(url, data).map((res) => res.json());
  }
}
