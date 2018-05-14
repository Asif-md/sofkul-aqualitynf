import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {GeneralRoutingModule} from "./general-routing.module";
import { FormsModule, ReactiveFormsModule, NgModel } from '@angular/forms';

//own components
//import { LoginComponent } from '../login/login.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {NavbarComponent} from './navbar/navbar.component';
import {SidebarComponent} from './sidebar/sidebar.component';
import {FooterComponent} from './footer/footer.component';


// modules
import {HomeModule} from '../home/home.module';
import {FileUploadModule} from '../file-upload/file-upload.module';
import {CustomerModule} from '../customer/customer.module';
import {ProductModule} from '../product/product.module';
import {AreaModule} from '../area/area.module';
import {InvoiceModule} from '../invoice/invoice.module';
import {QuotationModule} from '../quotation/quotation.module';
import {ProformaModule} from '../proforma/proforma.module';
import {DeliveryModule} from '../delivery/delivery.module';
import {SettingsModule} from '../settings/settings.module';
import {ReportModule} from '../report/report.module';
import {GeneralService} from './general.service';

@NgModule({
  imports: [
    CommonModule,
    HomeModule,
    GeneralRoutingModule,
    FileUploadModule,
    CustomerModule,
    ProductModule,
    AreaModule,
    InvoiceModule,
    QuotationModule,
    ProformaModule,
    DeliveryModule,
    SettingsModule,
    ReportModule,
    FormsModule, 
    ReactiveFormsModule
    
  ],
  declarations: [
    DashboardComponent,
    NavbarComponent,
    SidebarComponent,
    FooterComponent,
   
  ],
  exports: [
    DashboardComponent
  ],
  providers: [GeneralService]
})
export class GeneralModule {
}
