import {
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { OnboardingMobileService } from '../../../../Services/onboarding-mobile/onboarding-mobile.service';
import { GetOnboardingMobileDataResponse } from '../../../../Services/onboarding-mobile/Models/GetOnboardingMobileDataResponse';
import { CreateDigitalFileAndSendOTPResponse } from '../../../../Services/onboarding-mobile/Models/CreateDigitalFileAndSendOTPResponse';
import { openNotificationDialog } from '../../../../Helpers/notification-dialog.helper';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-register-mobile-signature',
  standalone: false,
  templateUrl: './register-mobile-signature.component.html',
  styleUrl: './register-mobile-signature.component.css',
})
export class RegisterMobileSignatureComponent {
  @Input() getOnboardingMobileDataResponse: GetOnboardingMobileDataResponse =
    new GetOnboardingMobileDataResponse();
  @Input()
  createDigitalFileAndSendOTPResponse: CreateDigitalFileAndSendOTPResponse =
    new CreateDigitalFileAndSendOTPResponse();
  @Input() startCountdownEvent: boolean = false;

  @Output() changeStepEvent: EventEmitter<void> = new EventEmitter<void>();

  otpFormControl: FormControl = new FormControl('', [
    Validators.required,
    Validators.minLength(6),
    Validators.maxLength(6),
  ]);
  timeLeft: number = 60;
  canResend: boolean = false;

  constructor(
    private _onboardingMobileService: OnboardingMobileService,
    private dialog: MatDialog
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['startCountdownEvent']) {
      this.startCountdown();
    }
  }

  startCountdown() {
    const intervalId = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        this.canResend = true;
        clearInterval(intervalId);
      }
    }, 1000);
  }

  resendOtp() {
    const { createDigitalFileAndSendOTPResponse } = this;

    if (this.canResend) {
      this._onboardingMobileService
        .digitalFileReSendOTP({
          strIdClient: createDigitalFileAndSendOTPResponse.strIdClien,
        })
        .subscribe({
          next: (_) => {
            if (this.timeLeft === 0) {
              this.canResend = false;
              this.startCountdown();
            }
            this.timeLeft = 60;
            this.otpFormControl.reset();
          },
          error: (_) => {
            openNotificationDialog(
              'Error al validar el OTP',
              'La solicitud no pudo ser procesada',
              'incorrect',
              'Intentar nuevamente',
              this.dialog
            );
          },
        });
    }
  }

  validateOtp() {
    const {
      getOnboardingMobileDataResponse,
      otpFormControl,
      createDigitalFileAndSendOTPResponse,
    } = this;

    this._onboardingMobileService
      .validateOTPDigitalFile({
        idc: getOnboardingMobileDataResponse.affiliateIdc,
        typeIdc: getOnboardingMobileDataResponse.affiliateIdcType,
        extensionIdc: getOnboardingMobileDataResponse.affiliateIdcExtension,
        complementIdc: getOnboardingMobileDataResponse.affiliateIdcComplement,
        affCompanyId: getOnboardingMobileDataResponse.affCompanyId,
        codeOTP: otpFormControl.value,
        strIdClient: createDigitalFileAndSendOTPResponse.strIdClien,
      })
      .subscribe({
        next: (response) => {
          if (response) {
            this.changeStepEvent.emit();
          } else {
            openNotificationDialog(
              'OTP incorrecto',
              'La solicitud no pudo ser procesada',
              'incorrect',
              'Intentar nuevamente',
              this.dialog
            );
          }
        },
        error: (_) => {
          openNotificationDialog(
            'Error al validar el OTP',
            'La solicitud no pudo ser procesada',
            'incorrect',
            'Intentar nuevamente',
            this.dialog
          );
        },
      });
  }
}
