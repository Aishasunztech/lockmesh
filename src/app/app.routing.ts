import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Import Containers
import { LoginComponent } from './login/login.component';

import { HomeComponent } from "./components/home.component";
import { HomeModule } from './components/home.module';
import { AddDeviceComponent } from './components/add-device/add-device.component';
import { ClientComponent } from "./components/client/client.component";
import { ConnectAdminDevicesComponent } from './components/connect-devices/connect-devices.component';
import { CreateClientComponent } from "./components/create-client/create-client.component";
import { CreateDealerSdealerComponent } from "./components/create-dealer/create-dealer-sdealer.component";
import { CreateSdealerComponent } from "./components/create-sdealer/create-sdealer.component";
import { DealerComponent } from "./components/dealer/dealer.component";
import { DevicesComponent } from './components/devices/devices.component';
import { ProfileComponent } from './components/profile/profile.component';
import { AccountComponent } from './components/account/account.component';
import { ProfileListComponent } from './components/profile-list/profile-list.component';

import { SdealerComponent } from './components/sdealer/sdealer.component';
import { SettingsComponent } from "./components/settings/settings.component";
import { UploadApkComponent } from './components/upload-apk/upload-apk.component';
import { ViewApkComponent } from './components/view-apk/view-apk.component';

//invalid pages
import { InvalidPage } from './views/error/invalid_page.component';
import { P404Component } from './views/error/404.component';
import { P500Component } from './views/error/500.component';
// import { LoginComponent } from './views/login/login.component';
// import { RegisterComponent } from './views/register/register.component';

export const routes: Routes = [
    {
        path: '404',
        component: P404Component,
        data: {
            title: 'Page 404',
            componentName: 'P404Component',
            path: '404',
            description: "Page not Found"
        }
    },
    {
        path: '500',
        component: P500Component,
        data: {
            title: 'Page 500',
            componentName: 'P500Component',
            path: '500',
            description: ""
        }
    },
    {
        path: 'login',
        component: LoginComponent,
        data: {
            title: 'Login',
            componentName: "LoginComponent",
            path: 'login',
            description: ""
        }
    },
    {
        path: '',            //<---- parent component declared here
        component: HomeComponent,
        data: {
            title: 'Dashboard',
            componentName: "HomeComponent",
            path: '',
            description: ""
        },
        children: [
            {
                path: 'devices',
                component: DevicesComponent,
                data: {
                    componentName: "DevicesComponent"
                }
            },
            {
                path: 'add-device',
                component: AddDeviceComponent,
                data: {
                    componentName: "AddDeviceComponent"
                }
            },
            {
                path: 'dealer',
                component: DealerComponent,
                data: {
                    componentName: "DealerComponent"
                }
            },
            {
                path: 'sdealer',
                component: SdealerComponent,
                data: {
                    componentName: "SdealerComponent"
                }
            },
            {
                path: 'client',
                component: ClientComponent,
                data: {
                    componentName: "ClientComponent"
                }
            },
            {
                path: 'create-dealer-sdealer',
                component: CreateDealerSdealerComponent,
                data: {
                    componentName: "CreateDealerSdealerComponent"
                }
            },
            {
                path: 'create-sdealer',
                component: CreateSdealerComponent,
                data: {
                    componentName: "CreateSdealerComponent"
                }
            },
            {
                path: 'profile',
                component: ProfileComponent,
                data: {
                    componentName: "ProfileComponent"
                }
            },
            {
                path: 'create-cilent',
                component: CreateClientComponent,
                data: {
                    componentName: "CreateClientComponent"
                }
            },
            {
                path: 'upload-apk',
                component: UploadApkComponent,
                data: {
                    componentName: "UploadApkComponent"
                }
            },
            {
                path: 'view-apk',
                component: ViewApkComponent,
                data: {
                    componentName: "ViewApkComponent"
                }
            },
            {
                path: 'connect-devices/:device_id',
                component: ConnectAdminDevicesComponent,
                data: {
                    componentName: "ConnectDevicesComponent"
                }
            },
            {
                path: 'settings',
                component: SettingsComponent,
                data: {
                    componentName: "SettingsComponent"
                }
            },
            {
                path: 'account',
                component: AccountComponent,
                data: {
                    componentName: "AccountComponent"
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
                data: {
                    componentName: "InvalidPage"
                }
            },
        ]
    }
    , { path: '**', component: P404Component }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { enableTracing: true, useHash: false })],
    exports: [RouterModule]
})
export class AppRoutingModule { }