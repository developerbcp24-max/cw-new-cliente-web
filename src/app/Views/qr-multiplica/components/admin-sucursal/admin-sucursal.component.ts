import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ParameterResult } from '../../../../Services/parameters/models/parameter-result';
import { AdminQRPaymentData } from '../../../../Services/qr/models/AdminQRPaymentData';
import { BusinesBranchId } from '../../../../Services/qr/models/BusinesBranchId';
import { ClientResponseUser } from '../../../../Services/qr/models/ClientResponseUser';
import { ListBranchQR } from '../../../../Services/qr/models/ListBranchQR';
import { Operation } from '../../../../Services/qr/models/Operation';
import { RequestSucursal } from '../../../../Services/qr/models/RequestSucursal';
import { RegBoQrService } from '../../../../Services/qr/reg-bo-qr.service';
import { RegisterService } from '../../../../Services/qr/register.service';
import { GlobalService } from '../../../../Services/shared/global.service';
import { UtilsService } from '../../../../Services/shared/utils.service';
import { PaginationComponent } from '../../../../Views/shared/cw-components/pagination/pagination.component';

@Component({
  selector: 'app-admin-sucursal',
  standalone: false,
  templateUrl: './admin-sucursal.component.html',
  styleUrls: ['./admin-sucursal.component.css']
})
export class AdminSucursalComponent implements OnInit, OnChanges {

  disabled: boolean = false;
  showDetailForm: boolean = false;
  operation!: number;
  visible: boolean = false;
  reqSuc: RequestSucursal = new RequestSucursal();
  businesBranch: BusinesBranchId = new BusinesBranchId()

  regSucSig: boolean = true;
  regSuc: boolean = true;

  listUserAtmQr: ClientResponseUser[] = [];
  branchOffice: ParameterResult = new ParameterResult();
  branchOffices: ParameterResult[] = [];

  ListUserBranch: ClientResponseUser[] = [];

  listBranchQrs: ListBranchQR[] = [];

  @Input() ballot!: any;
  @Input() userBranch: ClientResponseUser[] = [];
  @Input() businesCode: string = '';
  @Input() businesId: number = 0;
  @Output() onChangeStep3 = new EventEmitter<number>();
  @Output() onchangeOthers = new EventEmitter<any>();
  @Output() listUserAtm = new EventEmitter<ClientResponseUser[]>()
  @Output() listBranch = new EventEmitter<ListBranchQR[]>()
  @Output() businessCode = new EventEmitter<string>();
  @Output() businessId = new EventEmitter<number>();

  listBranchQR: ListBranchQR[] = [];

  @ViewChild('sucursalForm') form3!: NgForm;

  businesBranchId: BusinesBranchId = new BusinesBranchId()

  spreadsheetPerPage: RequestSucursal[] = [];
  branchNewList: RequestSucursal[] = [];
  detail: RequestSucursal = new RequestSucursal();
  adminQRPaymentData: AdminQRPaymentData = new AdminQRPaymentData();
  spreadsheetSize!: number;
  @ViewChild(PaginationComponent) pagination: PaginationComponent = new PaginationComponent();

  itemsPerPage = 5;


  constructor(private cdRef: ChangeDetectorRef, private globalService: GlobalService, private utilsService: UtilsService,
    private regBoQrServices: RegBoQrService, private servicesQr: RegisterService) { }

