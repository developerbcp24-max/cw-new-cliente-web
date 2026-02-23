import {Injectable} from '@angular/core';
import {catchError} from "rxjs";
import {IpAddresService} from "../users/ip-addres.service";
import {FxService} from "./fx.service";
import {AppConfig} from "../../app.config";
import {VentaDto} from "../../Models/venta-dto";
import {GlobalService} from "../shared/global.service";
import  moment from "moment/moment";
import {CompanyLimitsResult} from "../limits/models/company-limits-result";
import {LimitsService} from "../limits/limits.service";

@Injectable({
  providedIn: 'root'
})
export class CommonFxService {

  constructor(private ipEnc: IpAddresService, private messageService: GlobalService,
              private fxService: FxService, private config: AppConfig, private limitsService: LimitsService) {
  }

  public showMessage(message: string, clase: string = "snackbar-success"): void {
    if (clase == "snackbar-success") {
      this.messageService.success('', message);
    } else {
      this.messageService.danger('Error: ', ' ' + message);
    }
  }

  public getIpAddres(): Promise<string> {
    return new Promise((resolve) => {
      this.ipEnc.getIpClient().pipe(
        catchError(_error => this.ipEnc.getIpAddress())
      ).subscribe({
        next: response => {
          resolve(response.ip);
        }, error: _err => {
          resolve('NOT_IP');
        },
      });
    });
  }

  public isValidNumber(value: any, errorMessage: string): boolean {
    const number: number = Number(value);
    if (isNaN(number) || number <= 0) {
      this.showMessage(errorMessage, 'snackbar-danger');
      return false;
    }
    return true;
  }

  public GetCompanyAutorizhed(company_id: number, type: boolean): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.fxService.Autorizhed({"companyId": company_id}).subscribe((data: any) => {
        if (type === true) {
          resolve(data.dollarBuyState);
        }
        if (type === false) {
          resolve(data.dollarSellState);
        }
      }, (_error: any): void => {
        reject(false);
      });
    });
  }


  public async getListaBankers() {
    return new Promise((resolve, reject) => {
      this.fxService.GetBankers().subscribe((response: any) => {
        resolve(response);
      }, (error: any) => {
        reject(error);
      });
    });
  }

  public saveSales(venta: VentaDto) {
    return new Promise((resolve, reject) => {
      this.fxService.saveSales(venta).subscribe((data: any) => {
        resolve(data);
      }, (error: any) => {
        reject(error);
      });
    });
  }

  public formatDateToString(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  public toPercentage(value: number) {
    return (value * 100).toFixed(2) + '%';
  }

  public detailFx(BatchId: number): Promise<any> {
    return new Promise((resolve, reject) => {
      this.fxService.GetDetail(BatchId).subscribe((data: any) => {
        resolve(data);
      }, (error: any) => {
        reject(error);
      });
    });
  }

  public desformatearFecha(fecha: string) {
    if (fecha.length !== 8) {
      throw new Error("La fecha debe tener el formato YYYYMMDD.");
    }
    return moment(fecha, 'YYYYMMDD').toDate();
  }

  public async limitValor(): Promise<CompanyLimitsResult> {
    return new Promise((resolve, reject) => {
      this.limitsService.getCompanyLimits()
        .subscribe({
          next: response => resolve(response),
          error: err => reject(err.message)
        });
    });
  }
}
