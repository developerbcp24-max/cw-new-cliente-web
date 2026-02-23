import {  HttpHeaders, HttpResponse } from "@angular/common/http";
export const httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'})
};
export class JwtRequestOptions extends HttpResponse<Response>{
    public token: string;
    constructor(customOptions?: any) {
        
        super();
        let user = JSON.parse(sessionStorage.getItem('userActual')!);
        let fingerprint = sessionStorage.getItem('fingerprint');
        this.token = user && user.token;
        httpOptions.headers.append('Content-Type', 'application/json');
        httpOptions.headers.append('Authorization', 'Bearer ' + this.token);
        httpOptions.headers.append('Fingerprint', fingerprint!);
        const base64Credential: string = btoa(user.username + ':' + user.refreshToken);
        httpOptions.headers.append('Authorization', 'Basic ' + base64Credential);
    }
}
export class JwtRequestOptionsFile extends HttpResponse<Response> {
    public token: string;
    constructor(customOptions?: any) {
        super();
        httpOptions.headers.delete('Content-Type');
        let user = JSON.parse(sessionStorage.getItem('userActual')!);
        let fingerprint = sessionStorage.getItem('fingerprint');
        this.token = user && user.token;
        httpOptions.headers.append('Authorization', 'Bearer ' + this.token);
        httpOptions.headers.append('Fingerprint', fingerprint!);
    }
}