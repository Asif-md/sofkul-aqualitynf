import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule , ReactiveFormsModule, NgModel} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {AppComponent} from './app.component';
import {GeneralModule} from "./general/general.module";
import {AppRoutingModule} from './app-routing.module';
import { NgxQRCodeModule } from 'ngx-qrcode2';
import { RouterModule, Routes} from '@angular/router';
import { Injectable } from '@angular/core';


//import {DashboardComponent} from './general/dashboard/dashboard.component';
/*import {NavbarComponent} from './general/navbar/navbar.component';
import {SidebarComponent} from './general/sidebar/sidebar.component';
import {FooterComponent} from './gafooter/footer.component';*/
// services
import {AuthService} from './services/auth.service';
import {ValidateService} from './services/validate.service';
import {AuthGuard} from './guards/auth.guard';
import {CustomHttpService} from "./custom-http.service";
import {AutoCompleteModule, PickListModule, ConfirmDialogModule, SharedModule} from 'primeng/primeng';
import {UploadService} from './upload.service';
import { QRCodeModule } from 'angularx-qrcode';
import { LoginComponent } from './login/login.component';
import {FlashMessagesModule} from 'angular2-flash-messages';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent
    //DashboardComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    //routing module
    AppRoutingModule,
    //user defines modules
    GeneralModule,
    RouterModule,
    NgxQRCodeModule,
    QRCodeModule,
    ReactiveFormsModule, 
    AutoCompleteModule, PickListModule, ConfirmDialogModule, SharedModule,
    NgbModule.forRoot(),
    FlashMessagesModule.forRoot()
  ],
  providers: [
    AuthService,
    CustomHttpService,
    UploadService,
    ValidateService,
    AuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
