import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ChangePasswordModel } from '../../../Services/users/models/change-password-model';
import { UserService } from '../../../Services/users/user.service';
import { GlobalService } from '../../../Services/shared/global.service';
import { IpAddresService } from '../../../Services/users/ip-addres.service';
import { AppConfig } from '../../../app.config';
import { Router } from '@angular/router';

@Component({
  selector: 'app-change-password',
  standalone: false,
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css'
})
export class ChangePasswordComponent implements OnInit {
  errorMessage: any;
  submitted?: boolean;
  ok?: string;
  isVisibleKeyboard: boolean = false;

  changePassword: ChangePasswordModel = new ChangePasswordModel();
  radioSelected = 'old';
  isAlias: boolean = false
  @ViewChild('txtOldPassword') txtOldPassword?: ElementRef;
  @ViewChild('txtNewPassword') txtNewPassword?: ElementRef;
  @ViewChild('txtConfirmPassword') txtConfirmPassword?: ElementRef;
  //@ViewChild(CaptchaComponent) captchaComponent?: CaptchaComponent;
  isRecaptcha = false;
  visiblePass = false;
  visibleNewPass = false;
  visibleConfirmPass = false;
  passwordStatus: 'normal' | 'debil' | 'mal' | 'muybien' = 'normal';
  passwordMessage = 'Las contraseñas no coinciden';

  constructor(private userService: UserService
    , private globalService: GlobalService
    , private ipEnc: IpAddresService
    , private router: Router, private config: AppConfig,
    ) {
    this.changePassword.accessNumber = '90000100000';
    this.changePassword.ipClient = 'NOT_IP';
    this.getIpClient();
  }

  ngOnInit(): void {
    this.isRecaptcha = this.config.getConfig('isRecaptcha');
    this.getNewRecaptcha();
  }
  private reset() {
    this.changePassword.oldPassword = '';
    this.changePassword.newPassword = '';
    this.changePassword.confirmPassword = '';
  }
  handleVerifyStrength(_$event: any) {
    // This is intentional
  }
  handleRadio($event: string) {
    this.radioSelected = $event;
    switch (this.radioSelected) {
      case 'old':
        this.txtOldPassword?.nativeElement.focus();
        break;
      case 'new':
        this.txtNewPassword?.nativeElement.focus();
        break;
      case 'confirm':
        this.txtConfirmPassword?.nativeElement.focus();
        break;
    }
  }

  selectAuth($event: boolean){
    this.isAlias=$event;
    this.changePassword.isAlias=this.isAlias;
  }

  handleKeyChange($event: any) {
    switch (this.radioSelected) {
      case 'old':
        if ($event === 'back') {
          this.changePassword.oldPassword = this.changePassword.oldPassword.substring(0, this.changePassword.oldPassword.length - 1);
        } else {
          this.changePassword.oldPassword = this.changePassword.oldPassword + $event;
        }
        this.txtOldPassword?.nativeElement.focus();
        break;
      case 'new':
        if ($event === 'back') {
          this.changePassword.newPassword = this.changePassword.newPassword.substring(0, this.changePassword.newPassword.length - 1);
        } else {
          this.changePassword.newPassword = this.changePassword.newPassword + $event;
        }
        this.txtNewPassword?.nativeElement.focus();
        break;
      case 'confirm':
        if ($event === 'back') {
          this.changePassword.confirmPassword = this.changePassword.confirmPassword
            .substring(0, this.changePassword.confirmPassword.length - 1);
        } else {
          this.changePassword.confirmPassword = this.changePassword.confirmPassword + $event;
        }
        this.txtConfirmPassword?.nativeElement.focus();
        break;
    }
  }

  get isPasswordValid(): boolean {
  const pwd = this.changePassword.newPassword || '';
  const conf = this.changePassword.confirmPassword || '';
  const validLengthNew = pwd.length >= 8 && pwd.length <= 14;
  const validLengthConf = conf.length >= 8 && conf.length <= 21;
  const passwordsMatch = pwd === conf;
  return validLengthNew && validLengthConf && passwordsMatch;
}

