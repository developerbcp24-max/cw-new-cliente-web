import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { TransferAbroadResult } from '../../../../Services/transfers-abroad/models/transfer-abroad-result';
import { TransfersAbroadService } from '../../../../Services/transfers-abroad/transfer-abroad.service';
import { GetTransferAbroadDto } from '../../../../Services/transfers-abroad/models/get-transfer-abroad-dto';
import { GlobalService } from '../../../../Services/shared/global.service';
import { GpiDatesResult } from '../../../../Services/transfers-abroad/models/gpi-dates-result';
import  moment from 'moment';
import { AppConfig } from '../../../../app.config';

@Component({
  selector: 'app-transfer-abroad-batch-detail',
  standalone: false,
  templateUrl: './transfer-abroad-batch-detail.component.html',
  styleUrls: ['./transfer-abroad-batch-detail.component.css'],
  providers: [TransfersAbroadService]
})
export class TransferAbroadBatchDetailComponent implements OnInit, OnChanges {

  @Input() batchId!: number;
  @Input() isAuthorize!: boolean;
  isVisibleFormDetail = false;
  transfer: TransferAbroadResult = new TransferAbroadResult();
  processes: any = [];
  gpiDatesResult: GpiDatesResult[] = [];
  totalGpiDates: number = 0;
  sizeCol = 2;
  isVisibleGpi = false;
  showGPI!: boolean;
  messageGPI = '';

  constructor(
    private transfersAbroadService: TransfersAbroadService,
    private globalService: GlobalService, private config: AppConfig) { }

  ngOnInit() {
    this.showGPI = this.config.getConfig('showGPI');
  }

  ngOnChanges() {
    this.isVisibleFormDetail = false;
    this.showGPI = this.config.getConfig('showGPI');
    if (this.showGPI) {
      this.getDetailGPI();
    }
    this.LoadTransferAbroadResult();
  }

  LoadTransferAbroadResult() {
    const transfer: GetTransferAbroadDto = new GetTransferAbroadDto({ batch: this.batchId });
    this.transfersAbroadService
      .getTransferAbroad(transfer)
      .subscribe({next: (res: TransferAbroadResult) => {
        this.transfer = res;
        this.transfer.currency = this.transfer.currency.trim() === 'USD' ? 'DÓLARES' : 'BOLIVIANOS';
      }, error: _err => {
        this.globalService.danger('Servicio de Transferencias al Exterior', _err.message);
      }});
  }

  getDetailGPI() {
    this.processes = [];
    const transfer: GetTransferAbroadDto = new GetTransferAbroadDto({ batch: this.batchId });
    this.transfersAbroadService.getTrackerGPI(transfer)
      .subscribe({next: (res: GpiDatesResult[]) => {
         this.gpiDatesResult = res;
         this.totalGpiDates = this.gpiDatesResult.length;
         this.isVisibleGpi = this.totalGpiDates > 0 ? true : false;
         if (this.showGPI && this.isVisibleGpi) {
            this.messageGPI = 'GPI: No existen datos para mostrar.';
         }
         for (let item of this.gpiDatesResult) {
            let inProcess = item.codeDescription.includes('PAGO TRANSFERIDO AL SIGUIENTE AGENTE GPI') && this.totalGpiDates === 1 ?
                            'EN PROCESO' : item.codeDescription.includes('PAGO TRANSFERIDO AL SIGUIENTE AGENTE GPI') && this.totalGpiDates > 1 ?
                            'ENVIADO' : item.codeDescription;
            this.processes.push(inProcess);
            let aux = moment(item.emissionDate, 'YYYYMMDD');
            item.emissionDate = aux.format('DD/MM/YYYYY');
            let aux2 = moment(item.receptionDate, 'YYYYMMDD');
            item.receptionDate = aux2.format('DD/MM/YYYYY');
         }
         if (this.totalGpiDates === 4) {
           this.sizeCol = 3;
         } else if (this.totalGpiDates === 3) {
          this.sizeCol = 4;
         } else if (this.totalGpiDates === 2) {
          this.sizeCol = 6;
         } else if (this.totalGpiDates === 1)  {
          this.sizeCol = 12;
         }
      }, error: _err => {
        this.isVisibleGpi = false;
        this.globalService.info('GPI', 'No existen Datos que mostrar.');
      }});
  }

  handleSubmit() {
    this.isVisibleFormDetail = true;
  }

  handleCloseFormDetail() {
    this.isVisibleFormDetail = false;
  }
}
