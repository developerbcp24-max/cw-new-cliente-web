import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { PasswordValidationComponent } from '../password-validation/password-validation.component';
import { TokenComponent } from '../token/token.component';
import { AppConfig } from '../../../../app.config';
import { NewOptTokenVuService } from '../../../../Services/new-opt-token-vu/new-opt-token-vu.service';
/* import { AppConfig } from 'src/app/app.config';
import { NewOptTokenVuService } from 'src/app/Services/new-opt-token-vu/new-opt-token-vu.service';
 */
@Component({
  selector: 'app-token-modal',
  standalone: false,
  templateUrl: './token-modal.component.html',
  styleUrls: ['./token-modal.component.css'],
  //providers: [NewOptTokenVuService],
})
export class TokenModalComponent implements OnInit {
  @Input() validatePasswordInsteadToken = true;
  @Input() isVisible!: boolean;
  @Input() disabled = false;
  @Input() message =
    'Necesitamos que ingrese su número Token para confirmar la operación.';
  @Input() isUserToken = false;
  @Output() onSubmit = new EventEmitter();
  @Output() onClose = new EventEmitter();
  @ViewChild(TokenComponent) token!: TokenComponent;
  @ViewChild(PasswordValidationComponent)
  passwordValidation!: PasswordValidationComponent;
  isTokenVU = false;

  constructor(
    private config: AppConfig,
    private _validToken: NewOptTokenVuService
  ) {
    /*This is intentional*/
  }

  ngOnInit() {
    this.handleValidTokenVu();
  }

  handleValidTokenVu() {
    this.isTokenVU = this.config.getConfig('isTokenVU');
    if (!this.isTokenVU) {
      this._validToken.ValidTokenVu({ VersionToken: 'NewOtp' }).subscribe({
        next: (resp) => {
          this.isTokenVU = resp.isAffiliated;
        },
        error: (err) => {
          this.isTokenVU = false;
        },
      });
    }
  }

  handleTokenValidationSubmit($event: any) {
    this.onSubmit.emit($event);
  }

  handlePasswordValidationSubmit($event: string) {
    this.onSubmit.emit($event);
  }

  handleOnClose() {
    this.onClose.emit(false);
    if (this.token) {
      this.token.resetPad();
    }
    if (this.passwordValidation) {
      this.passwordValidation.resetForm();
    }
  }

  handleClosed($event: boolean) {
    this.onClose.emit($event);
  }
}
