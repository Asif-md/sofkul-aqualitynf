import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";

import {Ng2PaginationModule} from 'ng2-pagination';
import {DialogModule} from 'primeng/primeng';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {DeliveryRoutingModule} from './delivery-routing.module';
import {DeliveryAllComponent} from './delivery-all/delivery-all.component';
import {DeliveryCreateComponent} from './delivery-create/delivery-create.component';
import {DeliveryService} from './delivery.service';
import {DeliveryRecentComponent} from './delivery-recent/delivery-recent.component';
import {ProductService} from '../product/product.service';
import {AreaService} from '../area/area.service';
import {DeliveryEditComponent} from './delivery-edit/delivery-edit.component';
import {DeliveryHtmlComponent} from './delivery-html/delivery-html.component';
import {CustomerService} from '../customer/customer.service';
import {GeneralService} from '../general/general.service';
import { DeliverySearchComponent } from './delivery-search/delivery-search.component';

@NgModule({
  imports: [
    CommonModule,
    Ng2PaginationModule,
    DialogModule,
    FormsModule,
    ReactiveFormsModule,
    DeliveryRoutingModule,
  ],
  declarations: [
    DeliveryAllComponent,
    DeliveryCreateComponent,
    DeliveryRecentComponent,
    DeliveryEditComponent,
    DeliveryHtmlComponent,
    DeliverySearchComponent
  ],
  exports: [
    DeliveryHtmlComponent
  ],
  providers: [
    DeliveryService,
    ProductService,
    AreaService,
    CustomerService,
    GeneralService
  ]
})
export class DeliveryModule {
}

