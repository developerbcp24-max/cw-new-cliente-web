import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ConsultClientRequest } from '../../../../Services/AffiliationRegCw/Models/ConsultClientRequest';
import { ConsultClientResponse } from '../../../../Services/AffiliationRegCw/Models/ConsultClientResponse';
import { CreateDigitalFileAndSendOTPRequest } from '../../../../Services/AffiliationRegCw/Models/CreateDigitalFileAndSendOTPRequest';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GetCodeOTPResult } from '../../../../Services/OTP/models/get-code-otp-result';
import { UpdateSelectedAccountAndFirmantes } from '../../../../Services/AffiliationRegCw/Models/UpdateSelectedAccountAndFirmantes';
import { MatDialog } from '@angular/material/dialog';
import { AffiliationRegCwService } from '../../../../Services/AffiliationRegCw/affiliation-reg-cw.service';
import { AffiliationDocumentDialogComponent } from '../affiliation-document-dialog/affiliation-document-dialog.component';
import { openNotificationDialog } from '../../../../Helpers/notification-dialog.helper';
import { ValidateOTPDigitalFileRequest } from '../../../../Services/AffiliationRegCw/Models/ValidateOTPDigitalFileRequest';

@Component({
  selector: 'app-finalize-registration',
  standalone: false,
  templateUrl: './finalize-registration.component.html',
  styleUrl: './finalize-registration.component.css'
})
export class FinalizeRegistrationComponent {
  @Input() affCompanyId: string = '';
  @Input() documentDataString: string = '';
  @Input() client: {
    request: ConsultClientRequest;
    response: ConsultClientResponse;
  } = {
    request: new ConsultClientRequest(),
    response: new ConsultClientResponse(),
  };
  @Output() changeStepEvent: EventEmitter<number> = new EventEmitter<number>();

  _createDigitalFileAndSendReq: CreateDigitalFileAndSendOTPRequest =
    new CreateDigitalFileAndSendOTPRequest();
  timeLeft: number = 60;
  formOtp!: FormGroup;
  _otpRes: GetCodeOTPResult = new GetCodeOTPResult();
  _inputCode: string = '';
  _intervalId: any;
  canResend: boolean = false;

  stepOptions = [
    { value: 1, viewValue: 'DA', selected: true },
    { value: 2, viewValue: 'OTP', selected: false },
    { value: 3, viewValue: 'CR', selected: false },
  ];

  _updateAllInfoFirmasAndAccountsRequest: UpdateSelectedAccountAndFirmantes =
    new UpdateSelectedAccountAndFirmantes();

  constructor(
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private _affiliationService: AffiliationRegCwService
  ) {
    this.initializeFormOtp();
  }

  changePage(page: number) {
    for (let item of this.stepOptions) {
      item.selected = item.value === page;
    }
  }

  downloadDocument() {
    let link = document.createElement('a');
    link.download = 'comprobante-ob.pdf';
    link.href = this.documentDataString;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  openDocumentDialog() {
    this.dialog.open(AffiliationDocumentDialogComponent, {
      data: {
        documentDataString: this.documentDataString,
      },
      panelClass: 'affiliation-document-dialog-class',
    });
  }

  startOTP() {
    this.createDigitalFileAndSendOTP(true);
    this.changePage(2);
  }

  createDigitalFileAndSendOTP(startCountdown: boolean = false) {
    this._createDigitalFileAndSendReq = new CreateDigitalFileAndSendOTPRequest({
      affCompanyId: this.affCompanyId,
      base64: this.documentDataString.split('base64,')[1],
    });

    this._affiliationService
      .createDigitalFileAndSendOTP(this._createDigitalFileAndSendReq)
      .subscribe({
        next: () => {
          if (this.timeLeft === 0 || startCountdown) {
            this.startCountdown();
          }
          this.changePage(2);
        },
        error: (_) => {
          this.openErrorDialog(
            'Error interno, favor comunicarse con Soporte Help Desk a la Linea gratuita 800-10-2244'
          );
        },
      });
  }

  startCountdown() {
    this.timeLeft = 60;
    clearInterval(this._intervalId);
    this._intervalId = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        this.canResend = true;
        clearInterval(this._intervalId);
      }
    }, 1000);
  }

  initializeFormOtp() {
    this.formOtp = this.formBuilder.group({
      otp1: ['', [Validators.required]],
      otp2: ['', [Validators.required]],
      otp3: ['', [Validators.required]],
      otp4: ['', [Validators.required]],
      otp5: ['', [Validators.required]],
      otp6: ['', [Validators.required]],
    });
  }

  openErrorDialog(
    message: string,
    onDialogClose: Function = () => {
      // This is intentional
    }
  ) {
    openNotificationDialog(
      message,
      'La solicitud no pudo ser procesada',
      'incorrect',
      'Intentar nuevamente',
      this.dialog,
      onDialogClose
    );
  }

  moveFocus(
    event: KeyboardEvent,
    nextInput: HTMLInputElement,
    prevInput?: HTMLInputElement
  ) {
    const input = event.target as HTMLInputElement;
    if (event.key === 'Backspace') {
      if (prevInput && input.value.length === 0) {
        prevInput.focus();
      }
    } else if (input.value.length === 1) {
      nextInput?.focus();
    }
  }

  resendOPT() {
    if (this.canResend) {
      // this.getCodeOTPAffiliation();
      // if (this.timeLeft === 0) {
      //   this.canResend = false;
      //   this.startCountdown();
      // }
      // this.timeLeft = 60;
      // this.formOtp.reset();
    }
  }

  // getCodeOTPAffiliation() {
  //   this._affiliationService
  //     .digFileSignatureReSendOTP(this.strIdClient)
  //     .subscribe({
  //       error: (_) => {
  //         this.openErrorDialog(
  //           'Error interno, favor comunicarse con Soporte Help Desk a la Linea gratuita 800-10-2244'
  //         );
  //       },
  //     });
  // }

  validateOtp() {
    this._inputCode = '';
    for (let i = 1; i < 7; i++) {
      this._inputCode += this.formOtp.value[`otp${i}`];
    }
    const _validateOTPDigitalFileRequestReq: ValidateOTPDigitalFileRequest =
      new ValidateOTPDigitalFileRequest({
        idc: this.client.response.idc,
        typeIdc: this.client.response.typeIdc,
        extencionIdc: this.client.request.extensionIdc,
        complement: this.client.request.complement,
        affCompanyId: this.affCompanyId,
        codeOTP: this._inputCode,
      });
    this._affiliationService
      .validateOTPDigitalFile(_validateOTPDigitalFileRequestReq)
      .subscribe({
        next: (_) => {
          openNotificationDialog(
            'Recibirá el documento firmado por correo electrónico',
            'Se firmó el documento correctamente',
            'correct',
            'Continuar',
            this.dialog,
            () => {
              this.changePage(3);
            },
            true
          );
        },
        error: (_) => {
          this.openErrorDialog('El código ingresado es incorrecto');
        },
      });
  }
}

