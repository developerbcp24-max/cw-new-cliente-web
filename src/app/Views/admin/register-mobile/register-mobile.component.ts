import { Component, OnInit, SecurityContext } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { OnboardingMobileService } from '../../../Services/onboarding-mobile/onboarding-mobile.service';
import { GetOnboardingMobileDataResponse } from '../../../Services/onboarding-mobile/Models/GetOnboardingMobileDataResponse';
import * as pdfMake from 'pdfmake/build/pdfmake';
import 'pdfmake/build/vfs_fonts';
import { CreateDigitalFileAndSendOTPRequest } from '../../../Services/onboarding-mobile/Models/CreateDigitalFileAndSendOTPRequest';
import { CreateDigitalFileAndSendOTPResponse } from '../../../Services/onboarding-mobile/Models/CreateDigitalFileAndSendOTPResponse';
import { openNotificationDialog } from '../../../Helpers/notification-dialog.helper';
import { MatDialog } from '@angular/material/dialog';
import { retry, share, Subject, switchMap, takeUntil, timer } from 'rxjs';
import { GetRespPassiveLiveTestResponse } from '../../../Services/onboarding-mobile/Models/GetRespPassiveLiveTestResponse';
import { GetRespPassiveLiveTestRequest } from '../../../Services/onboarding-mobile/Models/GetRespPassiveLiveTestRequest';
import { GetValidatePassiveLiveTestResponse } from '../../../Services/onboarding-mobile/Models/GetValidatePassiveLiveTestResponse';
import { GetValidatePassiveLiveTestRequest } from '../../../Services/onboarding-mobile/Models/GetValidatePassiveLiveTestRequest';
import { SaveFinalDataToCWAffRequest } from '../../../Services/onboarding-mobile/Models/SaveFinalDataToCWAffRequest';
import { AffiliationRegCwService } from '../../../Services/AffiliationRegCw/affiliation-reg-cw.service';
import { UpDocBase64Request } from '../../../Services/AffiliationRegCw/Models/UpDocBase64Request';
import { UpDocBase64Response } from '../../../Services/AffiliationRegCw/Models/UpDocBase64Response';
import { DocGenerationSignatureDigitalRequest } from '../../../Services/AffiliationRegCw/Models/DocGenerationSignatureDigitalRequest';
import { AppConfig } from '../../../app.config';

@Component({
  selector: 'app-register-mobile',
  standalone: false,
  templateUrl: './register-mobile.component.html',
  styleUrl: './register-mobile.component.css',
})
export class RegisterMobileComponent implements OnInit {
  currentStep: number = 1;

  getOnboardingMobileDataResponse: GetOnboardingMobileDataResponse =
    new GetOnboardingMobileDataResponse();
  createDigitalFileAndSendOTPResponse: CreateDigitalFileAndSendOTPResponse =
    new CreateDigitalFileAndSendOTPResponse();
  getRespPassiveLiveTestResponse: GetRespPassiveLiveTestResponse =
    new GetRespPassiveLiveTestResponse();
  upDocBase64Response: UpDocBase64Response = new UpDocBase64Response();

  affiliationDocument: string = '';
  affiliationDocumentJson: any;
  affiliationDocumentBase64: SafeResourceUrl | null = null;
  affiliationDocumentBase64Str: String = '';
  startCountdownEvent: boolean = false;

  CreateDocSignature: boolean = true;

  constructor(
    private config: AppConfig,
    private _affiliationService: AffiliationRegCwService,
    _iconRegistry: MatIconRegistry,
    private _sanitizer: DomSanitizer,
    private _route: ActivatedRoute,
    private _onboardingMobileService: OnboardingMobileService,
    private dialog: MatDialog,

  ) {
    _iconRegistry.addSvgIcon(
      'register-mobile-download',
      _sanitizer.bypassSecurityTrustResourceUrl(
        'assets/icons/register-mobile-download.svg'
      )
    );
    _iconRegistry.addSvgIcon(
      'register-mobile-success',
      _sanitizer.bypassSecurityTrustResourceUrl(
        'assets/icons/register-mobile-success.svg'
      )
    );
    _iconRegistry.addSvgIcon(
      'google-play',
      _sanitizer.bypassSecurityTrustResourceUrl('assets/icons/google-play.svg')
    );
    _iconRegistry.addSvgIcon(
      'app-store',
      _sanitizer.bypassSecurityTrustResourceUrl('assets/icons/app-store.svg')
    );
    this.CreateDocSignature = this.config.getConfig('createDocSignature');
  }

  ngOnInit(): void {
    
    if (window.innerWidth > 640) {
      openNotificationDialog(
        'Por favor, utilice un celular para completar el proceso de afiliación.',
        'La solicitud no pudo ser procesada',
        'incorrect',
        'Intentar nuevamente',
        this.dialog,
        () => {},
        false,
        false
      );
    } else {
      const affCompanyId: string =
        this._route.snapshot.queryParamMap.get('affCompanyId') ?? '';
      this._onboardingMobileService
        .getOnboardingMobileData({
          AffCompanyId: affCompanyId,
        })
        .subscribe({
          next: (response: GetOnboardingMobileDataResponse) => {
            this.getOnboardingMobileDataResponse = response;
            this.affiliationDocumentJson = JSON.parse(
              response.affiliationDocument
            );
            
            
            pdfMake
              .createPdf(this.affiliationDocumentJson).getBase64((data: string) => {
              
                this.affiliationDocumentBase64Str = data;
                this.affiliationDocumentBase64 = this._sanitizer.bypassSecurityTrustResourceUrl(`data:application/pdf;base64,${data}`);
                const iframe = document.getElementById('iframeDocument') as HTMLIFrameElement;
                iframe.src = `data:application/pdf;base64,${data}`;
                
              });
          },
          error: (error) => {
            openNotificationDialog(
              error.message,
              'La solicitud no pudo ser procesada',
              'incorrect',
              'Intentar nuevamente',
              this.dialog
            );
          },
        });
    }
  }

