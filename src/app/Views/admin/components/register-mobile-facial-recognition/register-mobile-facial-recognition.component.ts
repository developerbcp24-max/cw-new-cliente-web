import { Component, Input, SimpleChanges } from '@angular/core';
import { GetRespPassiveLiveTestResponse } from '../../../../Services/onboarding-mobile/Models/GetRespPassiveLiveTestResponse';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-register-mobile-facial-recognition',
  standalone: false,
  templateUrl: './register-mobile-facial-recognition.component.html',
  styleUrl: './register-mobile-facial-recognition.component.css',
})
export class RegisterMobileFacialRecognitionComponent {
  @Input()
  getRespPassiveLiveTestResponse: GetRespPassiveLiveTestResponse =
    new GetRespPassiveLiveTestResponse();

  respPassiveLiveTestResUrl: SafeResourceUrl | null = null;

  constructor(private _sanitizer: DomSanitizer) {}

  ngOnChanges(changes: SimpleChanges) {
    const { getRespPassiveLiveTestResponse } = this;
    if (changes['getRespPassiveLiveTestResponse']) {
      //console.log(getRespPassiveLiveTestResponse);

      this.respPassiveLiveTestResUrl =
        this._sanitizer.bypassSecurityTrustResourceUrl(
          getRespPassiveLiveTestResponse.url
        ); //NOSONAR
    }
  }
}
