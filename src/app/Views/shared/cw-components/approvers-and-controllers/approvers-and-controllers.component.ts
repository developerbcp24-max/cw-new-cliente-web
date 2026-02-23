import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { DecimalPipe } from "@angular/common";
import { ApproversAndControllersService } from '../../../../Services/approvers-and-controllers/approversandcontrollers.service';
import { UtilsService } from '../../../../Services/shared/utils.service';
import { ApproversAndControllers } from '../../../../Services/approvers-and-controllers/models/approvers-and-controllers';
import { ApproverOrControllerResult } from '../../../../Services/approvers-and-controllers/models/approver-or-controller-result';
import { CismartAuthorizerResult } from '../../../../Services/approvers-and-controllers/models/cismart-authorizer-result';
import { CurrentUser } from '../../../../Services/users/models/current-user';
import { InputApprovers } from '../../../../Services/approvers-and-controllers/models/input-approvers';
import { AccountDto } from '../../../../Services/accounts/models/account-dto';
import { EventLogRequest } from '../../../../Services/mass-payments/Models/event-log-request';
import { UserService } from '../../../../Services/users/user.service';
import { GlobalService } from '../../../../Services/shared/global.service';
import { AuthenticationService } from '../../../../Services/users/authentication.service';
import { ParametersService } from '../../../../Services/parameters/parameters.service';
import { CismartAuthorizerDto } from '../../../../Services/approvers-and-controllers/models/cismart-authorize-dto';
import { ApproversNumberResult } from '../../../../Services/approvers-and-controllers/models/approvers-number-result';
import { ControllerNumberResult } from '../../../../Services/approvers-and-controllers/models/controllers-number-result';
import { Authorizer } from '../../../../Services/approvers-and-controllers/models/authorizer';
import { Constants } from '../../../../Services/shared/enums/constants';
import { ApproversDto } from '../../../../Services/approvers-and-controllers/models/approvers-dto';
import { CismartApproversValidationDto } from '../../../../Services/approvers-and-controllers/models/cismart-approvers-validation-dto';
import { ParameterDto } from '../../../../Services/parameters/models/parameter-dto';
import { CismartApproversValidationResult } from '../../../../Services/approvers-and-controllers/models/cismart-approvers-validation-result';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-approvers-and-controllers',
  standalone: false,
  templateUrl: './approvers-and-controllers.component.html',
  styleUrls: ['./approvers-and-controllers.component.css'],
  providers: [ApproversAndControllersService, UtilsService]
})
export class ApproversAndControllersComponent implements OnInit, OnChanges {

  data: ApproversAndControllers;
  approvers: ApproverOrControllerResult[] = [];
  cismartApprovers: CismartAuthorizerResult = new CismartAuthorizerResult();
  controllers: ApproverOrControllerResult[] = [];
  rejectedApprover!: string;
  approversNumber: number;
  controllersNumber: number;
  controllersHaveErrors!: boolean;
  approversHaveErrors!: boolean;
  approversCismartHaveErrors!: boolean;
  isSignature = false;
  namesApprovers: any[] = [];
  line!: number;
  currentUser: CurrentUser;
  @Input() showOnly = '';
  @Input() approversRequest?: InputApprovers;
  @Input() isAdministrative = false;
  @Input() currency!: string;
  @Input() amounts: number[] = [];
  @Input() amount!: number;
  @Input() disabled: boolean;
  @Input() isVisible: boolean;
  @Input() showApproversNumber = false;
  @Input() accountDto!: AccountDto;
  @Output() onChange: EventEmitter<ApproversAndControllers>;
  @Output() onChangeNamesApprovers = new EventEmitter<any[]>();
  isfirst = false;
  eventLog = new EventLogRequest();

