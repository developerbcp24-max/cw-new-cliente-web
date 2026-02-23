import { Component, OnInit, Output, Input, EventEmitter, ViewChild, SimpleChanges } from '@angular/core';
import { Constants } from '../../../../Services/shared/enums/constants';
import { ParametersService } from '../../../../Services/parameters/parameters.service';
import { ParameterDto } from '../../../../Services/parameters/models/parameter-dto';
import { ParameterResult } from '../../../../Services/parameters/models/parameter-result';
import { GetDebtsClientEntelDto } from '../../../../Services/telephone-services/models/get-debts-client-entel-dto';
import { TelephoneServicesService } from '../../../../Services/telephone-services/telephone-services.service';
import { ClientDebtsEntelResult } from '../../../../Services/telephone-services/models/client-debts-entel-result';
import { GetClientResponse } from '../../../../Services/telephone-services/models/get-client-response';
import { EntelDto } from '../../../../Services/telephone-services/models/entel-dto';
import { NgForm } from '@angular/forms';
import { GlobalService } from '../../../../Services/shared/global.service';
import { ListDebts } from '../../../../Services/tigo-payments/models/get-debts-response';
import { TigoDto } from '../../../../Services/tigo-payments/models/tigo-dto';
import { NewPaseDto } from '../../../../Services/new-pase/models/new-pase-dto ';

@Component({
  selector: 'app-debt-detail-comunication',
  standalone: false,
  templateUrl: './debt-detail-comunication.component.html',
  styleUrls: ['./debt-detail-comunication.component.css'],
  providers: [TelephoneServicesService, ParametersService]
})
export class DebtDetailComunicationComponent implements OnInit {

  lastChecked: number = -1;
  showDetail = false;
  @Input() showDataBillint = false;
  branchOffice: Constants = new Constants();
  branchOfficeCode = '201';
  centralOffice = 'OFICINA CENTRAL';
  country!: string;
  direction!: string;
  resultParameters: ParameterResult = new ParameterResult();
  parametersDto: ParameterDto = new ParameterDto();
  billingType = false;
  @Input() amountDebts = 0;
  rowsPerPage: number[] = [10, 15, 20, 25];
  pageItems = 10;
  @Input()
  disabled!: boolean;
  @Input() debtsDetail: any;
  @Input() tigoDebtsDetail: any;
  @Input() totalDebts = 0;
  @Input()debtsByDetail!: GetDebtsClientEntelDto | any;
  @Output() onCheckedChange: EventEmitter<boolean>;
  @Output() onChangeDetail: EventEmitter<boolean>;
  @Output() onChangeDetailBilling: EventEmitter<boolean>;
  @Output() onChangeParameters: EventEmitter<string>;
  details: ClientDebtsEntelResult[] = [];
  detailsPagination: ClientDebtsEntelResult[] = [];
  debtsSelected: any;
  @ViewChild('billingForm')
  formBilling!: NgForm;
  entelDto: EntelDto = new EntelDto();
  tigoDto: TigoDto = new TigoDto();

  newPaseDto: NewPaseDto = new NewPaseDto();

  constructor(private parametersService: ParametersService, private telephoneServicesService: TelephoneServicesService,
    private globalService: GlobalService) {
    this.onCheckedChange = new EventEmitter();
    this.onChangeDetail = new EventEmitter();
    this.onChangeDetailBilling = new EventEmitter();
    this.onChangeParameters = new EventEmitter();
  }

  ngOnInit() {
    this.getInvoceAmouny();
    this.handleBrachOffice();
  }

  getInvoceAmouny() {
    this.parametersDto.group = 'INVCOS';
    this.parametersDto.code = 'COST';
    this.parametersService.getByGroupAndCode(this.parametersDto)
      .subscribe({next: resp => {
        this.resultParameters = resp;
      }});
  }

  getDetail() {

  }

