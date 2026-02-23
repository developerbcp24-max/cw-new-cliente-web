import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ChangeDetectorRef,
  ViewChild,
  HostListener
} from '@angular/core';
import {InputApprovers} from '../../../../Services/approvers-and-controllers/models/input-approvers';
import {OperationType} from '../../../../Services/shared/enums/operation-type';
import {TrackTransfersDto} from '../../../../Services/track-transfers/models/track-transfers-dto';
import {TrackTransfersResult} from '../../../../Services/track-transfers/models/track-transfers-result';
import {TrackTransfersService} from '../../../../Services/track-transfers/track-transfers.service';
import {UserService} from '../../../../Services/users/user.service';
import {UtilsService} from '../../../../Services/shared/utils.service';
import {GlobalService} from '../../../../Services/shared/global.service';
import {BallotOfWarrantyService} from '../../../../Services/ballot-of-warranty/ballot-of-warranty.service';
import {BallotOfWarrantyDto} from '../../../../Services/ballot-of-warranty/models/ballot-of-warranty-dto';
import {GetBatchDto} from '../../../../Services/ballot-of-warranty/models/get-batch-dto';
import {VoucherOperationService} from '../../../../Services/vouchers/voucher-operation/voucher-operation.service';
import {VoucherDto} from '../../../../Services/vouchers/voucher-operation/models/voucher-dto';
import {TrackStatusResult} from '../../../../Services/track-transfers/models/track-status-result';
import {ParametersService} from '../../../../Services/parameters/parameters.service';
import {ParameterDto} from '../../../../Services/parameters/models/parameter-dto';
import {FxService} from "../../../../Services/Fx/fx.service";

import {TransactionFx} from "../../../../Models/transaction-fx";
import {CommonFxService} from "../../../../Services/Fx/common-fx.service";
import {mensajes} from "../../../../Models/Mensajes";


@Component({
  selector: 'app-tracking-list',
  standalone: false,
  templateUrl: './tracking-list.component.html',
  styleUrls: ['./tracking-list.component.css'],
  providers: [TrackTransfersService, UtilsService, BallotOfWarrantyService, VoucherOperationService]
})
export class TrackingListComponent implements OnInit {
  flag!: boolean;
  formatSelected!: string;
  nameReport = 'Seguimiento de operaciones';
  companyName!: string;
  batchId!: number;
  operationTypeId!: number;
  showBatchDetail = false;
  role!: string;
  isAdministrative = false;
  showAuthorizersOrControllers = false;
  operationType!: string;
  approversDto!: InputApprovers;
  totalTracks!: number;
  allTracksSelected = false;
  pageSize = 10;
  spreadsheetSize!: number;
  rowsPerPage: number[] = [10, 15, 20, 25];
  allBatchesSelected = false;
  tracksPerPage: TrackTransfersResult[] = [];
  batches: TrackTransfersResult[] = [];
  listTracks: TrackTransfersResult[] = [];
  administrativeRolesOperations: number[] = [OperationType.formularioSolicitud, OperationType.boletaGarantia, OperationType.formularioModificacion];
  @Input()
  totalItems!: number;
  @Input()
  order!: boolean;
  @Input() tracks: TrackTransfersResult[] = [];
  @Input() tracksDto: TrackTransfersDto = new TrackTransfersDto();
  @Output() changePaginate = new EventEmitter<TrackTransfersDto>();

  detail: BallotOfWarrantyDto = new BallotOfWarrantyDto();
  byteString!: string;
  isVisibleEBS = false;
  public transactionFxModal: boolean = false;

  headers = {
    col01: false,
    col02: false,
    col03: true,
    col04: true,
    col05: true,
    col06: false,
    col07: false,
  };
  requestDto: VoucherDto = new VoucherDto();
  nameVoucher!: string;

  @ViewChild('insideButton') insideButton: any;
  @ViewChild('insideElement') insideElement: any;
  showFilter = false;
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


  public transactionFx: TransactionFx;

  constructor(private ballotOfWarrantyService: BallotOfWarrantyService, private userService: UserService, private trackTransfersService: TrackTransfersService, private globalService: GlobalService,
              private cdRef: ChangeDetectorRef, private utilsService: UtilsService, private voucherOperationService: VoucherOperationService,
              private parametersService: ParametersService, private fxService: FxService, private commonFx: CommonFxService) {
    this.transactionFx = new TransactionFx();
  }

