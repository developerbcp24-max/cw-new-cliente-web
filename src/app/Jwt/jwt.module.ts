import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JwtService } from './jwt.service';
import { httpServiceFactory } from './jwt.factory';
import { GlobalService } from '../Services/shared/global.service';
import { HttpXhrBackend } from '@angular/common/http';
import { AuthenticationService } from '../Services/users/authentication.service';


@NgModule({
    imports: [
        CommonModule,
    ],
    exports: [
    ],
    declarations: [
    ],
    providers: [
        {
            provide: JwtService,
            useFactory: httpServiceFactory,
            deps: [HttpXhrBackend, AuthenticationService, GlobalService]
        },

    ]
})
export class JwtModule { }
