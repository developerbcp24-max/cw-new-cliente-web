import { Injectable } from '@angular/core';
import { GlobalService } from '../Services/shared/global.service';
import { JwtRequestOptions, JwtRequestOptionsFile } from './jwt.options';
import { HttpClient, HttpHeaderResponse, HttpHeaders, HttpResponse, HttpXhrBackend } from '@angular/common/http';
import { AuthenticationService } from '../Services/users/authentication.service';
import { catchError,finalize, flatMap, Observable, tap, throwError, timeout } from 'rxjs';
import { map, } from 'rxjs/operators'
import { User } from '../Services/users/models/user';

const httpOptions = {
    headers: new HttpHeaders({'content-type': 'application/json'})
}
@Injectable({
  providedIn: 'root'
})
export class JwtService extends HttpClient {
    public token: any;
    private headers: any;
    public antiCsrfToken: string;
    public responseType: any;
    public url: any;
    private filesTypesList = [
        { value: 'application/pdf' },
        { value: 'application/vnd.ms-excel' },
        { value: 'application/txt' },
        { value: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' },
        { value: 'application/file' },
        { value: 'application/zip' }
    ];

    constructor(
        backend: HttpXhrBackend,
        defaultOptions: JwtRequestOptions,
        private authenticationService: AuthenticationService,
        private globalService: GlobalService ) {
        super(backend, /* defaultOptions */);
        const user = JSON.parse(sessionStorage.getItem('userActual')!);
        if (user) {
            this.token = user.token;
        }
        this.antiCsrfToken = undefined!;
    }

    // HttpService
    GET(url: string, options?: HttpResponse<Response>): Observable<any> {
        if (this.IsTokenExpired()) {
            return this.authenticationService.refreshToken().pipe(catchError((error: any) => {
                //console.log('errorcatch', error);
                this.authenticationService.logout();
                return throwError(new Error(error.status));
            }), flatMap(() => this.get(url, options)));
        }

        options = this.requestOptions(options);
        if (this.antiCsrfToken !== undefined) {
            options.headers.append('X-CSRFToken', this.antiCsrfToken);
        }

        console.log(this.getFullUrl(url));
        this.globalService.showLoader(true);
        return super.get<HttpResponse<Response>>(this.getFullUrl(url), options)
            .pipe(tap(res => {
                if (res.headers.get('csrftoken') !== undefined) {
                    this.antiCsrfToken = res.headers.get('csrftoken')!;
                }
            }, error => {
                this.globalService.danger('Error', 'Mostrar error aqui', false, false);
                if (error.headers.get('csrftoken') !== undefined) {
                    this.antiCsrfToken = error.headers.get('csrftoken');
                }
            })
            ,finalize(() => {
                this.globalService.showLoader(false);
            }));
    }
    POST(url: string, body: any, options?: HttpResponse<Response>): Observable<any> {
        if (this.IsTokenExpired()) {
            return this.authenticationService.refreshToken().pipe(catchError((error: any) => {
                this.authenticationService.logout();
                return throwError(new Error(error.status));
            }), flatMap(() => this.post(url, body, options)));
        }
        options = this.requestOptions(options);
        if (this.antiCsrfToken !== undefined) {
            options!.headers.append('X-CSRFToken', this.antiCsrfToken);
        }
        this.globalService.showLoader(true);
        return this.post<HttpResponse<Response>>(this.getFullUrl(url), body, options)
        .pipe(tap(res => {
            if (res.headers.get('csrftoken') !== undefined) {
                this.antiCsrfToken = res.headers.get('csrftoken')!;
            }
        }, (error: any) => {
            if (error.headers.get('csrftoken') !== undefined) {
                this.antiCsrfToken = error.headers.get('csrftoken');
            }
        }), finalize(() => {
            this.globalService.showLoader(false);
        })
        ,timeout(180000)
        ,map( (res:  HttpResponse<Response>) => {
            const result = res;
                    if (result.ok) {
                        return result.body;
                    }
            return;
        }))
           }

     POSTFile(url: string, body: any, options?: HttpHeaderResponse | undefined | any): Observable<any> {
        if (this.IsTokenExpired()) {
            return this.authenticationService.refreshToken().pipe(catchError((error: any) => {
                this.authenticationService.logout();
                return throwError(new Error(error.status));
            }), flatMap(() => this.post(url, body, options)));
        }
        options = new JwtRequestOptionsFile();
        if (this.antiCsrfToken !== undefined) {
            options.headers.append('X-CSRFToken', this.antiCsrfToken);
        }
        this.globalService.showLoader(true);
        return super.post(this.getFullUrl(url), body, options)
            .pipe(tap((res: any) => {
                if (res.headers.get('csrftoken') !== undefined) {
                    this.antiCsrfToken = res.headers.get('csrftoken');
                }
            }, (error: any) => {
                if (error.headers.get('csrftoken') !== undefined) {
                    this.antiCsrfToken = error.headers.get('csrftoken');
                }
            })
            , finalize(() => {
                this.globalService.showLoader(false);
            })
            , map((res: any) => {
                const result = res.json();
                if (result.isOk) {
                    return result.body;
                }
                throw throwError(new Error(result.message));
            }), catchError((error: any) => {
                if (error.error) {
                    return throwError(new Error(error._err.message));
                }
                if (error.status === 422) {
                    let msgResult = '';
                    const errors = error.json();
                    Object.keys(errors).forEach(function (key) {
                        msgResult = msgResult + `Campo:'${key}', Error':${errors[key]}'\n`;
                    });
                    return throwError(new Error(msgResult));
                }
                console.log(error);
                return throwError(new Error('No se puede acceder al servicio'));
            }));
    }

    POSTReport(url: string, body: any, options?: HttpHeaderResponse | undefined | any): Observable<any> {
        if (this.IsTokenExpired()) {
            return this.authenticationService.refreshToken().pipe(catchError((error: any) => {
                this.authenticationService.logout();
                return throwError(new Error(error.status));
            }), flatMap(() => this.post(url, body, options)));
        }

        options = this.requestOptions(options);
        if (this.antiCsrfToken !== undefined) {
            options.headers.append('X-CSRFToken', this.antiCsrfToken);
        }
        this.globalService.showLoader(true);
        return super.post(this.getFullUrl(url), body, options)
            .pipe(tap((res: any) => {
                if (res.headers.get('csrftoken') !== undefined) {
                    this.antiCsrfToken = res.headers.get('csrftoken');
                }
            }, (error: any) => {
                if (error.headers.get('csrftoken') !== undefined) {
                    this.antiCsrfToken = error.headers.get('csrftoken');
                }
            }), finalize(() => {
                this.globalService.showLoader(false);
            })
            ,map((res: any) => {
                const result = res.json();
                for (let i = 0; i < this.filesTypesList.length; i++) {
                    if (result.type === this.filesTypesList[i].value) {
                        const report = new Blob([res.blob()], { type: result.type });
                        return report;
                    }
                }
                throw throwError(new Error(result.message));
            }), catchError((error: any) => {
                if (error.error) {
                    return throwError(new Error(error._err.message));
                }
                if (error.status === 422) {
                    let msgResult = '';
                    const errors = error.json();
                    Object.keys(errors).forEach(function (key) {
                        msgResult = msgResult + `Campo:'${key}', Error':${errors[key]}'\n`;
                    });
                    return throwError(new Error(msgResult));
                }
                console.log(error);
                return throwError(new Error('No se puede acceder al servicio'));
            }));
    }

    PUT(url: string, body: any, options?: HttpHeaderResponse | undefined | any): Observable<any> {
        if (this.IsTokenExpired()) {
            return this.authenticationService.refreshToken().pipe(catchError((error: any) => {
                this.authenticationService.logout();
                return throwError(new Error(error.status));
            })
                ,flatMap(() => this.put(url, body, options)));
        }

        options = this.requestOptions(options);
        if (this.antiCsrfToken !== undefined) {
            options.headers.append('X-CSRFToken', this.antiCsrfToken);
        }

        this.globalService.showLoader(true);
        return super.put(this.getFullUrl(url), body, options)
            .pipe(tap((res: any) => {
                if (res.headers.get('csrftoken') !== undefined) {
                    this.antiCsrfToken = res.headers.get('csrftoken');
                }
            }, (error: any) => {
                this.globalService.danger('Error', 'Mostrar error aqui', false, false);
                if (error.headers.get('csrftoken') !== undefined) {
                    this.antiCsrfToken = error.headers.get('csrftoken');
                }
            })
            , finalize(() => {
                this.globalService.showLoader(false);
            }));
    }

    getFullUrl(url: string): string {
        return url;
    }

    private IsTokenExpired(): boolean {
        const user = JSON.parse(sessionStorage.getItem('userActual')!);
        if (!user || user == null) {
             this.authenticationService.logout();
        }
        if (!user.token) {
            return true;
        }
        this.token = user.token;
        const base64Url = this.token.split('.')[1];
        const base64 = base64Url.replace('-', '+').replace('_', '/');
        const data = JSON.parse(window.atob(base64));
        if ((Date.now() / 1000) > data.exp) {
            return false;
        }
        data.exp -= 240;
        return (Date.now() / 1000) > data.exp;
    }

    private requestOptions(options?: HttpResponse<Response>){
        if (options == null) {
            options = new JwtRequestOptions();
        } else {
            this.responseType = options;
        }
        if (options.headers == null) {
            options = new JwtRequestOptions();
        }
        return options;
    }

}
