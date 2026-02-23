import {Component, EventEmitter, OnInit, Output, ViewChild, ChangeDetectorRef} from '@angular/core';
import {NgForm} from '@angular/forms';
import {AuthorizationService} from '../../../../Services/authorization/authorization.service';
import {BatchDetail} from '../../../../Services/authorization/models/batch-detail';
import {ProcessBatch} from '../../../../Services/authorization/models/process-batch';
import {GlobalService} from '../../../../Services/shared/global.service';
import {UserService} from '../../../../Services/users/user.service';
import {InputApprovers} from '../../../../Services/approvers-and-controllers/models/input-approvers';
import {OperationType} from '../../../../Services/shared/enums/operation-type';
import {UtilsService} from '../../../../Services/shared/utils.service';
import {TokenCredentials} from '../../../../Services/tokens/models/token-credentials';
import {Constants} from '../../../../Services/shared/enums/constants';
import {LimitsService} from '../../../../Services/limits/limits.service';
import {CompanyLimitsResult} from '../../../../Services/limits/models/company-limits-result';
import {UifService} from '../../../../Services/uif/uif.service';
import {BatchUIFRegistered} from '../../../../Services/uif/models/batch-uif-registered';
import {BatchUIFResult} from '../../../../Services/uif/models/batch-uif-result';
import {PaginationDto} from '../../../../Services/authorization/models/pagination-dto';
import {TransactionFx} from "../../../../Models/transaction-fx";
// @ts-ignore
import * as bootstrap from 'bootstrap';
import {FxService} from "../../../../Services/Fx/fx.service";
import {CommonFxService} from "../../../../Services/Fx/common-fx.service";
import {mensajes} from "../../../../Models/Mensajes";

@Component({
  selector: 'app-pending-batch-list',
  standalone: false,
  templateUrl: './pending-batch-list.component.html',
  styleUrls: ['./pending-batch-list.component.css'],
  providers: [AuthorizationService, UtilsService, LimitsService, UifService]
})

export class PendingBatchListComponent implements OnInit {
  showAuthorizerLimit = false;
  rowsPerPageControl: number[] = [10, 15, 20, 25];
  rowsPerPageAuthorize: number[] = [10, 15, 20, 25];
  rowsPerPagePreSave: number[] = [10, 15, 20, 25];
  pageItemsAuth = 10;
  pageItemsControl = 10;
  pageItemsPreSave = 10;
  showPreSave = false;
  showAuthorize = false;
  flagPreS = false;
  flagCtrl = false;
  flagAuth = false;
  batchId!: number;
  operationTypeId!: number;
  rejectionCause!: string;
  showRejectBatchForm = false;
  showAuthorizersOrControllers = false;
  showBatchDetail = false;
  role!: string;
  isAdministrative = false;
  operationType!: string;
  controllerScheme = false;
  approversDto!: InputApprovers;
  batchIdsToControl: number[] = [];
  batchIdsToPreSave: number[] = [];
  batchIdsToAuthorize: number[] = [];
  batchIdsMultiples: number[] = [];
  batchIdsToReject: number[] = [];
  totalBatchesToPreSave = 0;
  totalBatchesToControl = 0;
  totalBatchesToAuthorize = 0;
  allBatchesToPreSaveSelected = false;
  allBatchesToControlSelected = false;
  allBatchesToAuthorizeSelected = false;
  administrativeRolesOperations: number[] = [OperationType.formularioSolicitud, OperationType.boletaGarantia, OperationType.formularioModificacion];
  batchesToPreSave: BatchDetail[] = [];
  batchesToControl: BatchDetail[] = [];
  batchesToAuthorize: BatchDetail[] = [];
  batchesToPreSavePerPage: BatchDetail[] = [];
  batchesToControlPerPage: BatchDetail[] = [];
  batchesToAuthorizePerPage: BatchDetail[] = [];
  @Output() onChange: EventEmitter<ProcessBatch> = new EventEmitter();
  @Output() onChangeUIF: EventEmitter<BatchDetail[]> = new EventEmitter();
  @ViewChild('rejectBatchForm') form!: NgForm;
  @ViewChild('fundsForm') funds!: NgForm;

