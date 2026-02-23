import { Component, OnInit, Output, EventEmitter, Input, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ConsultorsPaseService } from '../../../../Services/pase/consultors-pase.service';
import { RequestModelPaseAccount } from '../../../../Services/pase/Models/Request-model-pase';
import { RequestModelPaseDetail } from '../../../../Services/pase/Models/Request-model-pase';
import { ResponseModelPaseDetail } from '../../../../Services/pase/Models/ResponseModelPaseDetail';
import { RequestModelHeadPase } from '../../../../Services/pase/Models/Request-model-pase';
import { ResponseModelPaseHead } from '../../../../Services/pase/Models/ResponseModelPaseHead';
import { RequestModelReportsPase } from '../../../../Services/pase/Models/Request-model-pase';
import { GlobalService } from '../../../../Services/shared/global.service';
import { UserService } from '../../../../Services/users/user.service';
import { UtilsService } from '../../../../Services/shared/utils.service';

@Component({
  selector: 'app-list-pase',
  standalone: false,
  templateUrl: './list-pase.component.html',
  styleUrls: ['./list-pase.component.css'],
  providers: [ConsultorsPaseService, UtilsService]
})
export class ListPaseComponent implements OnInit {

  loading = true;
  @Input() request!: RequestModelHeadPase;
  public RequestModelPaseDetail: RequestModelPaseDetail = new RequestModelPaseDetail();
  public RequestModelReportsPase: RequestModelReportsPase = new RequestModelReportsPase();

  pase: ResponseModelPaseDetail[] = [];

  ListModelPase: ResponseModelPaseDetail[] = [];

  public ResponseModelPase: ResponseModelPaseDetail[] = [];
  public ResponseModelPaseHead: ResponseModelPaseHead[] = [];
  public ResponseModelPaseHeadObj: ResponseModelPaseHead = new ResponseModelPaseHead();
  public FormatSelected!: string;
  public ok!: boolean;
  public Type!: string;
  quantity!: number;
  public dateIni!: string;
  public dateEnd!: string;
  public CodeServ!: string;
  public DateNow!: Date;
  public date!: string;
  pageSize = 25;
  rowsPerPage: number[] = [10, 15, 20, 25];
  currentUser: any;
  totalResponse = 0;

