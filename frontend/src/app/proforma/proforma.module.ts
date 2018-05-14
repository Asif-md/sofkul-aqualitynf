import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";

import {Ng2PaginationModule} from 'ng2-pagination';
import {DialogModule} from 'primeng/primeng';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ProformaRoutingModule} from './proforma-routing.module';
import {ProformaAllComponent} from './proforma-all/proforma-all.component';
import {ProformaCreateComponent} from './proforma-create/proforma-create.component';
import {ProformaService} from './proforma.service';
import {ProformaRecentComponent} from './proforma-recent/proforma-recent.component';
import {ProductService} from '../product/product.service';
import {AreaService} from '../area/area.service';
import {ProformaEditComponent} from './proforma-edit/proforma-edit.component';
import {ProformaHtmlComponent} from './proforma-html/proforma-html.component';
import {CustomerService} from '../customer/customer.service';
import {GeneralService} from '../general/general.service';
import { ProformaSearchComponent } from './proforma-search/proforma-search.component';

@NgModule({
  imports: [
    CommonModule,
    Ng2PaginationModule,
    DialogModule,
    FormsModule,
    ReactiveFormsModule,
    ProformaRoutingModule,
  ],
  declarations: [
    ProformaAllComponent,
    ProformaCreateComponent,
    ProformaRecentComponent,
    ProformaEditComponent,
    ProformaHtmlComponent,
    ProformaSearchComponent
  ],
  exports: [
    ProformaHtmlComponent
  ],
  providers: [
    ProformaService,
    ProductService,
    AreaService,
    CustomerService,
    GeneralService
  ]
})
export class ProformaModule {
}