  ngOnInit(): void {
    this.branchOffices = this.utilsService.getBranchOffices();
    this.getUserAll();
    this.getUserBranch();
    this.getBranchListQR(this.businesBranchId);
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.businesBranchId.businessId = changes['businesId'].currentValue;

  }
  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }
  handleValidate() {
    this.getUserAll();

    this.globalService.validateAllFormFields(this.form3.form);
    if (this.form3.form.valid) {
      this.showDetailForm = false;
      this.visible = true;
    } else {
      this.globalService.danger('', 'Lo siento, ha habido uno mas errores en el formulario. Por favor Revisa tus datos.');
    }


    this.executeOperation();
    this.handlePageChanged(1)
    this.updateSpreadsheet(this.adminQRPaymentData.branchReq);
  }

  selectBranchOffice() {
    this.detail.city = this.reqSuc.city;
  }
  selectBranchQr($event: ClientResponseUser[]) {
    for (let newBranch of $event) {
      if (this.reqSuc.qrUserId.toString() === newBranch.qrUserId.toString()) {
        this.detail.id = newBranch.id
        this.detail.qrUserId = this.reqSuc.qrUserId;
        this.detail.name = newBranch.name;
      }
    }
  }

  handleCancel() {
    this.showDetailForm = false;
    this.setNewRow();
  }

  handleAddRow() {
    this.getUserBranch();
    this.showDetailForm = true;
    this.operation = Operation.adition;
    this.handleShowAdditionForm();
    this.handleShowAdditionForm();
  }

  handleShowAdditionForm(): void {
    this.setNewRow();
  }

  setNewRow(): void {
    this.detail = new RequestSucursal();
    this.detail.city = '';
    this.detail.branchName = '';
  }

  updateSpreadsheet(branchReqRes: RequestSucursal[]) {
    this.adminQRPaymentData.branchReq = branchReqRes;
    this.branchNewList = branchReqRes;
    this.spreadsheetSize = branchReqRes.length;
    if (this.pagination !== undefined) { this.pagination.ngOnChanges(); }
  }


  handlePageChanged(pageNumber: number) {
    if (this.adminQRPaymentData.branchReq.length > 0){
      this.spreadsheetPerPage = this.adminQRPaymentData.branchReq.slice((pageNumber - 1) * this.itemsPerPage, this.itemsPerPage * pageNumber);
    }
  }
  handleViewRows($event: string) {
    this.itemsPerPage = +$event;
    this.handlePageChanged(0);
  }
  executeOperation(): void {
    this.operation = Operation.adition;
    switch (this.operation) {
      case Operation.adition:
        this.detail.businessCode = +this.businesCode;
        this.detail.businessId = this.businesId;
        this.detail.line = this.adminQRPaymentData.branchReq.length + 1;
        this.adminQRPaymentData.branchReq.push(this.detail);
        break;
      case Operation.update:
        let ind = this.detail.line! --;
        this.adminQRPaymentData.branchReq[ind] = this.detail;
        break;
    }
    this.spreadsheetSize = this.adminQRPaymentData.branchReq.length;
  }
  validateForms() {
    this.globalService.validateAllFormFields(this.form3.form);
    if (this.form3.valid) {
      this.saveBranch();
      this.getUserAll();
      this.onchangeOthers.emit(this.ballot);
      this.listUserAtm.emit(this.listUserAtmQr)
      this.listBranch.emit(this.listBranchQR)
      this.businessCode.emit(this.businesCode);
      this.businessId.emit(this.businesId)

    } else {
      this.getUserAll();
      this.listBranch.emit(this.listBranchQR)
      this.businessCode.emit(this.businesCode);
      this.businessId.emit(this.businesId)
      this.onChangeStep3.emit(3);
    }

  }


  getUserBranch() {
    this.businesBranch.option = 1;
    this.regBoQrServices.getUsersQr(this.businesBranch)
      .subscribe({
        next: (resp: ClientResponseUser[]) => {
          this.ListUserBranch = resp
          if (this.ListUserBranch.length > 0) {
            this.ListUserBranch.forEach(x => {
              if (x.bachAtmId === 0) {
                this.regSuc = false;
              } else {
                this.globalService.danger('', 'Favor debe tener al menos un usuario disponible para asignar una sucursal.')
              }
            });

          }
        }, error: _err => {
//not more
        }
      })
  }
  getUserAll() {
    this.businesBranch.option = 2;
    this.regBoQrServices.getUsersQr(this.businesBranch)
      .subscribe({
        next: (resp: ClientResponseUser[]) => {
          this.listUserAtmQr = resp
          this.listUserAtmQr.forEach(x => {
            if (x.bachAtmId === 0) {
              this.regSucSig = false;
            } else {
              this.globalService.danger('', 'Favor debe contar al menos un usuario disponible para asignar una caja.');
            }
          });
        }, error: _err => {
          this.globalService.danger('', 'Intente mas tarde.');
        }
      })
  }

  getBranchQR(idBis: BusinesBranchId): void {
    this.servicesQr.getBranchesQR(idBis)
      .subscribe({
        next: (resp: ListBranchQR[]) => {
          this.listBranchQR = resp;
          if (this.listBranchQR.length > 0) {
            this.regSucSig = false
          }
        },
        error: (error: any) => {
          //console.error("Ocurrió un error al obtener los QRs de la sucursal", error);
        }
      });
  }

  saveBranch() {
    this.regBoQrServices.regBranchQr(this.adminQRPaymentData)
      .subscribe({
        next: (_resp: AdminQRPaymentData) => {

          this.globalService.success('Info:', 'Su registro de Sucursal fue exitoso.')
          this.onChangeStep3.emit(3);
        }, error: _err => {
          this.globalService.warning('Info:', 'No logro guardar el Sucursal intente mas tarde.')
        }
      })
  }
  ///////-------
  getBranchListQR(idBis: BusinesBranchId): void {
    idBis.ListBranch = 'A';
    this.servicesQr.getBranchesQR(idBis)
      .subscribe({
        next: (resp: ListBranchQR[]) => {
          this.listBranchQrs = resp;

          if(this.listBranchQrs.length>0){
           this.visible=true;
           this.regSucSig=false;
          }

        },
        error: (_err: any) => {
          //not more
        }
      });
  }
  ///////-------
}
