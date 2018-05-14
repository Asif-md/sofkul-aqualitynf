import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";

import {Ng2PaginationModule} from 'ng2-pagination';
import {DialogModule} from 'primeng/primeng';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {QuotationRoutingModule} from './quotation-routing.module';
import {QuotationAllComponent} from './quotation-all/quotation-all.component';
import {QuotationCreateComponent} from './quotation-create/quotation-create.component';
import {QuotationService} from './quotation.service';
import {QuotationRecentComponent} from './quotation-recent/quotation-recent.component';
import {ProductService} from '../product/product.service';
import {AreaService} from '../area/area.service';
import {QuotationEditComponent} from './quotation-edit/quotation-edit.component';
import {QuotationHtmlComponent} from './quotation-html/quotation-html.component';
import {CustomerService} from '../customer/customer.service';
import {GeneralService} from '../general/general.service';
import { QuotationSearchComponent } from './quotation-search/quotation-search.component';

@NgModule({
  imports: [
    CommonModule,
    Ng2PaginationModule,
    DialogModule,
    FormsModule,
    ReactiveFormsModule,
    QuotationRoutingModule,
  ],
  declarations: [
    QuotationAllComponent,
    QuotationCreateComponent,
    QuotationRecentComponent,
    QuotationEditComponent,
    QuotationHtmlComponent,
    QuotationSearchComponent
  ],
  exports: [
    QuotationHtmlComponent
  ],
  providers: [
    QuotationService,
    ProductService,
    AreaService,
    CustomerService,
    GeneralService
  ]
})
export class QuotationModule {
}

