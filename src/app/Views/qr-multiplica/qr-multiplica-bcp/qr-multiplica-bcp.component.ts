import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
  HostListener,
  ChangeDetectorRef,
  ElementRef,
} from '@angular/core'
import { NgForm } from '@angular/forms'
import { RegisterService } from '../../../Services/qr/register.service'
import { GlobalService } from '../../../Services/shared/global.service'
import { UtilsService } from '../../../Services/shared/utils.service'
import { BranchOfficeQr } from '../../../Services/qr/models/branch-office-qr'
import { ParametersService } from '../../../Services/parameters/parameters.service'
import { QrPaymaentsResult } from '../../../Services/qr/models/qr-payments-result'
import { Constants } from '../../../Services/shared/enums/constants'
import { QrPaymentData } from '../../../Services/qr/models/qr-payment-data'
import { AccountDto } from '../../../Services/accounts/models/account-dto'
import { InputApprovers } from '../../../Services/approvers-and-controllers/models/input-approvers'
import { OperationType } from '../../../Services/shared/enums/operation-type'
import { AccountUse } from '../../../Services/shared/enums/account-use'
import { Roles } from '../../../Services/shared/enums/roles'
import { AccountTypes } from '../../../Services/shared/enums/account-types'
import { Operation } from '../../../Services/mass-payments/Models/operation';
import { EventLogRequest } from '../../../Services/mass-payments/Models/event-log-request'
import { ErrorDetailResult } from '../../../Services/mass-payments/Models/error-detail-result'
import { ApproversAndControllersComponent } from '../../shared/cw-components/approvers-and-controllers/approvers-and-controllers.component'
import { AccountResult } from '../../../Services/balances-and-movements/models/account-result'
import { CurrencyAndAmount } from '../../../Services/transfers/models/currency-and-amount'
import { PaginationComponent } from '../../shared/cw-components/pagination/pagination.component'
import { UserService } from '../../../Services/users/user.service'
import { TokenCredentials } from '../../../Services/tokens/models/token-credentials';
import { EMPTY, catchError, of, switchMap } from 'rxjs'
import { BusinesBranchId } from '../../../Services/qr/models/BusinesBranchId'
import { ListBusinesQR } from '../../../Services/qr/models/ListBusinessQR'
import { BranchQR, ListBranchQR } from '../../../Services/qr/models/ListBranchQR'
import { ListAtmQR } from '../../../Services/qr/models/ListAtmQR'
import { RegBoQrService } from '../../../Services/qr/reg-bo-qr.service'

@Component({
  selector: 'app-qr-multiplica-bcp',
  standalone: false,
  templateUrl: './qr-multiplica-bcp.component.html',
  styleUrls: ['./qr-multiplica-bcp.component.css'],
  providers: [RegisterService, UtilsService, ParametersService, RegisterService, RegBoQrService],
})
export class QrMultiplicaBcpComponent implements OnInit {
  headers = {
    line: true,
    account: true,
    gloss: true,
    amount: true,
    expiration: true,
    stock: true,
    email: true,
    city: true,
    branchOffice: true,
    atmName: true
  }

  messageQrPreparer = Constants.messageQrPreparer;
  ProcessBatchId!: number;

  showDetailForm = false;
  showRemoveRowForm = false;
  operation!: number;
  selectedRowIndex!: number;
  qrBranchs!: BranchOfficeQr[];
  qrExpirations!: BranchOfficeQr[];
  errorsDetail: ErrorDetailResult[] = [];

  showDownload = false;
  showdetailDownload = false;

  itemsPerPage = 10;
  rowsPerPage: number[] = [10, 15, 20, 25];
  spreadsheetSize!: number;
  currencies = Constants.currencies;
  authorizersDto!: InputApprovers;

  sourceAccount: AccountResult = new AccountResult();
  excedeedAmount = false;
  isPreSave = false;
  validateAmount = false;
  showTokenForm = false;

  _currency!: string;
  //_messageProcesbachId: string;
  ///----
  branchOffice: BranchOfficeQr = new BranchOfficeQr();
  expiration: BranchOfficeQr = new BranchOfficeQr();
  _time: BranchOfficeQr = new BranchOfficeQr();

  detail: QrPaymaentsResult = new QrPaymaentsResult();
  batchInformation: QrPaymentData = new QrPaymentData();
  eventLog = new EventLogRequest();
  //-----
  isTokenFormDisabled = false;
  isVisibleToken = false;
  isDownload = true;
  nextDelete = false
  batchIdsToPreSave: number[] = [];

