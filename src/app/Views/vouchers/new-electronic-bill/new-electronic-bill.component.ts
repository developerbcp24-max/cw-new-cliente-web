import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { UserService } from '../../../Services/users/user.service';
import { HeaderBillDto } from '../../../Services/vouchers/electronic-bill/models/header-bill-dto';
import { ElectronicBillService } from '../../../Services/vouchers/electronic-bill/electronic-bill.service';
import { HeaderBillResult } from '../../../Services/vouchers/electronic-bill/models/header-bill-result';
import { GlobalService } from '../../../Services/shared/global.service';
import { DatePipe } from '@angular/common';
import { UtilsService } from '../../../Services/shared/utils.service';
import moment, { Moment } from 'moment';
import { DateRangeModel, OptionsDateRange } from '../../shared/cw-components/date-range/date-range.component';
import { MonthsResult } from '../../../Services/parameters/models/months-result';

@Component({
  selector: 'app-new-electronic-bill',
  standalone: false,
  templateUrl: './new-electronic-bill.component.html',
  styleUrls: ['./new-electronic-bill.component.css'],
  providers: [ElectronicBillService, DatePipe, UtilsService]
})
export class NewElectronicBillComponent implements OnInit {
  titularUser: any;
  isDateOrMonths: boolean;
  isVisibleDetail: boolean;
  requestHeader: HeaderBillDto = new HeaderBillDto();
  responseHeader: HeaderBillResult[] = [];
  responseHeaderPerPage: HeaderBillResult[] = [];
  MonthDescription!: string;
  totalBills!: number;
  isPanelVisible!: boolean;
  message!: string;
  isDisabled: boolean;
  isModalVisible!: boolean;
  dateRange: DateRangeModel = new DateRangeModel();
  actualEnd = new Date();
  dateInit = new Date();

  rowsPerPage: number[] = [10, 15, 20, 25];
  pageItems = 10;
  typeFilter!: number;
  resultMonth: MonthsResult = new MonthsResult();

  optionsDateRange: OptionsDateRange = {
    isHorizontal: false,
    isMaxDateNow: true,
    showClearDate: false,
    maxMonthRange: 3
  };

  constructor(private userService: UserService, private billService: ElectronicBillService,
    private messageService: GlobalService, private datepipe: DatePipe, private utilsService: UtilsService, private cdRef: ChangeDetectorRef) {
    this.isDateOrMonths = true;
    this.isVisibleDetail = false;
    this.isDisabled = true;
  }

