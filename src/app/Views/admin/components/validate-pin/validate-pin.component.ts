import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NumberPadComponent } from '../../../shared/cw-components/number-pad/number-pad.component';
import { ValidatePinModel } from '../../../../Services/users/models/validate-pin-model';
import { GetDatesDto } from '../../../../Services/OTP/models/get-dates-dto';
import { GetDatesResult } from '../../../../Services/OTP/models/get-dates-result';
import { GetCodeOTPResult } from '../../../../Services/OTP/models/get-code-otp-result';
import { UserService } from '../../../../Services/users/user.service';
import { GlobalService } from '../../../../Services/shared/global.service';
import { AppConfig } from '../../../../app.config';
import { OtpService } from '../../../../Services/OTP/otp.service';

@Component({
  selector: 'app-validate-pin',
  standalone: false,
  templateUrl: './validate-pin.component.html',
  styleUrl: './validate-pin.component.css'
})
export class ValidatePinComponent implements OnInit {

  @Output() onSubmit = new EventEmitter();
  //@ViewChild(CaptchaComponent) captchaComponent!: CaptchaComponent;
  @ViewChild(NumberPadComponent) numberPadComponent!: NumberPadComponent;
  @Input() accessNumber = '';
  @Input() readOnlyAccessNumber = false;
  @Input() isVisibleCancel = false;
  validateCaptcha = true;
  result = { isOk: false, numberAccess: '', message: '', pin: '', card: '' };
  validatePin: ValidatePinModel = new ValidatePinModel();
  captchaValue!: string;
  sendCodeOTP = false;
  isSixDigits = false;
  digitsPin = 4;
  disabled = true;
  disabledCode = true;
  getDatesDto: GetDatesDto = new GetDatesDto();
  getDatesValidateDto: GetDatesDto = new GetDatesDto();
  getDatesResult: GetDatesResult = new GetDatesResult();
  getCodeOTPResult: GetCodeOTPResult = new GetCodeOTPResult();
  response: any;
  isBtnOTP = false;
  disabledButtonOk = true;
  isSaveOTP = false;

  constructor(private userService: UserService, private globalService: GlobalService, private config: AppConfig, private otpService: OtpService) {
  }

  ngOnInit() {
    this.validatePin.card = this.accessNumber;
    this.validateCaptcha = this.config.getConfig('validateCaptcha');
  }

  handleCountCard() {
    this.disabledCode = true;
    if (this.validatePin.card.length === 16) {
      this.disabledCode = false;
    }
  }

  handleKeyPad($event: any) {
    this.validatePin.pin = $event;
  }

  handleSubmit() {
    if (!this.isBtnOTP) {
      this.globalService.showLoader(true);
      this.userService.getNewRecaptcha()
        .then((response: any) => {
          this.validatePin.captchaValue = response;
          this.validatePin.captchaValueToVerify = response;
          let newPin = this.getDatesDto.validationType + '' + this.validatePin.pin;
          this.validatePin.pin = newPin;
          this.getDatesValidateDto.codeId = this.getCodeOTPResult.codeId;
          this.getDatesValidateDto.code = newPin;
          this.getDatesValidateDto.userName = this.validatePin.card;
          if (this.getDatesDto.validationType !== 3) {
            this.otpService.validateCodeOTP(this.getDatesValidateDto).subscribe({next: (resp: any) => {
              const responseValidate = resp;
              if (responseValidate) {
                this.handleValidatePIN();
              }
            },error: _err => {
              this.globalService.danger('Alerta: ', _err.message);
            this.globalService.showLoader(false);
            this.numberPadComponent.resetPin();
          }});
          } else {
            this.handleValidatePIN();
          }
        });
    }
  }

  handleValidatePIN() {
    this.userService.validatePin(this.validatePin)
      .subscribe({next: (res:any) => {
        this.result.isOk = res;
        if (this.result.isOk) {
          this.result.numberAccess = this.validatePin.card;
          this.result.pin = this.validatePin.pin;
          this.result.card = this.validatePin.card;
          this.onSubmit.emit(this.result);
        } else if (this.result.message === 'invalid_username') {
          this.globalService.danger('Alerta: ', 'Tarjeta/PIN incorrectos, verifique sus datos');
          this.numberPadComponent.resetPin();
        } else {
          this.globalService.danger('Alerta: ', 'Tarjeta/PIN incorrectos, verifique sus datos ');
          this.numberPadComponent.resetPin();
        }
        this.globalService.showLoader(false);
      }, error: _err => {
        if (_err.status === 401 || _err.status === 500) {
          this.globalService.danger('Error: ', _err);
        } else if (_err.status === 400) {
          const errorTemp = _err;
          if (errorTemp.message === 'invalid_captcha') {
            this.globalService.showLoader(false);
            this.globalService.danger('Alerta: ', 'El texto introducido no coincide con la imagen');
          } else if (errorTemp.message === 'card_pin_error') {
            this.globalService.showLoader(false);
            this.globalService.danger('Alerta: ', 'Tarjeta/PIN incorrectos, verifique sus datos');
          } else {
            this.globalService.showLoader(false);
            this.globalService.danger('Alerta: ', errorTemp.message);
          }
        } else {
          this.globalService.danger('Error: ', 'Si el error persiste, por favor comuníquese con el Administrador del Sistema');
          ////console.log('error en el servicio del pin');
        }
        this.globalService.showLoader(false);
        this.numberPadComponent.resetPin();
      }});
  }

  handleGenerateCode() {
    this.isBtnOTP = true;
    this.numberPadComponent.handleOnClickLimpiar();
    this.getDatesDto.userName = this.validatePin.card;
    this.otpService.getUserDates(this.getDatesDto)
      .subscribe({next: resp => {
        const response = resp;
        this.getDatesResult.isValidCellPhone = response.isValidCellPhone;
        this.getDatesResult.isValidEmail = response.isValidEmail;
        this.getDatesResult.cellPhone = response.cellPhone;
        this.getDatesResult.email = response.email;
        this.sendCodeOTP = true;
      }, error: _err => {
        this.sendCodeOTP = false;
        this.globalService.danger('Alerta: ', _err.message);
      }});
  }
  setradio(e: number) {
    this.getDatesDto.validationType = e;
    this.disabledButtonOk = false;
  }

  SaveOTPCode() {
    this.disabled = false;
    this.isSaveOTP = false;
    this.digitsPin = 6;
    if (this.getDatesDto.validationType === 3) {
      this.digitsPin = 4;
    }
    if (this.getDatesDto.validationType !== 3) {
      let sendType = this.getDatesDto.validationType === 1 ? 'Celular.' : 'Correo.';
      this.globalService.showLoader(true);
      this.otpService.getCodeOTP(this.getDatesDto).subscribe({next: resp => {
        this.response = resp;
        this.getCodeOTPResult.codeId = this.response.codeId;
        this.sendCodeOTP = false;
        this.isBtnOTP = false;
        this.isSaveOTP = true;
        this.globalService.showLoader(false);
        if (this.getDatesDto.validationType === 1 || this.getDatesDto.validationType === 2) {
          this.globalService.success('Mensaje : ', 'El Código se envió correctamente, revise su ' + sendType);
        }
      }, error: _err => {
        this.globalService.showLoader(false);
        this.sendCodeOTP = false;
        this.globalService.danger('Alerta: ', 'No se pudo enviar su Código.');
      }});
    } else if (this.getDatesDto.validationType === 3) {
      this.sendCodeOTP = false;
      this.isBtnOTP = false;
    }
  }
}
