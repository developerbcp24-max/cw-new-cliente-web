import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ConfigNewServicePaseResult } from '../../../../Services/new-pase/models/config-new-service-pase-result';
import { GetDebtsResult } from '../../../../Services/new-pase/models/get-debts-result';
import { GetServicesResult } from '../../../../Services/new-pase/models/get-services-result';
import { NewPaseDto } from '../../../../Services/new-pase/models/new-pase-dto ';
import { NewPasePaymentDto } from '../../../../Services/new-pase/models/new-pase-payment-dto';
import { NewPaseService } from '../../../../Services/new-pase/new-pase.service';
import { GetDebtsDto } from '../../../../Services/service-pase/models/get-debts-dto';
import { Constants } from '../../../../Services/shared/enums/constants';
import { GlobalService } from '../../../../Services/shared/global.service';

@Component({
  selector: 'app-add-debt',
  standalone: false,
  templateUrl: './add-debt.component.html',
  styleUrls: ['./add-debt.component.css'],
  providers: [NewPaseService]
})
export class AddDebtComponent implements OnInit {

  lastChecked = -1
  @Input() telephoneNumber: any = [];
  @Input() getServicesResult: GetServicesResult[] = [];
  @Input() showDetailForm = false;
  @Input() newPaseDto!: NewPaseDto;
  @Output() onChange: EventEmitter<any> = new EventEmitter();
  @Output() onChangeDebts: EventEmitter<any> = new EventEmitter();
  @ViewChild('detailForm') detailForm!: NgForm;
  @Input() getDebtsDto: GetDebtsDto = new GetDebtsDto();
  @Input() resultParameters: GetServicesResult = new GetServicesResult();
  getDebtsResult: GetDebtsResult[] = [];
  @Input() configurationResult: ConfigNewServicePaseResult[] = [];
  configurationHead: ConfigNewServicePaseResult = new ConfigNewServicePaseResult();
  configurationDetail: ConfigNewServicePaseResult = new ConfigNewServicePaseResult();
  debtsDetailNewPase: GetDebtsResult = new GetDebtsResult();
  debtsDetail: GetDebtsResult = new GetDebtsResult();
  newPasePaymentDto: NewPasePaymentDto[] = [];
  isDetail = false;
  showDetailDebts = false;
  line = 0;
  totalParameters = 0;
  constants: Constants = new Constants();
  isTigo = false;
  showTab1 = false;
  showTab2 = false;
  arraySelect = [];
  isInput = false;
  pendingDebt = 0;
  cuotaDescription: any;

  constructor(private newPaseService: NewPaseService, private globalService: GlobalService) { }

  ngOnInit() {
    /*This is intentional*/
  }

  ngOnChanges(_changes: SimpleChanges): void {
    if (this.showDetailForm && this.getDebtsDto.serviceCode != undefined) {
      this.getDebtsResult = [];
      this.showDetailDebts = false;
      this.debtsDetailNewPase = new GetDebtsResult();
      this.handleChangeServiceType();
    } else {
      this.getDebtsResult = [];
      this.showDetailDebts = false;
      this.debtsDetailNewPase = new GetDebtsResult();
    }
    this.totalParameters = this.resultParameters.parameters.length;
  }

  handleChangeServiceType() {
    this.getDebtsDto.billingType = '';
    this.arraySelect = [];
    this.showTab1 = this.showTab2 = false;
    if (this.getServicesResult.length > 0) {
      this.resultParameters = this.getServicesResult.find(x => x.serviceCode == this.getDebtsDto.serviceCode)!;
      for (let item of this.resultParameters.parameters) {
        item.parameterType = item.parameterType!.toLowerCase();
        if (item.parameterType.includes('combo')) {
          item.arraySelect = [];
          let list = item.values!.split('|');
          for (let det of list) {
            let res = det.split(':');
            item.arraySelect.push({ name: res[0], value: res[1] });
          }
        }
      }
      this.getDebtsDto.billingType = this.resultParameters.billingType;
      this.totalParameters = this.resultParameters.parameters.length;
    }
  }

  handleCancel() {
    this.showDetailForm = false;
    this.onChange.emit(this.showDetailForm);
  }

