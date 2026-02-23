import { Component, OnInit, EventEmitter, Input, Output, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { VoucherOperationService } from '../../../../Services/vouchers/voucher-operation/voucher-operation.service';
import { VoucherResult } from '../../../../Services/vouchers/voucher-operation/models/voucher-result';
import { VoucherDto } from '../../../../Services/vouchers/voucher-operation/models/voucher-dto';
import { GlobalService } from '../../../../Services/shared/global.service';
import { SelectedVoucher } from '../../../../Services/vouchers/voucher-operation/models/selected-voucher';
import { FilterDto } from '../../../../Services/vouchers/voucher-operation/models/filter-dto';
import { UserService } from '../../../../Services/users/user.service';
import { UserCreationId } from '../../../../Services/vouchers/voucher-operation/models/user-creation-id';
import { UtilsService } from '../../../../Services/shared/utils.service';
import { PaymentElfecDetailDto } from '../../../../Services/elfec/models/payment-elfec-detail-dto';
import { ElfecService } from '../../../../Services/elfec/elfec.service';
import { ServicePaseService } from '../../../../Services/service-pase/service-pase.service';
import { OperationType } from '../../../../Services/shared/enums/operation-type';

@Component({
  selector: 'app-list-voucher-operation',
  standalone: false,
  templateUrl: './list-voucher-operation.component.html',
  styleUrls: ['./list-voucher-operation.component.css'],
  providers: [VoucherOperationService, UtilsService, ElfecService, ServicePaseService]
})
export class ListVoucherOperationComponent implements OnInit {

  @Output() voucherChecked = new EventEmitter();
  @Output() listVoucherChecked = new EventEmitter();
  @Output() arrayChecked = new EventEmitter();
  @Input()
  message!: string;
  @Input()inputValue!: number;
  @Input()listDetailVoucher!: VoucherResult[];
  @Input() isVisibleEBS: any;

  pageItems = 10;
  totalVouchersAMonthAgo = 0;
  requestDto: VoucherDto = new VoucherDto();
  downloadVoucher = true;
  filterDto: FilterDto = new FilterDto();
  resultVoucher: VoucherResult[] = [];
  resultVoucherTotal: VoucherResult[] = [];
  requestUserId: UserCreationId = new UserCreationId();
  totalVouchers = 0;
  vouchersCheckeds: boolean[] = [];
  vouchersDetailCheckeds: boolean[] = [];
  vouchersFractionatedCheckeds: boolean[] = [];
  vouchersTextCheckeds: boolean[] = [];
  arrayVoucher: Array<SelectedVoucher> = [];

  constructor(private voucherOperationService: VoucherOperationService, private messageService: GlobalService, private elfecService: ElfecService,
    private userService: UserService, private utilsService: UtilsService,
    private cdRef: ChangeDetectorRef, private servicePaseService: ServicePaseService) { }

  ngOnInit() {
    this.requestDto.arrayVoucher = [];
  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnChanges(changes: SimpleChanges): void {
    this.vouchersCheckeds = [];
    this.vouchersDetailCheckeds = [];
    this.vouchersFractionatedCheckeds = [];
    this.vouchersTextCheckeds = [];
  }

  verificationUser(detail: any, typeVoucher: number) {
    let isExist = 0;
    const user = this.userService.getUserToken();
    if (detail.operationTypeId === 8) {
      this.voucherOperationService.getUserId(detail).subscribe({next: resp => {

        for (let i = 0; i < resp.length; i++) {
          this.requestUserId.userId = resp[i].userId;
          if (resp[i].userId.toString() === user.nameid!.toString() ||
            resp[i].userAuthorizedId.toString() === user.nameid!.toString()) {
            isExist = 1;
          }
        }
        if (isExist === 1) {
          if (typeVoucher === 4) {
            this.getFileVoucher(detail);
          } else {
            this.getReportVoucher(detail, typeVoucher);
          }
        } else {
          this.messageService.info('Nota: ', 'Usted no tiene acceso al comprobante');
        }
      }, error: _err => this.messageService.info('Nota: ', 'Usted no tiene acceso al comprobante')});

    } else {
      if (typeVoucher === 4) {
        this.getFileVoucher(detail);
      } else {
        this.getReportVoucher(detail, typeVoucher);
      }
    }
  }

  getReportVoucher(detail: VoucherDto, typeVoucher: number) {
    this.requestDto.numberTypeVoucher = typeVoucher;
    this.requestDto.id = detail.id;
    this.requestDto.nameOperation = detail.nameOperation;
    this.requestDto.operationTypeId = detail.operationTypeId;
    this.voucherOperationService.getReportVouchers(this.requestDto)
      .subscribe({next: (resp: Blob) => {
        this.utilsService.donwloadReport(this.requestDto.nameOperation + '.pdf', resp);
      }, error: _err => this.messageService.info('No se pudo descargar su comprobante: ', 'Por favor intente mas tarde.')});
  }

  getFileVoucher(detail: VoucherDto) {
    this.requestDto.id = detail.id;
    this.requestDto.nameOperation = detail.nameOperation;
    this.requestDto.operationTypeId = detail.operationTypeId;

    this.voucherOperationService.getNameFileTxt(this.requestDto)
      .subscribe({next: response => {
        this.requestDto.txtName = response.txtName;
        this.voucherOperationService.getFileVouchers(this.requestDto)
          .subscribe({next: (resp: Blob) => {
            this.utilsService.donwloadReport(this.requestDto.txtName + '.txt', resp);
          }});
      }, error: _err => this.messageService.info('No se pudo descargar su comprobante: ', 'Por favor intente mas tarde.')});
  }

  getChecking(e: any, detail:  any, typeOperation: number) {
    let isExist = 0;
    if (e.target.checked) {
      const user = this.userService.getUserToken();
      if (detail.operationTypeId === OperationType.pagoHaberes) {
        this.voucherOperationService.getUserId(detail).subscribe({next: resp => {
          for (const list of resp) {
            this.requestUserId.userId = list.userId;
            if (list.userId.toString() === user.nameid!.toString() ||
              list.userAuthorizedId.toString() === user.nameid!.toString()) {
              isExist = 1;
            }
          }
          if (isExist === 1) {
            this.arrayVoucher.push({ id: detail.id, operationTypeId: detail.operationTypeId, nameOperation: detail.nameOperation, typeVoucher: typeOperation, operationTypeDes: detail.operationTypeDes });
          } else {
            this.messageService.info('Nota: ', ' Usted no tiene acceso al comprobante');
          }
        }, error: _err => this.messageService.info('Nota: ', ' Usted no tiene acceso al comprobante')});

      } else {
        this.arrayVoucher.push({ id: detail.id, operationTypeId: detail.operationTypeId, nameOperation: detail.nameOperation, typeVoucher: typeOperation, operationTypeDes: detail.operationTypeDes });
      }
    }
    if (!e.target.checked) {
      for (let i = 0; i < this.arrayVoucher.length; i++) {
        if (this.arrayVoucher[i].id === detail.id && this.arrayVoucher[i].typeVoucher === typeOperation) {
          this.arrayVoucher.splice(i, 1);
        }
      }
    }
    this.requestDto.arrayVoucher = this.arrayVoucher;
    this.listVoucherChecked.emit(this.requestDto.arrayVoucher);
  }

  handleGetBill(det: any) {
    if (det.operationTypeId == OperationType.pagoServicioElfec) {
      this.elfecService.getBill(new PaymentElfecDetailDto({processBatchId: det.id}))
      .subscribe({next: (resp: Blob) => {
        this.utilsService.donwloadReport('FacturaElfec' + det.id + '.pdf', resp);
      }, error: _err => this.messageService.info('No se pudo descargar su comprobante: ', 'Por favor intente mas tarde.')});
    } else if (det.operationTypeId == OperationType.pagoServicioPase) {
      this.servicePaseService.getBill(new PaymentElfecDetailDto({processBatchId: det.id}))
      .subscribe({next: (resp: Blob) => {
        this.utilsService.donwloadReport('FacturaSemapa' + det.id + '.pdf', resp);
      }, error: _err => {
        this.messageService.info('No se pudo descargar su comprobante: ', 'Por favor intente mas tarde.');
      }});
    }

  }

}
