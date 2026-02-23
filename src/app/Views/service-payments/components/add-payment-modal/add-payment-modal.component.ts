import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { GetDebtsResult } from '../../../../Services/new-pase/models/get-debts-result';
import { GetServicesResult } from '../../../../Services/new-pase/models/get-services-result';
import { NewPaseDto } from '../../../../Services/new-pase/models/new-pase-dto ';
import { NewPasePaymentDto } from '../../../../Services/new-pase/models/new-pase-payment-dto';
import { NewPaseService } from '../../../../Services/new-pase/new-pase.service';
import { GetDebtsDto } from '../../../../Services/service-pase/models/get-debts-dto';
import { Constants } from '../../../../Services/shared/enums/constants';
import { ServiceTypes } from '../../../../Services/shared/enums/service-types';
import { GlobalService } from '../../../../Services/shared/global.service';

@Component({
  selector: 'app-add-payment-modal',
  standalone: false,
  templateUrl: './add-payment-modal.component.html',
  styleUrls: ['./add-payment-modal.component.css'],
  providers: [NewPaseService]
})
export class AddPaymentModalComponent implements OnInit {

  @Input() isYpfb = false;
  @Input() amountDebts = 0;
  line = 0;
  @Input() totalDebts = 0;
  @Input() showDetailForm = false;
  @Input() newPaseDto!: NewPaseDto;
  @Input() getServicesResult: GetServicesResult[] = [];
  @Input() serviceCode: any;
  @Input() telephoneNumber: any = [];
  @Input() resultParameters: GetServicesResult = new GetServicesResult();
  @Input() newPasePaymentDto: NewPasePaymentDto[] = [];
  @Output() onChangeAmount: EventEmitter<any>;
  @Output() onChangeDebts: EventEmitter<any>;
  @ViewChild('detailForm') detailForm!: NgForm;
  getDebtsDto: GetDebtsDto = new GetDebtsDto();
  getDebtsResult: GetDebtsResult[] = [];
  showDetailDebts = false;
  debtsDetailCotas: GetDebtsResult = new GetDebtsResult();
  amountAndTotal: any = [];
  constants: Constants = new Constants();
  currency!: string;
  showTab1 = false;
  showTab2 = false;
  showTab3 = false;
  showTab4 = false;

  constructor(private newPaseService: NewPaseService, private globalService: GlobalService) {
    this.onChangeAmount = new EventEmitter();
    this.onChangeDebts = new EventEmitter();
  }