  isShowOriginAndDestinationFundsForm = false;
  @Output() isShowFundsForm = new EventEmitter<boolean>();
  @Output() onChange: EventEmitter<CurrencyAndAmount>;
  data: CurrencyAndAmount = new CurrencyAndAmount();
  @Input() isAmountDisabled!: boolean;
  @Input() maximumDigitsAllowed!: number;
  @Input() isCurrencyBlocked = false;
  @Input() isFlagVisible = true;
  @Input() currencyTag!: string;

  isTransactionSuccessful = false;
  is_validbatchtoken!: boolean;

  headerValidation!: boolean;
  approversValidation!: boolean;
  approverLimitsValidation!: boolean;
  emailsValidation!: boolean;
  showModalPreSave = false;
  showModalSetDate = false;

  manyEmails!: string;
  showMessageIsBlock = false;
  //----
  @Input() isCashOnline = false;
  @Input() accountDto: AccountDto;
  @Input() disabled = false;
  @Input() visible = false;

  spreadsheetPerPage: QrPaymaentsResult[] = [];

  @ViewChild(PaginationComponent) pagination: PaginationComponent = new PaginationComponent();

  isAuthorizeOperation: boolean;
  amounts: number[] = [];
  amount!: number;

  idBusinessBranch: BusinesBranchId = new BusinesBranchId();
  public businessQR: ListBusinesQR[] = [];
  listBranchQR: ListBranchQR[] = [];
  public listAtm: ListAtmQR[] = [];
  listAtmQR: ListAtmQR[] = [];
  listBranch: BranchQR = new BranchQR();
  showNewQR: boolean = false;
  showQRNew = false;

  messageQr: string = '';


  @Output() onRowChange = new EventEmitter();
  @ViewChild(ApproversAndControllersComponent) approversComponent!: ApproversAndControllersComponent;
  @ViewChild('insideButton') insideButton: any;
  @ViewChild('detailForm') form!: NgForm;
  @ViewChild('insideElement') insideElement: any;
  @ViewChild('header') header!: ElementRef;
  showFilter = false;
  clickedInside!: boolean;
  clickedInsideBtn!: boolean;

  totalErrors!: number;
  totalCorrects!: number;
  haveErrors = false;
  @HostListener('document:click', ['$event.target'])
  clickout(event: any) {
    if (this.showFilter) {
      this.clickedInside = this.insideElement.nativeElement.contains(event);
      this.clickedInsideBtn = this.insideButton.nativeElement.contains(event);
      if (!this.clickedInside && !this.clickedInsideBtn && this.showFilter) {
        this.showFilter = false
      }
    }
  }
  constructor(private globalService: GlobalService, private servicesQr: RegisterService, private regBoQrServices: RegBoQrService, private utilsService: UtilsService,
    private cdRef: ChangeDetectorRef, private userService: UserService, private messageService: GlobalService) {
    this.accountDto = new AccountDto({
      accountUse: String.fromCharCode(AccountUse.debit),
      roleId: Roles.initiator,
      operationTypeId: [
        OperationType.pagoHaberes,
        OperationType.pagoProveedores,
        OperationType.pagoProveedoresAch,
        OperationType.pagoQr,
        OperationType.pagoProveedoresEfe,
        OperationType.nationalTransfers,
        OperationType.transAlExteriorConCambioD,
        OperationType.transferenciasCuentasPropias,
        OperationType.transferenciasCuentasTerceros],
      types: [String.fromCharCode(AccountTypes.passive)],
    })
    this.batchInformation.operationTypeId = OperationType.pagoQr;
    this.isAuthorizeOperation = this.userService.getUserToken().authorize_operation!;
    localStorage.setItem('operationType', OperationType.pagoQr.toString());
    localStorage.setItem('operationType', OperationType.nationalTransfers.toString());
    this.onChange = new EventEmitter();
  }
  ngOnInit() {
    this.userService.getValidateCurrentUser();
    this.batchInformation.amount = 0;
    this.utilsService.getLastOne();
    if (this.currencies === Constants.currencies) {

      if (this.currencies[0].value === 'BOL') {
        this._currency = 'BOLIVIANOS';
        this.currencies = Constants.currencies.filter((x) => x.value === 'BOL');
      } else {
        this._currency = 'DOLARES'
        this.currencies = Constants.currencies.filter((x) => x.value === 'USD');
      }
    }
    this.qrBranchs = this.utilsService.getBranchOffices();
    this.qrExpirations = this.utilsService.getExpirationTime();
    this.getBusinessQR();
  }
  ngOnChanges(): void {
    this.changeLines();
    this.countErrors();
  }
  getBusinessQR() {
    this.servicesQr.getBusinessQR().pipe(
      switchMap((resp: ListBusinesQR[]) => {
        this.businessQR = resp;
        if (this.businessQR.length === 0) {
          this.showNewQR = true;
          this.showQRNew = true;
          return this.regBoQrServices.regBusinessQR();
        } else {
          return of(undefined);
        }
      }),
      switchMap(() => {
        const notBusinessQR = this.businessQR.filter(businessQR => businessQR.businessCode === "Not Valid");
        if (notBusinessQR.length > 0) {
          return this.regBoQrServices.regBusinessQR();
        } else {
          return of(undefined);
        }
      }),
      catchError((_error: any) => {
        return EMPTY;
      })
    ).subscribe((_resp: any) => {
//not more
    });
  }

