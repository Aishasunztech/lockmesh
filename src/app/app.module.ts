import { BrowserModule } from '@angular/platform-browser';
import { FilterPipe } from './filter.pipe';
import { StorageServiceModule} from 'angular-webstorage-service';
import { NgModule } from '@angular/core';
import { NgDatepickerModule } from 'ng2-datepicker';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Ng2OrderModule } from 'ng2-order-pipe'; // importing the module for sorting
import {NgxPaginationModule} from 'ngx-pagination'; // import the module for pagination
import {LocationStrategy, HashLocationStrategy} from '@angular/common';
import { AppComponent } from './app.component';

import { DevicesComponent } from './components/devices/devices.component';
import { SettingsComponent } from './components/settings/settings.component';
import { AddDeviceComponent } from './components/add-device/add-device.component';
import { DealerComponent } from './components/dealer/dealer.component';
import { CreateDealerSdealerComponent } from './components/create-dealer/create-dealer-sdealer.component';
import { CreateSdealerComponent } from './components/create-sdealer/create-sdealer.component';
// import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ClientComponent } from './components/client/client.component';
import {Common} from './entity/common';
import {RestService} from './services/rest.service';
import {HelperService} from './services/helper.service';

import { ConnectAdminDevicesComponent } from './components/connect-devices/connect-devices.component';
import { SdealerComponent } from './components/sdealer/sdealer.component';
import { CreateClientComponent } from './components/create-client/create-client.component';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown/angular2-multiselect-dropdown';
// import { SdealerDevicesComponent } from './sdealer/sdealer-devices/sdealer-devices.component';
// import { SdealerAddDevicesComponent } from './sdealer/sdealer-add-devices/sdealer-add-devices.component';
// import { SdealerClientComponent } from './sdealer/sdealer-client/sdealer-client.component';
// import { DealerCreateSdealerComponent } from './dealer/dealer-create-sdealer/dealer-create-sdealer.component';

import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';
import {DataTableModule} from 'angular-6-datatable';
// import { ProfileComponent } from './dealer/profile/profile.component';
// import { SdealerprofileComponent } from './sdealer/sdealerprofile/sdealerprofile.component';
// import { SConnectDevicesComponent } from './sdealer/s-connect-devices/s-connect-devices.component';
import { UploadApkComponent } from './components/upload-apk/upload-apk.component';
import { ViewApkComponent } from './components/view-apk/view-apk.component';
import { UiSwitchModule } from 'ngx-toggle-switch';
import { InvalidPage } from './views/error/invalid_page.component';
import { ProfileListComponent } from './components/profile-list/profile-list.component';
import { AppRoutingModule } from './app.routing';
import { P404Component } from './views/error/404.component';
import { P500Component } from './views/error/500.component';
// // import { FilterProfilePipe } from "./shared/filter-profile.pipe";
// import { HomeModule } from './component/home.module';
import { LoginComponent } from './login';

import { HomeModule } from './components/home.module';

@NgModule({
  declarations: [
    AppComponent,
    FilterPipe,
    LoginComponent,
    P404Component,
    P500Component,
    InvalidPage
  ],
  imports: [
    BrowserModule,
    AngularMultiSelectModule,
    HttpClientModule,
    FormsModule,
    Ng2OrderModule,
    NgxPaginationModule,
    StorageServiceModule,
    NgDatepickerModule,
    DataTableModule,
    UiSwitchModule,
    Ng4LoadingSpinnerModule.forRoot(),
    AppRoutingModule,
    HomeModule
  ],

  providers: [
    Common,
    RestService,
    HelperService,
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
