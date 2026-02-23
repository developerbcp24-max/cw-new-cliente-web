import {Component, OnInit, Input, EventEmitter, Output} from '@angular/core';
import { VoucherDto } from '../../../../Services/vouchers/voucher-operation/models/voucher-dto';
import { VoucherOperationService } from '../../../../Services/vouchers/voucher-operation/voucher-operation.service';
import { UtilsService } from '../../../../Services/shared/utils.service';
import { GlobalService } from '../../../../Services/shared/global.service';
import { UserService } from '../../../../Services/users/user.service';
import { ParametersService } from '../../../../Services/parameters/parameters.service';
import { CurrentUser } from '../../../../Services/users/models/current-user';
//import { CurrentUser } from 'src/app/Services/users/models/current-user';

@Component({
  selector: 'app-successful-operation-modal',
  standalone: false,
  templateUrl: './successful-operation-modal.component.html',
  styleUrls: ['./successful-operation-modal.component.css'],
  providers: [UtilsService, VoucherOperationService]
})
export class SuccessfulOperationModalComponent implements OnInit {

  @Input() isSuccessful!: boolean;
  @Input() processBatchId!: number;
  @Input() isTransfer = false;
  @Input() isMasive = false;
  @Input() isTransferType = false;
  @Input() operationTypeId!: number;
  @Input() operationTypeName!: string;
  @Input() isGenericPase = false;
  @Input() visible: boolean = true;
  @Output() Accept = new EventEmitter();

  requestDto: VoucherDto = new VoucherDto();
  isMultiple = false;
  nameVoucher!: string;
  is_validbatchtoken = false;
  isVisibleDetail = false;

  constructor(private voucherOperationService: VoucherOperationService, private utilsService: UtilsService, private messageService: GlobalService,
    private paramService: ParametersService, private userService: UserService) { }

  ngOnInit() {
    this.isVisibleDetail = false;
    this.requestDto.nameOperation = '';
    this.is_validbatchtoken = window.sessionStorage.getItem('is_validbatchtoken') === 'true' ? true : false;
    if (this.operationTypeId == 8) {
        this.paramService.getValidateCompanyId()
          .subscribe({next: (resp: any) => {

            if (resp.body) {
              const user: CurrentUser = this.userService.getUserToken();
              for (let item of user.role) {
                if (item.includes('AUTORIZADOR')) {
                  this.isVisibleDetail = true;
                }
              }
            }
          }, error: err => console.log(err)});
    }
  }

  handleGetReport(voucher: number) {
    this.requestDto.isGenericPase = this.isGenericPase;
    this.requestDto.numberTypeVoucher = voucher;
    this.requestDto.id = this.processBatchId;
    this.requestDto.operationTypeId = this.operationTypeId;
    this.requestDto.txtName  = this.requestDto.nameOperation = this.isTransferType ? 'TR' : this.operationTypeName;
    this.nameVoucher = voucher === 3 ? 'Fracc_' : voucher === 2 ? 'Det_' : 'Gral_';
    this.voucherOperationService.getReportVouchers(this.requestDto)
      .subscribe({next: (resp: Blob) => {
        this.utilsService.donwloadReport('PreComprobante' + this.nameVoucher + this.processBatchId + '.pdf', resp);
      }, error: _err => this.messageService.info('No se pudo descargar su comprobante: ', 'Por favor vuelva a intentar mas tarde.')});
  }

  handleCloseModal($event: any) {
    this.isSuccessful = false;
    this.Accept.emit($event);
  }
}
