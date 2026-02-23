import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AccountDto } from '../../../../Services/accounts/models/account-dto';
import { AccountResult } from '../../../../Services/balances-and-movements/models/account-result';
import { AdminQRPaymentData } from '../../../../Services/qr/models/AdminQRPaymentData';
import { BusinesBranchId } from '../../../../Services/qr/models/BusinesBranchId';
import { ClientResponseUser } from '../../../../Services/qr/models/ClientResponseUser';
import { ListAtmQR } from '../../../../Services/qr/models/ListAtmQR';
import { ListBranchQR } from '../../../../Services/qr/models/ListBranchQR';
import { Operation } from '../../../../Services/qr/models/Operation';
import { RequestCaja } from '../../../../Services/qr/models/RequestCaja';
import { RequestSucursal } from '../../../../Services/qr/models/RequestSucursal';
import { RegBoQrService } from '../../../../Services/qr/reg-bo-qr.service';
import { RegisterService } from '../../../../Services/qr/register.service';
import { AccountTypes } from '../../../../Services/shared/enums/account-types';
import { AccountUse } from '../../../../Services/shared/enums/account-use';
import { OperationType } from '../../../../Services/shared/enums/operation-type';
import { Roles } from '../../../../Services/shared/enums/roles';
import { GlobalService } from '../../../../Services/shared/global.service';
import { CurrencyAndAmount } from '../../../../Services/transfers/models/currency-and-amount';
import { PaginationComponent } from '../../../../Views/shared/cw-components/pagination/pagination.component';

@Component({
  selector: 'app-admin-caja',
  standalone: false,
  templateUrl: './admin-caja.component.html',
  styleUrls: ['./admin-caja.component.css']
})
export class AdminCajaComponent implements OnInit, OnChanges {
  disabled: boolean = false;
  showDetailForm: boolean = false;
  operation: number = 0;
  isVisibleToken = false;
  isPreSave = false;
  isDisabledForm = false;
  detail: RequestCaja = new RequestCaja();
  public numberAccount: string = '';
  respSuc: RequestSucursal[] = []
  spreadsheetSize!: number;
  cajaNewList: RequestCaja[] = [];
  spreadsheetPerPage: RequestCaja[] = [];
  itemsPerPage = 5;
  listAtmQR: ListAtmQR[] = [];
  visible: boolean = false;
  adminQRPaymentData: AdminQRPaymentData = new AdminQRPaymentData();
  businesBranch: BusinesBranchId = new BusinesBranchId()
  newListBranchQR: ListBranchQR[] = [];
  newUserAtmlist: ClientResponseUser[] = []
  isOverdraftBalance: boolean;
  registrarCaja: boolean = true;

  @Input() ballot!: any;
  @Input() accountDto: AccountDto;
  @Input() userAtm: ClientResponseUser[] = []
  @Input() listBranchQr: ListBranchQR[] = [];
  @Input() selectedAccountId: number;
  @Input() showBarRoute = true;
  @Input() showBalances = true;
  @Input() businesId: number = 0;
  @Input() businesCode: string = '';
  @Input() defaultAccount = 0;
  @Input() onlyCurrencyBOL = false;
  @Input() isAwait = false;
  @Input() showDetails = true;
  @Input() loadFirstAccount = true;
  @Input() accountRequest: AccountDto = new AccountDto();
  @Input() companyAccounts!: boolean;

