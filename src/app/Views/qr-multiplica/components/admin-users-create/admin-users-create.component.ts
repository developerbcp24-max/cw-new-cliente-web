import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { EMPTY, catchError, of, switchMap } from 'rxjs';
import { ParameterResult } from '../../../../Services/parameters/models/parameter-result';
import { AdminQRPaymentData } from '../../../../Services/qr/models/AdminQRPaymentData';
import { BusinesBranchId } from '../../../../Services/qr/models/BusinesBranchId';
import { ClientResponseUser } from '../../../../Services/qr/models/ClientResponseUser';
import { ListBusinesQR } from '../../../../Services/qr/models/ListBusinessQR';
import { Operation } from '../../../../Services/qr/models/Operation';
import { ReqUserBO } from '../../../../Services/qr/models/ReqUserBO';
import { BranchOfficeQr } from '../../../../Services/qr/models/branch-office-qr';
import { RegBoQrService } from '../../../../Services/qr/reg-bo-qr.service';
import { RegisterService } from '../../../../Services/qr/register.service';
import { GlobalService } from '../../../../Services/shared/global.service';
import { UtilsService } from '../../../../Services/shared/utils.service';
import { PaginationComponent } from '../../../../Views/shared/cw-components/pagination/pagination.component';

@Component({
  selector: 'app-admin-users-create',
  standalone: false,
  templateUrl: './admin-users-create.component.html',
  styleUrls: ['./admin-users-create.component.css']
})
export class AdminUsersCreateComponent implements OnInit {
  headers = {
    Nombre: true,
    RoleUser: true,
    EstadoUser: true,
    Accion: true
  }
  public businessQR: ListBusinesQR[] = [];
  documentTypes: ParameterResult[] = [];
  documentType: ParameterResult = new ParameterResult;
  roleQrs: ParameterResult[] = [];
  documentExtension: ParameterResult = new ParameterResult;
  documentExtensions: ParameterResult[] = [];
  roleQr: ParameterResult = new ParameterResult();


  spreadsheetPerPage: ClientResponseUser[] = [];
  showDetailForm: boolean = false;
  showDetailForm1: boolean = false;
  showRemoveRowForm: boolean = true;
  operation!: number;
  showMessageIsBlock: boolean = false;

  visible: boolean = false;
  regSegQr: boolean = true;
  @Input() modalOpen!: boolean;
  @Output() closeModalEvent = new EventEmitter();

  itemsPerPage = 5;
  businesBranch: BusinesBranchId = new BusinesBranchId()
  listClientUserQr: ClientResponseUser[] = [];


  listUserBranchQr: ClientResponseUser[] = [];
  @Output() listUserBranch = new EventEmitter<ClientResponseUser[]>()

  @Output() ballotDto = new EventEmitter<any>();
  @Output() onChange = new EventEmitter<number>();
  @Output() onchangeBallot = new EventEmitter<ClientResponseUser>();
  @Output() onChangeStep2 = new EventEmitter<number>();

  @Output() listUser = new EventEmitter<ClientResponseUser[]>();

  @Input() ballot!: ClientResponseUser;
  ////
  @Input() businesCode: string = '';
  @Input() businesId: number = 0;
  @Output() businessCode = new EventEmitter<string>();
  @Output() businessId = new EventEmitter<number>();
  ////
  @Input() userAll: ClientResponseUser[] = [];

  @ViewChild('roleForm') form1!: NgForm;
  @ViewChild('regUserForm') form2!: NgForm;
  @ViewChild('documentNumberForm') form3!: NgForm;
  @ViewChild('aditionalForm') form4!: NgForm;
  @ViewChild('originCityForm') form5!: NgForm;

  userNewList: ClientResponseUser[] = [];
  userList: ClientResponseUser[] = [];
  detail: ClientResponseUser = new ClientResponseUser();
  reqUserBo: ReqUserBO = new ReqUserBO();

  listUserQr: ClientResponseUser[] = [];
  visiblePass = false;
  maskPassword!: string;

