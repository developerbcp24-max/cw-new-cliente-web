import { Component, EventEmitter, forwardRef, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Router } from '@angular/router';
import { ApproversAndControllers } from '../../../../Services/approvers-and-controllers/models/approvers-and-controllers';
import { InputApprovers } from '../../../../Services/approvers-and-controllers/models/input-approvers';
import { ParameterDto } from '../../../../Services/parameters/models/parameter-dto';
import { ParameterResult } from '../../../../Services/parameters/models/parameter-result';
import { ParametersService } from '../../../../Services/parameters/parameters.service';
import { Constants } from '../../../../Services/shared/enums/constants';
import { OperationType } from '../../../../Services/shared/enums/operation-type';
import { GlobalService } from '../../../../Services/shared/global.service';
import { UtilsService } from '../../../../Services/shared/utils.service';
import { TokenCredentials } from '../../../../Services/tokens/models/token-credentials';
import { UserService } from '../../../../Services/users/user.service';

import { BallotOfWarrantyDto } from '../../../../Services/new-ballot-of-warranty/models/ballot-of-warranty-dto';
import { NewBallotOfWarrantyService } from '../../../../Services/new-ballot-of-warranty/new-ballot-of-warranty.service';

@Component({
  selector: 'app-new-ballot-instructions',
  standalone: false,
  templateUrl: './new-ballot-instructions.component.html',
  styleUrls: ['./new-ballot-instructions.component.css'],
  providers: [NewBallotOfWarrantyService, ParametersService, UtilsService,
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NewBallotInstructionsComponent),
      multi: true
    }]
})
export class NewBallotInstructionsComponent implements OnInit {

  @Input()
  ballot: BallotOfWarrantyDto = new BallotOfWarrantyDto;
  @Input() disabled = false;
  placeOfDeliveries: ParameterResult[] = [];
  authorizersDto: InputApprovers;
  titularUser: any;
  isVisibleToken = false;
  isTokenFormDisabled = false;
  requestParameter: ParameterDto = new ParameterDto();
  tempContract!: Blob;
  isRenewable = false;
  isCondition = false;
  isContract = false;
  showMessageContract = false;
  isDisabledForm = false;
  numProcesBatch = 0;
  isSuccessfulProcess = false;
  showIframe = true;
  showInput = false;
  isValidContract: boolean = false;
  isPreSave = false;
  messagePrePreparer = Constants.messagePrePreparer;
  is_validbatchtoken: boolean = false;

  @ViewChild('formComponent')form!: NgForm;
  @Output() onChangeNamesApprovers = new EventEmitter<any[]>();

  constructor(private newBallotOfWarrantyService: NewBallotOfWarrantyService, private userService: UserService, private _router: Router,
    private globalService: GlobalService, private utilsService: UtilsService) {
    this.authorizersDto = {
      operationTypeId: OperationType.boletaGarantia
    };
  }

  ngOnInit() {

    this.titularUser = this.userService.getUserToken();
    this.handleValidateForm();
    let navigator = this.handleGetNavigator();
    if (navigator.includes('IE')) {
      this.showIframe = false;
    }
    this.newBallotOfWarrantyService.GetContract(this.ballot)
      .subscribe({next: response => {
        this.tempContract = response;
        const iframe = document.querySelector('iframe');
        iframe!.src = URL.createObjectURL(this.tempContract);
      }, error: _err => {
        this.globalService.danger('Operación fallida', _err.message);
      }});
  }

  handleGetNavigator() {
    let ua = navigator.userAgent, tem,
      M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
    if (/trident/i.test(M[1])) {
      tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
      return 'IE ' + (tem[1] || '');
    }
    if (M[1] === 'Chrome') {
      tem = ua.match(/\b(OPR|Edge)\/(\d+)/);
      if (tem !== null)
        return tem.slice(1).join(' ').replace('OPR', 'Opera');
    }
    M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
    if ((tem = ua.match(/version\/(\d+)/i)) !== null) M.splice(1, 1, tem[1]);
    return M.join(' ');
  }