  constructor(private userService: UserService,
    private messageService: GlobalService,
    private utilsService: UtilsService, private decimalPipe: DecimalPipe,
    private approversAndControllersService: ApproversAndControllersService,
    private authenticationService: AuthenticationService,
    private paramService: ParametersService) {
    this.approversNumber = 0;
    this.controllersNumber = 0;
    this.isAdministrative = false;
    this.disabled = false;
    this.data = new ApproversAndControllers();
    this.onChange = new EventEmitter();
    this.isVisible = true;
    this.isSignature = userService.getUserToken().is_signature!;
    this.currentUser = userService.getUserToken();
  }

  ngOnInit() {
    if (this.isAdministrative) {
      this.getApproversAndControllersAdm();
    }
    this.utilsService.getLastOne();

    // Events
    this.eventLog.userName = sessionStorage.getItem('userActual')!;
    this.eventLog.module = "Credinet Web Cliente";
    this.eventLog.event = "Pagos Masivos";
    this.eventLog.eventDetail = "Proveedores Abono en Otro Banco ACH";
    this.eventLog.browserAgentVersion = this.authenticationService.browser;
    this.eventLog.sourceIP = this.authenticationService.ipClient;
  }

  ngOnChanges(changes: SimpleChanges | any) {
    if (changes.approversRequest && !changes.approversRequest.isFirstChange() && !this.isAdministrative) {
      this.approvers = [];
      this.controllers = [];
      this.cismartApprovers = new CismartAuthorizerResult();
      if (changes.approversRequest.previousValue === undefined) {
        this.isfirst = true;
      } else {
        this.isfirst = false;
        this.getApproversAndControllers();
      }
      this.onChange.emit(this.data);
    }
    if (this.isAdministrative) {
      this.getApproversAndControllersAdm();
    }
    if (changes.amount && !changes.amount.isFirstChange()) {
      this.amounts = [];
    }
  }