  @ViewChild('passwordElement')
    inputPassword!: ElementRef;
    inputType: string = 'password';

  adminQRPaymentData: AdminQRPaymentData = new AdminQRPaymentData();
  spreadsheetSize!: number;
  @ViewChild(PaginationComponent) pagination: PaginationComponent = new PaginationComponent();
  @Input() disabled = false;

  isVisibleList = false;


  qrExpirations!: BranchOfficeQr[];
  listRole = [
    { code: '1', name: 'Jefe de agencia' },
    { code: '2', name: 'Cajero' }
  ];


  constructor(private cdRef: ChangeDetectorRef, private globalService: GlobalService,
    private regBoQR: RegBoQrService, private utilsService: UtilsService,
    private servicesQr: RegisterService) {
  }

  ngOnInit(): void {
    this.userList = this.userAll
    this.getUserClientAll();
    this.getUserAll();
    if (this.userList.length > 0) {
      this.handleViewRows(this.itemsPerPage)
      this.spreadsheetSize = this.userList.length;
      this.visible = true;
      this.regSegQr = false;
    }

    this.roleQrs = this.utilsService.getRoleQR();
    this.documentTypes = this.utilsService.getDocumentTypes();
    this.documentExtensions = this.utilsService.getDocumentExtension();
  }



