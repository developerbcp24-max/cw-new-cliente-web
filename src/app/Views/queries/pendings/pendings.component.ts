
import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {AuthorizationService} from '../../../Services/authorization/authorization.service';
import {BatchStatus} from '../../../Services/authorization/models/batch-status';
import {ProcessBatch} from '../../../Services/authorization/models/process-batch';
import {DataService} from '../../../Services/shared/data.service';
import {GlobalService} from '../../../Services/shared/global.service';
import {Router} from '@angular/router';
import {UserService} from '../../../Services/users/user.service';
import {BatchDetail} from '../../../Services/authorization/models/batch-detail';
import {ProcessBatchDto} from '../../../Services/shared/models/process-batch';
import {UifcwDto} from '../../../Services/uif/models/uifcw-dto';
import {UtilsService} from '../../../Services/shared/utils.service';
import {UifDto} from '../../../Services/shared/models/uif-dto';
import {UifService} from '../../../Services/uif/uif.service';
import {UifMultipleDto} from '../../../Services/uif/models/uif-multiple-dto';
import moment, { Moment } from 'moment';
import {FxService} from "../../../Services/Fx/fx.service";
import {MatSnackBar} from "@angular/material/snack-bar";
// @ts-ignore
import * as bootstrap from 'bootstrap';
import {mensajes} from "../../../Models/Mensajes";
import {CommonFxService} from "../../../Services/Fx/common-fx.service";

@Component({
  selector: 'app-pendings',
  standalone: false,
  templateUrl: './pendings.component.html',
  styleUrls: ['./pendings.component.css'],
  providers: [AuthorizationService, UserService, UtilsService, UifService],
  //changeDetection: ChangeDetectionStrategy.OnPush
})
export class PendingsComponent implements OnInit {

  isCredentialsValidationVisible = false;
  processBatchData: ProcessBatch = new ProcessBatch();
  validatePasswordInsteadToken!: boolean;
  processBatchUIF: BatchDetail [] = [];
  batchInformation: ProcessBatchDto = new ProcessBatchDto();
  batchInformationList: ProcessBatchDto []= [];
  newList: ProcessBatchDto []= [];

  showMessageIsBlock = false;
  uifcwDto: UifDto = new UifDto();
  uifMultipleDto: UifMultipleDto = new UifMultipleDto();
  uifMultipleDtoList: UifMultipleDto [] = [];
  saleExchangeRate!: number;

  public statusAuthorization: any;

  constructor(private authorizationService: AuthorizationService, private globalService: GlobalService, private snackBar: MatSnackBar,
              private dataService: DataService, private router: Router, private userService: UserService, private fxService: FxService,
              private utilsService: UtilsService, private UIFService: UifService, private commonFx: CommonFxService) {
    this.statusAuthorization = [];
  }

  ngOnInit() {
    this.userService.getValidateCurrentUser();
    this.validatePasswordInsteadToken = this.userService.getUserToken().authorize_pin!;
  }

  handleProcessBatches($event: ProcessBatch) {
    if ($event.operation === 4) {
      this.authorizationService.processBatches($event)
      .subscribe({next: response => {
        this.dataService.serviceData = response;
        this.router.navigate(['queries/batch-status']);
      }, error: _err => this.globalService.danger('Preparar', _err.message)});

    } else {
      this.isCredentialsValidationVisible = true;
    }
    this.processBatchData = $event;
  }

  handleCredentialsValidationSubmit($event: any) {
    if (typeof $event === 'string') {
      this.processBatchData.password = $event;
    } else {
      this.processBatchData.tokenCode = $event.code;
      this.processBatchData.tokenName = $event.name;
    }
    this.batchInformationList = [];
    this.uifMultipleDtoList = [];
    this.authorizationService.processBatches(this.processBatchData)
      .subscribe({next: response => {
        this.dataService.serviceData = response;
        for (let item of this.processBatchUIF) {
          let index = this.processBatchUIF.indexOf(item);
          this.batchInformation = new ProcessBatchDto();
          this.batchInformation.id = item.id;
          this.batchInformation.formattedNumber = item.account;
          this.batchInformation.causalTransaction = item.causalTransaction;
          this.batchInformation.amount = item.amount;
          this.batchInformation.currency = item.currency;
          this.batchInformation.description = item.description!;
          this.batchInformation.fundDestination = item.destinationFunds!;
          this.batchInformation.fundSource = item.sourceFunds!;
          this.uifcwDto.processBatchId = item.id;
          this.batchInformationList.push(this.batchInformation);
        }
        this.handleValidateUIF(this.batchInformationList);
        this.router.navigate(['queries/batch-status']);
      }, error: _err => this.globalService.danger('Autorizacíon', _err.message)});
  }
  handleProcessBatchesUif($event: BatchDetail[]) {
    this.processBatchUIF = $event;
  }

  handleValidateUIF(uifDto: ProcessBatchDto[]) {
    this.utilsService.QueryUIF(uifDto)
        .subscribe({next: resp => {
          if (this.utilsService.isUif()) {
            let isValid = resp.find(x => x.isValid === true) ? true : false;
              uifDto.forEach(x => x.isValidUif = isValid);

          }
          let isBlocked = resp.find(x => x.isBlocked === true) ? true : false;
          if (isBlocked) {
            this.showMessageIsBlock = true;
            return;
          }
          if (resp.length > 0) {
            for (let i = 0; resp.length > i; i++) {
              this.batchInformation.uif[i] = new UifDto();
              this.batchInformation.uif[i].isSuspiciusUif = resp[i].isValid;
              this.batchInformation.uif[i].trace = resp[i].trace;
              this.batchInformation.uif[i].numberQueryUIF = resp[i].numberQueryUIF;
              this.batchInformation.uif[i].cumulus = resp[i].cumulus;
              this.batchInformation.uif[i].causalTransaction = resp[i].causalTransaction;
              this.batchInformation.uif[i].branchOffice = resp[i].branchOffice;
              this.batchInformation.uif[i].isMultiple = resp[i].isMultiple;
            }
          }
          this.router.navigate(['queries/batch-status']);
        }, error: _err => {
        }});

  }

  onClose($event: any) {
    this.showMessageIsBlock = $event;
  }
}