  handleResetForm() {
    this.showDataBillint = false;
    this.entelDto.isComission = this.tigoDto.isComission = false;
    this.entelDto.entelPaymentDetail = this.tigoDto.detailPayments = [];
    this.amountDebts = 0;
    this.entelDto.nitFactura = this.entelDto.nameBill = undefined!;
    this.tigoDto.nitFactura = this.tigoDto.nameBill = undefined!;
    this.billingType = false;
    this.country = this.direction = undefined!;
    this.entelDto.isStreet = this.tigoDto.isStreet = false;
    this.entelDto.streetOrAvenue = this.entelDto.number = this.entelDto.floorOrDepartament = undefined!;
    this.tigoDto.streetOrAvenue = this.tigoDto.number = this.tigoDto.floorOrDepartament = undefined!;
    this.entelDto.batchOrCondominium = this.entelDto.location = this.entelDto.province = undefined!;
    this.tigoDto.batchOrCondominium = this.tigoDto.location = this.tigoDto.province = undefined!;
    this.entelDto.departament = this.entelDto.zoneOrNeighborhood = undefined!;
    this.tigoDto.departament = this.tigoDto.zoneOrNeighborhood = undefined!;
  }

  handleShowDetail(selectedDebts: GetClientResponse) {
    this.handleResetForm();
    this.debtsByDetail.paymentType = selectedDebts.service;
    this.debtsByDetail.paymentTypeDescription = selectedDebts.serviceDescription;
    this.entelDto.service = selectedDebts.service;
    this.entelDto.serviceDescription = selectedDebts.serviceDescription;
    this.entelDto.serviceName = selectedDebts.serviceName;
    this.entelDto.paymentDescription = selectedDebts.paymentDescription;
    this.entelDto.paymentType = selectedDebts.payment;
    this.entelDto.parameters = this.debtsByDetail.paymentType == 'TC_POST' ? selectedDebts.numberAccount : this.debtsByDetail.parameters;
    this.debtsByDetail.parameters = this.debtsByDetail.paymentType == 'TC_POST' ? selectedDebts.numberAccount : this.debtsByDetail.parameters;
    this.onChangeParameters.emit(this.entelDto.parameters);
    if (!this.disabled) {
      this.telephoneServicesService.getDebtsEntel(this.debtsByDetail)
        .subscribe({next: (response: any) => {
          this.details = response;
          this.details.forEach(x => x.isValidPeriod = true);
          this.details.forEach(x => x.beneficiaryReason = selectedDebts.name);
          this.details.forEach(x => x.minAmountOriginal = x.minAmount);
          this.detailsPagination = response;
          this.showDetail = true;
          this.onChangeDetail.emit(this.showDetail);
        }, error: _err => {
          this.showDetail = false;
          this.globalService.info('Pago de Entel: ', _err.message);
          this.onChangeDetail.emit(this.showDetail);
        }});
    }
  }

  handleChangeAmountTigo() {
    this.amountDebts = 0;
    for (let det of this.tigoDebtsDetail) {
      if (det.isSelected) {
        this.amountDebts = Number(this.amountDebts) + Number(det.amount);
      }
    }
  }

  handleChangeAmount() {
    this.amountDebts = 0;
    for (let detail of this.details) {
      if (detail.isSelected) {
        let newAmount = this.debtsByDetail.paymentType == 'TC_POST' ? detail.amount : detail.minAmount;
        this.amountDebts = Number(this.amountDebts) + Number(newAmount);
      }
    }
  }

  validateDebts(period: string) {
    let periodNumber = Number(period);
    let resultado = true;
    this.details.forEach((value, index) => {
      let periodDetail = Number(value.period);
      if ((value.isSelected == false || typeof value.isSelected == 'undefined') && periodDetail < periodNumber) {
        resultado = false;
      }
    })
    return resultado;
  }