  showPassword() {
    this.inputType = (this.inputType === 'password') ? 'text' : 'password';
  }
  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }
  getBusinessQR() {
    this.servicesQr.getBusinessQR().pipe(
      switchMap((resp: ListBusinesQR[]) => {
        this.businessQR = resp;
        this.businesId = this.businessQR[0].id;
        this.businesCode = this.businessQR[0].businessCode;
        if (this.businessQR.length === 0) {
          return this.regBoQR.regBusinessQR();
        } else {
          return of(undefined);
        }
      }),
      switchMap(() => {
        const notBusinessQR = this.businessQR.filter(businessQR => businessQR.businessCode === "not");
        if (notBusinessQR.length > 0) {
          return this.regBoQR.regBusinessQR();
        } else {
          return of(undefined);
        }
      }),
      catchError((_error: any) => {
        return EMPTY;
      })
    ).subscribe((resp: any) => {
      if (resp) {
        //not more
      }
    });
  }
  selectDocType() {
    if (this.detail.documentType !== 'C.I.') {
      this.detail.documentExtension = '';
    } else {
      this.detail.documentExtension = this.documentExtensions[0].code;
    }
  }

  selectRoleQr() {
    this.detail.roleUser = this.roleQr.description;
    this.adminQRPaymentData.typeUser = this.roleQr.description;
  }
  closeModal() {
    this.modalOpen = false;
    this.closeModalEvent.emit();
  }

  submitForm(form: any) {
    //console.log(form.value);
    this.closeModal();
  }
  handleAddRow() {
    this.showDetailForm = true;
    this.operation = Operation.adition;
    this.handleShowAdditionForm();
  }

  handleShowAdditionForm(): void {
    this.setNewRow();
  }

  setNewRow(): void {
    this.detail = new ClientResponseUser();
    this.detail.roleUser = '';
    this.detail.documentType = this.documentTypes[0].description;
    this.detail.documentExtension = this.detail.documentType === 'C.I' ? this.documentExtensions[0].code : '';
  }
  updateSpreadsheet(clientResponseUser: ClientResponseUser[]) {
    this.adminQRPaymentData.clientResponseUser = clientResponseUser;
    this.userNewList = clientResponseUser;
    this.spreadsheetSize = clientResponseUser.length;
    if (this.pagination !== undefined) { this.pagination.ngOnChanges(); }
  }
  handleValidate() {
    if (this.form1.valid) {
      this.showDetailForm1 = true;
    } else {
      this.globalService.danger('', 'Por favor debe seleccionar un rol.')
    }


  }

  handlePageChanged(_pageNumber: number) {
    let pageNumber2 = this.userList.length;
    this.spreadsheetPerPage = this.userList.slice((pageNumber2 - 1) * this.itemsPerPage, this.itemsPerPage * pageNumber2);
    this.spreadsheetPerPage = this.adminQRPaymentData.clientResponseUser.slice((pageNumber2 - 1) * this.itemsPerPage, this.itemsPerPage * pageNumber2);
  }
  handleViewRows($event: number) {
    this.itemsPerPage = $event;
    this.handlePageChanged(0);
  }
  handleValidateReg() {
    this.visible = true;
    if (this.form2.form.valid) {
      this.showDetailForm1 = false;
      this.regSegQr = false;
      this.executeOperation();
      this.handlePageChanged(1)
      this.updateSpreadsheet(this.adminQRPaymentData.clientResponseUser);
    } else {
      this.globalService.danger('', 'Lo siento, ha habido uno mas errores en el formulario. Por favor Revisa tus datos.')
    }

  }
  handleCancel() {
    this.showDetailForm = false;
  }
  handleCancelReg() {
    this.showDetailForm1 = false;
  }
  executeOperation(): void {
    this.adminQRPaymentData.businessCode = this.businesCode;

    this.operation = Operation.adition;
    switch (this.operation) {
      case Operation.adition:
        this.detail.line = this.adminQRPaymentData.clientResponseUser.length + 1;
        this.detail.userType = this.detail.roleUser === '1' ? this.listRole[0].name : this.listRole[1].name;
        this.detail.typeUser = this.detail.userType;
        this.detail.roleCode = this.detail.roleUser === '1' ? this.listRole[0].code : this.listRole[1].code;
        this.adminQRPaymentData.clientResponseUser.push(this.detail);
        break;
      case Operation.update:
        let ind = this.detail.line! --;
        this.adminQRPaymentData.clientResponseUser[ind] = this.detail;
        break;
    }
    if (this.spreadsheetSize > 0) {
      this.spreadsheetSize = this.spreadsheetSize + this.adminQRPaymentData.clientResponseUser.length;
    } else {
      this.spreadsheetSize = this.adminQRPaymentData.clientResponseUser.length;
    }

  }

  handleShowToken() {
//not more
  }

  onClose($event: any) {
    this.showMessageIsBlock = $event;
  }

  getUserAll() {
    this.businesBranch.option = 1;
    this.regBoQR.getUsersQr(this.businesBranch)
      .subscribe({
        next: (resp: ClientResponseUser[]) => {
          this.listUserBranchQr = resp
        }, error: _err => {

        }
      })
  }

  getUserClientAll() {
    this.businesBranch.option = 0;
    this.regBoQR.getUsersQr(this.businesBranch)
      .subscribe({
        next: (resp: ClientResponseUser[]) => {
          this.listUserQr = resp

        }, error: _err => {
//not more
        }
      })
  }

  validateForms() {
    this.globalService.validateAllFormFields(this.form1.form);
    this.globalService.validateAllFormFields(this.form2.form);
    if (this.form1.valid && this.form2.valid) {
      this.regSegQr = false;
      this.regUserQr();
      this.getUserAll();
      this.listUserBranch.emit(this.listUserBranchQr)
      this.businessId.emit(this.businesId);
      this.businessCode.emit(this.businesCode);
    } else {
      if (this.userList.length > 0) {
        this.onChangeStep2.emit(2);
        this.getUserAll();
        this.listUserBranch.emit(this.listUserBranchQr)
        this.businessId.emit(this.businesId);
        this.businessCode.emit(this.businesCode);
      }
    }

  }
  regUserQr() {
    let message: string ='';
    this.regBoQR.regUsersQr(this.adminQRPaymentData)
      .subscribe({
        next: (resp: any) => {
          this.onChangeStep2.emit(2);
          if (resp.length > 0) {
            resp.forEach( (e: any) => {
              this.getUserAll();
              message = e.message
            });
            this.globalService.success('Info:', message)
          }

        }, error: _err => {
          this.globalService.warning('Info:', 'Error al registrar el usuario, intente nuevamente.')
        }
      })
  }
}
