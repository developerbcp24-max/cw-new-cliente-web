import { Component, OnInit, Output, EventEmitter, Input, OnChanges, ChangeDetectorRef, HostListener, ViewChild } from '@angular/core';
import { HistoricalAccountsService } from '../../../../Services/historical-accounts/historical-accounts.service';
import { MovAccountsDto } from '../../../../Services/historical-accounts/models/MovAccountsDto';
import { MovAccountsModel } from '../../../../Services/historical-accounts/models/MovAccountsModel';
import { GlobalService } from '../../../../Services/shared/global.service';
import { HistoricalAccountsResult } from '../../../../Services/historical-accounts/models/HistoricalAccountsResult';
import { UtilsService } from '../../../../Services/shared/utils.service';
import moment from 'moment';
import { ParametersService } from '../../../../Services/parameters/parameters.service';
import { ParameterDto } from '../../../../Services/parameters/models/parameter-dto';
import { ParameterModel } from '../../../../Services/historical-accounts/models/ParameterModel';

@Component({
  selector: 'app-historical-account-list',
  standalone: false,
  templateUrl: './historical-account-list.component.html',
  styleUrls: ['./historical-account-list.component.css'],
  providers: [HistoricalAccountsService, UtilsService]
})
export class HistoricalAccountListComponent implements OnInit, OnChanges {

  public numeroAccount = 0;
  public reportType!: string;
  public rowElegidos: number[] = [];
  @Input() flagHistTr!: boolean;
  @Input() resultHistorical!: HistoricalAccountsResult;
  @Input() miModel!: MovAccountsDto;
  @Input() isVisibleList!: boolean;

  @Output() onChange = new EventEmitter();
  @Output() onChangeTwo = new EventEmitter();
  @Output() onChangeCertificate = new EventEmitter();
  @Output() changePaginate = new EventEmitter<MovAccountsDto>();

  resultTwo: MovAccountsModel[] = [];
  resultFilter: ParameterModel[] = [];
  public numberRowMsg!: string;
  public numeroFilas!: number;
  showCertificate = false;
  btnCertificate = true;

  public dataAccMovido: MovAccountsDto = new MovAccountsDto();

  miModelTemp: MovAccountsDto = new MovAccountsDto();

  headers = {
    Col01: true,
    Col02: true,
    Col03: true,
    Col04: true,
    Col05: true,
    Col06: true,
    Col07: true,
    Col08: true,
    Col09: true,
    Col10: false,
    NroLote: false,
    Ordenante: false,
    Benifi: false,
    document: false,
    Operation: false,
    Channel: false,
    IdProveedor: false,
    TransactionNumberEBS: false,
    ProviderId: false,
    EBSTransactionNumber: false,
    Document: false
  }!;
  rowsPerPage: number[] = [10, 15, 20, 25];
  totalHistoricalAccount = 0;
  pageItems = 25;
  numberAccount!: string;
  formattedAccount!: string;
  dateInit!: string;
  dateEnd!: string;
  resultHistoricalPagination: MovAccountsModel[] = [];
  showTxt = false;
  @Input() totalItems: any;

  @ViewChild('insideButton') insideButton: any;
  @ViewChild('insideElement') insideElement: any;
  showFilter= false;
  clickedInside!: boolean;
  clickedInsideBtn!: boolean;
  @HostListener('document:click', ['$event.target'])
  clickout(event: any) {
    this.clickedInside = this.insideElement.nativeElement.contains(event);
    this.clickedInsideBtn = this.insideButton.nativeElement.contains(event);
    if (!this.clickedInside && !this.clickedInsideBtn && this.showFilter) {
      this.showFilter = false;
    }
  }

  constructor(private _HistoricalAccountsService: HistoricalAccountsService,
    private messageService: GlobalService, private utilsService: UtilsService, private cdRef: ChangeDetectorRef) {
  }

  ngOnInit() {
    this._HistoricalAccountsService.getShowTxtReport().subscribe({next: response => {
      this.resultFilter = response;
      this.reportType = this.resultFilter[0].code;
    }, error: _err => this.messageService.danger('Históricos', _err.message)});
  }

