import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EMPTY, catchError, of, switchMap } from 'rxjs';
import { ClientResponseUser } from '../../../Services/qr/models/ClientResponseUser';
import { ListBranchQR } from '../../../Services/qr/models/ListBranchQR';
import { ListBusinesQR } from '../../../Services/qr/models/ListBusinessQR';
import { RegBoQrService } from '../../../Services/qr/reg-bo-qr.service';
import { RegisterService } from '../../../Services/qr/register.service';


@Component({
  selector: 'app-admin-qr',
  standalone: false,
  templateUrl: './admin-qr.component.html',
  styleUrls: ['./admin-qr.component.css']
})
export class AdminQrComponent implements OnInit {

  currentStep: number;
  batch!: number;
  nameC = 'Registro de Sucursal';
  nameD = 'Registro de Caja';
  nameBC!: string;


  modalOpen = false;

  namesApprovers: any;
  resultFunds: any;
  detail: any;
  ballot: any;

  ballotSetp1: any;
  ballotSetp2: any;
  ballotSetp3: any;

  businesId: number=0;
  businesCode: string='';
  userAll: ClientResponseUser[]=[];
  userBranch: ClientResponseUser[]=[];
  userAtm: ClientResponseUser[]=[];
  listBranchQr: ListBranchQR[]=[];
  public businessQR: ListBusinesQR[] = [];
  showQRNew = false;
  showNewQR: boolean = false;

  constructor(private router: Router, private regBoQrServices: RegBoQrService, private servicesQr: RegisterService,) {
    this.currentStep = 1;
   }

  ngOnInit(): void {
    // This is intentional
    this.getBusinessQR();
  }
  handleRates() {
    this.router.navigate(['/qr-multiplica/register-user']);
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


   // --------------------------------------------------------
   handleChangeStep1($event: number) {
    this.batch = $event;
    this.currentStep = 2;
  }

  handleChangeStep2($event: number) {
    this.batch = $event;
    this.currentStep = 3;
  }

  handleChangeStep3($event: any) {
    this.batch = $event;
    this.currentStep = 4;
  }
  handleChangeStep4($event: number) {
    this.batch = $event;
    this.currentStep = 5;
  }

  handlePreviusForm($event: any) {
    this.currentStep = $event;
  }

  handleChangeRoe($event: any) {
    this.nameC = $event ? 'D' : 'C';
    this.nameD = $event ? 'E' : 'D';
    this.nameBC = $event ? ' - C' : '';
  }
  handleBallotDto($event: any) {
    this.ballotSetp1 = $event;
    this.ballotSetp2 = $event;
    this.ballotSetp3 = $event;
  }
  handleQrBusinesCode($event: any) {
    this.businesCode=$event;
  }
  handleQrBusinesId($event: number) {
    this.businesId=$event;
  }
  businessId($event: number) {
    this.businesId=$event;
  }
  businessCode($event: string) {
    this.businesCode=$event;
  }
  handleUserQr($event: ClientResponseUser[]){
    this.userAll=$event;
  }
  handleUserBranchQr($event: ClientResponseUser[]){
    this.userBranch=$event;
  }
  handleUserAtmQr($event: ClientResponseUser[]){
    this.userAtm=$event;
  }
  handleBranchQr($event: ListBranchQR[]){
    this.listBranchQr=$event;
  }
  handlePreviusStep() {
    switch (this.currentStep) {
      case 2:
        this.handlePreviusForm(1);
        break;
      case 3:
        this.handlePreviusForm(2);
        break;
      case 4:
        this.handlePreviusForm(3);
        break;
      case 5:
        this.handlePreviusForm(4);
        break;
      default:
        this.currentStep = this.currentStep - 1;
        break;
    }
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
}
