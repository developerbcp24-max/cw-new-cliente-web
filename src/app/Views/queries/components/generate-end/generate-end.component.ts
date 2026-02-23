import { OperationType } from '../../../../Services/shared/enums/operation-type';
import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { GlobalService } from '../../../../Services/shared/global.service';
import { MovAccountsModel } from '../../../../Services/historical-accounts/models/MovAccountsModel';
import { HistoricalAccountsService } from '../../../../Services/historical-accounts/historical-accounts.service';
import { AccountPartialModel } from '../../../../Services/historical-accounts/models/AccountPartialModel';
import { AccountIni } from '../../../../Services/historical-accounts/models/AccountIni';
import { ParameterModel } from '../../../../Services/historical-accounts/models/ParameterModel';
import { CertificationTransction } from '../../../../Services/historical-accounts/models/CertificationTransctionModel';
import { StoreSelectedMessagesModel } from '../../../../Services/historical-accounts/models/StoreSelectedMessagesModel';
import { CurrencyAndAmount } from '../../../../Services/transfers/models/currency-and-amount';
import { HistoricalModelDto } from '../../../../Services/historical-accounts/models/historical-model-dto';
import { Router, ActivatedRoute } from '@angular/router';
import { AccountDto } from '../../../../Services/accounts/models/account-dto';
import { AccountUse } from '../../../../Services/shared/enums/account-use';
import { Roles } from '../../../../Services/shared/enums/roles';
import { MovAccountsDto } from '../../../../Services/historical-accounts/models/MovAccountsDto';
import { SaveHistoricalAccountDto } from '../../../../Services/historical-accounts/models/save-historical-account-dto';
import { TokenCredentials } from '../../../../Services/tokens/models/token-credentials';
import { ProcessBatchResult } from '../../../../Services/historical-accounts/models/process-batch-result';
import { InputApprovers } from '../../../../Services/approvers-and-controllers/models/input-approvers';
import moment from 'moment';

@Component({
  selector: 'app-generate-end',
  standalone: false,
  templateUrl: './generate-end.component.html',
  styleUrls: ['./generate-end.component.css'],
  providers: [HistoricalAccountsService]
})
export class GenerateEndComponent implements OnInit {

  @Input() vectorIn: MovAccountsModel[] = [];
  @Input() vectorListAccountMovement: MovAccountsModel[] = [];
  @Input()miModel!: MovAccountsDto;
  @Input() isFlagVisible: boolean;
  @Input()inDetailAccountSource!: AccountPartialModel;
  @Output() onChangeNew = new EventEmitter();
  @Output() change = new EventEmitter();
  @Output() valueGlobal = new EventEmitter<boolean>();

  public AccountSelect: AccountPartialModel = new AccountPartialModel();
  public accountIni: AccountIni = new AccountIni();
  public accountIniCtrAuth: AccountIni = new AccountIni();
  public ListAccount: AccountPartialModel[] = [];
  public ListParamGroup: ParameterModel[] = [];
  public ListParamGroupIntro: ParameterModel = new ParameterModel();
  public CertificateSelect: ParameterModel = new ParameterModel();
  public directions!: string;
  public IniCtrolAuth: AccountIni = new AccountIni();
  listAccountMovement: MovAccountsModel[] = [];

  public NumCtrol = 0;
  public NumAuth = 0;
  public isVisibleToken: boolean;
  public detailIni!: CertificationTransction;
  public detailResult: CertificationTransction[] = [];
  public storeIni: StoreSelectedMessagesModel = new StoreSelectedMessagesModel();
  public storeResult: StoreSelectedMessagesModel = new StoreSelectedMessagesModel();
  numProcesBatch = 0;
  public swNumberIdProcess!: boolean;
  public swBtnAceptaVer = false;
  HistoricalDto: HistoricalModelDto = new HistoricalModelDto(); // borrar
  SaveHistoricalDto: SaveHistoricalAccountDto = new SaveHistoricalAccountDto();
  isRemoveModalVisible: boolean;

  certificateTemp!: CertificationTransction;
  certificateListTemp: CertificationTransction[] = [];
  sourceAccountDto: AccountDto = new AccountDto();
  types: string[] = ['P'];
  // Otro componente
  approversRequest: InputApprovers = new InputApprovers();
  sourceAccountRequest: AccountDto = new AccountDto();
  data: CurrencyAndAmount = new CurrencyAndAmount();
  typeCertificateSelected: ParameterModel = new ParameterModel();
  valueGlobalTwo = false;
  AmountTotal!: number;
  message!: string;
  isVisibleMessage = false;
  listVectorIn: MovAccountsModel[] = [];
  rowsPerPage: number[] = [10, 15, 20, 25];
  pageItems = 10;

  constructor(private _router: Router, private _HistoricalAccountsService: HistoricalAccountsService,
    private messageService: GlobalService, private cdRef: ChangeDetectorRef) {
    this.isFlagVisible = false;
    this.isVisibleToken = false;
    this.valueGlobalTwo = false;
    this.isRemoveModalVisible = false;
  }