  generateOtp(): void {
    const { getOnboardingMobileDataResponse } = this;
    this._onboardingMobileService
      .createDigitalFileAndSendOTP(
        new CreateDigitalFileAndSendOTPRequest({
          affCompanyId: getOnboardingMobileDataResponse.affCompanyId,
          idc: getOnboardingMobileDataResponse.affiliateIdc,
          typeIdc: getOnboardingMobileDataResponse.affiliateIdcType,
          extensionIdc: getOnboardingMobileDataResponse.affiliateIdcExtension,
          complementIdc: getOnboardingMobileDataResponse.affiliateIdcComplement,
          email: getOnboardingMobileDataResponse.affiliateUserEmail,
          phone: getOnboardingMobileDataResponse.affiliatePhone,
          requestDate: Date.now().toString(),
        })
      )
      .subscribe({
        
        next: (response: CreateDigitalFileAndSendOTPResponse) => {
          
          this.createDigitalFileAndSendOTPResponse = response;

          this._affiliationService.upDocBase64(new UpDocBase64Request({
            affCompanyId: getOnboardingMobileDataResponse.affCompanyId,
            strIdClient: response.strIdClien,
            strDocumentBase64: this.affiliationDocumentBase64Str
          })).subscribe({
            next: (data: UpDocBase64Response) => {
              
              this.upDocBase64Response = data;
              this.currentStep = 2;
              this.startCountdownEvent = !this.startCountdownEvent;
            }
          });
          
        },
        error: (_) => {
          openNotificationDialog(
            'Error interno, favor comunicarse con Soporte Help Desk a la Linea gratuita 800-10-2244',
            'La solicitud no pudo ser procesada',
            'incorrect',
            'Intentar nuevamente',
            this.dialog,
            () => {
              this.currentStep = 1;
            }
          );
        },
      });
  }

  getRespPassiveLiveTest() {
    const { getOnboardingMobileDataResponse } = this;

    this._onboardingMobileService
      .getRespPassiveLiveTest(
        new GetRespPassiveLiveTestRequest({
          idc: getOnboardingMobileDataResponse.affiliateIdc,
          typeIdc: getOnboardingMobileDataResponse.affiliateIdcType,
          extensionIdc: getOnboardingMobileDataResponse.affiliateIdcExtension,
          complementIdc: getOnboardingMobileDataResponse.affiliateIdcComplement,
          email: getOnboardingMobileDataResponse.affiliateUserEmail,
          phone: getOnboardingMobileDataResponse.affiliatePhone,
          affCompanyId: getOnboardingMobileDataResponse.affCompanyId,
        })
      )
      .subscribe({
        next: (data: GetRespPassiveLiveTestResponse) => {
          this.getRespPassiveLiveTestResponse = data;
          this.currentStep = 3;
          this.pollingValidatePassiveLiveTest();
        },
        error: (_) => {
          openNotificationDialog(
            'Error interno, favor comunicarse con Soporte Help Desk a la Linea gratuita 800-10-2244',
            'La solicitud no pudo ser procesada',
            'incorrect',
            'Intentar nuevamente',
            this.dialog
          );
        },
      });
  }

  pollingValidatePassiveLiveTest() {
    const { getRespPassiveLiveTestResponse, getOnboardingMobileDataResponse } =
      this;
    const stopPollingValidatePassiveLiveTest: Subject<void> =
      new Subject<void>();

    // Execute after 7 seconds with an interval of 5 seconds
    const secondsToStart: number = 7;
    const secondsInterval: number = 5;
    timer(secondsToStart * 1000, secondsInterval * 1000)
      .pipe(
        switchMap(() =>
          this._onboardingMobileService.getValidatePassiveLiveTest(
            new GetValidatePassiveLiveTestRequest({
              affCompanyId: getOnboardingMobileDataResponse.affCompanyId,
              sessionId: getRespPassiveLiveTestResponse.sessionID,
            })
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

            this._onboardingMobileService
              .SaveFinalDataToCWAff(
                new SaveFinalDataToCWAffRequest({
                  affCompanyId: getOnboardingMobileDataResponse.affCompanyId,
                })
              )
              .subscribe({
                next: (_: void) => {
                  
                  if (this.CreateDocSignature){
                    this._affiliationService.docGenerationSignatureDigital(
                    new DocGenerationSignatureDigitalRequest({
                    affCompanyId: getOnboardingMobileDataResponse.affCompanyId, 
                    strIdClient: this.createDigitalFileAndSendOTPResponse.strIdClien,
                    strIdDocument: this.upDocBase64Response.strIdDocument,
                    nroOfLeaves: this.upDocBase64Response.NroOfLeaves
                    })).subscribe({
                      next: (_data: string) => {
                        // Document generated successfully
                        this.currentStep = 4;
                      },
                      error: (_) => {
                        openNotificationDialog(
                          'Error interno, favor comunicarse con Soporte Help Desk a la Linea gratuita 800-10-2244',
                          'La solicitud no pudo ser procesada, firma digital',
                          'incorrect',
                          'Intentar nuevamente',
                          this.dialog
                        );
                      }
                    });
                  }else{
                    this.currentStep = 4;
                  }
                },
                error: (_) => {
                  openNotificationDialog(
                    'Error interno, favor comunicarse con Soporte Help Desk a la Linea gratuita 800-10-2244',
                    'La solicitud no pudo ser procesada',
                    'incorrect',
                    'Intentar nuevamente',
                    this.dialog
                  );
                },
              });
          }
        },
      });
  }
}