  validateTigoDebts(billingPeriod: string) {
    let newPeriod = billingPeriod.split(' ');
    let period = newPeriod[2].split('-').reverse().join('');
    let periodNumber = Number(period);

    let resultado = true;
    this.tigoDebtsDetail.forEach((value: any, index: any) => {
      let newPeriod2 = value.billingPeriod.split(' ');
      let period2 = newPeriod2[2].split('-').reverse().join('');
      let periodDetail = Number(period2);
      if ((value.isSelected == false || typeof value.isSelected == 'undefined') && periodDetail < periodNumber) {
        resultado = false;
      }
    })
    return resultado;
  }

  handleSelectedTigoDebt($event: any, selectedDetail: ListDebts) {
    this.debtsSelected = selectedDetail;
    this.billingType = false;
    if ($event.target.checked) {
      this.checkedOnlyTigo(selectedDetail);
    } else {
      this.amountDebts = 0;
      this.tigoDto.isComission = false;
      this.handleAddTigoDetail();

      let newPeriodo = this.debtsSelected.billingPeriod.split(' ');
      let periodo = newPeriodo[2].split('-').reverse().join('');
      this.tigoDebtsDetail.forEach((value: any, index: any) => {

        let newPeriodo2 = value.billingPeriod.split(' ');
        let periodo2 = newPeriodo2[2].split('-').reverse().join('');

        if (Number(periodo) < Number(periodo2)) {
          this.tigoDebtsDetail[index].isSelected = false;
        }
        if (selectedDetail.billingPeriod.trim() == value.billingPeriod.trim()) {
          value.isSelected = false;
        }
      });
      this.handleChangeAmountTigo();
    }
    this.handleBrachOffice();
    this.showDataBillint = this.tigoDto.detailPayments.length > 0 ? true : false;
    this.onChangeDetailBilling.emit(this.showDataBillint);
  }

  handleSelectedDebt($event: any, selectedDetail: ClientDebtsEntelResult) {
    this.debtsSelected = selectedDetail;
    this.billingType = false;
    if ($event.target.checked) {
      if (this.debtsByDetail.paymentType != 'TC_POST') {
        if (selectedDetail.minAmount < selectedDetail.minAmountOriginal) {
          this.globalService.info('Pago de Entel: ', ' El monto introducido debe ser igual o mayor al monto mínimo.');
          return;
        }
      }
      this.checkedOnly(selectedDetail);
    } else {
      this.amountDebts = 0;
      this.entelDto.isComission = false;
      this.handleAddEntelDetail();
      this.details.forEach((value, index) => {
        if (Number(this.debtsSelected.period) < Number(value.period)) {
          this.details[index].isSelected = false;
        }
        if (selectedDetail.description.trim() == value.description.trim()) {
          value.isSelected = false;
        }
      });
      this.handleChangeAmount();
    }
    this.handleBrachOffice();
    this.showDataBillint = this.entelDto.entelPaymentDetail.length > 0 ? true : false;
    this.onChangeDetailBilling.emit(this.showDataBillint);
  }

  checkedOnly(selectedDetail: any) {
    for (let detail of this.details) {
      if (selectedDetail.description.trim() == detail.description.trim()) {
        let newAmount = this.debtsByDetail.paymentType == 'TC_POST' ? detail.amount : detail.minAmount;
        detail.isSelected = true;
        this.amountDebts = Number(this.amountDebts) + Number(newAmount);
      }
    }
    this.handleAddEntelDetail();
  }

  checkedOnlyTigo(selectedDetail: any) {
    for (let det of this.tigoDebtsDetail) {
      if (selectedDetail.billingPeriod.trim() == det.billingPeriod.trim()) {
        det.isSelected = true;
        this.amountDebts = Number(this.amountDebts) + Number(det.amount);
      }
    }
    this.handleAddTigoDetail();
    this.handleChangeAmountTigo();
  }

