import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ApproversAndControllersService } from '../../../../Services/approvers-and-controllers/approversandcontrollers.service';
import { ApproverOrControllerResult } from '../../../../Services/approvers-and-controllers/models/approver-or-controller-result';
import { ApproversDto } from '../../../../Services/approvers-and-controllers/models/approvers-dto';
import { CismartAuthorizerDto } from '../../../../Services/approvers-and-controllers/models/cismart-authorize-dto';
import { CismartAuthorizerResult } from '../../../../Services/approvers-and-controllers/models/cismart-authorizer-result';
import { InputApprovers } from '../../../../Services/approvers-and-controllers/models/input-approvers';
import { GlobalService } from '../../../../Services/shared/global.service';
import { UserService } from '../../../../Services/users/user.service';

@Component({
  selector: 'app-authorizer-status',
  standalone: false,
  templateUrl: './authorizer-status.component.html',
  styleUrls: ['./authorizer-status.component.css'],
  providers: [ApproversAndControllersService]
})
export class AuthorizerStatusComponent implements OnInit, OnChanges {

  approvers: ApproverOrControllerResult[] = [];
  controllers: ApproverOrControllerResult[] = [];
  cismartApprovers: CismartAuthorizerResult = new CismartAuthorizerResult();
  approversNumber: number = 0;
  controllersNumber: number = 0;
  isSignature = false;
  @Input() role = '';
  @Input() approversRequest: InputApprovers = new InputApprovers();
  @Input() isAdministrative: boolean = false;

  constructor(private userService: UserService, private messageService: GlobalService, private approversAndControllersService: ApproversAndControllersService) {
    this.isSignature = userService.getUserToken().is_signature!;
  }

  ngOnInit() {
    if (this.isAdministrative) {
      this.getApproversAndControllersAdm();
    }
  }

  ngOnChanges(changes: SimpleChanges | any) {
    if (changes.approversRequest && !changes.approversRequest.isFirstChange() && !this.isAdministrative) {
      this.approvers = [];
      this.controllers = [];
      this.cismartApprovers = new CismartAuthorizerResult();
      this.getApproversAndControllers();
    } if (this.isAdministrative) {
      this.getApproversAndControllersAdm();
    }
  }

  getApproversAndControllers() {
    if (this.approversRequest.accountId !== undefined) {
      if (this.approversRequest.isSignerScheme || (this.isSignature && !this.isAdministrative)) {
        this.getCismartApprovers();
      } else {
        this.getApprovers();
      }
      if (this.userService.getUserToken().controller_scheme) {
        this.getControllers();
      }
    }
  }

  getApproversAndControllersAdm() {
    this.getAdmApprovers();
    if (this.userService.getUserToken().controller_scheme) {
      this.getAdmControllers();
    }
  }

  getApprovers() {
    this.approversAndControllersService.getApprovers(this.getApproversDto())
      .subscribe({next: response => {
        this.approvers = response;
        this.getApproversNumber();
      }, error: _err => this.messageService.info('Autorizadores', _err)});
  }

  getCismartApprovers() {
    const dto: CismartAuthorizerDto = {
      accountNumber: this.approversRequest.accountNumber!,
      operationTypeId: this.approversRequest.operationTypeId,
      batchId: this.approversRequest.batchId,
      accountId: this.approversRequest.accountId!
    };
    this.approversAndControllersService.getCismartApprovers(dto)
      .subscribe({next: response => {
        this.cismartApprovers = response;
        this.approversNumber = response.authorizers.length;
      }, error: _err => this.messageService.info('Autorizadores', _err)});
  }

  getAdmApprovers() {
    this.approversAndControllersService.getAdmApprovers(this.getApproversDto())
      .subscribe({next: response => {
        this.approvers = response;
        this.getApproversNumber();
      }, error: _err => this.messageService.info('Autorizadores', _err)});
  }

  getControllers() {
    this.approversAndControllersService.getControllers(this.getApproversDto())
      .subscribe({next: response => {
        this.controllers = response;
        this.getControllersNumber();
      }, error: _err => this.messageService.info('Controladores', _err)});
  }

  getAdmControllers() {
    this.approversAndControllersService.getAdmControllers(this.getApproversDto())
      .subscribe({next: response => {
        this.controllers = response;
        this.getControllersNumber();
      }, error: _err => this.messageService.info('Controladores', _err)});
  }

  getApproversNumber() {
    if (!this.approversRequest.isAuthorizerControl) {
      this.approversRequest.accountId = undefined;
    }
    this.approversAndControllersService.getApproversNumber(this.getApproversDto())
      .subscribe({next: response => this.approversNumber = response.approversNumber,
        error: _err => this.messageService.info('Autorizadores', _err)});
  }

  getControllersNumber() {
    if (!this.approversRequest.isAuthorizerControl) {
      this.approversRequest.accountId = undefined;
    }
    this.approversAndControllersService.getControllersNumber(this.getApproversDto())
      .subscribe({next: response => this.controllersNumber = response.controllersNumber,
        error: _err => this.messageService.warning('Controladores', _err)});
  }

  getApproversDto(): ApproversDto {
    return {
      accountId: this.approversRequest.accountId,
      batchId: this.approversRequest.batchId,
      isAuthorizerControl: this.approversRequest.isAuthorizerControl,
      operationTypeId: this.approversRequest.operationTypeId,
    };
  }
}

