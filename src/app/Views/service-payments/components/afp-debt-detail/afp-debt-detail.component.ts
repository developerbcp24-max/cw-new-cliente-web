import { Component, OnInit, OnChanges, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { ResponseModelsAfpquery } from '../../../../Services/AFP/Models/response-models-afpquery';
import { GlobalService } from '../../../../Services/shared/global.service';

@Component({
  selector: 'app-afp-debt-detail',
  standalone: false,
  templateUrl: './afp-debt-detail.component.html',
  styleUrls: ['./afp-debt-detail.component.css']
})
export class AfpDebtDetailComponent implements OnInit, OnChanges {

  @Input() ResponseModelsAfp!: ResponseModelsAfpquery;
  @Input() disabled: boolean;
  public periodo!: string;
  public TCI!: number;
  public numberFeeTCI!: number;
  public TVP!: number;
  public numberFeeTVP!: number;
  public TVL!: number;
  public numberFeeTVL!: number;
  public TSOL!: number;
  public numberFeeTSOL!: number;
  public Total!: number;
  public isvisible!: boolean;


  constructor(private globalService: GlobalService) {
    this.disabled=false;
  }

  ngOnInit() {
    /*This is intentional*/
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.periodo = this.ResponseModelsAfp.detail.detailDpaymentAFP[0].expirationDate;

    if (this.ResponseModelsAfp.detail.detailDpaymentAFP[0].accountNumberAFP == 1) {
      this.TCI = this.ResponseModelsAfp.detail.detailDpaymentAFP[0].amounts;
      this.numberFeeTCI = this.ResponseModelsAfp.detail.detailDpaymentAFP[0].accountNumberAFP;

    }
    if (this.ResponseModelsAfp.detail.detailDpaymentAFP[1].accountNumberAFP == 2) {
      this.TVP = this.ResponseModelsAfp.detail.detailDpaymentAFP[1].amounts;
      this.numberFeeTVP = this.ResponseModelsAfp.detail.detailDpaymentAFP[1].accountNumberAFP;
    }
    if (this.ResponseModelsAfp.detail.detailDpaymentAFP[2].accountNumberAFP == 4) {
      this.TVL = this.ResponseModelsAfp.detail.detailDpaymentAFP[2].amounts;
      this.numberFeeTVL = this.ResponseModelsAfp.detail.detailDpaymentAFP[2].accountNumberAFP;
      this.isvisible=true;
    }
    else
    {
      if (this.ResponseModelsAfp.detail.detailDpaymentAFP[2].accountNumberAFP == 3) {
      this.TSOL = this.ResponseModelsAfp.detail.detailDpaymentAFP[2].amounts;
      this.numberFeeTSOL = this.ResponseModelsAfp.detail.detailDpaymentAFP[2].accountNumberAFP;
      this.isvisible=false;
      }
    }
    this.Total = this.ResponseModelsAfp.detail.amountTotal;
  }

}