  handleSearchDebts() {
    this.showDetailDebts = false;
    this.getDebtsResult = [];
    this.newPasePaymentDto = [];
    this.globalService.validateAllFormFields(this.detailForm.form);
    if (this.detailForm.valid) {
      this.getDebtsDto.companyCode = this.newPaseDto.companyCode;
      this.getDebtsDto.parameters = this.telephoneNumber[0].toString().trim();
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
          if (this.getDebtsResult.length > 0){
            this.cuotaDescription = this.getDebtsResult[0];
            this.debtsDetailNewPase.debts = this.getDebtsResult[0].debts;
          }
          if (this.getDebtsDto.companyCode == '762' && this.getDebtsDto.serviceCode == '002') {
            let resp = response[0].debts[0];
            this.getDebtsResult[0].debts = [];
            this.getDebtsResult[0].debts.push(resp);
          }
          this.handleGetConfiguration();
        }, error: _err => {
          this.globalService.info('Pago de Servicio: ', _err.message);
        }});
    }
  }

  handleChangeCuota($event: any){
    this.debtsDetailNewPase = new GetDebtsResult();
    this.debtsDetailNewPase = $event;
    this.cuotaDescription = [];
    this.cuotaDescription = this.debtsDetailNewPase;
    this.handleShowDetailDebts(this.cuotaDescription);
  }

  handleGetConfiguration() {
    this.isDetail = false
    this.configurationHead = this.configurationDetail = new ConfigNewServicePaseResult();
    this.configurationHead = this.configurationResult.find(x => !x.isDetail)!;
    if (this.configurationDetail != undefined) {
      if (this.configurationHead.debtSelected) {
        this.showTab1 = false;
        this.showTab2 = true;
      } else {
        this.showTab1 = true;
        this.showTab2 = true;
      }
      if (this.configurationHead.debtSelected) {
        this.configurationDetail = this.configurationHead;
          this.handleShowDetailDebts(this.cuotaDescription);

        if (this.isTigo) {
          this.showDetailDebts = false;
          this.globalService.info('Nota : ', 'Agrege el Crédito a cargar');
        }
      }
    }
  }

  handleShowDetailDebts($event: GetDebtsResult) {
    this.showDetailDebts = true;
    this.isInput = false;
    this.debtsDetailNewPase = $event;
    if (this.configurationHead.isSelectedAll) {
      this.debtsDetailNewPase.debts.forEach(x => x.isSelected = true);
    }
    let newName = this.debtsDetailNewPase.clientName;
    if (newName == null || newName == undefined || newName.trim() == '') {
      newName = '';
    } else {
      if (newName.length > 5) {
        newName = this.debtsDetailNewPase.clientName.trim().substring(0, 5);
      }
    }
    this.handleCompleteShow(newName);
  }

  handleCompleteShow(newName: string){
    for (let item of this.debtsDetailNewPase.debts) {
      if (item.amount == 0 || this.configurationHead.isEditable) {
        this.isInput = true;
      }
      if (item.endDate.includes('1/1/1900')) {
        item.endDate = '----';
      }
      for (let det of item.paymentInformation) {
        if (item.information == undefined || item.information == '') {
          item.information = det;
        }
        if (!item.information.includes(newName)) {
          item.information = 'Cliente: ' + this.debtsDetailNewPase.clientName + ', ' + item.information;
        } else {
          if (!item.information.includes(det))
            item.information = item.information + ', ' + det;
        }
      }
      if (item.information!.includes(',')) {
        item.information = item.information!.split(',').join('<br>');
      }
    }
  }

  validateDebts(debt: any) {
    let result = true;
    if (this.configurationDetail.isSelectedAll) {
      result = true;
    } else if (this.configurationDetail.validateQuotaNumber) {
      this.debtsDetailNewPase.debts.forEach((value) => {
        if ((!value.isSelected || typeof value.isSelected == 'undefined') && value.quotaNumber < debt.quotaNumber) {
          result = false;
        }
      });
    }
    return result;
  }

  disabledCheck($event: any, $event2: any){
    if (!$event2){
      if (this.configurationDetail.validateQuotaNumber) {
        this.debtsDetailNewPase.debts.forEach((value) => {
          if (value.quotaNumber > $event.quotaNumber) {
            $event.isSelected = false;
            value.isSelected = false;
          }
        });
      }
    }
  }

  handleAddDebts() {

    if (this.isTigo) {
      this.debtsDetailNewPase.debts.forEach(x => x.isSelected = true);
    }
    this.newPasePaymentDto = [];
    if (this.debtsDetailNewPase.debts.length > 0) {
      this.line = this.newPasePaymentDto.length > 0 ? Math.max.apply(null, this.newPasePaymentDto.map(item => item.line)) : 0;
      for (let item of this.debtsDetailNewPase.debts) {
        this.line = this.line + 1;
        this.handleSearNow(item);
      }
    } else {
      this.globalService.info('Pago de Servicio: ', 'Debe seleccionar al menos una deuda.');
    }
    if (this.newPasePaymentDto.length > 0) {
      this.showDetailForm = false;
      this.onChangeDebts.emit(this.newPasePaymentDto);
    } else {
      this.globalService.info('Pago de Servicio: ', 'Debe seleccionar al menos una deuda.');
    }
  }

  handleSearNow(item: any){
    if (item.isSelected) {
      let valid = this.newPasePaymentDto.find(x => x.parameters == this.getDebtsDto.parameters && x.amount == item.amount && x.period == item.paymentInformation[0]);
      if (valid == undefined) {
        this.newPasePaymentDto.push({
          line: this.line,
          clientName: this.debtsDetailNewPase.clientName,
          serviceCode: this.getDebtsDto.serviceCode,
          parameters: this.getDebtsDto.parameters,
          paymentDetailId: this.debtsDetailNewPase.datilPaymentId,
          descriptionPayment: this.debtsDetailNewPase.paymentDescription,
          phoneNumber: '',
          email: '',
          billingType: this.getDebtsDto.billingType,
          documentExtension: '',
          iDCComplement: '',
          documentNumber: '',
          documentType: '',
          information: item.information,
          detailDescription: '--',
          numberQuote: item.quotaNumber,
          amount: Number(item.amount),
          paymentInformation: item.paymentInformation,
          companyCode: this.newPaseDto.companyCode,
          period: this.configurationDetail.isPeriod && this.configurationDetail.endDate ? item.period : item.paymentInformation[0]
        });
      }
    }
  }

}