  ngOnInit() {
    this.getServicesResult = [];
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.showDetailForm && this.serviceCode == undefined) {
      this.handleAddRow();
    } else if (this.showDetailForm && this.serviceCode !== undefined) {
      this.getDebtsResult = [];
      this.showDetailDebts = false;
      this.getDebtsDto.serviceCode = this.serviceCode;
    }
  }

  handleChangeServiceType() {
    this.resultParameters = this.getServicesResult.find(x => x.serviceCode == this.getDebtsDto.serviceCode)!;
  }

  handleShowTableType() {
    this.showTab1 = this.showTab2 = this.showTab3 = this.showTab4 = false;
    switch (this.newPaseDto.companyCode) {
      case ServiceTypes.Cotas.toString():
      case ServiceTypes.Axs.toString():
        this.showTab1 = true;
        this.showTab3 = true;
        break;
      case ServiceTypes.Comteco.toString():
        this.showTab1 = true;
        this.showTab4 = true;
        break;
      default:
        if (this.constants.branchOfficesPase.find(x => x.value == this.newPaseDto.companyCode)) {
          this.showTab2 = true;
          this.showTab4 = true;
        }
        break;
    }
  }

  handleSearchCodeCotas() {
    if (this.resultParameters.descriptionCode == undefined) {
      this.handleChangeServiceType();
    }
    this.getDebtsResult = [];
    this.showDetailDebts = false;
    this.globalService.validateAllFormFields(this.detailForm.form);
    if (this.detailForm.valid) {
      this.getDebtsDto.companyCode = this.newPaseDto.companyCode;
      this.getDebtsDto.parameters = this.telephoneNumber[0].trim();
      if (this.telephoneNumber.length > 1) {
        for (let item of this.telephoneNumber) {
          if (this.getDebtsDto.parameters != item) {
            this.getDebtsDto.parameters = this.getDebtsDto.parameters.trim() + '*' + item.trim();
          }
        }
      }
      this.newPaseService.getDebtsNewPase(this.getDebtsDto)
        .subscribe({next: response => {
          this.getDebtsResult = response;
          if (this.newPaseDto.companyCode == ServiceTypes.Comteco.toString()) {
            this.getDebtsResult.forEach(x => x.paymentDescription = this.resultParameters.descriptionCode);
          }
          if (this.newPaseDto.companyCode == ServiceTypes.Axs.toString()) {
            for (let item of this.getDebtsResult) {
              let det = item.datilPaymentId.split('-');
              item.datilPaymentId = det[0];
            }
          }
          this.handleShowTableType();
        }, error: _err => {
          this.globalService.info('Pago de Servicio: ', 'No existen deudas.');
          //console.log(_err.message);
        }});
    }
  }

  handleShowDetailDebts($event: GetDebtsResult) {
    this.showDetailDebts = true;
    this.debtsDetailCotas = $event;
    for (let item of this.debtsDetailCotas.debts) {
      if (this.newPaseDto.companyCode == ServiceTypes.Axs.toString()) {
        this.currency = this.debtsDetailCotas.currency.trim() == 'BOL' ? 'Bs' : 'Usd';
      } else if (!this.isYpfb) {
        let period = item.paymentInformation[0].split(':');
        item.paymentInformation[0] = period[1].trim();
        let contract = item.paymentInformation[2].split(':');
        item.paymentInformation[2] = contract[1].trim();
      } else if (this.isYpfb) {
        let period = item.paymentInformation[0].split(':');
        item.paymentInformation[0] = period[1].trim();
      }
    }
  }

  validateDebts(period: string) {
    let re = /[/-]/gi;
    period = this.newPaseDto.companyCode == ServiceTypes.Axs.toString() ? this.getPeriod(period) : period;
    let periodNumber = period.replace(re, '');
    periodNumber = periodNumber.trim();
    let newPeriod = Number(periodNumber);
    let result = true;
    this.debtsDetailCotas.debts.forEach((value, index) => {
      let aux = value.paymentInformation[0].replace(re, '').trim();
      let periodDetail = Number(aux);
      if ((value.isSelected == false || typeof value.isSelected == 'undefined') && periodDetail < newPeriod) {
        result = false;
      }
    });
    return result;
  }

  getPeriod($event: any) {
    let result = $event.split('-');
    let resp = '';
    for (let det of result) {
      if (det.includes('Period')) {
        let period = det.trim().split(' ');
        resp = period[1].trim();
      }
    }
    return resp;
  }

  handleGetPeriod() {
    for (let item of this.debtsDetailCotas.debts) {
      item.period = this.getPeriod(item.paymentInformation[0]);
    }
  }

  handleAddDebts() {
    this.amountAndTotal = [];
    if (this.debtsDetailCotas.debts.length > 0) {
      this.line = this.newPasePaymentDto.length > 0 ? Math.max.apply(null, this.newPasePaymentDto.map(item => item.line)) : 0;
      for (let item of this.debtsDetailCotas.debts) {
        this.line = this.line + 1;
        if (item.isSelected) {
          let valid = this.newPasePaymentDto.find(x => x.parameters == this.getDebtsDto.parameters && x.amount == item.amount && x.period == item.paymentInformation[0]);
          if (valid == undefined) {
            if (this.newPaseDto.companyCode == ServiceTypes.Axs.toString()) {
              this.handleGetPeriod();
            }
            this.newPasePaymentDto.push({
              line: this.line,
              clientName: this.debtsDetailCotas.clientName,
              serviceCode: this.getDebtsDto.serviceCode,
              parameters: this.getDebtsDto.parameters,
              paymentDetailId: this.debtsDetailCotas.datilPaymentId,
              descriptionPayment: this.isYpfb ? this.resultParameters.descriptionCode : this.debtsDetailCotas.paymentDescription,
              detailDescription: this.handleGetOperationType()!,
              numberQuote: item.quotaNumber,
              amount: item.amount,
              paymentInformation: item.paymentInformation,
              companyCode: this.newPaseDto.companyCode,
              period: this.newPaseDto.companyCode == ServiceTypes.Axs.toString() ? item.period : item.paymentInformation[0]
            });
            this.amountDebts = this.amountDebts + item.amount;
            this.showDetailForm = false;
          } else {
            this.globalService.info('Nota: ', ' La deuda ya fue agregada.');
          }
        }
      }
      this.totalDebts = this.newPasePaymentDto.length;
    } else {
      this.globalService.info('Pago de Servicio: ', 'Debe seleccionar al menos una deuda.');
    }
    this.handleEmit();
  }

  handleEmit() {
    this.newPaseDto.newPasePayments = this.newPasePaymentDto;
    this.amountAndTotal.push(
      {
        dto: this.newPasePaymentDto,
        total: this.totalDebts,
        amount: this.amountDebts,
        showModal: this.showDetailForm,
        line: this.line
      })
    this.onChangeAmount.emit(this.amountAndTotal);
    this.onChangeDebts.emit(this.newPaseDto);
  }

  handleCancel() {
    this.showDetailForm = false;
    this.onChangeAmount.emit(this.showDetailForm);
  }

  handleAddRow() {
    this.getDebtsDto.serviceCode = undefined!;
    this.resultParameters = new GetServicesResult();
    this.debtsDetailCotas = new GetDebtsResult();
    this.getDebtsResult = [];
    this.telephoneNumber = [];
    this.showDetailDebts = false;
  }

  handleGetOperationType() {
    if (this.isYpfb) {
      return this.constants.ypfbService;
    } else if (this.newPaseDto.companyCode == ServiceTypes.Cotas.toString()) {
      return this.constants.telephonyServiceCotas;
    } else if (this.newPaseDto.companyCode == ServiceTypes.Axs.toString()) {
      return this.constants.serviceAxs;
    } else if (this.newPaseDto.companyCode == ServiceTypes.Comteco.toString()) {
      return this.constants.serviceComteco;
    }
    return;
  }

}
