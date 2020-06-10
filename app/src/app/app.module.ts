import { environment } from '../environments/environment';

/* --- MODULES --- */
import { NgModule } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { BrowserModule } from '@angular/platform-browser';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { HttpClientModule } from '@angular/common/http';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AppRoutingModule } from './app-routing.module';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { SplashscreenModule } from './splashscreen/splashscreen.module';
import { ServiceWorkerModule } from '@angular/service-worker';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

/* --- SERVICES --- */
import { ApiService } from './services/api/api.service';
import { AuthManager } from './services/account/account.manager';
import { MenuService } from './services/menu/menu.service';
import { ToastService } from './services/toast/toast.service';
import { ConfigService } from './services/config/config.service';
import { LoggerService } from './services/logger/logger.service';
import { AccountService } from './services/account/account.service';
import { FormErrorService } from './services/form-error/form-error.service';
import { LocalstorageService } from './services/localstorage/localstorage.service';

/* --- COMPONENTS --- */
import { AppComponent } from './app.component';

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        MatIconModule,
        MatListModule,
        MatRippleModule,
        MatButtonModule,
        MatToolbarModule,
        AppRoutingModule,
        HttpClientModule,
        MatSidenavModule,
        MatSnackBarModule,
        SplashscreenModule,
        BrowserAnimationsModule,
        ServiceWorkerModule.register('ngsw-worker.js', {
            'enabled': environment.production
        }),
    ],
    providers: [
        ApiService,
        MenuService,
        AuthManager,
        ToastService,
        LoggerService,
        ConfigService,
        AccountService,
        FormErrorService,
        LocalstorageService
    ],
    bootstrap: [
        AppComponent
    ]
})

export class AppModule {}