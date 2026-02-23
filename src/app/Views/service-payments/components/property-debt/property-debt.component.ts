import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { Constants } from '../../../../Services/shared/enums/constants';
import { ParameterResult } from '../../../../Services/parameters/models/parameter-result';
import { RuatDto } from '../../../../Services/ruat/models/ruat-dto';
import { ParametersService } from '../../../../Services/parameters/parameters.service';
import { ParameterDto } from '../../../../Services/parameters/models/parameter-dto';
import { GlobalService } from '../../../../Services/shared/global.service';
import { NgForm } from '@angular/forms';
import { RuatService } from '../../../../Services/ruat/ruat.service';
import { PropertyDebtResult } from '../../../../Services/ruat/models/property-debt-result';
import { RuatPayment } from '../../../../Services/ruat/models/ruat-payment';
import { DebtDetail } from '../../../../Services/ruat/models/debt-detail';

@Component({
  selector: 'app-property-debt',
  standalone: false,
  templateUrl: './property-debt.component.html',
  styleUrls: ['./property-debt.component.css'],
  providers: [ParametersService, RuatService]
})
export class PropertyDebtComponent implements OnInit {

  lastChecked: number = -1;
  criterias!: ParameterResult[];
  cityHalls!: ParameterResult[];
  documentTypes!: ParameterResult[];
  documentExtensions = Constants.ruatDocumentExtensions;
  ruatDto: RuatDto = new RuatDto();
  ruatResponse!: PropertyDebtResult;
  @Input() disabled = false;
  @Input() batchInformation!: RuatPayment;
  @ViewChild('requestForm') form!: NgForm;

  constructor(private parametersService: ParametersService, private globalService: GlobalService, private ruatService: RuatService) { }

  ngOnInit() {
    this.getParameters();
    this.ruatDto.documentExtension = this.documentExtensions[0].value;
  }

  handleSearch() {
    this.handleFormChanged();
    this.batchInformation.payment.debtDetails = [];
    this.lastChecked = -1;
    if (this.handleValidate()) {
      this.ruatService.getPropertyDebt(this.ruatDto)
        .subscribe({next: response => {
          this.ruatResponse = response;
          this.batchInformation.payment.serviceTypeInformation = response.property;
          this.batchInformation.payment.serviceTypeInformation.criteria = this.ruatDto.criteria;
          this.batchInformation.payment.serviceTypeInformation.documentType = this.ruatDto.documentType;
          this.batchInformation.payment.serviceTypeInformation.documentNumber = this.ruatDto.documentNumber;
          this.batchInformation.payment.serviceTypeInformation.documentExtension = this.ruatDto.documentExtension;
        }, error: _err => this.globalService.danger('Servicio RUAT', _err.message, true)});
    }
  }

  handleValidate() {
    this.globalService.validateAllFormFields(this.form.form);
    return this.form.valid;
  }

  handleFormChanged() {
    this.batchInformation.amount = 0;
    this.ruatResponse = undefined!;
  }

  restartForm() {
    this.ruatDto = new RuatDto();
    this.ruatDto.documentExtension = this.documentExtensions[0].value;
    this.ruatDto.cityHallCode = this.cityHalls[0].value;
    this.ruatDto.criteria = this.criterias[0].value;
    this.ruatDto.documentType = this.documentTypes[0].value;
    this.handleFormChanged();
  }

  handleDetailChecked(debt: DebtDetail) {
    this.addOrRemoveDebts(debt);
  }

  addOrRemoveDebts(debtDetail: DebtDetail) {
    const debtIndex = this.ruatResponse.debtDetail.filter(x => x.isPaymentPossible).findIndex(x => x == debtDetail);
    if ((debtDetail.selected && debtIndex === this.lastChecked + 1) || (!debtDetail.selected && debtIndex == this.lastChecked)) {
      if (!debtDetail.selected) {
        this.lastChecked--;
        this.batchInformation.payment.debtDetails.pop();
      } else {
        this.lastChecked++;
        this.batchInformation.payment.debtDetails.push(debtDetail);
      }
    } else {
      this.globalService.warning('Selección incorrecta de deuda', 'Debe seleccionar las deudas pasadas.');
      setTimeout(() => { debtDetail.selected = !debtDetail.selected; }, 70);
    }
    this.batchInformation.amount = Math.round((this.batchInformation.payment.debtDetails.reduce((sum, item) => sum + item.amount, 0)) * 1e12) / 1e12;
  }

  getParameters() {
    this.parametersService.getByGroup(new ParameterDto({ group: 'RUATAL' }))
      .subscribe({next: response => {
        this.cityHalls = response;
        this.ruatDto.cityHallCode = this.cityHalls[0].value;
      }, error: _err => this.globalService.danger('Parámetros', _err.message)});

    this.parametersService.getByGroup(new ParameterDto({ group: 'RUATCR' }))
      .subscribe({next: response => {
        this.criterias = response;
        this.ruatDto.criteria = this.criterias[0].value;
      }, error: _err => this.globalService.danger('Parámetros', _err.message)});

    this.parametersService.getByGroup(new ParameterDto({ group: 'RUATD' }))
      .subscribe({next: response => {
        this.documentTypes = response;
        this.ruatDto.documentType = this.documentTypes[0].value;
      }, error: _err => this.globalService.danger('Parámetros', _err.message)});
  }

}
