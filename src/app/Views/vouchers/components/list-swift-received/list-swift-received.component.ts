import { Component, OnInit, Input } from '@angular/core';
import { OperationReceivedResult } from '../../../../Services/transfers-abroad/models/operation-received-result';
import { TransferAbroadSwiftReportReceivedDto } from '../../../../Services/transfers-abroad/models/transfer-abroad-swift-report-received-dto';
import { TransfersAbroadService } from '../../../../Services/transfers-abroad/transfer-abroad.service';
import { GlobalService } from '../../../../Services/shared/global.service';
import { UtilsService } from '../../../../Services/shared/utils.service';

@Component({
  selector: 'app-list-swift-received',
  standalone: false,
  templateUrl: './list-swift-received.component.html',
  styleUrls: ['./list-swift-received.component.css'],
  providers: [UtilsService]
})
export class ListSwiftReceivedComponent implements OnInit {

  @Input() received!: OperationReceivedResult[];
  @Input() message!: string;
  constructor(private transfersAbroadService: TransfersAbroadService,
    private globalService: GlobalService,
    private utilsService: UtilsService) { }

  ngOnInit() {
    /*This is intentional*/
  }

  handleGetReport($event: OperationReceivedResult) {
    const request: TransferAbroadSwiftReportReceivedDto = {
      account: $event.beneficiaryClientTwoOfFive,
      clientOrderingOneOfFive: $event.clientOrderingOneOfFive,
      messageId: $event.messageId,
      reference: $event.reference
    };
    this.transfersAbroadService.getReportReceived(request)
      .subscribe({next: (resp: Blob) => {
        this.utilsService.donwloadReport('SwiftReceived.pdf', resp);
      }, error: _err => this.globalService.danger('Fallo del Servicio: ', _err.message)});
  }
}