  handleValidateForm() {
    this.ballot.termInDays = this.ballot.termInDays === null ? 0 : this.ballot.termInDays;
    if (this.ballot.typeWarranty !== 'DPF') {
      this.ballot.bank = '-';
      this.ballot.numberDPF = '-';
      this.ballot.firstTitular = '-';
      this.ballot.firstDocumentCI = '-';
      this.ballot.secondTitular = '-';
      this.ballot.secondDocumentCI = '-';
      this.ballot.thirdTitular = '-';
      this.ballot.thirdDocumentCI = '-';
    }
  }

  handleValidate() {
    this.isValidContract = false;
    if (this.isRenewable && this.isCondition && this.isContract) {
      this.ballot.additionalClause = this.ballot.typeWarranty === 'PDF' || this.ballot.typeWarranty === 'LRC' ? true : false;
      this.showMessageContract = false;
      this.isValidContract = true;
    } else {
      this.showMessageContract = true;
    }
  }
  handleShowToken(approversAndControllersValidation: boolean) {
    this.handleValidate();
    if (approversAndControllersValidation && this.isValidContract) {
      this.isVisibleToken = true;
    }
  }

  handleIsPreparer($event: any) {
    this.isPreSave = false;
    if ($event) {
      this.handleTokenSubmit(new TokenCredentials());
    }
  }

  handleInput(){
    if (this.isRenewable) {
      this.showInput = false;
    }else{
      this.showInput = true;
    }
  }

  handleValidateNoToken(approversAndControllersValidation: boolean) {
    this.handleValidate();
    if (approversAndControllersValidation && this.isValidContract) {
      this.ballot.isPrePreparer = true;
      this.isPreSave = true;
    }
  }

  handleTokenSubmit($event: TokenCredentials) {
    this.ballot.numberRenovation = this.ballot.statusRenovation ? '' : this.ballot.numberRenovation;
    this.ballot.statusRenovation = this.ballot.statusRenovation ? false : true;

    const myReader = new FileReader();
    myReader.readAsDataURL(this.tempContract);
    myReader.onloadend = (_e) => {
      const base64data = myReader.result!.toString();
      this.ballot.contractRoe.contract = base64data.toString();
      this.handleSaveBallot($event);
    };
  }

  handleRenewable(){
/*nonImplentation */
  }

  handleSaveBallot($event: TokenCredentials) {
    this.ballot.token = $event.code;
    this.ballot.tokenCode = $event.code;
    this.ballot.tokenName = $event.name;
    this.ballot.numberWarranty = '-';
    this.isTokenFormDisabled = true;
    this.newBallotOfWarrantyService.Save(this.ballot)
      .subscribe({next: response => {
        this.numProcesBatch = response.processBatchId;
        this.isSuccessfulProcess = this.ballot.isPrePreparer ? false : true;
        this.isVisibleToken = this.isTokenFormDisabled = false;
        this.isDisabledForm = true;
        if (this.ballot.isPrePreparer) {
          this._router.navigate(['/operations/newBallotOfWarranty']);
        }
      }, error: _err => {
        this.globalService.danger('Operación fallida', _err.message);
        this.isTokenFormDisabled = false;
      }});
  }

  handleDownloadContract() {
    this.utilsService.donwloadReport('Contrato.pdf', this.tempContract);
  }

  handleSuccessfulProcess() {
    this.isSuccessfulProcess = false;
    this._router.navigate(['/operations/newBallotOfWarranty']);
  }

  handleNamesApprovers($event: any[]) {
    this.onChangeNamesApprovers.emit($event);
  }

  handleApproversOrControllersChanged($event: ApproversAndControllers) {
    this.ballot.controllers = $event.controllers;
    this.ballot.approvers = $event.approvers;
    this.ballot.cismartApprovers = $event.cismartApprovers;
  }

  writeValue(obj: any): void {
    if (obj) {
      this.ballot = obj;
    }
  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(_fn: any): void {
    /*nonImplentation */
  }

  propagateChange = (_: any) => {
    /*nonImplentation */
  };

}
