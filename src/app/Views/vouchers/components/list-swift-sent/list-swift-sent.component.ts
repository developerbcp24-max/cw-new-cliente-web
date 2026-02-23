import { Component, OnInit, Input } from '@angular/core';
import { TransferAbroadSwiftResult } from '../../../../Services/transfers-abroad/models/transfer-abroad-swift-result';
import { TransfersAbroadService } from '../../../../Services/transfers-abroad/transfer-abroad.service';
import { TransferAbroadSwiftReportDto } from '../../../../Services/transfers-abroad/models/transfer-abroad-swift-report-dto';
import { GlobalService } from '../../../../Services/shared/global.service';
import { UtilsService } from '../../../../Services/shared/utils.service';

@Component({
  selector: 'app-list-swift-sent',
  standalone: false,
  templateUrl: './list-swift-sent.component.html',
  styleUrls: ['./list-swift-sent.component.css'],
  providers: [TransfersAbroadService, UtilsService]
})
export class ListSwiftSentComponent implements OnInit {

  @Input() swifts: TransferAbroadSwiftResult[] = [];

  constructor(private transfersAbroadService: TransfersAbroadService,
    private globalService: GlobalService,
    private utilsService: UtilsService) { }

  ngOnInit() {
    /*This is intentional*/
  }

  handleGetReport(detail: TransferAbroadSwiftResult) {
    const dataReport: TransferAbroadSwiftReportDto = new TransferAbroadSwiftReportDto();
    dataReport.processBatchId = detail.processBatchId == null ? 0 : detail.processBatchId;
    dataReport.operationNumber = detail.processBatchId == null ? detail.operationNumber : detail.referenceSender;
    dataReport.isSwift = detail.processBatchId == null ? true : false;

    this.transfersAbroadService.getReportSender(dataReport)
      .subscribe({next: (resp: Blob) => {
        this.utilsService.donwloadReport(`swift${(dataReport.isSwift ? dataReport.operationNumber : dataReport.processBatchId)}` + '.pdf', resp);
      }, error: _err => this.globalService.danger('Fallo del Servicio: ', _err.message)});
  }
}
