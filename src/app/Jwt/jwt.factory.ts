import { JwtRequestOptions } from './jwt.options';
import { JwtService } from './jwt.service';
import { GlobalService } from '../Services/shared/global.service';
import { HttpXhrBackend } from '@angular/common/http';
import { AuthenticationService } from '../Services/users/authentication.service';

function httpServiceFactory(backend: HttpXhrBackend, options: JwtRequestOptions, authenticationService: AuthenticationService, globalService: GlobalService) {
    return new JwtService(backend, options, authenticationService, globalService);
}
export { httpServiceFactory };
