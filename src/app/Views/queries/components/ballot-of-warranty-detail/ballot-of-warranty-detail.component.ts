import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { BallotOfWarrantyDto } from '../../../../Services/ballot-of-warranty/models/ballot-of-warranty-dto';
import { GlobalService } from '../../../../Services/shared/global.service';
import { BallotOfWarrantyService } from '../../../../Services/ballot-of-warranty/ballot-of-warranty.service';
import { GetBatchDto } from '../../../../Services/ballot-of-warranty/models/get-batch-dto';
import { UtilsService } from '../../../../Services/shared/utils.service';

@Component({
  selector: 'app-ballot-of-warranty-detail',
  standalone: false,
  templateUrl: './ballot-of-warranty-detail.component.html',
  styleUrls: ['./ballot-of-warranty-detail.component.css'],
  providers: [BallotOfWarrantyService]
})
export class BallotOfWarrantyDetailComponent implements OnInit, OnChanges {

  @Input() batchId!: number;
  detailBallot: BallotOfWarrantyDto = new BallotOfWarrantyDto();
  detail: BallotOfWarrantyDto = new BallotOfWarrantyDto();

  constructor(private ballotOfWarrantyService: BallotOfWarrantyService, private utilsService: UtilsService, private globalService: GlobalService) { }

  ngOnInit() {
    /*This is intentional*/
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.ballotOfWarrantyService.getDetail(new GetBatchDto({ id : this.batchId }))
      .subscribe({next: response => {
        this.detail = response;
        this.detail.typeBallotOfWarranty = this.detail.typeBallotOfWarranty.trim();
        this.detail.personType = this.detail.personType.trim();
        this.detail.typeWarranty = this.detail.typeWarranty.trim();
        this.detail.object = this.detail.object.trim();
        this.detail.secondTitular = this.detail.secondTitular === '' ? '-' : this.detail.secondTitular;
        this.detail.secondDocumentCI = this.detail.secondDocumentCI === '' ? '-' : this.detail.secondDocumentCI;
        this.detail.thirdTitular = this.detail.thirdTitular === '' ? '-' : this.detail.thirdTitular;
        this.detail.thirdDocumentCI = this.detail.thirdDocumentCI === '' ? '-' : this.detail.thirdDocumentCI;
        this.detail.modality = this.detail.modality != null ? this.detail.modality.trim() : this.detail.modality;
      }, error: _err => this.globalService.danger('Boleta de Garantía', _err.message)});
  }
}
