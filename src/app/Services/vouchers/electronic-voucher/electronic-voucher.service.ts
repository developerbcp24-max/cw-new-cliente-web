import { Injectable } from '@angular/core';
import { AppConfig } from '../../../app.config';
import { Observable } from 'rxjs';
import { GetElectronicVouchersResponse } from './models/get-electronic-vouchers-response';
import { ElectronicVoucherDto } from './models/electronic-voucher-dto';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../../users/user.service';

@Injectable()
export class ElectronicVoucherService {

  private _electronicVoucher: string;

  constructor(private http: HttpClient,
    private config: AppConfig, private userService: UserService) {
      this._electronicVoucher = this.config.getConfig('VoucherElectronicUrl');
      this.userService.getValidateCurrentUser();
    }

    getListElectronicVoucher(request: ElectronicVoucherDto): Observable<GetElectronicVouchersResponse[]> {
      const {  _electronicVoucher } = this;
      return this.http.post<GetElectronicVouchersResponse[]>(`${_electronicVoucher}GetListElectronicVoucher`, request);
    }
    getReport(getElectronicVouchersResponseDto: GetElectronicVouchersResponse): Observable<Blob> {
      const { _electronicVoucher } = this;
      return this.http.post(`${_electronicVoucher}GetReport`, getElectronicVouchersResponseDto, { responseType: 'blob' });//ojosos postReport
    }
}
