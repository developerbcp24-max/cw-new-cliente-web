import { Injectable } from '@angular/core';
import { JwtService } from '../../Jwt/jwt.service';
import { AccountDto } from './models/account-dto';
import { AccountNumberDto } from './models/account-number-dto';
import { AppConfig } from '../../app.config';
import { AccountIdDto } from '../balances-and-movements/models/account-id-dto';
import { AccountResult } from '../balances-and-movements/models/account-result';
import { AccountOwnerResult } from './models/account-owner-result';
import { CompleteAccountResult } from './models/complete-account-result';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EncryptDecryptService } from '../encrypt-decrypt/encrypt-decrypt.service';
@Injectable({
  providedIn: 'root'
})
export class AccountsService {

  private accounts: string;

  constructor(private http: HttpClient, private config: AppConfig, private jwt: JwtService, private _encriptDecrypt: EncryptDecryptService){
    this.accounts = this.config.getConfig('AccountsServiceUrl');
  }

  getAccounts(accountRequest: AccountDto): Observable<AccountResult[]> {
    return this.http.post<AccountResult[]>(`${this.accounts}Get`, accountRequest);
  }

  getCompanyAccounts(accountRequest: AccountDto): Observable<AccountResult[]> {
    return this.http.post<AccountResult[]>(`${this.accounts}GetByCompany`, accountRequest);
  }

  /* getOwner(accountNumberRequest: AccountNumberDto): Observable<AccountOwnerResult> {
    let _account = this._encriptDecrypt.encryptAES(accountNumberRequest.accountNumber);
  accountNumberRequest.accountNumber=_account
    const { http, accounts } = this;
    return http.post<AccountOwnerResult>(`${accounts}GetOwner`, accountNumberRequest);
  } */
 getOwner(accountNumberRequest: AccountNumberDto): Observable<AccountOwnerResult> {
  const encryptedAccount = this._encriptDecrypt.encryptAES(accountNumberRequest.accountNumber);
  const payload = {
    ...accountNumberRequest,
    accountNumber: encryptedAccount
  };
  return this.http.post<AccountOwnerResult>(`${this.accounts}GetOwner`, payload);
}


  getById(accountIdRequest: AccountIdDto): Observable<CompleteAccountResult> {
    const { http, accounts } = this;
    return http.post<CompleteAccountResult>(`${accounts}GetById`, accountIdRequest);
  }
}
