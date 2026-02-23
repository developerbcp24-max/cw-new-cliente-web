import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ConsultClientResponse } from '../../../../Services/AffiliationRegCw/Models/ConsultClientResponse';
import { ConsultClientRequest } from '../../../../Services/AffiliationRegCw/Models/ConsultClientRequest';
import { GetDatesAffilition } from '../../../../Services/OTP/models/GetDatesAffilition';
import { GetCodeOTPResult } from '../../../../Services/OTP/models/get-code-otp-result';
import { GetDatesDto } from '../../../../Services/OTP/models/get-dates-dto';
import { GetRespPassiveLiveTestRequest } from '../../../../Services/AffiliationRegCw/Models/GetRespPassiveLiveTestRequest';
import { GetRespPassiveLiveTestResponse } from '../../../../Services/AffiliationRegCw/Models/GetRespPassiveLiveTestResponse';
import { GetValidatePassiveLiveTestRequest } from '../../../../Services/AffiliationRegCw/Models/GetValidatePassiveLiveTestRequest';
import { GetValidatePassiveLiveTestResponse } from '../../../../Services/AffiliationRegCw/Models/GetValidatePassiveLiveTestResponse';
import { ResponseBranchOffices } from '../../../../Services/AffiliationRegCw/Models/ResponseBranchOffices';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AffiliationRegCwService } from '../../../../Services/AffiliationRegCw/affiliation-reg-cw.service';
import { OtpService } from '../../../../Services/OTP/otp.service';
import { DomSanitizer } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';
import { openNotificationDialog } from '../../../../Helpers/notification-dialog.helper';
import { DialogUpdateUserInfoComponent } from '../../../shared/cw-components/dialog-update-user-info/dialog-update-user-info.component';
import { retry, share, Subject, switchMap, takeUntil, timer } from 'rxjs';

@Component({
  selector: 'app-personal-information',
  standalone: false,
  templateUrl: './personal-information.component.html',
  styleUrl: './personal-information.component.css',
  providers: [AffiliationRegCwService]
})
export class PersonalInformationComponent implements OnInit {
  @Output() setAffCompanyIdEvent = new EventEmitter<string>();
  @Output() setConsultClientResponseEvent =
    new EventEmitter<ConsultClientResponse>();
  @Output() setConsultClientRequestEvent =
    new EventEmitter<ConsultClientRequest>();
  @Output() changeStepEvent: EventEmitter<number> = new EventEmitter<number>();

  currentStep: number = 0;
  // Initial values
  legalRepresentativeForm: FormGroup;
  _infClientReq: ConsultClientRequest = new ConsultClientRequest();
  _otpReq: GetDatesAffilition = new GetDatesAffilition();
  _otpRes: GetCodeOTPResult = new GetCodeOTPResult();
  _otpReqValidate: GetDatesDto = new GetDatesDto();
  _inputCode: string = '';
  _infClientRes: ConsultClientResponse = new ConsultClientResponse();
  _getRespPassiveLiveTestReq: GetRespPassiveLiveTestRequest =
    new GetRespPassiveLiveTestRequest();
  _getRespPassiveLiveTestRes: GetRespPassiveLiveTestResponse =
    new GetRespPassiveLiveTestResponse();
  _getValidatePassiveLiveTestReq: GetValidatePassiveLiveTestRequest =
    new GetValidatePassiveLiveTestRequest();
  _getValidatePassiveLiveTestRes: GetValidatePassiveLiveTestResponse =
    new GetValidatePassiveLiveTestResponse();

  cameraAvailable = false;
  imagesValid = false;
  frontImage: string | null = null;
  backImage: string | null = null;

  _respBranchOffices: ResponseBranchOffices[] = [];

  form!: FormGroup;
  formCli!: FormGroup;
  formOtp!: FormGroup;
  formComp!: FormGroup;
  formImg!: FormGroup;

  timeLeft: number = 60;

  stepOptions = [
    { value: 1, viewValue: 'GD', selected: true },

    { value: 2, viewValue: 'VI', selected: false },
    { value: 3, viewValue: 'PLT', selected: false },
    { value: 4, viewValue: 'OTP', selected: false },
  ];

  canResend: boolean = false;

