import { Component, OnInit, Input, SimpleChanges, OnChanges } from '@angular/core';
import { ClaimRequestService } from '../../../../Services/claimRequest/claim-request.service';
import { GlobalService } from '../../../../Services/shared/global.service';
import { ClaimRequestDetail } from '../../../../Services/claimRequest/models/claim-request-detail';
import { ClaimRequestSpreadsheetsDto } from '../../../../Services/claimRequest/models/claim-request-spreadsheets-dto';
import  moment from 'moment';

@Component({
  selector: 'app-claim-request-detail',
  standalone: false,
  templateUrl: './claim-request-detail.component.html',
  styleUrls: ['./claim-request-detail.component.css'],
  providers: [ClaimRequestService]
})
export class ClaimRequestDetailComponent implements OnInit, OnChanges {

  @Input() batchId!: number;
  detail: ClaimRequestDetail = new ClaimRequestDetail();

  constructor(private claimRequestService: ClaimRequestService, private globalService: GlobalService) { }

  ngOnInit() {
    /*This is intentional*/
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.claimRequestService.getDetail(new ClaimRequestSpreadsheetsDto({ id: this.batchId }))
      .subscribe({next: response => {
        this.detail = response;
        this.detail.transactionDate = this.detail.transactionDate.trim() !== '' ? moment(this.detail.transactionDate).format('DD-MM-YYYY') : '';
        this.detail.transactionTime = this.detail.transactionTime.trim() !== '' ? moment(this.detail.transactionTime, 'HHmmA').format('HH:mm:A') : '';
      }, error: _err => this.globalService.danger('Detalle Reclamos. ', _err.message)});
  }

}
