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
import { HeaderComponent } from './components/header/header.component';
import { DevicesComponent } from './components/devices/devices.component';
import { SettingsComponent } from './components/settings/settings.component';
import { AddDeviceComponent } from './components/add-device/add-device.component';
import { DealerComponent } from './components/dealer/dealer.component';
import { CreateDealerSdealerComponent } from './components/create-dealer/create-dealer-sdealer.component';
import { CreateSdealerComponent } from './components/create-sdealer/create-sdealer.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ClientComponent } from './components/client/client.component';
import {Common} from './entity/common';
import {RestService} from './rest.service';
import { DealerDevicesComponent } from './dealer/dealer-devices/dealer-devices.component';
import { DealerSDealerComponent } from './dealer/dealer-s-dealer/dealer-s-dealer.component';
import { DealerClientComponent } from './dealer/dealer-client/dealer-client.component';
import { DealerHeaderComponent } from './dealer/dealer-header/dealer-header.component';
import { DealerAddDevicesComponent } from './dealer/dealer-add-devices/dealer-add-devices.component';
import { DealerLoginComponent } from './dealer/dealer-login/dealer-login.component';
import { ConnectDevicesComponent } from './dealer/connect-devices/connect-devices.component';
import { ConnectAdminDevicesComponent } from './components/connect-devices/connect-devices.component';
import { SdealerLoginComponent } from './sdealer/sdealer-login/sdealer-login.component';
import { SdealerComponent } from './components/sdealer/sdealer.component';
import { CreateClientComponent } from './components/create-client/create-client.component';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown/angular2-multiselect-dropdown';
import { SdealerDevicesComponent } from './sdealer/sdealer-devices/sdealer-devices.component';
import { SdealerAddDevicesComponent } from './sdealer/sdealer-add-devices/sdealer-add-devices.component';
import { SdealerClientComponent } from './sdealer/sdealer-client/sdealer-client.component';
import { SdealerHeaderComponent } from './sdealer/sdealer-header/sdealer-header.component';
import { DealerCreateSdealerComponent } from './dealer/dealer-create-sdealer/dealer-create-sdealer.component';
import { BlankComponent } from './blank/blank.component';
import { NewComponent } from './new/new.component';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';
import {DataTableModule} from 'angular-6-datatable';
import { ProfileComponent } from './dealer/profile/profile.component';
import { SdealerprofileComponent } from './sdealer/sdealerprofile/sdealerprofile.component';
import { SConnectDevicesComponent } from './sdealer/s-connect-devices/s-connect-devices.component';
import { UploadApkComponent } from './components/upload-apk/upload-apk.component';
import { ViewApkComponent } from './components/view-apk/view-apk.component';
import { UiSwitchModule } from 'ngx-toggle-switch';
//import { LayoutHeaderComponent } from './layouts/layout-header/layout-header.component';
@NgModule({
  declarations: [
    AppComponent,
    FilterPipe,
    HeaderComponent,
    DevicesComponent,
    SettingsComponent,
    AddDeviceComponent,
    DealerComponent,
    CreateDealerSdealerComponent,
    LoginComponent,
    RegisterComponent,
    ClientComponent,
    CreateSdealerComponent,
    DealerDevicesComponent,
    DealerSDealerComponent,
    DealerClientComponent,
    DealerHeaderComponent,
    DealerAddDevicesComponent,
    DealerLoginComponent,
    ConnectDevicesComponent,
    SdealerLoginComponent,
    SdealerComponent,
    CreateClientComponent,
    ConnectAdminDevicesComponent,
    SdealerDevicesComponent,
    SdealerAddDevicesComponent,
    SdealerClientComponent,
    SdealerHeaderComponent,
    DealerCreateSdealerComponent,
    BlankComponent,
    NewComponent,
    ProfileComponent,
    SdealerprofileComponent,
    SConnectDevicesComponent,
    UploadApkComponent,
    ViewApkComponent,
  //  LayoutHeaderComponent,
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
    RouterModule.forRoot([
      {
        path: '',
        component: LoginComponent
      },
      {
        path: 'header',
        component: HeaderComponent
      },
      {
        path: 'devices',
        component: DevicesComponent
      },
      {
        path: 'black-list-devices',
        component: BlankComponent,
      },
      {
        path: 'add-device',
        component: AddDeviceComponent
      },
      {
        path: 'dealer',
        component: DealerComponent
      },
      {
        path: 'sdealer',
        component: SdealerComponent
      },
      {
        path: 'client',
        component: ClientComponent
      },
      {
        path: 'login',
        component: LoginComponent
      },
      {
        path: 'register',
        component: RegisterComponent
      },
      {
        path: 'create-dealer-sdealer',
        component: CreateDealerSdealerComponent
      },
      {
        path: 'create-sdealer',
        component: CreateSdealerComponent
      },
      {
        path: 'dealer/create-sdealer',
        component: DealerCreateSdealerComponent
      },
      {
        path: 'profile',
        component: ProfileComponent
      },
      {
        path: 'create-cilent',
        component: CreateClientComponent
      },
      {
        path: 'upload-apk',
        component: UploadApkComponent
      },
      {
        path: 'view-apk',
        component: ViewApkComponent
      },
      {
        path: 'connect-devices/:device_id',
        component: ConnectAdminDevicesComponent
      },
      {
        path: 'settings',
        component: SettingsComponent
      },
      {
        path: 'dealer/header',
        component: DealerHeaderComponent
      },
      {
        path: 'dealer/devices',
        component: DealerDevicesComponent
      },
      {
        path: 'sdealer/devices',
        component: SdealerDevicesComponent
      },
      {
        path: 'sdealer/sdealerprofile',
        component: SdealerprofileComponent
      },
      {
        path: 'dealer/client',
        component: DealerClientComponent
      },
      {
        path: 'dealer/login',
        component: DealerLoginComponent
      },
      {
        path: 'sdealer/login',
        component: SdealerLoginComponent
      },
      {
        path: 'dealer/s-dealer',
        component: DealerSDealerComponent
      },
      {
        path: 'dealer/add-devices',
        component: DealerAddDevicesComponent
      },
      {
        path: 'dealer/connect-devices/:device_id',
        component: ConnectDevicesComponent
      },
      {
        path: 'sdealer/connect-devices/:device_id',
        component: SConnectDevicesComponent
      },
    ],
    { enableTracing: true, useHash: false })
    ],

  providers: [Common,
              RestService,
              {provide: LocationStrategy, useClass: HashLocationStrategy}
            ],
  bootstrap: [AppComponent]
})
export class AppModule { }