  totalAmount: any = [];
  showTokenForm = false;
  batchInformation: ProcessBatch = new ProcessBatch();
  amountLimit = 10000;
  excedeedAmount = false;
  newAmount = 0;
  is_validbatchtoken!: boolean;
  disabledPreparer = false;
  limits: CompanyLimitsResult = new CompanyLimitsResult();
  showFunds = false;
  batchUIFRegistered: BatchUIFRegistered[] = [];
  originDestinationFunds: BatchUIFRegistered = new BatchUIFRegistered();
  originFunds: BatchUIFRegistered = new BatchUIFRegistered();
  batchUIFResult: BatchUIFResult [] = [];
  paginationDto: PaginationDto = new PaginationDto();
  isVisibleEBS = false;
  informationUIF: BatchDetail[] = [];
  public transactionFx: TransactionFx;
  public transactionFxModal: boolean = false;
  constructor(private authorizationService: AuthorizationService, private globalService: GlobalService,
              private utilsService: UtilsService, private fxService: FxService, private commonFx: CommonFxService,
              private userService: UserService, private cdRef: ChangeDetectorRef, private limitsService: LimitsService,
              private uifService: UifService) {
    this.transactionFx = new TransactionFx();
  }

  ngOnInit() {
    this.paginationDto.rowIniAuthorize = 1;
    this.paginationDto.numberRowAuthorize = 10;
    this.paginationDto.rowIniController = 1;
    this.paginationDto.numberRowController = 10;
    this.paginationDto.rowIniPreSave = 1;
    this.paginationDto.numberRowPreSave = 10;
    this.getList(this.paginationDto);
    this.showAuthorizerLimit = false;
    this.is_validbatchtoken = window.sessionStorage.getItem('is_validbatchtoken') === 'true' ? true : false;
  }

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }

  getList(paginationDto: PaginationDto) {
    this.flagPreS = false;
    this.controllerScheme = this.userService.getUserToken().controller_scheme!;
    const roles: any = this.userService.getUserToken().role;
    this.showPreSave = roles.includes('INICIADOR');
    this.authorizationService.getPendingBatches(paginationDto)
      .subscribe({
        next: response => {
          this.batchesToControl = response.batchesToControl;
          this.batchesToControlPerPage = this.batchesToControl;
          this.totalBatchesToControl = response.totalItemsControl;
          this.batchesToAuthorize = response.batchesToAuthorize;
          this.batchesToAuthorizePerPage = this.batchesToAuthorize;
          this.totalBatchesToAuthorize = response.totalItemsAuthorize;
          this.batchesToPreSave = response.batchesToPreSave;
          this.batchesToPreSavePerPage = this.batchesToPreSave;
          this.totalBatchesToPreSave = response.totalItemsPreSave;
          if (this.totalBatchesToControl > 0) {
            this.isVisibleEBS = this.batchesToControl[0].isVisibleEBSNumber;
          } else if (this.totalBatchesToAuthorize > 0) {
            this.isVisibleEBS = this.batchesToAuthorize[0].isVisibleEBSNumber;
          } else if (this.totalBatchesToPreSave > 0) {
            this.isVisibleEBS = this.batchesToPreSave[0].isVisibleEBSNumber;
          } else {
            this.isVisibleEBS = false;
          }
          this.flagPreS = true;
          this.flagCtrl = true;
          this.flagAuth = true;
        }, error: _err => console.error('Autorización', _err.message)
      });
  }

  handleBatchesToControlPageChanged($event: number) {
    this.allBatchesToControlSelected = false;
    this.handleAllBatchesToControlChecked();
    this.paginationDto.numberRowController = this.pageItemsControl;
    if (this.paginationDto.rowIniController !== -1) {
      this.paginationDto.rowIniController = $event;
      this.getList(this.paginationDto);
    } else {
      this.paginationDto.rowIniController = $event;
      this.batchesToControlPerPage = this.batchesToControl;
    }
  }

  handleBatchesToAuthorizePageChanged($event: number) {
    this.handleAllBatchesToAuthorizeChecked();
    this.allBatchesToAuthorizeSelected = false;
    this.paginationDto.numberRowAuthorize = this.pageItemsAuth;
    if (this.paginationDto.rowIniAuthorize !== -1) {
      this.paginationDto.rowIniAuthorize = $event;
      this.getList(this.paginationDto);
    } else {
      this.paginationDto.rowIniAuthorize = $event;
      this.batchesToAuthorizePerPage = this.batchesToAuthorize;
    }
  }

  handleBatchToControlChecked(batch: BatchDetail) {
    this.batchIdsToControl = this.changeStatus(batch.isSelected, this.batchIdsToControl, batch.id, null!);
  }

  handleBatchToAuthorizeChecked(batch: BatchDetail) {
    this.batchIdsToAuthorize = this.changeStatus(batch.isSelected, this.batchIdsToAuthorize, batch.id, batch);
    if (batch.operationTypeId === 20) {
      this.batchIdsMultiples = this.changeStatus(batch.isSelected, this.batchIdsMultiples, batch.id, batch);
      if (!batch.isSelected) {
        for (let i = 0; i < this.batchUIFResult.length; i++) {
          if (this.batchUIFResult[i].processBatchId === batch.id) {
            this.batchUIFResult.splice(i, 1);
          }
        }
        for (let i = 0; i < this.batchUIFRegistered.length; i++) {
          if (this.batchUIFRegistered[i].processBatchId === batch.id) {
            this.batchUIFRegistered.splice(i, 1);
          }
        }
      }
    }
  }

  handleAllBatchesToControlChecked() {
    this.batchIdsToControl = [];
    for (const batch of this.batchesToControlPerPage) {
      batch.isSelected = this.allBatchesToControlSelected;
      this.batchIdsToControl = this.changeStatus(this.allBatchesToControlSelected, this.batchIdsToControl, batch.id, null!);
    }
  }

  handleAllBatchesToAuthorizeChecked() {
    this.batchIdsToAuthorize = [];
    this.batchIdsMultiples = [];
    this.batchUIFResult = [];
    this.informationUIF = [];
    for (const batch of this.batchesToAuthorizePerPage) {
      batch.isSelected = this.allBatchesToAuthorizeSelected;
      this.batchIdsToAuthorize = this.changeStatus(this.allBatchesToAuthorizeSelected, this.batchIdsToAuthorize, batch.id, batch);
      if (batch.operationTypeId === 20) {
        this.batchIdsMultiples = this.changeStatus(this.allBatchesToAuthorizeSelected, this.batchIdsMultiples, batch.id, batch);
      }
    }
  }

  handleRejectBatch() {
    this.globalService.validateAllFormFields(this.form.form);
    if (this.form.valid) {
      this.showRejectBatchForm = false;
      this.onChange.emit(new ProcessBatch({
        batchIds: this.batchIdsToReject,
        operation: 3,
        rejectionCause: this.rejectionCause
      }));
    }
  }

  public async handleShowBatchDetail(batch: BatchDetail) {
    if ([48, 49].includes(batch.operationTypeId)) {
      try {
        this.transactionFx = await this.commonFx.detailFx(batch.id);
        this.transactionFxModal = true;
      } catch (e: any) {
        this.commonFx.showMessage(mensajes['500'] + " " + e.message, 'snackbar-danger');
      }
    } else {
      this.operationType = batch.operationType;
      this.operationTypeId = batch.operationTypeId;
      this.batchId = batch.id;
      this.showBatchDetail = true;
    }
  }

  handleShowBatchAuthorizersOrControllers(batch: BatchDetail, role: string) {
    this.role = role;
    this.showAuthorizersOrControllers = true;
    this.operationType = batch.operationType;
    this.isAdministrative = this.administrativeRolesOperations.includes(batch.operationTypeId);
    this.approversDto = new InputApprovers({
      operationTypeId: batch.operationTypeId,
      batchId: batch.id,
      isAuthorizerControl: batch.isAuthorizerControl,
      accountId: batch.accountId,
      accountNumber: batch.account
    });
  }

  handleBatchesToControl() {
    this.onChange.emit(new ProcessBatch({batchIds: this.batchIdsToControl, operation: 1, rejectionCause: ''}));
  }

  handleBatchesToAuthorize() {
    this.batchUIFResult = [];
    this.batchUIFRegistered = [];
    for (const item of this.batchIdsMultiples) {
      this.batchUIFRegistered.push({
        processBatchId: item,
        errorMessage: '',
        originFunds: '',
        destinationFunds: ''
      });
    }
    if (this.batchIdsMultiples.length > 0) {
      this.uifService.verifyUifPendingPayments(this.batchUIFRegistered).subscribe({
        next: resp => {
          this.batchUIFResult = resp;
          if (this.batchUIFResult.length === 0) {
            this.onChange.emit(new ProcessBatch({
              batchIds: this.batchIdsToAuthorize,
              operation: 2,
              rejectionCause: ''
            }));
            this.onChangeUIF.emit(this.informationUIF);
          }
        }
      });
    } else {
      this.onChange.emit(new ProcessBatch({batchIds: this.batchIdsToAuthorize, operation: 2, rejectionCause: ''}));
      this.onChangeUIF.emit(this.informationUIF);
    }
  }

  handleShowFunds(batch: BatchDetail) {
    this.originDestinationFunds.originFunds = undefined!;
    this.originDestinationFunds.destinationFunds = undefined!;
    this.originDestinationFunds.processBatchId = batch.id;
    this.showFunds = true;
  }

  handleSaveFunds() {
    this.globalService.validateAllFormFields(this.funds.form);
    if (this.funds.valid) {
      this.uifService.updateUifDeclarations(this.originDestinationFunds).subscribe({
        next: resp => {
          this.showFunds = false;
          for (let i = 0; i < this.batchUIFResult.length; i++) {
            if (this.batchUIFResult[i].processBatchId === this.originDestinationFunds.processBatchId) {
              this.batchUIFResult.splice(i, 1);
            }
          }
          this.globalService.info('Origen y Destino de Fondos', resp);
        }
      });
    }
  }

  handleBatchesToPreSave() {
    this.limitsService.getCompanyLimits()
      .subscribe({
        next: response => {
          this.limits = response;
          if (this.utilsService.sumTotal(this.totalAmount) > this.limits.companyLimit) {
            this.excedeedAmount = true;
            this.disabledPreparer = true;
          } else {
            this.showTokenForm = true;
          }
        }, error: _err => this.globalService.warning('Servicio de límites', _err.message)
      });
  }

  changeStatus(selected: boolean, array: number[], item: number, batchUif: BatchDetail): number[] {
    if (selected) {
      array.push(item);
      let aux = this.informationUIF?.filter(x => x.id == item).length;
      if (aux == 0 && batchUif != null) {
        this.informationUIF.push(batchUif);
      }
    } else {
      array.splice(array.indexOf(item, 0), 1);
      for (let i = 0; i < this.informationUIF.length; i++) {
        if (this.informationUIF[i].id === item) {
          this.informationUIF.splice(i, 1);
        }
      }
    }
    return array;
  }

  handleChangeDetail() {
    this.paginationDto.rowIniAuthorize = 1;
    this.paginationDto.numberRowAuthorize = 10;
    this.paginationDto.rowIniController = 1;
    this.paginationDto.numberRowController = 10;
    this.paginationDto.rowIniPreSave = 1;
    this.paginationDto.numberRowPreSave = 10;
    this.getList(this.paginationDto);
  }

  handleViewRows($event: string) {
    this.pageItemsControl = +$event;
  }

  handleViewRowsAuthorize($event: string) {
    this.pageItemsAuth = +$event;
  }

  handleViewRowsPreSave($event: string) {
    this.pageItemsPreSave = +$event;
  }

  handleBatchesToPreSavePageChanged($event: number) {

    if (this.allBatchesToPreSaveSelected) {
      this.allBatchesToPreSaveSelected = false;
      this.batchesToPreSave.forEach(x => x.isSelected = false);
    } else if (!this.allBatchesToPreSaveSelected && this.batchesToPreSavePerPage.length === 0) {
      this.batchesToPreSavePerPage.forEach(x => x.isSelected = false);
    }

    this.paginationDto.numberRowPreSave = this.pageItemsPreSave;
    if (this.paginationDto.rowIniPreSave !== -1) {
      this.paginationDto.rowIniPreSave = $event;
      this.getList(this.paginationDto);
    } else {
      this.paginationDto.rowIniPreSave = $event;
      this.batchesToPreSavePerPage = this.batchesToPreSave;
    }
  }

  handleAllBatchesToPreSaveChecked($event: any) {
    this.excedeedAmount = false;
    this.disabledPreparer = false;
    this.totalAmount = [];
    this.batchIdsToPreSave = [];
    if ($event.target.checked) {
      for (let batch of this.batchesToPreSave) {
        batch.isSelected = this.allBatchesToPreSaveSelected;
        this.batchIdsToPreSave = this.changeStatus(this.allBatchesToPreSaveSelected, this.batchIdsToPreSave, batch.id,null!);
        this.newAmount = batch.amount;
        if (batch.currency === Constants.currencyBol) {
          this.newAmount = this.utilsService.changeAmountBolToUsd(batch.amount);
        }
        this.totalAmount.push({ batchId: batch.id, amount: this.newAmount });
      }
    } else {
      this.batchesToPreSave.forEach(x => x.isSelected = false);
    }
  }

  handleBatchToPreSaveChecked($event: any, batch: BatchDetail) {
    this.excedeedAmount = false;
    this.disabledPreparer = false;
    this.batchIdsToPreSave = this.changeStatus(batch.isSelected, this.batchIdsToPreSave, batch.id,null!);

    if ($event.target.checked) {
      this.newAmount = batch.amount;
      if (batch.currency === Constants.currencyBol) {
        this.newAmount = this.utilsService.changeAmountBolToUsd(batch.amount);
      }
      this.totalAmount.push({ batchId: batch.id, amount: this.newAmount });

    } else {
      for (let i = 0; i < this.totalAmount.length; i++) {
        if (this.totalAmount[i].batchId === batch.id) {
          this.totalAmount.splice(i, 1);
        }
      }
    }
  }

  handleTokenSubmit($event: TokenCredentials) {
    this.batchInformation.batchIds = this.batchIdsToPreSave;
    this.batchInformation.operation = 4;
    this.batchInformation.rejectionCause = '';
    this.batchInformation.tokenCode = $event.code;
    this.batchInformation.tokenName = $event.name;
    this.onChange.emit(this.batchInformation);
  }
}