  ngOnInit() {
    this.userService.getValidateCurrentUser();
    this.titularUser = this.userService.getUserToken();
    this.requestHeader.reportType = true;
    this.requestHeader.startDate = this.dateRange.dateInit = moment(new Date()).add(-3, 'M').toDate();
    this.requestHeader.endDate = this.dateRange.dateEnd = new Date();
  }

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }

  handleGetMonths($event: any) {
    let starDate = moment($event.monthYear + '-01').startOf('month').format('YYYY-MM-DD');
    let endDate = moment($event.monthYear + '-01').endOf('month').format('YYYY-MM-DD');

    this.requestHeader.startDate = moment(starDate).toDate();
    this.requestHeader.endDate = moment(endDate).toDate();

    this.MonthDescription = moment(starDate).format('MMMM');
    this.isVisibleDetail = false;
    this.isPanelVisible = false;
    this.isDisabled = true;
  }

  handleDates() {
    this.requestHeader.startDate = this.dateRange.dateInit!;
    this.requestHeader.endDate = this.dateRange.dateEnd!;
    this.isVisibleDetail = false;
    this.isPanelVisible = false;
    this.isDisabled = this.dateRange.isValid!;
  }

  ResetComponents() {
    this.isVisibleDetail = false;
    this.isDisabled = this.isDateOrMonths ? true : false;
    if (this.isDateOrMonths) {
      this.handleDates();
    }
    this.isPanelVisible = false;
  }

  SearchBill() {
    if (this.dateRange.isValid || this.typeFilter === 1) {
      if (this.typeFilter === 0) {
        this.requestHeader.startDate = this.dateRange.dateInit!;
        this.requestHeader.endDate = this.dateRange.dateEnd!;
      }

      console.log(this.requestHeader.startDate);
      console.log(this.requestHeader.endDate);

      this.billService.GetNewListBill(this.requestHeader).subscribe({next: resp => {
        if (resp.length > 0) {
          this.isVisibleDetail = true;
          this.responseHeader = resp;
          this.responseHeaderPerPage = this.responseHeader;
          this.totalBills = resp.length;
          this.isPanelVisible = false;
          this.isModalVisible = this.totalBills >= 201 && !this.isDateOrMonths ? true : false;
        } else {
          this.isPanelVisible = true;
          this.isVisibleDetail = false;
          this.message = this.typeFilter === 0 ?
            'No existen facturas para el rango de fechas: ' + moment(this.requestHeader.startDate).format('DD-MM-YYYY') + ' a ' + moment(this.requestHeader.endDate).format('DD-MM-YYYY')
            : 'No existen facturas para el mes de: ' + moment(this.requestHeader.startDate).format('MMMM YYYY');
        }
      }, error: _err => {
        this.isPanelVisible = true;
        this.isVisibleDetail = false;
        this.message = this.typeFilter === 0 ?
          'No existen facturas para el rango de fechas: ' + moment(this.requestHeader.startDate).format('DD-MM-YYYY') + ' a ' + moment(this.requestHeader.endDate).format('DD-MM-YYYY')
          : 'No existen facturas para el mes de: ' + moment(this.requestHeader.startDate).format('MMMM YYYY');
      }});
    }
  }

  handlePageChanged($event: number) {
    this.responseHeader = this.responseHeaderPerPage.slice((($event - 1) * this.pageItems), this.pageItems * $event);
  }

  handleViewRows($event: string) {
    this.pageItems = +$event;
    this.handlePageChanged(0);
  }

  handleShowDetails($number: string, $code: string, $autorizationNumber: string) {
    this.requestHeader.number = $number;
    this.requestHeader.controlCode = $code;
    this.requestHeader.autorizationNumber = $autorizationNumber;
    this.billService.GetNewDetailBill(this.requestHeader).subscribe({
      next: resp => {
        if (resp.size > 0) {
          this.utilsService.donwloadReport('Factura.pdf', resp);
        } else {
          this.messageService.info('La Factura no tiene detalle', '');
        }
      }, error: _err => this.messageService.info('No se pudo generar el reporte: ', 'Por favor intente mas tarde.')
    });
  }

  handleDonwloadRarDetail() {
    this.billService.GetNewBillPerMonth(this.requestHeader).subscribe({
      next: resp => {
        this.utilsService.donwloadReport('Facturas ' + this.MonthDescription + '.zip', resp);
      }, error: _err => this.messageService.info('No se pudo generar el archivo: ', 'Por favor intente mas tarde.')
    });
  }

  handleExportListBill() {
    this.requestHeader.companyName = this.titularUser.company_name;
    this.billService.GetNewListBillReport(this.requestHeader).subscribe({
      next: resp => {
        const extension = this.requestHeader.reportType ? '.pdf' : 'xls';
        this.utilsService.donwloadReport('Facturas de ' + this.datepipe.transform(this.requestHeader.startDate, 'dd-MM-yyyy')
          + ' a ' + this.datepipe.transform(this.requestHeader.endDate, 'dd-MM-yyyy') + extension, resp);
      }, error: _err => this.messageService.info('No se pudo generar el reporte: ', 'Por favor intente mas tarde.')
    });
  }

  handleMonthYear($event: MonthsResult) {
    this.requestHeader.endDate = this.requestHeader.startDate = moment($event.monthYear + '-01').toDate();
    this.requestHeader.endDate = moment(this.requestHeader.endDate).endOf('month').toDate();
    this.MonthDescription = moment(this.requestHeader.endDate).format('MMMM');
  }

  handleGroupChanged($event: any) {
    this.typeFilter = $event;
    this.isDateOrMonths = true;
    this.isVisibleDetail = false;
    this.isPanelVisible = false;
    if (this.typeFilter === 1) {
      this.isDateOrMonths = false;
      this.resultMonth.monthYear = moment(new Date()).format('YYYY-MM');
      this.handleMonthYear(this.resultMonth);
    }
  }
}