  getRecaptcha(): Promise<any> {
    return this.config.getConfig('publicKeyRecaptcha');
  }
  getNewRecaptcha(): Promise<any> {
    return this.config.getConfig('publicKeyRecaptcha');
  }
  handleShowKeyboard() {
    this.isVisibleKeyboard = !this.isVisibleKeyboard;
  }

  async getIpClient() {
    try {
      const ip = await this.ipEnc.getClientIp();
      this.changePassword.ipClient = ip;
    } catch (error) {
      //console.error('Error al obtener la IP del cliente:', error);
      this.changePassword.ipClient = 'NOT_IP';
    }
    /* this.ipEnc.getIpClient().pipe(
      catchError(_error => this.ipEnc.getIpAddress())
    ).subscribe({
      next: response => {
        this.changePassword.ipClient = response.ip;
      }, error: _err => {
        this.changePassword.ipClient = 'NOT_IP';
      }
    }); */

  }

  onPasswordsChange() {
  const pwd = this.changePassword.newPassword || '';
  const conf = this.changePassword.confirmPassword || '';
  if (!pwd) {
    this.passwordStatus = 'mal';
    this.passwordMessage = 'Ingresa una contraseña';
    return;
  }

  if (conf && pwd !== conf) {
    this.passwordStatus = 'mal';
    this.passwordMessage = 'Las contraseñas no coinciden';
    return;
  }
  const errors: string[] = [];
  if (pwd.length < 8) errors.push('al menos 8 caracteres');
  const uppercaseMatches = pwd.match(/[A-Z]/g) || [];
  if (uppercaseMatches.length < 2) errors.push('al menos 2 mayúsculas');
  const numberMatches = pwd.match(/[0-9]/g) || [];
  if (numberMatches.length < 2) errors.push('al menos 2 números');
  if (!/[a-z]/.test(pwd)) errors.push('al menos una minúscula');
  if (/[^A-Za-z0-9]/.test(pwd)) errors.push('sin caracteres especiales');

  if (errors.length > 0) {
    this.passwordStatus = 'mal';
    this.passwordMessage = 'Contraseña inválida: ' + errors.join(', ');
  } else {
    this.passwordStatus = 'muybien';
    this.passwordMessage = 'Contraseña segura';
  }
}

  handleChangePassword(): void {
    this.globalService.showLoader(true);

    this.userService.getNewRecaptcha()
      .then((response: any) => {
        this.changePassword.captchaValue = response;
        this.changePassword.captchaValueToVerify = response;
        this.userService
          .changePassword(this.changePassword)
          .subscribe({
            next: (result: any) => {
              this.globalService.showLoader(false);
              this.globalService.success('Mensaje: ', result, false, true);
              this.router.navigate(['/login']);
            }, error: _err => {
              if (_err.status === 401 || _err.status === 500) {
                this.globalService.danger('Error: ', _err.error);
              } else if (_err.status === 400) {
                const errorTemp = _err;
                if (errorTemp.message === 'invalid_captcha') {
                  this.globalService.danger('Alerta: ', 'El texto introducido no coincide con la imagen');
                } else {
                  this.globalService.danger('Alerta: ', errorTemp.message);
                }
              } else {
                this.globalService.danger('Error: ', 'Si el error persiste, por favor comuníquese con el Administrador del Sistema');
              }
              this.globalService.showLoader(false);
            }
          });
      });
  }

  showHidePassword() {
    this.visiblePass = !this.visiblePass;
  }
  showHideNewPassword() {
    this.visibleNewPass = !this.visibleNewPass;
  }
  showHideConfirmPassword() {
    this.visibleConfirmPass = !this.visibleConfirmPass;
  }
}