  ngOnInit() {
    this.companyName = this.userService.getUserToken().company_name!;
    this.flag = false;
  }

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }

  ngOnChanges() {
    if (this.totalItems > 0) {
      this.listTracks = this.tracks;
      this.isVisibleEBS = this.listTracks[0].isVisibleEBSNumber;
    }
  }

  handleBallotOfWarranty(batch: TrackTransfersResult) {
    this.batchId = batch.id;

    this.ballotOfWarrantyService.getDetail(new GetBatchDto({id: this.batchId}))
      .subscribe({
        next: response => {
          this.detail = response;
          let contract = atob(this.detail.contractRoe.contract);
          let byteNumbers = new ArrayBuffer(contract.length);
          let byteString = new Uint8Array(byteNumbers);
          for (let i = 0; i < contract.length; i++) {
            byteString[i] = contract.charCodeAt(i);
          }
          const blob = new Blob([byteNumbers], {type: 'application/pdf'});

          this.utilsService.donwloadReport('Contrato_' + this.batchId + '.pdf', blob);
        }, error: _err => this.globalService.info('Boleta de Garantía', _err.message)
      });
  }



  public async handleShowBatchDetail(batch: TrackTransfersResult) {
    let batchDto = new TrackStatusResult();
    batchDto.id = batch.id;
    switch (batch.operationTypeId) {
      case 48:
      case 49:
        try {
          this.transactionFx = await this.commonFx.detailFx(batch.id);
          this.transactionFxModal = true;
        } catch (e: any) {
          this.commonFx.showMessage(mensajes['500'] + " " + e.message, 'snackbar-danger');
        }
        break;
      case 8:
        this.parametersService.getByGroupAndCode(new ParameterDto({group: 'DETPDH', code: 'PDH'}))
          .subscribe({
            next: resp => {
              if (resp.value == 'A' && batch.dateCreation.toString() >= '2023-05-03T12:00:00.000') {
                this.trackTransfersService.getBatchUserValidation(batchDto)
                  .subscribe({
                    next: (response: any) => {
                      if (response.value == 'I') {
                        this.trackTransfersService.getBatchUserValidSignature(batchDto)
                          .subscribe({
                            next: (response: any) => {
                              if (response.value == 'I') {
                                this.globalService.info('Nota: ', 'Usted no tiene acceso al comprobante.');
                              } else {
                                this.operationType = batch.name;
                                this.operationTypeId = batch.operationTypeId;
                                this.batchId = batch.id;
                                this.showBatchDetail = true;
                              }
                            }
                          });
                      } else {
                        this.operationType = batch.name;
                        this.operationTypeId = batch.operationTypeId;
                        this.batchId = batch.id;
                        this.showBatchDetail = true;
                      }
                    }
                  });
              } else {
                this.operationType = batch.name;
                this.operationTypeId = batch.operationTypeId;
                this.batchId = batch.id;
                this.showBatchDetail = true;
              }
            }
          });
        break;
      default:
        this.operationType = batch.name;
        this.operationTypeId = batch.operationTypeId;
        this.batchId = batch.id;
        this.showBatchDetail = true;
    }
  }

  handleShowBatchAuthorizersOrControllers(batch: TrackTransfersResult, role: string) {
    this.role = role;
    this.showAuthorizersOrControllers = true;
    this.operationType = batch.name;
    this.isAdministrative = this.administrativeRolesOperations.includes(batch.operationTypeId);
    this.approversDto = new InputApprovers({
      operationTypeId: batch.operationTypeId,
      batchId: batch.id,
      isAuthorizerControl: batch.isAuthorizerControl,
      accountId: batch.accountId,
      accountNumber: batch.formattedAccount,
      isSignerScheme: batch.isSignerScheme
    });
  }

  getReport() {
    if (this.formatSelected != null) {
      this.flag = false;
      this.tracksDto.ReportType = this.formatSelected;
      this.trackTransfersService.getReportOperations(this.tracksDto)
        .subscribe({
          next: (resp: Blob) => {
            this.utilsService.donwloadReport((this.nameReport + '_' + this.companyName).replace(/\./gi, ' ') + '.' + this.formatSelected, resp);
          }, error: _err => console.error('Fallo del export: ', _err.message)
        });
    }
  }

  handleGetReport(tracktransfer: TrackTransfersResult, voucher: number) {
    let batchDto = new TrackStatusResult();
    batchDto.id = tracktransfer.id;
    if (tracktransfer.operationTypeId === 8) {
      this.parametersService.getByGroupAndCode(new ParameterDto({group: 'DETPDH', code: 'PDH'}))
        .subscribe({
          next: resp => {
            if (resp.value == 'A' && tracktransfer.dateCreation.toString() >= '2023-05-03T12:00:00.000') {
              this.trackTransfersService.getBatchUserValidation(batchDto)
                .subscribe({
                  next: (response: any) => {
                    if (response.value == 'I') {
                      this.trackTransfersService.getBatchUserValidSignature(batchDto).subscribe({
                        next: (resp: any) => {
                          if (resp.value == 'A') {
                            this.requestDto.numberTypeVoucher = voucher;
                            this.nameVoucher = voucher === 1 ? 'Gral_' : voucher === 2 ? 'Det_' : 'Fracc_';
                            this.requestDto.id = tracktransfer.id;
                            this.requestDto.operationTypeId = tracktransfer.operationTypeId;
                            this.requestDto.nameOperation = tracktransfer.name;
                            if (tracktransfer.operationTypeId === OperationType.pagoMultiple || tracktransfer.operationTypeId === OperationType.pagoFavorito) {
                              this.requestDto.txtName = 'PRE';
                            }
                            this.voucherOperationService.getReportVouchers(this.requestDto)
                              .subscribe({
                                next: (resp: Blob) => {
                                  this.utilsService.donwloadReport('PreComprobante' + this.nameVoucher + this.requestDto.id + '.pdf', resp);
                                }, error: _err => this.globalService.info('Por favor intente mas tarde: ', _err.message)
                              });
                          } else {
                            this.globalService.info('Nota: ', 'Usted no tiene acceso al comprobante.');
                          }
                        }
                      })
                    } else {
                      this.requestDto.numberTypeVoucher = voucher;
                      this.nameVoucher = voucher === 1 ? 'Gral_' : voucher === 2 ? 'Det_' : 'Fracc_';
                      this.requestDto.id = tracktransfer.id;
                      this.requestDto.operationTypeId = tracktransfer.operationTypeId;
                      this.requestDto.nameOperation = tracktransfer.name;
                      if (tracktransfer.operationTypeId === OperationType.pagoMultiple || tracktransfer.operationTypeId === OperationType.pagoFavorito) {
                        this.requestDto.txtName = 'PRE';
                      }
                      this.voucherOperationService.getReportVouchers(this.requestDto)
                        .subscribe({
                          next: (resp: Blob) => {
                            this.utilsService.donwloadReport('PreComprobante' + this.nameVoucher + this.requestDto.id + '.pdf', resp);
                          }, error: _err => this.globalService.info('Por favor intente mas tarde: ', _err.message)
                        });
                    }
                  }
                });
            } else {
              this.requestDto.numberTypeVoucher = voucher;
              this.nameVoucher = voucher === 1 ? 'Gral_' : voucher === 2 ? 'Det_' : 'Fracc_';
              this.requestDto.id = tracktransfer.id;
              this.requestDto.operationTypeId = tracktransfer.operationTypeId;
              this.requestDto.nameOperation = tracktransfer.name;
              if (tracktransfer.operationTypeId === OperationType.pagoMultiple || tracktransfer.operationTypeId === OperationType.pagoFavorito) {
                this.requestDto.txtName = 'PRE';
              }
              this.voucherOperationService.getReportVouchers(this.requestDto)
                .subscribe({
                  next: (resp: Blob) => {
                    this.utilsService.donwloadReport('PreComprobante' + this.nameVoucher + this.requestDto.id + '.pdf', resp);
                  }, error: _err => this.globalService.info('Por favor intente mas tarde: ', _err.message)
                });
            }
          }
        });
    } else {
      this.requestDto.numberTypeVoucher = voucher;
      this.nameVoucher = voucher === 1 ? 'Gral_' : voucher === 2 ? 'Det_' : 'Fracc_';
      this.requestDto.id = tracktransfer.id;
      this.requestDto.operationTypeId = tracktransfer.operationTypeId;
      this.requestDto.nameOperation = tracktransfer.name;
      if (tracktransfer.operationTypeId === OperationType.pagoMultiple || tracktransfer.operationTypeId === OperationType.pagoFavorito) {
        this.requestDto.txtName = 'PRE';
      }
      this.voucherOperationService.getReportVouchers(this.requestDto)
        .subscribe({
          next: (resp: Blob) => {
            this.utilsService.donwloadReport('PreComprobante' + this.nameVoucher + this.requestDto.id + '.pdf', resp);
          }, error: _err => this.globalService.info('Por favor intente mas tarde: ', _err.message)
        });
    }
  }

  handleViewRows($event: string) {
    this.pageSize = +$event;
  }


  handleChangePage($event: any) {
    this.tracksDto.numberRow = this.pageSize;
    if (this.tracksDto.rowIni !== -1) {
      this.tracksDto.rowIni = ($event - 1) * this.pageSize;
      this.changePaginate.emit(this.tracksDto);
    } else {
      this.tracksDto.rowIni = $event;
      this.listTracks = this.tracks;
    }
  }
}