  ngOnChanges() {
    if (this.isVisibleList) {
      this.resultHistoricalPagination = this.resultHistorical.tableBody;
      this.callListFull(this.miModel);
      this.resultTwo = this.resultHistorical.tableBody;
      this.numberAccount = this.miModel.NumberCta;
      this.formattedAccount = this.miModel.FormattedAccount;
      this.dateInit = this.miModel.DateIni;
      this.dateEnd = this.miModel.DateEnd;
    }
  }

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }

  callListFull(miModel: MovAccountsDto) {
    if (this.totalItems > 0) {
      this.numberRowMsg = this.totalItems.toString();
      this.numeroFilas = this.totalItems;
      this.miModelTemp = miModel;
      this.dataAccMovido = {
        'NumberCta': miModel.NumberCta,
        'DateIni': miModel.DateIni,
        'DateEnd': miModel.DateEnd,
        'RowIni': 0,
        'NumberRow': this.totalItems,
        'ReportType': this.reportType,
        'OutListType': false,
        'FormattedAccount': miModel.FormattedAccount,
        'Col01': miModel.Col01,
        'Col02': miModel.Col02,
        'Col03': miModel.Col03,
        'Col04': miModel.Col04,
        'Col05': miModel.Col05,
        'Col06': miModel.Col06,
        'Col07': miModel.Col07,
        'Col08': miModel.Col08,
        'Col09': miModel.Col09,
        'Col10': miModel.Col10,
        'NroLote': miModel.NroLote,
        'Ordenante': miModel.Ordenante,
        'Benifi': miModel.Benifi,
        'Document': miModel.Document,
        'Operation': miModel.Operation,
        'Channel': miModel.Channel,
        'ProviderId': miModel.ProviderId,
        'EBSTransactionNumber': miModel.EBSTransactionNumber
      };
    }
  }

  /*pagination..... */
  handleBatchesToControlPageChanged($event: number) {
    this.resultHistoricalPagination = this.resultHistorical.tableBody.slice((($event - 1) * this.pageItems), this.pageItems * $event);
  }

  handleViewRows($event: string) {
    this.pageItems = +$event;
    this.handleChangePage(1);
  }

  handleChangePage($event: any) {
    this.miModel.NumberRow = this.pageItems;
    if (this.miModel.RowIni !== -1) {
      this.miModel.RowIni = ($event - 1) * this.pageItems;
      this.changePaginate.emit(this.miModel);
    } else {
      this.miModel.RowIni = $event;
      this.resultHistoricalPagination = this.resultHistorical.tableBody;
    }
  }
  /*end */

  getReport(miModel: any, typereport: string) {
    let currentDate = moment(new Date()).format('DDMMYY');
    this.dataAccMovido = {
      'NumberCta': this.numberAccount,
      'DateIni': this.dateInit,
      'DateEnd': this.dateEnd,
      'RowIni': 0,
      'NumberRow': 20,
      'ReportType': typereport,
      'OutListType': true,
      'FormattedAccount': this.formattedAccount,
      'Col01': miModel.Col01,
      'Col02': miModel.Col02,
      'Col03': miModel.Col03,
      'Col04': miModel.Col04,
      'Col05': miModel.Col05,
      'Col06': miModel.Col06,
      'Col07': miModel.Col07,
      'Col08': miModel.Col08,
      'Col09': miModel.Col09,
      'Col10': miModel.Col10,
      'NroLote': miModel.NroLote,
      'Ordenante': miModel.Ordenante,
      'Benifi': miModel.Benifi,
      'Document': miModel.Document,
      'Operation': miModel.Operation,
      'Channel': miModel.Channel,
      'ProviderId': miModel.ProviderId,
      'EBSTransactionNumber': miModel.EBSTransactionNumber
    };
    this._HistoricalAccountsService.getReportHistorical(this.dataAccMovido)
      .subscribe({next: (resp: Blob) => {
        let extension = '';
        switch (this.dataAccMovido.ReportType) {
          case 'xls':
          case 'xlsp':
            extension = '.xls';
            break;
          case 'pdf':
          case 'pdfp':
            extension = '.pdf';
            break;
          case 'sapc':
          case 'sapd':
            extension = '.PRN';
            break;
          case 'txt':
              extension = '.txt';
              break;
          default:
            break;
        }
        if (this.dataAccMovido.ReportType === 'sapc' || this.dataAccMovido.ReportType === 'sapd') {
          currentDate += this.dataAccMovido.ReportType === 'sapc' ? 'C' : 'D';
          this.utilsService.donwloadReport(`CON${currentDate}${extension}`, resp);
        } else {
          this.utilsService.donwloadReport(`Historicos${extension}`, resp);
        }
      }, error: _err => this.messageService.info('Por favor intente mas tarde: ', _err.message)});
  }

  handleCheckedRow(list: any) {
    this.rowElegidos = this.addOrRemoveElements(this.rowElegidos, list);
    this.numeroAccount = this.rowElegidos.length;
    this.btnCertificate = this.rowElegidos.length === 0 ? true : false;
    this.onChange.emit(this.rowElegidos);
    this.onChangeTwo.emit(this.resultTwo);
  }

  addOrRemoveElements(array: number[], item: number): number[] {
    array.includes(item) ? array.splice(array.indexOf(item, 0), 1) : array.push(item);
    return array;
  }

  handleCertificate() {
    this.onChangeCertificate.emit(true);
  }
}
