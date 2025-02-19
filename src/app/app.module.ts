import { LOCALE_ID, NgModule } from '@angular/core';
import {
    LocationStrategy,
    HashLocationStrategy,
    registerLocaleData,
} from '@angular/common';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppLayoutModule } from './layout/app.layout.module';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ServerErrorsInterceptor } from './interceptor/server-errors-interceptor';
import { PrimengModule } from './primeng/primeng.module';
import { MessageService } from 'primeng/api';
import { environment } from 'src/environments/environment.development';
import { JwtModule } from '@auth0/angular-jwt';

import localeEsPE from '@angular/common/locales/es-PE';
registerLocaleData(localeEsPE, 'es-PE');

export function tokenGetter() {
    return localStorage.getItem(environment.TOKEN_NAME);
}

@NgModule({
    declarations: [AppComponent],
    imports: [
        AppRoutingModule,
        AppLayoutModule,
        PrimengModule,
        JwtModule.forRoot({
            config: {
                tokenGetter: tokenGetter,
                allowedDomains: ['localhost:8081'],
                // allowedDomains: ["137.184.193.135:8081"],
                disallowedRoutes: ['https://api.migo.pe/api/v1/', 'http://localhost:8081/login/forget'],
            },
        }),
    ],
    providers: [
        // { provide: LocationStrategy, useClass: PathLocationStrategy },
        { provide: LocationStrategy, useClass: HashLocationStrategy },
        // {
        //     provide: HTTP_INTERCEPTORS,
        //     useClass: ServerErrorsInterceptor,
        //     multi: true,
        // },
        { provide: LOCALE_ID, useValue: 'es-PE' },
        MessageService,
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
