import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { BallotOfWarrantyDto } from '../../../../Services/new-ballot-of-warranty/models/ballot-of-warranty-dto';
import { GlobalService } from '../../../../Services/shared/global.service';
import { GetBatchDto } from '../../../../Services/ballot-of-warranty/models/get-batch-dto';
import { UtilsService } from '../../../../Services/shared/utils.service';
import { NewBallotOfWarrantyService } from '../../../../Services/new-ballot-of-warranty/new-ballot-of-warranty.service';

@Component({
  selector: 'app-new-ballot-of-warranty-detail',
  standalone: false,
  templateUrl: './new-ballot-of-warranty-detail.component.html',
  styleUrls: ['./new-ballot-of-warranty-detail.component.css'],
  providers: [NewBallotOfWarrantyService]
})
export class NewBallotOfWarrantyDetailComponent implements OnInit {

  @Input() batchId!: number;
  detailBallot: BallotOfWarrantyDto = new BallotOfWarrantyDto();
  detail: BallotOfWarrantyDto = new BallotOfWarrantyDto();

  constructor(private newBallotOfWarrantyService: NewBallotOfWarrantyService, private utilsService: UtilsService, private globalService: GlobalService) { }

  ngOnInit() {
    /*This is intentional*/
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.newBallotOfWarrantyService.getDetail(new GetBatchDto({ id : this.batchId }))
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
      }, error:_err => this.globalService.danger('Boleta de Garantía', _err.message)});
  }

}