  ngOnInit() {
    this.armar();
    this.isVisibleToken = false;
    this.swNumberIdProcess = false;
    this.valueGlobalTwo = false;
    this.approversRequest = ({
      operationTypeId: OperationType.formularioSolicitud
    });
    this.sourceAccountDto = new AccountDto({
      accountUse: String.fromCharCode(AccountUse.debit),
      roleId: Roles.consultant,
      operationTypeId: [OperationType.consultarCuentas],
      types: this.types
    });
  }

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }

  armar() {
    this.directions = '';
    this.accountIni.OperationTypeId = [OperationType.formularioSolicitud];
    this.getListAccount(this.accountIni);
    this.ListParamGroupIntro.groups = 'CERT';
    this.getCertificateType(this.ListParamGroupIntro);
  }

  getListAccount(modIni: AccountIni) {
    this._HistoricalAccountsService.getListAccount(modIni)
      .subscribe({next: (response: AccountPartialModel[]) => {
        this.ListAccount = response;
      }, error: _err => this.messageService.info('', _err.message)});
  }

  handleChangeDdpCertif($event: any) {
    this.typeCertificateSelected = $event;
  }

  getCertificateType(param: ParameterModel) {
    this._HistoricalAccountsService.getCertificateType()
      .subscribe({next: (response: ParameterModel[]) => {
        this.ListParamGroup = response;
        this.CertificateSelect = response[0];
        this.typeCertificateSelected = response[0];
      }, error: _err => this.messageService.info('', _err.message)});
  }

  handleTocken() {
    if (!this.valida()) {
      this.isVisibleToken = true;
      this.valueGlobal.emit(true);
      this.valueGlobalTwo = true;
    }
  }

  handleAcept($event: TokenCredentials) {
    if (!this.valida()) {
      this.isVisibleToken = true;
      this.swBtnAceptaVer = true;
      this.AmountTotal = 0;
      for (let i = 0; i < this.vectorIn.length; i++) {
        for (let j = 0; j < this.vectorListAccountMovement.length; j++) {
          if (this.vectorIn[i].id === this.vectorListAccountMovement[j].id) {
            this.listAccountMovement = this.vectorListAccountMovement;
            this.certificateTemp = new CertificationTransction();
            this.certificateTemp.amount = this.vectorListAccountMovement[j].amount;
            this.AmountTotal = this.AmountTotal + this.certificateTemp.amount;
            this.certificateTemp.currency = this.vectorListAccountMovement[j].currency;
            if (this.vectorListAccountMovement[j].moveName != null) {
              this.certificateTemp.gloss = this.vectorListAccountMovement[j].moveName.trim().substr(0, 30);
            } else {
              this.certificateTemp.gloss = '';
            }
            this.certificateTemp.movementDate = moment(this.vectorListAccountMovement[j].movementDate).format('YYYYMMDD');
            this.certificateTemp.movementHour = moment(this.vectorListAccountMovement[j].hora, 'HH:mm:ss').format('HHmmss');
            this.certificateTemp.accountsFormatted = this.vectorListAccountMovement[j].formattedAccount;
            if (this.CertificateSelect.description != null) {
              this.certificateTemp.typeCertificate = this.CertificateSelect.description.trim();
            }
            this.certificateTemp.addressShipping = this.directions;
            this.certificateTemp.user = this.vectorListAccountMovement[j].users;
            this.certificateTemp.numberOperation = this.vectorListAccountMovement[j].sequentialCode;
            this.certificateTemp.certificateType = this.typeCertificateSelected.code;
            this.certificateListTemp.push(this.certificateTemp);
          }
        }
      }
      this.SaveHistoricalDto.tokenCode = $event.code;
      this.SaveHistoricalDto.tokenName = $event.name;
      this.SaveHistoricalDto.sourceAccountId = this.inDetailAccountSource.id;
      this.SaveHistoricalDto.sourceAccount = 'REQUEST_CERTIFICATION';
      this.SaveHistoricalDto.currency = this.inDetailAccountSource.currency;
      this.SaveHistoricalDto.CertificateTransactions = this.certificateListTemp;
      this.SaveHistoricalDto.operationTypeId = OperationType.formularioSolicitud;
      this.SaveHistoricalDto.description = this.directions;

      if (this.AmountTotal > 0) {
        this.SaveHistoricalDto.amount = this.AmountTotal;
      } else {
        this.SaveHistoricalDto.amount = 0;
      }
      this._HistoricalAccountsService.saveHistorical(this.SaveHistoricalDto)
        .subscribe({next: (res: ProcessBatchResult) => {
          this.numProcesBatch = res.processBatchId;
          this.isRemoveModalVisible = true;
          this.swNumberIdProcess = true;
          this.isVisibleToken = false;
          this.valueGlobalTwo = true;
        }, error: _err => this.messageService.info('', _err.message)});
    }
  }

  valida(): Boolean {
    this.isVisibleMessage = false;
    if (this.directions.length === 0) {
      this.isVisibleMessage = true;
      this.message = 'Debe ingresar la dirección de entrega.';
      return this.isVisibleMessage;
    }
    if (this.vectorIn.length === 0 || this.vectorListAccountMovement.length === 0) {
      this.isVisibleMessage = true;
      this.message = 'Debe escoger registros de la lista.';
    }
    return this.isVisibleMessage;
  }

  handleTokenSubmit($event: TokenCredentials) {
    if ($event) {
      this.isVisibleToken = false;
      this.handleAcept($event);
    }
  }

  handleApproversOrControllersChanged($event: any) {

  }

  back() {
    this.isRemoveModalVisible = false;
    this._router.navigate(['/queries/HistoricalAccounts']);
  }

  handleSourceAccountChanged($event: any) {
    this.inDetailAccountSource = $event;
  }

  handlePageChanged($event: number) {
    this.listVectorIn = this.vectorIn.slice((($event - 1) * this.pageItems), this.pageItems * $event);
  }

  handleViewRows($event: string) {
    this.pageItems = +$event;
    this.handlePageChanged(0);
  }
}
