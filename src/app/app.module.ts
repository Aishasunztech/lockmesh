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
import {HelperService} from './helper.service';
import {GlobalSearchService} from './global-search.service';
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
import { InvalidPage } from './components/invalid_page/invalid_page.component';
import { ProfileListComponent } from './components/profile-list/profile-list.component';
// import { FilterProfilePipe } from "./shared/filter-profile.pipe";
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
    InvalidPage,
    ProfileListComponent
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
        component: LoginComponent,
        data :{
          componentName:"LoginComponent"
        }
      },
      {
        path: 'header',
        component: HeaderComponent,
        data :{
          componentName:"HeaderComponent"
        }
      },
      {
        path: 'devices',
        component: DevicesComponent,
        data :{
          componentName:"DevicesComponent"
        }
      },
      {
        path: 'black-list-devices',
        component: BlankComponent,
        data :{
          componentName : "BlankComponent"
        }
      },
      {
        path: 'add-device',
        component: AddDeviceComponent,
        data :{
          componentName:"AddDeviceComponent"
        }
      },
      {
        path: 'dealer',
        component: DealerComponent,
        data :{
          componentName:"DealerComponent"
        }
      },
      {
        path: 'sdealer',
        component: SdealerComponent,
        data :{
          componentName:"SdealerComponent"
        }
      },
      {
        path: 'client',
        component: ClientComponent,
        data :{
          componentName:"ClientComponent"
        }
      },
      {
        path: 'login',
        component: LoginComponent,
        data :{
          componentName:"LoginComponent"
        }
      },
      {
        path: 'register',
        component: RegisterComponent,
        data :{
          componentName:"RegisterComponent"
        }
      },
      {
        path: 'create-dealer-sdealer',
        component: CreateDealerSdealerComponent,
        data :{
          componentName:"CreateDealerSdealerComponent"
        }
      },
      {
        path: 'create-sdealer',
        component: CreateSdealerComponent,
        data :{
          componentName:"CreateSdealerComponent"
        }
      },
      {
        path: 'dealer/create-sdealer',
        component: DealerCreateSdealerComponent,
        data :{
          componentName:"DealerCreateSdealerComponent"
        }
      },
      {
        path: 'profile',
        component: ProfileComponent,
        data :{
          componentName:"ProfileComponent"
        }
      },
      {
        path: 'create-cilent',
        component: CreateClientComponent,
        data :{
          componentName:"CreateClientComponent"
        }
      },
      {
        path: 'upload-apk',
        component: UploadApkComponent,
        data :{
          componentName:"UploadApkComponent"
        }
      },
      {
        path: 'view-apk',
        component: ViewApkComponent,
        data :{
          componentName:"ViewApkComponent"
        }
      },
      {
        path: 'connect-devices/:device_id',
        component: ConnectAdminDevicesComponent,
        data :{
          componentName:"ConnectDevicesComponent"
        }
      },
      {
        path: 'settings',
        component: SettingsComponent,
        data :{
          componentName:"SettingsComponent"
        }
      },
      {
        path: 'dealer/header',
        component: DealerHeaderComponent,
        data :{
          componentName:"DealerHeaderComponent"
        }
      },
      {
        path: 'dealer/devices',
        component: DealerDevicesComponent,
        data :{
          componentName:"DealerDevicesComponent"
        }
      },
      {
        path: 'sdealer/devices',
        component: SdealerDevicesComponent,
        data :{
          componentName:"SdealerDevicesComponent"
        }
      },
      {
        path: 'sdealer/sdealerprofile',
        component: SdealerprofileComponent,
        data :{
          componentName:"SdealerprofileComponent"
        }
      },
      {
        path: 'dealer/client',
        component: DealerClientComponent,
        data :{
          componentName:"DealerClientComponent"
        }
      },
      {
        path: 'dealer/login',
        component: DealerLoginComponent,
        data :{
          componentName:"DealerLoginComponent"
        }
      },
      {
        path: 'sdealer/login',
        component: SdealerLoginComponent,
        data :{
          componentName:"SdealerLoginComponent"
        }
      },
      {
        path: 'dealer/s-dealer',
        component: DealerSDealerComponent,
        data :{
          componentName:"DealerSDealerComponent"
        }
      },
      {
        path: 'dealer/add-devices',
        component: DealerAddDevicesComponent,
        data :{
          componentName:"DealerAddDevicesComponent"
        }
      },
      {
        path: 'dealer/connect-devices/:device_id',
        component: ConnectDevicesComponent,
        data :{
          componentName:"ConnectDevicesComponent"
        }
      },
      {
        path: 'sdealer/connect-devices/:device_id',
        component: SConnectDevicesComponent,
        data :{
          componentName:"SConnectDevicesComponent"
        }
      },
      {
        path: 'profiles-list/:profile_type',
        component: ProfileListComponent,
        data: {
          componentName: "ProfileListComponent"
        }
      },
      {
        path: 'invalid_page/:type',
        component: InvalidPage,
        data :{
          componentName:"InvalidPage"
        }
      },
    ],
    { enableTracing: true, useHash: false })
    ],

  providers: [
              Common,
              RestService,
              HelperService,
              GlobalSearchService,
              {
                provide: LocationStrategy,
                useClass: HashLocationStrategy
              }
            ],
  bootstrap: [AppComponent]
})
export class AppModule { }