  constructor(
    private _affiliationService: AffiliationRegCwService,
    private formBuilder: FormBuilder,
    private _otp: OtpService,
    private _sanitizer: DomSanitizer,
    public dialog: MatDialog,
    private fb: FormBuilder
  ) {
    this.legalRepresentativeForm = this.fb.group({
      isLegalRepresentative: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.initializeFormCli();
    this.getBranchOffice();
  }
  proceedToNextStep() {
    const isLegalRep =
      this.legalRepresentativeForm.get('isLegalRepresentative')?.value ===
      'true';

    if (isLegalRep) {
      // Continuar con el flujo normal (paso 1)
      this._infClientReq.isRepresentative = true;
      this.currentStep = 1;
      // También actualizar stepOptions si es necesario
      this.updateStepOptions(1);
    } else {
      // Manejar caso cuando no es representante legal
      this._infClientReq.isRepresentative = false;
      this.currentStep = 1;
      this.handleNonLegalRepresentative();
    }
  }
  private updateStepOptions(stepValue: number) {
    this.stepOptions.forEach((step) => (step.selected = false));
    const targetStep = this.stepOptions.find(
      (step) => step.value === stepValue
    );
    if (targetStep) {
      targetStep.selected = true;
    }
  }

  private handleNonLegalRepresentative() {
    // Mostrar mensaje o redirigir
    ////console.log('Usuario no es representante legal');
  }
  initializeFormCli() {
    this.formCli = this.formBuilder.group({
      idc: [
        this._infClientReq.idc,
        [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(10),
        ],
      ],
      extensionIdc: [this._infClientReq.extensionIdc, [Validators.required]],
      complement: [this._infClientReq.complement, [Validators.maxLength(3)]],
      nroCuenta: [
        this._infClientReq.nroCuenta,
        [Validators.required, Validators.minLength(8)],
      ],
      nit: [
        this._infClientReq.nit,
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(14),
        ],
      ],
    });
  }
  onUpload(type: 'front' | 'back', event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (type === 'front') {
          this.frontImage = e.target?.result as string;
        } else {
          this.backImage = e.target?.result as string;
        }
        this.checkImagesValid();
      };
      reader.readAsDataURL(file);
    }
  }

  remove(type: 'front' | 'back') {
    if (type === 'front') {
      this.frontImage = null;
    } else {
      this.backImage = null;
    }
    this.checkImagesValid();
  }

  checkImagesValid() {
    this.imagesValid = this.frontImage !== null && this.backImage !== null;
  }
  getBranchOffice() {
    this._affiliationService.getBranchOffice().subscribe({
      next: (data: ResponseBranchOffices[]) => {
        this._respBranchOffices = data;
      },
      error: (error) => {
        //console.warn(error);
      },
    });
  }

  getInfClient() {
    this._infClientReq = { ...this._infClientReq, ...this.formCli.value };
    this._infClientReq.typeNit = 'T';

    this._affiliationService.getInfoClient(this._infClientReq).subscribe({
      next: (data: ConsultClientResponse) => {
        this._infClientRes = data;

        this.startCountdown();

        this.setAffCompanyIdEvent.emit(this._infClientRes.affCompanyId);
        this.setConsultClientResponseEvent.emit(this._infClientRes);
        this.setConsultClientRequestEvent.emit(this._infClientReq);
        this.changePage(2);
      },
      error: (error) => {
        this.openErrorDialog(
          error.message === 'No se puede conectar al servicio.'
            ? 'Error interno, favor comunicarse con Soporte Help Desk a la Linea gratuita 800-10-2244'
            : error.message
        );
      },
    });
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

  openErrorDialog(message: string) {
    openNotificationDialog(
      message,
      'La solicitud no pudo ser procesada',
      'incorrect',
      'Intentar nuevamente',
      this.dialog
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

  openUpdateUserInfoDialog() {
    this.dialog.open(DialogUpdateUserInfoComponent, {
      width: '576px',
      height: '316px',
    });
  }

  changePage(stepValue: number) {
    for (let item of this.stepOptions) {
      item.selected = item.value === stepValue;
    }
  }

  getActualStep(): number {
    return this.stepOptions.find((item) => item.selected)?.value ?? 1;
  }

  currentResult: number = 0;
  cameraResults = [
    {
      icon: 'correct',
      message: 'Validación exitosa',
      buttonMessage: 'Continuar',
    },
    {
      icon: 'incorrect',
      message: 'No se completó la verificación, intenta nuevamente por favor.',
      buttonMessage: 'Intentar nuevamente',
    },
  ];

  getRespPassiveLiveTest() {
    this._getRespPassiveLiveTestReq = {
      idc: this._infClientRes.idc,
      typeIdc: this._infClientRes.typeIdc,
      extensionIdc: this._infClientRes.extensionIdc,
      complementIdc: this._infClientRes.complement,
      email: this._infClientRes.email,
      phone: this._infClientRes.phone,
      affCompanyId: this._infClientRes.affCompanyId,
      flow: '1',
    };

    this._affiliationService
      .getRespPassiveLiveTest(this._getRespPassiveLiveTestReq)
      .subscribe({
        next: (data: GetRespPassiveLiveTestResponse) => {
          this._getRespPassiveLiveTestRes = data;
          this._getValidatePassiveLiveTestReq = {
            affCompanyId: this._infClientRes.affCompanyId,
            sessionID: data.sessionID,
          };
          this.changePage(3);
          this.pollingValidatePassiveLiveTest();
        },
        error: (_) => {
          this.openErrorDialog(
            'Error interno, favor comunicarse con Soporte Help Desk a la Linea gratuita 800-10-2244'
          );
        },
      });
  }

  pollingValidatePassiveLiveTest() {
    const stopPollingValidatePassiveLiveTest: Subject<void> =
      new Subject<void>();

    // Execute after 7 seconds with an interval of 5 seconds
    const secondsToStart: number = 7;
    const secondsInterval: number = 5;
    timer(secondsToStart * 1000, secondsInterval * 1000)
      .pipe(
        switchMap(() =>
          this._affiliationService.getValidatePassiveLiveTest(
            this._getValidatePassiveLiveTestReq
          )
        ),
        retry(3),
        share(),
        takeUntil(stopPollingValidatePassiveLiveTest)
      )
      .subscribe({
        next: (data: GetValidatePassiveLiveTestResponse) => {
          if (data.finishedProcess && data.phase === 'SuccessState') {
            stopPollingValidatePassiveLiveTest.next();
            this.setAffCompanyIdEvent.emit(this._infClientRes.affCompanyId);
            this.setConsultClientResponseEvent.emit(this._infClientRes);
            this.setConsultClientRequestEvent.emit(this._infClientReq);
            this.changePage(3);
            this.changeStepEvent.emit(1);
          }
        },
      });
  }

  getRespPassiveLiveTestResUrl() {
    const url = this._getRespPassiveLiveTestRes.url;
    return this._sanitizer.bypassSecurityTrustResourceUrl(url); //NOSONAR
  }
}
