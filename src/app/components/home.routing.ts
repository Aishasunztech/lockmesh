import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

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

import { InvalidPage } from '../views/error/invalid_page.component';

export const routes: Routes = [
    // {
    //     path: '',            //<---- parent component declared here
    //     data: {
    //         title: 'Dashboard',
    //         componentName: "HomeComponent",
    //         path: '',
    //         description: ""
    //     },
    //     children: [
            // {
            //     path: 'devices',
            //     component: DevicesComponent,
            //     data: {
            //         componentName: "DevicesComponent"
            //     }
            // },
            // {
            //     path: 'add-device',
            //     component: AddDeviceComponent,
            //     data: {
            //         componentName: "AddDeviceComponent"
            //     }
            // },
            // {
            //     path: 'dealer',
            //     component: DealerComponent,
            //     data: {
            //         componentName: "DealerComponent"
            //     }
            // },
            // {
            //     path: 'sdealer',
            //     component: SdealerComponent,
            //     data: {
            //         componentName: "SdealerComponent"
            //     }
            // },
            // {
            //     path: 'client',
            //     component: ClientComponent,
            //     data: {
            //         componentName: "ClientComponent"
            //     }
            // },
            // {
            //     path: 'create-dealer-sdealer',
            //     component: CreateDealerSdealerComponent,
            //     data: {
            //         componentName: "CreateDealerSdealerComponent"
            //     }
            // },
            // {
            //     path: 'create-sdealer',
            //     component: CreateSdealerComponent,
            //     data: {
            //         componentName: "CreateSdealerComponent"
            //     }
            // },
            // {
            //     path: 'profile',
            //     component: ProfileComponent,
            //     data: {
            //         componentName: "ProfileComponent"
            //     }
            // },
            // {
            //     path: 'create-cilent',
            //     component: CreateClientComponent,
            //     data: {
            //         componentName: "CreateClientComponent"
            //     }
            // },
            // {
            //     path: 'upload-apk',
            //     component: UploadApkComponent,
            //     data: {
            //         componentName: "UploadApkComponent"
            //     }
            // },
            // {
            //     path: 'view-apk',
            //     component: ViewApkComponent,
            //     data: {
            //         componentName: "ViewApkComponent"
            //     }
            // },
            // {
            //     path: 'connect-devices/:device_id',
            //     component: ConnectAdminDevicesComponent,
            //     data: {
            //         componentName: "ConnectDevicesComponent"
            //     }
            // },
            // {
            //     path: 'settings',
            //     component: SettingsComponent,
            //     data: {
            //         componentName: "SettingsComponent"
            //     }
            // },
            // {
            //     path: 'profiles-list/:profile_type',
            //     component: ProfileListComponent,
            //     data: {
            //         componentName: "ProfileListComponent"
            //     }
            // },
            // {
            //     path: 'invalid_page/:type',
            //     component: InvalidPage,
            //     data: {
            //         componentName: "InvalidPage"
            //     }
            // },
    //     ]
    // }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class HomeRoutingModule { }