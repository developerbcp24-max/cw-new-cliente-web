import { Component, OnInit, EventEmitter, Output, Input, forwardRef, ViewChild } from '@angular/core';
import { BallotOfWarrantyService } from '../../../../Services/ballot-of-warranty/ballot-of-warranty.service';
import { ParametersService } from '../../../../Services/parameters/parameters.service';
import { ParameterDto } from '../../../../Services/parameters/models/parameter-dto';
import { GlobalService } from '../../../../Services/shared/global.service';
import { ParameterResult } from '../../../../Services/parameters/models/parameter-result';
import { BallotOfWarrantyDto } from '../../../../Services/ballot-of-warranty/models/ballot-of-warranty-dto';
import { NG_VALUE_ACCESSOR, NgForm } from '@angular/forms';
import { InputApprovers } from '../../../../Services/approvers-and-controllers/models/input-approvers';
import { OperationType } from '../../../../Services/shared/enums/operation-type';
import { UserService } from '../../../../Services/users/user.service';
import { TokenCredentials } from '../../../../Services/tokens/models/token-credentials';
import { UtilsService } from '../../../../Services/shared/utils.service';
import { Router } from '@angular/router';
import { Constants } from '../../../../Services/shared/enums/constants';
import { ApproversAndControllers } from '../../../../Services/approvers-and-controllers/models/approvers-and-controllers';
declare let $: any;

@Component({
  selector: 'app-delivery-instructions',
  standalone: false,
  templateUrl: './delivery-instructions.component.html',
  styleUrls: ['./delivery-instructions.component.css'],
  providers: [BallotOfWarrantyService, ParametersService, UtilsService,
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DeliveryInstructionsComponent),
      multi: true
    }]
})

export class DeliveryInstructionsComponent implements OnInit {

  @Input() ballot!: BallotOfWarrantyDto;
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
  isValidContract!: boolean;
  isPreSave = false;
  messagePrePreparer = Constants.messagePrePreparer;
  is_validbatchtoken!: boolean;

  @ViewChild('formComponent') form!: NgForm;
  @Output() onChangeNamesApprovers = new EventEmitter<any[]>();

  constructor(private ballotOfWarrantyService: BallotOfWarrantyService, private userService: UserService, private _router: Router,
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
    this.ballotOfWarrantyService.GetContract(this.ballot)
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

  handleValidateNoToken(approversAndControllersValidation: boolean) {
    this.handleValidate();
    if (approversAndControllersValidation && this.isValidContract) {
      this.ballot.isPrePreparer = true;
      this.isPreSave = true;
    }
  }

  handleTokenSubmit($event: TokenCredentials) {
    if (this.titularUser.company_name.trim() === this.ballot.nameThirdPerson.trim()) {
      this.ballot.nameThirdPerson = '';
      this.ballot.documentCIThirdPerson = '';
    }
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

  handleSaveBallot($event: TokenCredentials) {
    this.ballot.token = $event.code;
    this.ballot.tokenCode = $event.code;
    this.ballot.tokenName = $event.name;
    this.ballot.numberWarranty = '-';
    this.isTokenFormDisabled = true;
    this.ballotOfWarrantyService.Save(this.ballot)
      .subscribe({next: response => {
        this.numProcesBatch = response.processBatchId;
        this.isSuccessfulProcess = this.ballot.isPrePreparer ? false : true;
        this.isVisibleToken = this.isTokenFormDisabled = false;
        this.isDisabledForm = true;
        if (this.ballot.isPrePreparer) {
          this._router.navigate(['/operations/ballotOfWarranty']);
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
    this._router.navigate(['/operations/ballotOfWarranty']);
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
    //on more
  }

  propagateChange = (_: any) => { //on more
  };

}
