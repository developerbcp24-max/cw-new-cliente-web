import { inject, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AdminModule } from './Views/admin/admin.module';
import { CoreModule } from './Services/shared/core.module';
import { AppMaterialModule } from './Views/angular.material/app.material.module';

import { AuthGuard } from './Directives/auth.guard';
import { AuthenticationService } from './Services/users/authentication.service';
import { UserService } from './Services/users/user.service';

import { JwtInterceptor, LoaderInterceptor } from './Jwt';
import { ErrorInterceptor } from './Jwt/error.interceptor';
import { NoCacheInterceptor } from './Jwt/no-cache.interceptor';

import { NgxCaptchaModule, ReCaptchaV3Service } from 'ngx-captcha';
import { AppConfig } from './app.config';

import { provideAppInitializer } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { SharedModule } from './Views/shared/shared.module';
import { JwtModule } from './Jwt/jwt.module';


@NgModule({
  declarations: [AppComponent, ],
  imports: [
    CommonModule,
    BrowserModule,
    //BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    AdminModule,
    ReactiveFormsModule,
    CoreModule.forRoot(),
    AppMaterialModule,
    NgxCaptchaModule,
    SharedModule,
    JwtModule,
  ],
  providers: [
    AuthGuard,
    AuthenticationService,
    UserService,
    AppConfig,
    DecimalPipe,
    provideAppInitializer(() => {
      const appConfig = inject(AppConfig);
      return appConfig.load();
    }),

    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: NoCacheInterceptor, multi: true },
    ReCaptchaV3Service,
    {
      provide: 'RECAPTCHA_V3_SITE_KEY',
      useFactory: (appConfig: AppConfig) => appConfig.getConfig('publicKeyRecaptcha'),
      deps: [AppConfig],
    },
  ],
  exports: [AppMaterialModule, HttpClientModule],
  bootstrap: [AppComponent],
})
export class AppModule {}
