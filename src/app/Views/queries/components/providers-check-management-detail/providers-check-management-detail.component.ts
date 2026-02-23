import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ProvidersCheckManagementData } from '../../../../Services/providersCheckManagement/models/providers-check-management-data';
import { ProvidersCheckManagementService } from '../../../../Services/providersCheckManagement/providers-check-management.service';
import { GlobalService } from '../../../../Services/shared/global.service';
import { MassivePaymentsSpreadsheetsDto } from '../../../../Services/mass-payments/Models/massive-payments-spreadsheets-dto';

@Component({
  selector: 'app-providers-check-management-detail',
  standalone: false,
  templateUrl: './providers-check-management-detail.component.html',
  styleUrls: ['./providers-check-management-detail.component.css'],
  providers: [ProvidersCheckManagementService]
})
export class ProvidersCheckManagementDetailComponent implements OnInit, OnChanges {
  @Input() batchId!: number;
  detail: ProvidersCheckManagementData = new ProvidersCheckManagementData();
  payments: ProvidersCheckManagementData = new ProvidersCheckManagementData();
  rowsPerPage: number[] = [5, 10, 15, 20, 25];
  pageItems = 5;

  constructor(private providersCheckManagementService: ProvidersCheckManagementService, private globalService: GlobalService) { }

  ngOnInit() {
    /*This is intentional*/
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.providersCheckManagementService.getPaymentDetail(new MassivePaymentsSpreadsheetsDto({ id: this.batchId }))
      .subscribe({next: response => {
        this.detail = response;
        this.handlePageChanged(1);
      }, error: _err =>
       this.globalService.danger('Proveedores Cheque Gerencia', _err.message)});
  }

  handlePageChanged($event: number) {
    this.payments.spreadsheet = this.detail.spreadsheet.slice((($event - 1) * this.pageItems), this.pageItems * $event);
  }

  handleViewRows($event: string) {
    this.pageItems = +$event;
    this.handlePageChanged(0);
  }
}
