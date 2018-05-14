import {NgModule} from "@angular/core";
import {RouterModule} from "@angular/router";
// components
import {HomeBodyComponent} from '../home/home-body/home-body.component';
import {ExcelFileUploaderComponent} from '../file-upload/excel-file-uploader/excel-file-uploader.component';
import {CustomerAllComponent} from '../customer/customer-all/customer-all.component';
import {CustomerDetailComponent} from '../customer/customer-detail/customer-detail.component';
import {ProductCreateComponent} from '../product/product-create/product-create.component';
import {CustomerCreateComponent} from '../customer/customer-create/customer-create.component';
import {AreaCreateComponent} from '../area/area-create/area-create.component';
//Quotation
import {QuotationAllComponent} from '../quotation/quotation-all/quotation-all.component';
import {QuotationRecentComponent} from '../quotation/quotation-recent/quotation-recent.component';
import {QuotationEditComponent} from '../quotation/quotation-edit/quotation-edit.component';
import {QuotationHtmlComponent} from '../quotation/quotation-html/quotation-html.component';
import {QuotationCreateComponent} from '../quotation/quotation-create/quotation-create.component';
import {QuotationSearchComponent} from '../quotation/quotation-search/quotation-search.component';
// Invoice
import {InvoiceAllComponent} from '../invoice/invoice-all/invoice-all.component';
import {InvoiceRecentComponent} from '../invoice/invoice-recent/invoice-recent.component';
import {InvoiceEditComponent} from '../invoice/invoice-edit/invoice-edit.component';
import {InvoiceHtmlComponent} from '../invoice/invoice-html/invoice-html.component';
import {LocationDueReportComponent} from '../report/location-due-report/location-due-report.component';
import {InvoiceCreateComponent} from '../invoice/invoice-create/invoice-create.component';
import {InvoiceSearchComponent} from '../invoice/invoice-search/invoice-search.component';
//Proforma
import {ProformaAllComponent} from '../proforma/proforma-all/proforma-all.component';
import {ProformaRecentComponent} from '../proforma/proforma-recent/proforma-recent.component';
import {ProformaEditComponent} from '../proforma/proforma-edit/proforma-edit.component';
import {ProformaHtmlComponent} from '../proforma/proforma-html/proforma-html.component';
import {ProformaCreateComponent} from '../proforma/proforma-create/proforma-create.component';
import {ProformaSearchComponent} from '../proforma/proforma-search/proforma-search.component';
//Delivery
import {DeliveryAllComponent} from '../delivery/delivery-all/delivery-all.component';
import {DeliveryRecentComponent} from '../delivery/delivery-recent/delivery-recent.component';
import {DeliveryEditComponent} from '../delivery/delivery-edit/delivery-edit.component';
import {DeliveryHtmlComponent} from '../delivery/delivery-html/delivery-html.component';
import {DeliveryCreateComponent} from '../delivery/delivery-create/delivery-create.component';
import {DeliverySearchComponent} from '../delivery/delivery-search/delivery-search.component';



const generalRoutes = [
  {
    path: '',
    redirectTo:'home',
    pathMatch:'full'
  },
  {
    path: 'home',
    component: HomeBodyComponent
  },
  {
    path: 'upload-file',
    component: ExcelFileUploaderComponent
  },
  {
    path: 'customer/all',
    component: CustomerAllComponent
  },
  {
    path: 'customer/detail/:id',
    component: CustomerDetailComponent
  },
  {
    path: 'customer/create',
    component: CustomerCreateComponent
  },
  {
    path: 'product',
    component: ProductCreateComponent
  },
  {
    path: 'area',
    component: AreaCreateComponent
  },
  {
    path: 'invoice/all',
    component: InvoiceAllComponent
  },
  {
    path: 'invoice/search',
    component: InvoiceSearchComponent
  },
  {
    path: 'invoice/create',
    component: InvoiceCreateComponent
  },
  {
    path: 'invoice/recent',
    component: InvoiceRecentComponent
  },
  {
    path: 'invoice/display/:type/:id',
    component: InvoiceHtmlComponent
  },
  {
    path: 'invoice/view/:type/:id',
    component: InvoiceEditComponent
  },
  {
    path: 'quotation/all',
    component: QuotationAllComponent
  },
  {
    path: 'quotation/search',
    component: QuotationSearchComponent
  },
  {
    path: 'quotation/create',
    component: QuotationCreateComponent
  },
  {
    path: 'quotation/recent',
    component: QuotationRecentComponent
  },
  {
    path: 'quotation/display/:type/:id',
    component: QuotationHtmlComponent
  },
  {
    path: 'quotation/view/:type/:id',
    component: QuotationEditComponent
  },
  
  {
    path: 'proforma/all',
    component: ProformaAllComponent
  },
  {
    path: 'proforma/search',
    component: ProformaSearchComponent
  },
  {
    path: 'proforma/create',
    component: ProformaCreateComponent
  },
  {
    path: 'proforma/recent',
    component: ProformaRecentComponent
  },
  {
    path: 'proforma/display/:type/:id',
    component: ProformaHtmlComponent
  },
  {
    path: 'proforma/view/:type/:id',
    component: ProformaEditComponent
  },
  {
    path: 'delivery/all',
    component: DeliveryAllComponent
  },
  {
    path: 'delivery/search',
    component: DeliverySearchComponent
  },
  {
    path: 'delivery/create',
    component: DeliveryCreateComponent
  },
  {
    path: 'delivery/recent',
    component: DeliveryRecentComponent
  },
  {
    path: 'delivery/display/:type/:id',
    component: DeliveryHtmlComponent
  },
  {
    path: 'delivery/view/:type/:id',
    component: DeliveryEditComponent
  },
  {
    path: 'report',
    component: LocationDueReportComponent
  }
  
];
@NgModule({
  imports: [
    RouterModule.forChild(generalRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class GeneralRoutingModule {
}
