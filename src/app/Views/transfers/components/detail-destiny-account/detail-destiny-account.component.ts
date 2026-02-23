import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { TransferAbroadDetailDto } from '../../../../Services/transfers-abroad/models/transfer-abroad-detail-dto';
import { Constants } from '../../../../Services/shared/enums/constants';

@Component({
  selector: 'app-detail-destiny-account',
  standalone: false,
  templateUrl: './detail-destiny-account.component.html',
  styleUrls: ['./detail-destiny-account.component.css']
})
export class DetailDestinyAccountComponent implements OnInit, OnChanges {

  @Input() detail: TransferAbroadDetailDto = new TransferAbroadDetailDto();
  constants: Constants = new Constants;
  documentType!: string;

  constructor() {
    /*This is intentional*/
  }

  ngOnInit() {
    /*This is intentional*/
  }

  ngOnChanges() {
    if (this.detail) {
      this.documentType = this.constants.documentTypes.find(x => x.value === this.detail.beneficiaryDocumentType).name;
    }
  }

}