  exit() {
    this.showNewQR = false;
    this.showQRNew = false;
  }
  countErrors() {
    this.totalErrors = this.batchInformation.spreadsheet!.filter(x => x.isError).length;
    this.totalCorrects = this.batchInformation.spreadsheet!.filter(x => !x.isError).length;
    this.haveErrors = this.totalErrors >= 0 ? true : false;
    this.errorsDetail = this.utilsService.addErrors(this.batchInformation.spreadsheet!.filter(x => x.isError));
  }

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }
  handleAccountChanged($event: AccountResult) {
    this.batchInformation.sourceAccount = $event.number;
    this.batchInformation.sourceAccountId = $event.id;
    this.batchInformation.sourceCurrency = $event.currency;
    this.batchInformation.currency = $event.currency;
    this.batchInformation.currencyDescription = $event.currencyDescription;
    this.batchInformation.formattedNumber = $event.formattedNumber;
    this.validatecurrency();
  }
  validatecurrency() {
    if (this.batchInformation.sourceCurrency === 'BOL') {
      this._currency = 'BOLIVIANOS';
      this.batchInformation.currency = 'BOL';
    } else {
      this._currency = 'DOLARES';
      this.batchInformation.currency = 'USD';
    }
  }
  handleShowFunds() {
    if (this.utilsService.showOriginDestinationFunds()) {
      this.isShowOriginAndDestinationFundsForm = true;
      this.isShowFundsForm.emit(this.isShowOriginAndDestinationFundsForm);
      return;
    }
  }
  selectCity() {
    /*This is intentional*/
  }

  selectBranchOffice() {
    let code = this.detail.branchOffice;
    for (let j of this.listBranchQR) {
      if (j.branchCode === code) {
        this.detail.branchCode = +code;
        this.detail.branchName = j.branchName;
        if (j != null) {
          this.idBusinessBranch.branchId = j.id;
        }

        this.servicesQr.getAtmQR(this.idBusinessBranch)
          .subscribe({
            next: resp => {
              this.listAtmQR = resp
            }, error: _err => {
            }
          })
      }
    }
  }
  selectAtms() {
    for (let j of this.listAtmQR) {
      if (this.detail.atmCode == +j.atmCode) {
        this.detail.atmName = j.atmName;
      }
    }
  }
  selectTime() {
    /*This is intentional*/
  }

  getBranchQR(idBis: BusinesBranchId): void {
    this.servicesQr.getBranchesQR(idBis)
      .subscribe({
        next: (resp: ListBranchQR[]) => {
          this.listBranchQR = resp;
        },
        error: (error: any) => {
          //console.error("Ocurrió un error al obtener los QRs de la sucursal", error);
          // Agrega aquí una lógica adicional para manejar el error de manera más efectiva
        }
      });
  }


  handleAddRow() {
    let businessRows = this.businessQR.filter(row => row.id);
    for (let businessRow of businessRows) {
      if (businessRow.id != null) {
        this.idBusinessBranch.businessId = businessRow.id;
        this.detail.businessCode = +businessRow.businessCode;
      }
    }
    this.getBranchQR(this.idBusinessBranch);
    this.showDetailForm = true;
    this.operation = Operation.adition;
    this.handleShowAdditionForm();
  }
  updateBatchAmount(): void {
    this.batchInformation.amount = this.utilsService.sumTotal(this.batchInformation.spreadsheet);
    this.validatecurrency();
    if (this.isAuthorizeOperation) {
      this.amounts = this.batchInformation.spreadsheet!.map(x => +x.amount!);
    } else {
      this.amount = this.utilsService.sumTotal(this.batchInformation.spreadsheet);
    }
    if (this.batchInformation.amount < -1) {
      this.validateAmount = true;
    } else {
      this.validateAmount = false;
    }
  }
  updateSpreadsheet(spreadsheet: QrPaymaentsResult[]) {
    this.batchInformation.spreadsheet = spreadsheet;
    this.updateBatchAmount();
    this.spreadsheetSize = spreadsheet.length;
    if (this.pagination !== undefined) { this.pagination.ngOnChanges(); }
  }
  handleShowAdditionForm(): void {
    this.setNewRow();
    this.operation = Operation.adition;
    this.detail.amount = 0;
    this.detail.city = 'LA PAZ';
    this.detail.expiration = '1A';
    this.detail.email = '';
    this.detail.branchOffice = '';
    this.detail.atmCode = 0;
    this.detail.branchCode = 0;
    this.detail.currency = this.batchInformation.currency;
    if (this.batchInformation.spreadsheet!.length === 0) {
      this.showDetailForm = true;
    } else {
      this.showDetailForm = false;
    }
    for (let i = 0; i < this.batchInformation.spreadsheet!.length; i++) {
      if (this.batchInformation.spreadsheet![i].currency === '') {
      } else {
        if (this.batchInformation.spreadsheet![i].currency === 'BOL' && this.detail.currency === 'BOL') {
          this.showDetailForm = true;

        } else {
          if (this.batchInformation.spreadsheet![i].currency === 'USD' && this.detail.currency === 'USD') {
            this.showDetailForm = true;

          } else {
            this.messageService.info('Con el cambio de moneda no se puede agregar, por favor verifique su cuenta.', '')
            this.showDetailForm = false;
          }
        }
      }

    }
    this.validatecurrency();
  }
  handlePageChanged(pageNumber: number) {
    this.spreadsheetPerPage = this.batchInformation.spreadsheet!.slice((pageNumber - 1) * this.itemsPerPage, this.itemsPerPage * pageNumber);
  }
  handleViewRows($event: string) {
    this.itemsPerPage = +$event;
    this.handlePageChanged(0);
  }
  setNewRow(): void {
    this.detail = new QrPaymaentsResult();
    this.detail.expiration = this.qrExpirations[0].description;
    this.detail.city = this.qrBranchs[0].description;
    this.selectCity();
    this.selectTime();
  }
  handleShowEditForm($event: QrPaymaentsResult): void {
    this.detail = Object.assign({}, $event);
    this.operation = Operation.update;
    this.branchOffice = this.qrBranchs.find(
      (x) => x.description === this.detail.city)!;
    this.expiration = this.qrExpirations.find(
      (x) => x.description === this.detail.expiration)!
    this.showDetailForm = true;
    localStorage.setItem('branchOffice', this.detail.city);
    localStorage.setItem('expiration', this.detail.expiration!);
  }
  handleTryToRemoveRow(index: number): void {
    this.showRemoveRowForm = true;
    this.selectedRowIndex = index - 1;
  }
  handleCancel() {
    this.showDetailForm = false;
    this.setNewRow();

    this.changeLines();
    this.onRowChange.emit();
  }
  handleRemove() {
    if (this.disabled) {

    } else {
      this.batchInformation.spreadsheet!.splice(this.selectedRowIndex, 1);
      this.showRemoveRowForm = false;
      this.updateSpreadsheet(this.batchInformation.spreadsheet!);
      this.changeLines();
      if (this.batchInformation.spreadsheet!.length >= 1) {
        this.visible = true;
      } else {
        this.visible = false;
      }
    }

  }
  changeLines() {
    for (let i = 0; i < this.batchInformation.spreadsheet!.length; i++) {
      this.batchInformation.spreadsheet![i].line = i + 1;
    }
  }
  handleValidate(): void {
    this.globalService.validateAllFormFields(this.form.form);
    let list: any = this.businessQR;
    for (let j of list) {
      this.detail.businessCode = +j.businessCode;
      this.detail.abreviation = j.abreviation;
    }
    ////console.log(this.detail)
    if (this.batchInformation.currency === 'BOL') {
      if (this.form.valid) {
        if (this.detail.atmCode != 0) {
          this.executeOperation();
          this.updateSpreadsheet(this.batchInformation.spreadsheet!);
          this.showDetailForm = false;
          this.visible = true;
        } else {
          this.messageService.info('', 'Por favor seleccione una Caja');
        }

      } else {
        this.validateAmount = false;
        if (this.detail.branchCode === 0) {
          this.messageService.info('Info: ', ' Seleccione un sucursal');
        } else if (this.detail.email == '' || this.emailsValidation) {
          this.messageService.info('Por favor verifique su email', '');
        } else if (this.form.valid == false) {
          this.messageService.info('Por favor verifique su email ', 'y que el formulario este correctamente llenado');
        } else {
          this.messageService.info('Por favor verifique sus Datos ', '')
        }

      }
    } else {
      if (this.batchInformation.currency === 'USD') {
        if (this.form.valid) {
          if (this.detail.atmCode != 0) {
            this.executeOperation();
            this.updateSpreadsheet(this.batchInformation.spreadsheet!);
            this.showDetailForm = false;
            this.visible = true;
          } else {
            this.messageService.info('', 'Por favor seleccione una Caja');
          }
        } else {
          this.validateAmount = false;
          if (this.form.valid == false) {
            if (this.detail.branchCode === 0) {
              this.messageService.info('Info: ', ' Seleccione un sucursal');
            } else if (this.form.valid == false) {
              this.messageService.info('Por favor verifique su email ', 'y que el formulario este correctamente llenado');
            }
            else {
              this.messageService.info('Por favor verifique su email', '');
            }
          }
        }
      }
    }
  }

  myFunction() {
    let popup = document.getElementById("myPopup");
    popup!.classList.toggle("show")
  }
  myPopUpModalUno() {
    let popup = document.getElementById("myPopupModalUno");
    popup!.classList.toggle("show")
  }
  myPopUpModalDos() {
    let popup = document.getElementById("myPopupModalDos");
    popup!.classList.toggle("show")
  }
  handleValidateQR() {
    if (this.batchInformation.spreadsheet.length > 0) {
      for (let batch of this.batchInformation.spreadsheet) {
        if (batch.line !== undefined) {
          this.disabled = true;
          this.isDownload = true;
          this.nextDelete = true;
        }
      }
      this.showToken();
    } else {
      this.isTransactionSuccessful = false;
    }
  }
  executeOperation(): void {
    this.detail.accountNumber = this.batchInformation.formattedNumber;
    this.detail.currency = this.batchInformation.currency;
    switch (this.operation) {
      case Operation.adition:
        this.detail.line = this.batchInformation.spreadsheet!.length + 1;
        this.batchInformation.spreadsheet!.push(this.detail);
        break;
      case Operation.update:
        this.detail.isError = false;
        this.batchInformation.spreadsheet![this.detail.line - 1] = this.detail;
        break;
    }
    this.spreadsheetSize = this.batchInformation.spreadsheet!.length;
  }
  getReport() {
    this.batchInformation.ProcessBatchId = this.ProcessBatchId;
    this.servicesQr.getQr(this.batchInformation).subscribe({
      next: (resp: Blob) => {
        this.utilsService.donwloadReport('QR' + this.ProcessBatchId + '.zip', resp);
      }, error: err => this.messageService.info('No se pudo generar el qr: ', 'Por favor intente mas tarde.')
    });

  }
  handleOptiondownload(): void {
    this.showdetailDownload = false;
    this.disabled = true;
  }
  showToken() {
    this.showdetailDownload = true;
    this.servicesQr.process(this.batchInformation)
      .subscribe({
        next: resp => {
          this.ProcessBatchId = resp.processBatchId
          if (this.ProcessBatchId != undefined) {
            this.disabled = false;
            this.isDownload = false;
            this.nextDelete = false;
            this.showdetailDownload = true;

          } else {
            this.isDownload = true;
          }
          this.isTransactionSuccessful = true;
        }, error: err => {
          this.globalService.info('Validación: ', err.message);
          if (err.message == "No se pudo encontrar el beneficiario de la Cuenta Origen.") {
            this.messageService.info('Por favor Verfique la cuenta', '')
            this.disabled = false;
            this.showdetailDownload = false;
          } else {
            this.messageService.info('Por favor inetnte mas tarde', '')
            this.disabled = false;
            this.showdetailDownload = false;
          }
        }
      });
  }
  handleNewOperation() {
    this.disabled = false;
    this.nextDelete = false;
    this.batchInformation.currency = '';
    this.batchInformation.amount = 0;
    this.batchInformation.spreadsheet = [];

    if (this.batchInformation.spreadsheet.length === 0) {
      this.visible = false;
      this.isTransactionSuccessful = false;
      this.ProcessBatchId = 0
    } else {
      this.isTransactionSuccessful = true;
    }
  }
  handleTokenSubmit($event: TokenCredentials) {
    this.batchInformation.batchIds = this.batchIdsToPreSave;
    this.batchInformation.tokenCode = $event.code;
    this.batchInformation.tokenName = $event.name;
    this.isVisibleToken = false;
    this.showToken();
  }
}