  @Output() onChange: EventEmitter<CurrencyAndAmount>;
  @ViewChild('cajaForm') form3!: NgForm;
  @ViewChild(PaginationComponent) pagination: PaginationComponent = new PaginationComponent();
  constructor(private cdRef: ChangeDetectorRef, private router: Router, private globalService: GlobalService,
    private servicesQr: RegisterService, private regBoQrServices: RegBoQrService,) {
    this.selectedAccountId = 0;
    this.disabled = false;
    this.isOverdraftBalance = false;
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
    });
    this.onChange = new EventEmitter();
  }

  ngOnInit(): void {
    this.getUserAll();
    this.getAtm()
    this.getBranchQR(this.businesBranch);
  }

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.businesBranch.businessId = changes['businesId'].currentValue;
  }
  handlePageChanged(pageNumber: number) {
    if (this.adminQRPaymentData.cajaRequest.length > 0){
      this.spreadsheetPerPage = this.adminQRPaymentData.cajaRequest.slice((pageNumber - 1) * this.itemsPerPage, this.itemsPerPage * pageNumber);
    }
  }
  handleViewRows($event: string) {
    this.itemsPerPage = +$event;
    this.handlePageChanged(0);
  }
  handleAccountChanged($event: AccountResult) {
    this.numberAccount = $event.formattedNumber;
  }
  handleValidate() {
    if (this.form3.form.valid) {
      this.showDetailForm = false;
      this.visible = true;

      this.executeOperation();
      this.handlePageChanged(1)
      this.globalService.validateAllFormFields(this.form3.form);

      this.updateSpreadsheet(this.adminQRPaymentData.cajaRequest);
    } else {
      this.globalService.danger('', 'Lo siento, ha habido uno mas errores en el formulario. Por favor Revisa tus datos.')
    }
  }
  handleCancel() {
    this.showDetailForm = false;

    this.setNewRow();
  }


  handleAddRow() {
    this.showDetailForm = true;
    this.getUserAll();
    this.handleShowAdditionForm();
    this.getBranchQR(this.businesBranch)
  }

  getBranchQR(idBis: BusinesBranchId): void {
    this.servicesQr.getBranchesQR(idBis)
      .subscribe({
        next: (resp: ListBranchQR[]) => {

          this.newListBranchQR = resp;
        },
        error: (error: any) => {
          //console.error("Ocurrió un error al obtener los QRs de la sucursal", error);
        }
      });
  }
  handleShowAdditionForm(): void {
    this.setNewRow();
  }

  executeOperation(): void {
    this.operation = Operation.adition;
    switch (this.operation) {
      case Operation.adition:
        this.detail.businessCode = +this.businesCode;
        this.detail.line = this.adminQRPaymentData.cajaRequest.length + 1;
        this.detail.account=this.numberAccount;
        this.adminQRPaymentData.cajaRequest.push(this.detail);
        break;
      case Operation.update:
        this.adminQRPaymentData.cajaRequest[this.detail.line - 1] = this.detail;
        break;
    }
    this.spreadsheetSize = this.adminQRPaymentData.cajaRequest.length;
  }
  setNewRow() {
    this.detail = new RequestCaja();
  }

  updateSpreadsheet(branchReqRes: RequestCaja[]) {
    this.adminQRPaymentData.cajaRequest = branchReqRes;
    this.cajaNewList = branchReqRes;
    this.spreadsheetSize = branchReqRes.length;
    if (this.pagination !== undefined) { this.pagination.ngOnChanges(); }
  }
  selectBranchQr($event: ListBranchQR[]) {

    for (let x of $event) {

      if (this.detail.branchCode.toString() === x.branchCode.toString()) {

        this.detail.branchCode = +x.branchCode;
        this.detail.branchQRPaymentId = x.id;
        this.detail.branchName = x.branchName;
        this.detail.atmCity = x.city;
      }
    }
  }
  selectUserhQr($event: ClientResponseUser[]) {
    for(let x of $event){
      if (this.detail.qrUserId.toString() === x.qrUserId.toString()) {
        this.detail.userClientId = x.id
        this.detail.qrUserId = x.qrUserId;
        this.detail.cellphone = x.cellphone;
        this.detail.userClieName = x.name!;
        this.detail.userType = x.userType;
      }
    }
  }
  handleShowToken(_approversAndControllersValidation?: boolean) {

    if (this.detail.line > 0) {
      this.saveAtm();
      this.globalService.success('Info:', 'Disfruta de Qrs, Se registraron satisfactoriamente sus sucursales y usuarios.')
    } else {
      this.globalService.success('Info:', 'Disfruta de Qrs, Se registraron satisfactoriamente sus sucursales y usuarios.')
      this.router.navigate(['/qr-multiplica/qr-multiplica-bcp']);
    }
  }

  saveAtm() {
    this.regBoQrServices.regAtmhQr(this.adminQRPaymentData)
      .subscribe({
        next: (_resp) => {
          this.globalService.success('Info:', 'Su registro de Caja fue exitoso.')
          this.router.navigate(['/qr-multiplica/qr-multiplica-bcp']);
        }
      })
  }
  handleValidateNoToken(approversAndControllersValidation?: boolean) {
    this.handleValidate();
    if (approversAndControllersValidation) {
      this.ballot.isPrePreparer = true;
      this.isPreSave = true;
    }
  }

  getUserAll() {
    this.businesBranch.option = 2;
    this.regBoQrServices.getUsersQr(this.businesBranch)
      .subscribe({
        next: (resp: ClientResponseUser[]) => {
          this.newUserAtmlist = resp
          if (this.newUserAtmlist.length > 0) {
            this.visible = true;
            this.newUserAtmlist.forEach(x => {
              if (x.bachAtmId === 0) {
                this.registrarCaja = false;
              }
            })
          }
        }, error: _err => {
//not more
        }
      })
  }

  getAtm() {
    this.businesBranch.ListBranch = 'A';
    this.servicesQr.getAtmQR(this.businesBranch)
      .subscribe({
        next: resp => {
          this.listAtmQR = resp
          if (this.listAtmQR.length > 0) {
            this.visible = true;
            this.spreadsheetSize = this.listAtmQR.length;
          }
        }, error: _err => {
          //not more
        }
      })
  }
}