  getApproversAndControllers() {
    if (this.approversRequest?.accountId !== undefined) {
      if (this.approversRequest.isSignerScheme || (this.isSignature && !this.isAdministrative)) {
        this.getCismartApproversService();
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
    this.data.approvers = [];
    this.approversAndControllersService
      .getApprovers(this.getApproversDto())
      .subscribe({
        next: (response: ApproverOrControllerResult[]) => {
          this.approvers = response;
          this.getApproversNumber();
        }, error: _err => this.messageService.info('Autorizadores', _err.message)
      });
  }

  /*  getCismartApproversService() {
     this.data.cismartApprovers = [];
     const dto: CismartAuthorizerDto = {
       accountNumber: this.approversRequest?.accountNumber!,
       operationTypeId: this.approversRequest!.operationTypeId,
       batchId: this.approversRequest?.batchId,
       accountId: this.approversRequest?.accountId!
     };
     this.approversAndControllersService
       .getCismartApprovers(dto)
       .subscribe({
         next: (response: CismartAuthorizerResult) => {
           if (response.instructions !== '') {
             this.cismartApprovers = response;
             this.approversNumber = response.authorizers.length;
           } else {
             this.cismartApprovers = new CismartAuthorizerResult();
             this.approversNumber = 0;
           }
         }, error: _err => {
           this.cismartApprovers = new CismartAuthorizerResult();
           this.approversNumber = 0;
         }
       });
   } */
  getCismartApproversService() {
    this.data.cismartApprovers = [];

    // Validación de datos de entrada
    if (!this.approversRequest?.accountId) {
      this.messageService.info('Error', 'No se ha seleccionado una cuenta válida');
      return;
    }

    const dto: CismartAuthorizerDto = {
      accountNumber: this.approversRequest.accountNumber!,
      operationTypeId: this.approversRequest.operationTypeId,
      batchId: this.approversRequest.batchId,
      accountId: this.approversRequest.accountId
    };

    this.approversAndControllersService
      .getCismartApprovers(dto)
      .subscribe({
        next: (response: CismartAuthorizerResult | null) => {
          try {
            if (this.isValidCismartResponse(response)) {
              this.cismartApprovers = response!;
              this.approversNumber = response!.authorizers?.length || 0;
            } else {
              this.resetCismartApprovers();
            }
          } catch (error) {
            //console.error('Error procesando respuesta Cismart:', error);
            this.resetCismartApprovers();
          }
        },
        error: (err: HttpErrorResponse) => {
          this.resetCismartApprovers();
          const errorMessage = err?.error?.message || 'Error al obtener autorizadores Cismart';
          this.messageService.info('Error', errorMessage);
        }
      });
  }

  /**
   * Valida que la respuesta de Cismart sea válida
   */
  private isValidCismartResponse(response: CismartAuthorizerResult | null): boolean {
    return !!(
      response &&
      response.instructions &&
      response.instructions.trim() !== '' &&
      Array.isArray(response.authorizers)
    );
  }

  /**
   * Resetea los valores de autorizadores Cismart
   */
  private resetCismartApprovers(): void {
    this.cismartApprovers = new CismartAuthorizerResult();
    this.approversNumber = 0;
  }

  getAdmApprovers() {
    this.data.approvers = [];
    this.approversAndControllersService
      .getAdmApprovers(this.getApproversDto())
      .subscribe({
        next: (response: ApproverOrControllerResult[]) => {
          this.approvers = response;
          this.getApproversNumber();
        }, error: _err => this.messageService.info('Autorizadores', _err.message)
      });
  }

  getControllers() {
    this.data.controllers = [];
    this.approversAndControllersService
      .getControllers(this.getApproversDto())
      .subscribe({
        next: (response: ApproverOrControllerResult[]) => {
          this.controllers = response;
          this.getControllersNumber();
        }, error: _err => this.messageService.info('Controladores', _err.message)
      });
  }

  getAdmControllers() {
    this.data.controllers = [];
    this.approversAndControllersService
      .getAdmControllers(this.getApproversDto())
      .subscribe({
        next: (response: ApproverOrControllerResult[]) => {
          this.controllers = response;
          this.getControllersNumber();
        }, error: _err => this.messageService.info('Controladores', _err.message)
      });
  }

  getApproversNumber() {
    if (!this.approversRequest!.isAuthorizerControl) {
      this.approversRequest!.accountId = undefined;
    }
    this.approversAndControllersService
      .getApproversNumber(this.getApproversDto())
      .subscribe({
        next: (response: ApproversNumberResult) => {
          this.approversNumber = response.approversNumber;
        }, error: _err => this.messageService.info('Autorizadores', _err.message)
      });
  }

  getControllersNumber() {
    const numberControllerDto = this.getApproversDto();
    if (!this.approversRequest!.isAuthorizerControl) {
      numberControllerDto.accountId = undefined;
    }
    this.approversAndControllersService
      .getControllersNumber(numberControllerDto)
      .subscribe({
        next: (response: ControllerNumberResult) => {
          this.controllersNumber = response.controllersNumber;
        }, error: _err => this.messageService.info('Controladores', _err.message)
      });
  }

  handleNewOperation() {
    this.data.approvers = [];
    this.approvers.forEach(x => x.isSelected = false);
    this.controllers.forEach(x => x.isSelected = false);
  }

  handleApproverChecked(id: number) {
    this.data.approvers = this.addOrRemoveElements(this.data.approvers, id);
    this.validateApproversNumber();
    this.onChange.emit(this.data);
    this.namesApprovers = [];
    this.data.approvers.forEach(element => {
      const approverTemp = this.approvers.find(x => x.id === element);
      this.namesApprovers.push(approverTemp);
    });
    this.onChangeNamesApprovers.emit(this.namesApprovers);

    this.checkEventLogAuthorizers(id, 1);
  }

  checkEventLogAuthorizers(id: number, tipo: number) {
    if (localStorage.getItem('operationType') == "24") {
      if (tipo == 1) {
        this.eventLog.eventName = "Check Autorizador id: " + id;
      } else {
        this.eventLog.eventName = "Check Controlador id: " + id;
      }

      this.eventLog.eventType = "input checkbox";
      this.eventLog.previousData = "";
      this.eventLog.updateData = "";

      this.paramService.saveEventLog(this.eventLog).subscribe();
    }
  }

  handleApproverCismartChecked(authorizer: Authorizer) {
    const { data } = this;
    let exists = false;
    for (let index = 0; index < data.cismartApprovers.length; index++) {
      if (data.cismartApprovers[index].id === authorizer.id) {
        data.cismartApprovers.splice(index, 1);
        exists = true;
        break;
      }
    }
    if (!exists) {
      this.data.cismartApprovers.push({ idc: authorizer.idc, id: authorizer.id, type: authorizer.typeId });
    }
    this.onChange.emit(this.data);
    this.namesApprovers = [];
    this.data.cismartApprovers.forEach(element => {
      const approverTemp = this.cismartApprovers.authorizers.find(x => x.id === element.id);
      this.namesApprovers.push(approverTemp);
    });
    this.onChangeNamesApprovers.emit(this.namesApprovers);
  }

  handleControllerChecked(id: number) {
    this.data.controllers = this.addOrRemoveElements(this.data.controllers, id);
    this.validateControllersNumber();
    this.onChange.emit(this.data);

    this.checkEventLogAuthorizers(id, 2);
  }

  addOrRemoveElements(array: number[], item: number): number[] {
    array.includes(item) ? array.splice(array.indexOf(item, 0), 1) : array.push(item);
    return array;
  }

  public validateApproversLimit(): boolean {
    if (this.isSignature && !this.isAdministrative) {
      return true;
    }
    if (this.amounts.length === 0 && this.amount) {
      this.amounts.push(this.amount);
    }
    if (this.currentUser.authorize_operation) {
      this.line = 0;
      for (const amount of this.amounts) {
        this.line++;
        const checkAmount = this.currency === Constants.currencyBol ? this.utilsService.changeAmountBolToUsd(amount) : amount;
        for (const approverId of this.data.approvers) {
          const approver = this.approvers.find(item => item.id === approverId)!;
          if (!this.validateLimit(approver, checkAmount)) {
            return false;
          }
        }
      }
    } else {
      const sum = this.amounts.reduce((a, b) => (+a) + (+b), 0);
      const amount = this.currency === Constants.currencyBol ? this.utilsService.changeAmountBolToUsd(sum) : sum;
      for (const approverId of this.data.approvers) {
        const approver = this.approvers.find(item => item.id === approverId)!;
        if (!this.validateLimit(approver, amount)) {
          return false;
        }
      }
    }
    return true;
  }

  validateLimit(approver: ApproverOrControllerResult, amount: number) {
    if (approver.limit < amount) {
      this.rejectedApprover = approver.names + ' ' + approver.firstLastName + ' ' + approver.secondLastName;
      this.messageService.info('Límite superado', 'El monto ' + amount + ' a abonar no puede ser mayor al límite del autorizador: ' + this.rejectedApprover + (this.currentUser.authorize_operation ? ' Error en Linea ' + this.line + ' ' : ''));
      return false;
    }
    return true;
  }


  public validateApproversLimitFx(): boolean {
    if (this.isSignature && !this.isAdministrative) {
      return true;
    }
    if (this.amounts.length === 0 && this.amount) {
      this.amounts.push(this.amount);
    }
    if (this.currentUser.authorize_operation) {
      this.line = 0;
      for (const amount of this.amounts) {
        this.line++;
        const checkAmount = this.currency === Constants.currencyBol ? this.utilsService.changeAmountBolToUsd(amount) : amount;
        for (const approverId of this.data.approvers) {
          const approver = this.approvers.find(item => item.id === approverId)!;
          if (!this.validateLimitFx(approver, checkAmount)) {
            return false;
          }
        }
      }
    } else {
      const sum = this.amounts.reduce((a, b) => (+a) + (+b), 0);
      const amount = this.currency === Constants.currencyBol ? this.utilsService.changeAmountBolToUsd(sum) : sum;
      for (const approverId of this.data.approvers) {
        const approver = this.approvers.find(item => item.id === approverId)!;
        if (!this.validateLimitFx(approver, amount)) {
          return false;
        }
      }
    }
    return true;
  }

  public validateLimitFx(approver: ApproverOrControllerResult, amount: number) {
    if (approver.limit < amount) {
      this.rejectedApprover = approver.names + ' ' + approver.firstLastName + ' ' + approver.secondLastName;
      this.messageService.info('Límite superado', 'El monto de compra, calculado según el tipo de cambio de venta, será convertido al tipo de cambio oficial. ' + this.decimalPipe.transform(amount ?? 0, '1.0-2') + ' a abonar no puede ser mayor al límite del autorizador: ' + this.rejectedApprover + (this.currentUser.authorize_operation ? ' Error en Linea ' + this.line + ' ' : ''));
      return false;
    }
    return true;
  }


  validateApproversNumber() {
    if (this.isSignature && !this.isAdministrative) {
      this.approversCismartHaveErrors = this.data.cismartApprovers.length === 0;
    } else {
      this.approversHaveErrors = this.data.approvers.length < this.approversNumber;
    }
  }

  validateControllersNumber() {
    this.controllersHaveErrors = this.data.controllers.length < this.controllersNumber;
  }

  handleValidate(): boolean {
    this.validateApproversNumber();
    if (this.userService.getUserToken().controller_scheme) {
      this.validateControllersNumber();
      if (this.isSignature && !this.isAdministrative) {
        return !this.controllersHaveErrors && !this.approversCismartHaveErrors && this.controllersNumber > 0;
      }
      return !this.controllersHaveErrors && !this.approversHaveErrors && this.approversNumber > 0 && this.controllersNumber > 0;
    }
    if (this.isSignature && !this.isAdministrative) {
      return !this.approversCismartHaveErrors;
    }
    return !this.approversHaveErrors && this.approversNumber > 0;
  }

  getApproversDto(): ApproversDto {
    return {
      accountId: this.approversRequest!.accountId,
      batchId: this.approversRequest!.batchId,
      isAuthorizerControl: this.approversRequest!.isAuthorizerControl,
      operationTypeId: this.approversRequest!.operationTypeId,
    };
  }

  validationCismart(): Observable<boolean> {
    let respCompany = this.userService.getUserToken();
    const subject = new Subject<boolean>();
    if (this.amounts.length === 0 && this.amount) {
      this.amounts.push(this.amount);
    }
    const dto = new CismartApproversValidationDto({
      accountId: this.approversRequest!.accountId,
      amount: this.amounts.reduce((a, b) => a + b, 0),
      currency: this.currency,
      authorizers: this.data.cismartApprovers,
    });

    if (this.isSignature && !this.isAdministrative) {
      this.paramService.getByGroup(new ParameterDto({ group: 'VALFIR' }))
        .subscribe({
          next: res => {
            if (res.find(x => x.value == respCompany.company_id)) {
              this.approversAndControllersService.validateSignersNumber(dto)
                .subscribe({
                  next: (res: CismartApproversValidationResult) => {
                    if (!res.isValid) {
                      this.messageService.info('Error de Validación: ', res.errorMessage);
                    }
                    subject.next(res.isValid);
                  }, error: _err => {
                    this.messageService.info('Error en el servicio de Cismart', _err.message);
                    subject.next(false);
                  }
                });
            } else {
              this.approversAndControllersService.validateCismartApprovers(dto)
                .subscribe({
                  next: (res: CismartApproversValidationResult) => {
                    if (!res.isValid) {
                      this.messageService.info('Error de Validación', res.errorMessage);
                    }
                    subject.next(res.isValid);
                  }, error: _err => {
                    this.messageService.info('Error en el servicio de Cismart', _err.message);
                    subject.next(false);
                  }
                });
            }
          }, error: _err => {
            this.messageService.info('Error en la validacion de compañia: ', _err.message);
          }
        });


    } else {
      return of(true);
    }
    return subject.asObservable();
  }
}
