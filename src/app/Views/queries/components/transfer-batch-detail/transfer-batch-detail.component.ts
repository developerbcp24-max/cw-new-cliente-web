import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { TransfersService } from '../../../../Services/transfers/transfers.service';
import { TransferDetail } from '../../../../Services/transfers/models/transfer-detail';
import { BatchIdDto } from '../../../../Services/transfers/models/batch-id-dto';
import { GlobalService } from '../../../../Services/shared/global.service';
import { ParametersService } from '../../../../Services/parameters/parameters.service';
import { ParameterDto } from '../../../../Services/parameters/models/parameter-dto';
import { of } from 'rxjs';
import { switchMap, catchError, map } from 'rxjs/operators';

@Component({
  selector: 'app-transfer-batch-detail',
  standalone: false,
  templateUrl: './transfer-batch-detail.component.html',
  styleUrls: ['./transfer-batch-detail.component.css'],
  providers: [TransfersService],
})
export class TransferBatchDetailComponent implements OnChanges {
  detail: TransferDetail = new TransferDetail();
  @Input() batchId!: number;
  private currencyMap: Record<string, string> = {
    'BOL': 'Bolivianos',
    'USD': 'Dólares',
    'EUR': 'Euros'
  };

  constructor(
    private transfersService: TransfersService,
    private globalService: GlobalService,
    private paramService: ParametersService
  ) {}

  ngOnChanges(_: SimpleChanges): void {
    if (!this.batchId) return;

    this.transfersService.getDetail(new BatchIdDto({ batchId: this.batchId }))
      .pipe(
        switchMap(detail => {
          this.detail = detail;
          if (!detail.currency) {
            this.detail.currency = 'Desconocido';
            return of(this.detail);
          }
          if (this.currencyMap[detail.currency]) {
            this.detail.currency = this.currencyMap[detail.currency];
            return of(this.detail);
          }
          return this.paramService.getByGroupAndCode(
            new ParameterDto({ group: 'MONTRS', code: detail.currency })
          ).pipe(
            map(resp => {
              this.detail.currency = resp.description ?? 'Desconocido';
              return this.detail;
            }),
            catchError(err => {
              //console.warn(`Parámetro de moneda no encontrado: ${detail.currency}`, err);

              this.globalService.danger('Transferencias', 'No se encontró la información de la moneda.');
              this.detail.currency = 'Desconocido';
              return of(this.detail);
            })
          );
        })
      )
      .subscribe();
  }
}
