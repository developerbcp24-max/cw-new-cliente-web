import { Component, OnInit, ViewChild } from '@angular/core';
import { ConsultClientRequest } from '../../../Services/AffiliationRegCw/Models/ConsultClientRequest';
import { ConsultClientResponse } from '../../../Services/AffiliationRegCw/Models/ConsultClientResponse';
import { GetAccountsResponse } from '../../../Services/AffiliationRegCw/Models/GetAccountsResponse';
import { GetSignaturesResponse } from '../../../Services/AffiliationRegCw/Models/GetSignaturesResponse';
import { NewStepperComponent } from '../../shared/cw-components/new-stepper/new-stepper.component';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {
  registerSteps: { label: string }[] = [
    { label: 'Datos generales' },
    { label: 'Condiciones de la empresa' },
    { label: 'Adición de usuarios/roles' },
    { label: 'Autorice y finalice el registro' },
  ];
  currentStep: number = 1;

  affCompanyId: string = '';
  clientRequest: ConsultClientRequest = new ConsultClientRequest();
  clientResponse: ConsultClientResponse = new ConsultClientResponse();
  selectedAccounts: GetAccountsResponse[] = [];
  signatures: GetSignaturesResponse[] = [];
  documentDataString: string = '';

  @ViewChild(NewStepperComponent) newStepper!: NewStepperComponent;

  constructor(
    // To handle svg icons
    private readonly _iconRegistry: MatIconRegistry,
    public readonly _sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.initializeSVGIcons();
  }

  initializeSVGIcons() {
    this._iconRegistry.addSvgIcon(
      'first-icon',
      this._sanitizer.bypassSecurityTrustResourceUrl(
        '../../../../../src/assets/new-face/images/register/first-facial-recognition-icon.svg'
      )
    );
    this._iconRegistry.addSvgIcon(
      'second-icon',
      this._sanitizer.bypassSecurityTrustResourceUrl(
        '/src/assets/new-face/images/register/second-facial-recognition-icon.svg'
      )
    );
    this._iconRegistry.addSvgIcon(
      'third-icon',
      this._sanitizer.bypassSecurityTrustResourceUrl(
        'assets/new-face/images/register/third-facial-recognition-icon.svg'
      )
    );
    this._iconRegistry.addSvgIcon(
      'two-tone-white-logo',
      this._sanitizer.bypassSecurityTrustResourceUrl(
        'assets/new-face/images/register/two-tone-white-logo.svg'
      )
    );
    this._iconRegistry.addSvgIcon(
      'correct',
      this._sanitizer.bypassSecurityTrustResourceUrl(
        'assets/new-face/images/register/correct.svg'
      )
    );
    this._iconRegistry.addSvgIcon(
      'incorrect',
      this._sanitizer.bypassSecurityTrustResourceUrl(
        'assets/new-face/images/register/incorrect.svg'
      )
    );
    this._iconRegistry.addSvgIcon(
      'camera',
      this._sanitizer.bypassSecurityTrustResourceUrl(
        'assets/new-face/images/register/camera.svg'
      )
    );
    this._iconRegistry.addSvgIcon(
      'check',
      this._sanitizer.bypassSecurityTrustResourceUrl(
        'assets/new-face/images/register/check.svg'
      )
    );
    this._iconRegistry.addSvgIcon(
      'back',
      this._sanitizer.bypassSecurityTrustResourceUrl(
        'assets/new-face/images/register/back.svg'
      )
    );
    this._iconRegistry.addSvgIcon(
      'bolivia-flag',
      this._sanitizer.bypassSecurityTrustResourceUrl(
        'assets/new-face/images/register/bolivia-flag.svg'
      )
    );
    this._iconRegistry.addSvgIcon(
      'usa-flag',
      this._sanitizer.bypassSecurityTrustResourceUrl(
        'assets/new-face/images/register/usa-flag.svg'
      )
    );
    this._iconRegistry.addSvgIcon(
      'info',
      this._sanitizer.bypassSecurityTrustResourceUrl(
        'assets/new-face/images/register/info.svg'
      )
    );
    this._iconRegistry.addSvgIcon(
      'smile',
      this._sanitizer.bypassSecurityTrustResourceUrl(
        'assets/new-face/images/register/smile.svg'
      )
    );
    this._iconRegistry.addSvgIcon(
      'document',
      this._sanitizer.bypassSecurityTrustResourceUrl(
        'assets/new-face/images/register/document.svg'
      )
    );
    this._iconRegistry.addSvgIcon(
      'download',
      this._sanitizer.bypassSecurityTrustResourceUrl(
        'assets/new-face/images/register/download.svg'
      )
    );
    this._iconRegistry.addSvgIcon(
      'check-green',
      this._sanitizer.bypassSecurityTrustResourceUrl(
        'assets/new-face/images/register/check-green.svg'
      )
    );
    this._iconRegistry.addSvgIcon(
      'download-2',
      this._sanitizer.bypassSecurityTrustResourceUrl(
        'assets/new-face/images/register/download-2.svg'
      )
    );
    this._iconRegistry.addSvgIcon(
      'apple',
      this._sanitizer.bypassSecurityTrustResourceUrl(
        'assets/new-face/images/register/apple.svg'
      )
    );
    this._iconRegistry.addSvgIcon(
      'google-play',
      this._sanitizer.bypassSecurityTrustResourceUrl(
        'assets/new-face/images/register/google-play.svg'
      )
    );
    this._iconRegistry.addSvgIcon(
      'close',
      this._sanitizer.bypassSecurityTrustResourceUrl(
        'assets/new-face/images/register/close.svg'
      )
    );
    this._iconRegistry.addSvgIcon(
      'close-blue',
      this._sanitizer.bypassSecurityTrustResourceUrl(
        'assets/new-face/images/register/close-blue.svg'
      )
    );
    this._iconRegistry.addSvgIcon(
      'checkbox',
      this._sanitizer.bypassSecurityTrustResourceUrl(
        'assets/new-face/images/register/checkbox.svg'
      )
    );
  }

  setAffCompanyId(affCompanyId: string) {
    this.affCompanyId = affCompanyId;
  }

  setConsultClientRequest(consultClientRequest: ConsultClientRequest) {
    this.clientRequest = consultClientRequest;
  }

  setConsultClientResponse(consultClientResponse: ConsultClientResponse) {
    this.clientResponse = consultClientResponse;
  }

  setSignatures(signatures: GetSignaturesResponse[]) {
    this.signatures = signatures;
  }

  setSelectedAccounts(selectedAccounts: GetAccountsResponse[]) {
    this.selectedAccounts = selectedAccounts;
  }

  setDocumentDataString(documentDataString: string) {
    this.documentDataString = documentDataString;
  }

  onStepChange(stepChange: number) {
    this.currentStep += stepChange;
  }
}
