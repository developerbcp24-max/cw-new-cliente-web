import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConfig } from '../../../app.config';
import { HeaderBillDto } from './models/header-bill-dto';
import { HeaderBillResult } from './models/header-bill-result';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class ElectronicBillService {

  private _electronicBill: string;

  constructor(private http: HttpClient, private config: AppConfig){
    this._electronicBill = this.config.getConfig('ElectronicBillUrl');
  }

  GetListBill(request: HeaderBillDto): Observable<HeaderBillResult[]> {
    const {  _electronicBill } = this;
    return this.http.post<HeaderBillResult[]>(`${_electronicBill}GetListBill`, request);
  }

  GetNewListBill(request: HeaderBillDto): Observable<HeaderBillResult[]> {
    const {  _electronicBill } = this;
    return this.http.post<HeaderBillResult[]>(`${_electronicBill}GetNewListBill`, request);
  }

  GetDetailBill(request: HeaderBillDto): Observable<Blob> {
    const {  _electronicBill } = this;
    return this.http.post(`${_electronicBill}GetDetailBill`, request, { responseType: 'blob' });//ojosos postReport
  }

  GetNewDetailBill(request: HeaderBillDto): Observable<Blob> {
    const {  _electronicBill } = this;
    return this.http.post(`${_electronicBill}GetNewDetailBill`, request, { responseType: 'blob' });//ojosos postReport
  }

  GetBillPerMonth(request: HeaderBillDto): Observable<Blob> {
    const {  _electronicBill } = this;
    return this.http.post(`${_electronicBill}GetBillPerMonth`, request, { responseType: 'blob' });//ojosos postReport
  }

  GetNewBillPerMonth(request: HeaderBillDto): Observable<Blob> {
    const {  _electronicBill } = this;
    return this.http.post(`${_electronicBill}GetNewBillPerMonth`, request, { responseType: 'blob' });//ojosos postReport
  }

  GetListBillReport(request: HeaderBillDto): Observable<Blob> {
    const {  _electronicBill } = this;
    return this.http.post(`${_electronicBill}GetListBillReport`, request, { responseType: 'blob' });//ojosos postReport
  }

  GetNewListBillReport(request: HeaderBillDto): Observable<Blob> {
    const {  _electronicBill } = this;
    return this.http.post(`${_electronicBill}GetNewListBillReport`, request, { responseType: 'blob' });//ojosos postReport
  }

}