  constructor(private _ConsultorsServicePase: ConsultorsPaseService,
    private _route: ActivatedRoute,
    private _router: Router,
    private GlobalService: GlobalService,
    private userService: UserService,
    private cdRef: ChangeDetectorRef,
    private utilsService: UtilsService) {
  }

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }

  ngOnInit() {
    this.currentUser = this.userService.getUserToken();
    this.FormatSelected = 'xls';
    this.callHead();
  }

  back() {
    this._router.navigate(['queries/pase']);
  }
  getDate2Str(fecha: Date): any {
    if (fecha != null) {
      let returnDate = '';
      let diaSt = '';
      let mesSt = '';
      let today = new Date();
      today = fecha;
      const dd = today.getDate();
      const mm = today.getMonth() + 1;
      const yyyy = today.getFullYear().toString();
      if (dd < 10) {
        diaSt = `0${dd}`;
      } else {
        diaSt = `${dd}`;
      }
      if (mm < 10) {
        mesSt = `0${mm}`;
      } else {
        mesSt = `${mm}`;
      }
      returnDate = yyyy + mesSt + diaSt;
      return returnDate;
    }
  }
  export() {
    this.Type = this.FormatSelected;
    this.RequestModelReportsPase = {
      'CodeService': this.CodeServ,
      'DatesInicial': this.dateIni,
      'DatesEnd': this.dateEnd,
      'type': this.Type
    };

    this.DateNow = new Date;

    this._ConsultorsServicePase
      .getReportsPase(this.RequestModelReportsPase)
      .subscribe({next: (resp: Blob) => {
        if (this.Type === 'xls') {
          this.utilsService.donwloadReport('Reporte de Recaudacion.xls', resp);
        }
        if (this.Type === 'sap') {
          this.utilsService.donwloadReport('CON' + this.getDate2Str(this.DateNow) + 'G.PRN', resp);
        }
        if (this.Type === 'pdf') {
          this.utilsService.donwloadReport('Reporte de Recaudacion.pdf', resp);
        }
        if (this.Type === 'sap-D') {
          this.utilsService.donwloadReport('CON' + this.getDate2Str(this.DateNow) + 'D.PRN', resp);
        }
        if (this.Type === 'txt') {
          this.date = this.getDate2Str(this.DateNow).substring(2, 6);
          this.utilsService.donwloadReport(this.CodeServ.substring(3, 6) + this.getDate2Str(this.DateNow).substring(2, 8) + this.CodeServ.substring(0, 3) + '.txt', resp);
        }
      }, error: _err => console.error('Fallo del Servicio: ', _err.message)});
  }

  handlePageChanged($event: number) {
    this.ListModelPase = this.ResponseModelPase.slice((($event - 1) * this.pageSize), this.pageSize * $event);
  }

  handleViewRows($event: string) {
    this.pageSize = +$event;
    this.handlePageChanged(0);
  }

  callHead(): void {


    this.dateIni = this._router.parseUrl(this._router.url).queryParams['DateIniHeadStr'];
    this.dateEnd = this._router.parseUrl(this._router.url).queryParams['DateEndHeadStr'];
    this.CodeServ = this._router.parseUrl(this._router.url).queryParams['numberAccount'];
    this.request = { DatesInicial: this.dateIni, DatesEnd: this.dateEnd, CodeService: this.CodeServ };

    this.request = {
      'CodeService': this.CodeServ,
      'DatesInicial': this.dateIni,
      'DatesEnd': this.dateEnd
    };

    this._ConsultorsServicePase
      .getDetailHeadPase(this.request)
      .subscribe({next: (resp: ResponseModelPaseHead[]) => {
        this.ResponseModelPaseHead = resp;
        this.ResponseModelPaseHeadObj.codeCollector = this.ResponseModelPaseHead[0].codeCollector;
        this.ResponseModelPaseHeadObj.codeService = this.ResponseModelPaseHead[0].codeService;
        this.ResponseModelPaseHeadObj.currencyCurrentAccount = this.ResponseModelPaseHead[0].currencyCurrentAccount;
        this.ResponseModelPaseHeadObj.codeCompany = this.ResponseModelPaseHead[0].codeCompany;
        this.ResponseModelPaseHeadObj.currencyDescriptionCuts = this.ResponseModelPaseHead[0].currencyDescriptionCuts;
        this.ResponseModelPaseHeadObj.currencyDescriptionTalks = this.ResponseModelPaseHead[0].currencyDescriptionTalks;
        this.ResponseModelPaseHeadObj.numberCounts = this.ResponseModelPaseHead[0].numberCounts;
        this.ResponseModelPaseHeadObj.registrationAmount = this.ResponseModelPaseHead[0].registrationAmount;
        this.ResponseModelPaseHeadObj.totalAmount = this.ResponseModelPaseHead[0].totalAmount;
        this.ResponseModelPaseHeadObj.tradeName = this.ResponseModelPaseHead[0].tradeName;

        if (this.ResponseModelPaseHead.length > 0) {
          this.Filltable();
        }
      }});

  }

  Filltable(): void {

    this._route.params.subscribe(params => {
      this.dateIni = this.request.DatesInicial;
      this.dateEnd = this.request.DatesEnd;
      this.CodeServ = this.request.CodeService;
    });
    this.RequestModelPaseDetail = {
      'CodeService': this.CodeServ,
      'DatesInitialProcess': this.dateIni,
      'DatesFinalProcess': this.dateEnd,
      'InitialRegistration': 1
    };
    this._ConsultorsServicePase
      .getDetailPase(this.RequestModelPaseDetail)
      .subscribe({next: (resp: ResponseModelPaseDetail[]) => {
        this.GlobalService.showLoader(true);
        this.ResponseModelPase = resp;
        this.totalResponse = this.ResponseModelPase.length;
        this.loading = true;
        this.GlobalService.showLoader(false);

      }, error: _err => console.error('fallo', _err.message)});

  }
}
