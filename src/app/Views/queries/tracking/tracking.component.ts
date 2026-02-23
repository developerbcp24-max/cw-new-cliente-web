import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { TrackTransfersDto } from '../../../Services/track-transfers/models/track-transfers-dto';
import { TrackTransfersResult } from '../../../Services/track-transfers/models/track-transfers-result';
import { TrackTransfersService } from '../../../Services/track-transfers/track-transfers.service';
import { GlobalService } from '../../../Services/shared/global.service';
import { UserService } from '../../../Services/users/user.service';
import { TrackStatusResult } from '../../../Services/track-transfers/models/track-status-result';
import { OperationTypeResult } from '../../../Services/track-transfers/models/operation-type-result';
import { NgForm } from '@angular/forms';
import { ParametersService } from '../../../Services/parameters/parameters.service';
import { DateRangeModel, OptionsDateRange } from '../../shared/cw-components/date-range/date-range.component';

@Component({
  selector: 'app-tracking',
  standalone: false,
  templateUrl: './tracking.component.html',
  styleUrls: ['./tracking.component.css'],
  providers: [TrackTransfersService, UserService]
})
export class TrackingComponent implements OnInit {
  orderFlag = false;
  isCredentialsValidationVisible = false;
  validatePasswordInsteadToken!: boolean;
  nameReport = 'Seguimiento de operaciones';
  showBatchDetail = false;
  operationType!: string;
  formatSelected!: string;
  dateRange?: DateRangeModel = new DateRangeModel();
  user: any;
  pageSize!: number;
  public tracksDto: TrackTransfersDto = new TrackTransfersDto();
  swTable!: boolean;
  public tracksResult: TrackTransfersResult[] = [];
  public tracks: TrackTransfersResult[] = [];
  public statuses: TrackStatusResult[] = [];
  public date: Date = new Date();
  statusses: any;
  defaultStatus = 0;
  companyName!: string;
  loadFirstStatus!: true;
  beneficiary!: string;
  flag!: number;
  swMessage = false;
  operationTypeSelected!: OperationTypeResult;
  statusSelected: TrackStatusResult = new TrackStatusResult();
  beneficiaries!: string[];
  operationTypes: OperationTypeResult[] = [];
  types: any;
  defaultType = 0;
  loadFirstType!: true;
  statusDto!: number;
  typeDto!: number;
  beneficiaryDto!: string;
  optionsDateRange: OptionsDateRange = {
    isHorizontal: false,
    isMaxDateNow: true,
    maxMonthRange: 3,
    showClearDate: false
  };
  totalItems = 0;
  isVisibleDet = false;

  @ViewChild('lotForm')
  processBatchId!: NgForm;

  constructor(private userService: UserService, private trackTransfersService: TrackTransfersService, private cdRef: ChangeDetectorRef,
    private globalService: GlobalService, private paramService: ParametersService) { }