  handleAddEntelDetail() {
    let newAgency = Number(this.branchOfficeCode) + 3;
    this.entelDto.entelPaymentDetail = [];
    for (let det of this.details) {
      if (det.isSelected) {
        this.entelDto.entelPaymentDetail.push({
          item: det.item,
          description: det.description,
          amount: Number(det.amount),
          agrupator: det.agrupator,
          numberBill: det.numberBill,
          nameBill: this.entelDto.nameBill,
          nitBill: det.nit,
          dosificationBatch: det.dosificationBatch === null ? '0' : det.dosificationBatch,
          rentNumber: det.rentNumber == null ? '0' : det.rentNumber,
          period: det.period,
          beneficiaryReason: det.beneficiaryReason,
          typeBill: det.typeBill,
          minAmount: Number(det.minAmount),
          actualBalance: det.actualBalance,
          departament: '1',
          city: this.branchOfficeCode,
          agency: newAgency.toString(),
          transactor: 'P',
          observations: '-'
        });
      }
    }
    this.entelDto.streetOrAvenue = this.billingType ? this.entelDto.streetOrAvenue : this.direction;
  }

  handleAddTigoDetail() {
    this.tigoDto.detailPayments = [];
    for (let det of this.tigoDebtsDetail) {
      if (det.isSelected) {
        det.billingPeriod = det.billingPeriod.trim();
        this.tigoDto.detailPayments.push(det);
      }
    }
  }

  handleInformation() {
    for (let det of this.details) {
      if (det.isSelected) {
        this.handleSetAmounts(det);
      }
    }
    this.entelDto.amount = this.amountDebts;
    this.entelDto.streetOrAvenue = this.billingType ? this.entelDto.streetOrAvenue : this.direction;
    this.entelDto.entelPaymentDetail.forEach(x => x.nameBill = this.entelDto.nameBill);
    this.entelDto.entelPaymentDetail.forEach(x => x.nitBill = this.entelDto.nitFactura);
    return this.entelDto;
  }

  handleInformationTigo() {
    this.tigoDto.nitFactura = this.entelDto.nitFactura;
    this.tigoDto.nameBill = this.entelDto.nameBill;
    this.tigoDto.streetOrAvenue = this.billingType ? this.tigoDto.streetOrAvenue : this.direction;
    return this.tigoDto;
  }

  handleInformationCotas() {
    this.newPaseDto.nitFactura = this.entelDto.nitFactura;
    this.newPaseDto.nameBill = this.entelDto.nameBill;
    this.newPaseDto.streetOrAvenue = this.billingType ? this.newPaseDto.streetOrAvenue : this.direction;
    this.newPaseDto.batchOrCondominium = this.branchOfficeCode;
    this.newPaseDto.departament = this.country;
    return this.newPaseDto;
  }

  handleSetAmounts(detail: any) {
    for (let det of this.entelDto.entelPaymentDetail) {
      if (detail.item === det.item) {
        det.amount = detail.amount == null ? 0 : Number(detail.amount);
        det.minAmount = detail.minAmount == null ? 0 : Number(detail.minAmount);
      }
    }
  }

  handleBrachOffice() {
    this.country = this.branchOffice.branchOffices.find(x => x.value === this.branchOfficeCode)!.name;
    this.direction = this.branchOffice.branchOfficesDirection.find(x => x.value === this.branchOfficeCode)!.name;
  }

  handleChangeChecked($event: any) {
    this.billingType = $event;
    this.newPaseDto.isComission = this.entelDto.isComission = this.tigoDto.isComission = $event;
    this.onCheckedChange.emit(this.billingType);
  }

  handleValidateForm() {
    if (this.showDataBillint) {
      this.globalService.validateAllFormFields(this.formBilling.form);
      return this.formBilling.valid;
    }
    return;
  }

  handlePageChangedSalaries($event: number) {
    this.details = this.detailsPagination.slice((($event - 1) * this.pageItems), this.pageItems * $event);
  }

  handleViewRowsSalaries($event: string) {
    this.pageItems = +$event;
    this.handlePageChangedSalaries(1);
  }

}
