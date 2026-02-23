import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { RuatService } from '../../../../Services/ruat/ruat.service';
import { RuatDto } from '../../../../Services/ruat/models/ruat-dto';
import { VehicleDebtResult } from '../../../../Services/ruat/models/vehicle-debt-result';
import { GlobalService } from '../../../../Services/shared/global.service';
import { DebtDetail } from '../../../../Services/ruat/models/debt-detail';
import { RuatPayment } from '../../../../Services/ruat/models/ruat-payment';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-vehicle-debt',
  standalone: false,
  templateUrl: './vehicle-debt.component.html',
  styleUrls: ['./vehicle-debt.component.css'],
  providers: [RuatService]
})
export class VehicleDebtComponent implements OnInit {

  lastChecked: number = -1;
  ruatDto: RuatDto = new RuatDto({ criteria: 1 });
  ruatResponse!: VehicleDebtResult;
  @Input() disabled = false;
  @Input() batchInformation!: RuatPayment;
  @ViewChild('requestForm') form!: NgForm;

  constructor(private ruatService: RuatService, private globalService: GlobalService) { }

  ngOnInit() {
    /*This is intentional*/
  }

  handleSearch() {
    this.lastChecked = -1;
    this.batchInformation.payment.debtDetails = [];
    if (this.handleValidate()) {
      this.ruatService.getVehicleDebt(this.ruatDto)
        .subscribe({next: response => {
          this.ruatResponse = response;
          this.batchInformation.payment.serviceTypeInformation = response.vehicle;
        }, error: _err => this.globalService.warning('Servicio RUAT', _err.message)});
    }
  }

  handleValidate() {
    this.globalService.validateAllFormFields(this.form.form);
    return this.form.valid;
  }

  handlePtaNumberChanged() {
    this.batchInformation.amount = 0;
    this.ruatResponse = undefined!;
  }

  restartForm() {
    this.ruatDto = new RuatDto({ criteria: 1 });
    this.handlePtaNumberChanged();
  }

  handleDetailChecked(debt: DebtDetail) {
    this.addOrRemoveDebts(debt);
  }

  addOrRemoveDebts(debtDetail: DebtDetail) {
    const debtIndex = this.ruatResponse.debtDetail.filter(x => x.isPaymentPossible).findIndex(x => x === debtDetail);
    if ((debtDetail.selected && debtIndex === this.lastChecked + 1) || (!debtDetail.selected && debtIndex === this.lastChecked)) {
      if (!debtDetail.selected) {
        this.lastChecked--;
        this.batchInformation.payment.debtDetails.pop();
      } else {
        this.lastChecked++;
        this.batchInformation.payment.debtDetails.push(debtDetail);
      }
    } else {
      this.globalService.warning('Selección incorrecta de deuda', 'Debe seleccionar las deudas pasadas.')
      setTimeout(() => { debtDetail.selected = !debtDetail.selected; }, 70);
    }
    this.batchInformation.amount = Math.round((this.batchInformation.payment.debtDetails.reduce((sum, item) => sum + item.amount, 0)) * 1e12) / 1e12;
  }
}