  ngOnInit() {
    this.userService.getValidateCurrentUser();
    this.companyName = this.userService.getUserToken().company_name!;
    this.beneficiary = '';
    this.dateRange!.dateEnd = this.dateRange!.dateInit = null!;
    this.tracksDto.OperationStatusId = this.tracksDto.OperationTypeId = 0;
    this.tracksDto.Beneficiary = this.tracksDto.batchId = '';
    this.tracksDto.InitialDate = this.tracksDto.EndDate = null!;
    this.tracksDto.OrderByAsc = false;
    this.tracksDto.rowIni = -1;
    this.tracksDto.numberRow = 10;
    this.listTracking(this.tracksDto);

    this.getStatus();
    this.getTypes();
  }

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }

  getTypes() {
    this.trackTransfersService
      .getOperationTypes()
      .subscribe({
        next: (response: OperationTypeResult[]) => {
          this.operationTypes = response;
          this.operationTypeSelected = this.operationTypes[0];
        }, error: _err => { console.error('Tipos de operación: ', _err.message); }
      });
  }

  getStatus() {
    this.trackTransfersService
      .getOperationStatus()
      .subscribe({
        next: (resp: TrackStatusResult[]) => {
          this.statuses = resp;
          this.statusSelected = this.statuses[0];
        }, error: _err => { console.error('Estados de operación ', _err.message); }
      });
  }

  handleClear() {
    this.dateRange = new DateRangeModel({
      dateEnd: null,
      dateInit: null
    });
  }

  handleSearch() {
    this.swMessage = false;
    this.tracksDto.rowIni = -1;
    this.tracksDto.numberRow = 10;
    this.globalService.validateAllFormFields(this.processBatchId.form);
    if (this.IsValid() === 1 && this.processBatchId.valid) {
      this.listTracking(this.tracksDto);
    } else {
      this.swTable = false;
    }
  }

  handleProcessBatches(tracksDto: TrackTransfersDto) {
    this.tracksDto = tracksDto;
    this.listTracking(this.tracksDto);
  }

  listTracking(tracksDto: TrackTransfersDto) {
    this.isVisibleDet = false;
    this.paramService.getValidateCompanyId()
      .subscribe({
        next: (resp: any) => {
          if (resp.body) {
            const user: any = this.userService.getUserToken();
            for (let item of user.role) {
              if (item.includes('AUTORIZADOR')) {
                this.isVisibleDet = true;
              }
            }
          }
          this.trackTransfersService.trackingListParameters(tracksDto)
            .subscribe({
              next: (response: TrackTransfersResult[]) => {
                this.tracks = response;
                this.totalItems = this.tracks.length > 0 ? this.tracks[0].totalItems : 0;
                this.swTable = this.tracks.length > 0;
                this.swMessage = this.tracks.length === 0;
                for (let item of this.tracks) {
                  if (item.operationTypeId == 8) {
                    item.isVisibleButton = this.isVisibleDet;
                  }
                }

              }, error: _err => {
                console.error('Seguimiento: ', _err.message);
                this.swTable = false;
                this.swMessage = true;
              }
            });
        }, error: _err => console.log(_err.message)
      });
  }

  IsValid(): number {
    this.flag = 0;
    if (this.dateRange!.dateEnd == null && this.dateRange!.dateInit == null) {
      this.flag = 1;
      this.tracksDto.OperationStatusId = this.statusSelected.id;
      this.tracksDto.OperationTypeId = this.operationTypeSelected.id;
      this.tracksDto.OperationTypeName = this.operationTypeSelected.name;
      this.tracksDto.Beneficiary = this.beneficiary;
      this.tracksDto.EndDate = null!;
      this.tracksDto.InitialDate = null!;

    } else {
      if ((this.dateRange!.dateEnd!.getTime() - this.dateRange!.dateInit!.getTime()) / 1000000 < 7776) {
        this.flag = 1;
        this.tracksDto.InitialDate = this.dateRange!.dateInit;
        this.tracksDto.EndDate = this.dateRange!.dateEnd;
        this.tracksDto.OperationStatusId = this.statusSelected.id;
        this.tracksDto.OperationTypeId = this.operationTypeSelected.id;
        this.tracksDto.Beneficiary = this.beneficiary;
      } else {
        this.flag = 2;
      }
    }
    return this.flag;
  }

  handleChangeChecked(event: boolean) {
    this.orderFlag = event;
    this.tracksDto.OrderByAsc = event;
    this.swTable = false;
    this.swMessage = false;
    this.trackTransfersService.trackingListParameters(this.tracksDto)
      .subscribe({
        next: (response: TrackTransfersResult[]) => {
          this.tracks = response;
          this.swTable = this.tracks.length > 0;
          this.swMessage = this.tracks.length === 0;
        }, error: _err => {
          console.error('Seguimiento: ', _err.message);
          this.swTable = false;
          this.swMessage = true;
        }
      });

  }

}

