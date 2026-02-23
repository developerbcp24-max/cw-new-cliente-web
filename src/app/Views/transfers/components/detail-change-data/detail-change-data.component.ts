import { Component, OnInit, Input } from '@angular/core';
import { TransferAbroadResult } from '../../../../Services/transfers-abroad/models/transfer-abroad-result';
import { TransferAbroadDetailDto } from '../../../../Services/transfers-abroad/models/transfer-abroad-detail-dto';

@Component({
  selector: 'app-detail-change-data',
  standalone: false,
  templateUrl: './detail-change-data.component.html',
  styleUrls: ['./detail-change-data.component.css']
})
export class DetailChangeDataComponent implements OnInit {

  @Input() transfer: TransferAbroadResult = new TransferAbroadResult();
  @Input() detail: TransferAbroadDetailDto = new TransferAbroadDetailDto();

  constructor() {/*This is intentional*/ }

  ngOnInit() {
    /*This is intentional*/
  }

}
