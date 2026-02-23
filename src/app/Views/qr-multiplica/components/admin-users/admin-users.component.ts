import { Component, EventEmitter, Input, OnInit, Output, ViewChild, OnChanges } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { EMPTY, catchError, of, switchMap } from 'rxjs';
import { BusinesBranchId } from '../../../../Services/qr/models/BusinesBranchId';
import { ClientResponseUser } from '../../../../Services/qr/models/ClientResponseUser';
import { ListBusinesQR } from '../../../../Services/qr/models/ListBusinessQR';
import { RegBoQrService } from '../../../../Services/qr/reg-bo-qr.service';
import { RegisterService } from '../../../../Services/qr/register.service';
import { GlobalService } from '../../../../Services/shared/global.service';

@Component({
  selector: 'app-admin-users',
  standalone: false,
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.css']
})
export class AdminUsersComponent implements OnInit, OnChanges {
  modalOpen = true;
  currentStep!: number;
  namesApprovers: any;
  resultFunds: any;
  batch!: number;
  detail: any;
  businesBranch: BusinesBranchId = new BusinesBranchId();
  public businessQR: ListBusinesQR[] = [];
  businesCode: string ='';
  businesId: number = 0;
  listClientUserQr: ClientResponseUser[]=[];
  @Output() businesCodeEm = new EventEmitter<string>();
  @Output() businesIdEm = new EventEmitter<number>();
  @Output() ballotDto = new EventEmitter<any>();
  @Output() onChange = new EventEmitter<number>();
  @Output() usersAll = new EventEmitter<ClientResponseUser[]>()
  @Input() ballot!: any;


  @ViewChild('Informationform') form!: NgForm;

  constructor(private router: Router, private globalService: GlobalService, private servicesQr: RegisterService, private regBoQrServices: RegBoQrService,) {
    this.currentStep = 1;
   }

  ngOnInit(): void {
    this.getBusinessQR();
  }
  ngOnChanges(){
    this.getUserAll();
    this.getBusinessQR();
  }
  handleRates() {
    this.router.navigate(['/qr-multiplica/register-user']);
  }

  handleChangeStep1($event: any) {
    this.batch = $event;
    this.currentStep = 2;
  }

  handleNamesApprovers($event: any) {
    this.namesApprovers = $event;
  }
  handleFunds($event: any) {
    this.resultFunds = $event;
  }

  handleSaveFavorite() {
    this.currentStep = 1;
    this.batch = null!;
  }
  handleSaveTransfer($event: any) {
    this.detail = $event;
    this.currentStep = 3;
  }

  handlePreviusForm() {
    this.currentStep = 2;
  }

  handlePreviusStep() {
    switch (this.currentStep) {
      case 2:
        this.router.navigate(['/qr-multiplica/register-user']);
        break;
      case 3:
        this.handlePreviusForm();
        break;
      default:
        this.currentStep = this.currentStep - 1;
        break;
    }
  }

  validateForms() {
    this.globalService.validateAllFormFields(this.form.form);
    this.getBusinessQR();
    if (this.form.valid) {
      this.ballotDto.emit(this.ballot);
      this.onChange.emit(2);
      this.businesCodeEm.emit(this.businesCode)
      this.businesIdEm.emit(this.businesId)
      this.usersAll.emit(this.listClientUserQr);
    }
  }

  getUserAll(){
    this.businesBranch.option=0;
    this.regBoQrServices.getUsersQr(this.businesBranch)
    .subscribe({next: (resp: ClientResponseUser[]) => {
      this.listClientUserQr=resp
    }, error: _err => {
//not more
    }});
  }
  getBusinessQR() {
    this.servicesQr.getBusinessQR().pipe(
      switchMap((resp: ListBusinesQR[]) => {
        this.businessQR = resp;
        this.businesId=this.businessQR[0].id;
        this.businesCode=this.businessQR[0].businessCode;
        if (this.businessQR.length === 0) {
          return this.regBoQrServices.regBusinessQR();
        } else {
          return of(undefined);
        }
      }),
      switchMap(() => {
        const notBusinessQR = this.businessQR.filter(businessQR => businessQR.businessCode === "not");
        if (notBusinessQR.length > 0) {
          return this.regBoQrServices.regBusinessQR();
        } else {
          return of(undefined);
        }
      }),
      catchError((_error: any) => {
        return EMPTY;
      })
    ).subscribe((resp: any) => {
//not more
    });
  }
}
