import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { StorageServiceModule } from 'angular-webstorage-service';
import { Ng2OrderModule } from 'ng2-order-pipe';
import { NgDatepickerModule } from 'ng2-datepicker';
import { UiSwitchModule } from 'ngx-toggle-switch';

import { ModuleWithProviders, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './../shared/layout/header/header.component';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { GlobalSearchService } from '../services/global-search.service';
import { AddDeviceComponent } from './add-device/add-device.component';
import { ClientComponent } from "./client/client.component";
import { ConnectAdminDevicesComponent } from './connect-devices/connect-devices.component';
import { CreateClientComponent } from "./create-client/create-client.component";
import { CreateDealerSdealerComponent } from "./create-dealer/create-dealer-sdealer.component";
import { CreateSdealerComponent } from "./create-sdealer/create-sdealer.component";
import { DealerComponent } from "./dealer/dealer.component";
import { DevicesComponent } from './devices/devices.component';
import { ProfileComponent } from './profile/profile.component';
import { ProfileListComponent } from './profile-list/profile-list.component';

import { SdealerComponent } from './sdealer/sdealer.component';
import { SettingsComponent } from "./settings/settings.component";
import { UploadApkComponent } from './upload-apk/upload-apk.component';
import { ViewApkComponent } from './view-apk/view-apk.component';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown/angular2-multiselect-dropdown';

import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';
import { DataTableModule } from 'angular-6-datatable';

import { HomeRoutingModule } from './home.routing';
import { HomeComponent } from './home.component';
import { Common } from '../entity/common';
import { RestService } from '../services/rest.service';
import { HelperService } from '../services/helper.service';

import { ACLComponent } from './acl/acl.component';
// const homeRouting: ModuleWithProviders = RouterModule.forChild([
//     // {
//     //     path: 'devices',
//     //     component: DevicesComponent,
//     //     data: {
//     //         componentName: "DevicesComponent"
//     //     }
//     // },
// ]);

@NgModule({
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
        HomeRoutingModule,
        // homeRouting,
        // SharedModule
    ],
    exports: [
        HomeRoutingModule,
    ],
    declarations: [
        HomeComponent,
        DevicesComponent,
        HeaderComponent,
        SettingsComponent,
        AddDeviceComponent,
        DealerComponent,
        CreateDealerSdealerComponent,
        ClientComponent,
        CreateSdealerComponent,
        SdealerComponent,
        CreateClientComponent,
        ConnectAdminDevicesComponent,
        ProfileComponent,
        UploadApkComponent,
        ViewApkComponent,
        ProfileListComponent,
        ACLComponent
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
    bootstrap: [HomeComponent]
})
export class HomeModule { }