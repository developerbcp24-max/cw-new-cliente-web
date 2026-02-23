import { Component, OnInit, OnChanges, Input, SimpleChanges } from '@angular/core';
import { HistoricalAccountsService } from '../../../../Services/historical-accounts/historical-accounts.service';
import { GlobalService } from '../../../../Services/shared/global.service';
import { HistoricalDetail } from '../../../../Services/historical-accounts/models/historical-detail';
import { ProcessBatchBasic } from '../../../../Services/historical-accounts/models/process-batch-basic';
import moment, { Moment } from 'moment';

@Component({
  selector: 'app-historical-account-detail',
  standalone: false,
  templateUrl: './historical-account-detail.component.html',
  styleUrls: ['./historical-account-detail.component.css'],
  providers: [HistoricalAccountsService]
})
export class HistoricalAccountDetailComponent implements OnInit, OnChanges {

  @Input() batchId!: number;
  detail: HistoricalDetail = new HistoricalDetail();
  historics: HistoricalDetail = new HistoricalDetail();
  rowsPerPage: number[] = [5, 10, 15, 20, 25];
  pageItems = 5;

  constructor(private historicalAccountsService: HistoricalAccountsService,
    private globalService: GlobalService) { }

  ngOnInit() {

  }

  ngOnChanges(changes: SimpleChanges): void {
    this.historicalAccountsService.getDetail(new ProcessBatchBasic({ id: this.batchId }))
      .subscribe({next: response => {
        this.detail = response;
        this.detail.certificateTransacDetails = this.detail.certificateTransacDetails.filter(x => x.movementDate = moment(x.movementDate).format('DD-MM-YYYY'));
        this.detail.certificateTransacDetails = this.detail.certificateTransacDetails.filter(x => x.movementHour = moment(x.movementHour, 'HHmmss').format('HH:mm:ss'));
      }, error: _err => this.globalService.danger('Detalle historicos. ', _err.message)});
  }

  handlePageChanged($event: number) {
    this.historics.certificateTransacDetails = this.detail.certificateTransacDetails.slice((($event - 1) * this.pageItems), this.pageItems * $event);
  }

  handleViewRows($event: string) {
    this.pageItems = +$event;
    this.handlePageChanged(0);
  }

}
