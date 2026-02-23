import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { NewUserPassword } from '../../../../Services/users/models/new-password-model';
import { UserService } from '../../../../Services/users/user.service';
import { GlobalService } from '../../../../Services/shared/global.service';
import { IpAddresService } from '../../../../Services/users/ip-addres.service';
import { AppConfig } from '../../../../app.config';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-create-password',
  standalone: false,
  templateUrl: './create-password.component.html',
  styleUrl: './create-password.component.css'
})
export class CreatePasswordComponent implements OnInit, OnChanges {
  newUser = new NewUserPassword();
  radioSelected = 'new';
  isVisibleKeyboard = false;

  @ViewChild('txtNewPassword') txtNewPassword!: ElementRef;
  @ViewChild('txtConfirmPassword') txtConfirmPassword!: ElementRef;
  @ViewChild('txtAlias') txtAlias!: ElementRef;

  @Input() accessNumber = '';
  @Input() readOnlyAccessNumber = false;
  @Output() onSubmit = new EventEmitter<NewUserPassword>();

  notExistAlias = false;
  isRecaptcha = false;
  visiblePass = false;
  visibleConfirmPass = false;
  visibleAlias = false;

  passwordStatus: 'mal' | 'debil' | 'normal' | 'muybien' = 'mal';
  passwordMessage = 'Las contraseñas no coinciden';
  lastStrengthRaw: any = null;

  constructor(
    private userService: UserService,
    private globalService: GlobalService,
    private ipEnc: IpAddresService,
    private config: AppConfig,
    private http: HttpClient
  ) {
    this.newUser.ipClient = 'NOT_IP';
    this.getIpClient();
  }

  ngOnInit(): void {
    this.isRecaptcha = this.config.getConfig('isRecaptcha');
  }

  ngOnChanges() {
    this.newUser.accessNumber = this.accessNumber;
  }

  async getIpClient() {
    try {
      const ip = await this.ipEnc.getClientIp();
      this.newUser.ipClient = ip || 'NOT_IP';
    } catch {
      this.newUser.ipClient = 'NOT_IP';
    }
  }

  handleShowKeyboard() {
    this.isVisibleKeyboard = !this.isVisibleKeyboard;
  }

  handleRadio(sel: string) {
    this.radioSelected = sel;
    switch (sel) {
      case 'new':
        this.txtNewPassword.nativeElement.focus();
        break;
      case 'confirm':
        this.txtConfirmPassword.nativeElement.focus();
        break;
      case 'alias':
        this.txtAlias.nativeElement.focus();
        break;
    }
  }

  handleKeyChange(val: any) {
    switch (this.radioSelected) {
      case 'new':
        this.newUser.newPassword =
          val === 'back'
            ? this.newUser.newPassword.slice(0, -1)
            : this.newUser.newPassword + val;
        this.txtNewPassword.nativeElement.focus();
        break;
      case 'confirm':
        this.newUser.confirmPassword =
          val === 'back'
            ? this.newUser.confirmPassword.slice(0, -1)
            : this.newUser.confirmPassword + val;
        this.txtConfirmPassword.nativeElement.focus();
        break;
      case 'alias':
        this.newUser.userAlias =
          val === 'back'
            ? this.newUser.userAlias.slice(0, -1)
            : this.newUser.userAlias + val;
        this.txtAlias.nativeElement.focus();
        break;
    }
  }

  register() {
    this.globalService.showLoader(true);
    this.userService.getNewRecaptcha().then(res => {
      this.newUser.captchaValue = res;
      this.newUser.captchaValueToVerify = res;
      this.userService.validateNewPassword(this.newUser).subscribe({
        next: result => {
          this.globalService.showLoader(false);
          if (result == null) {
            this.onSubmit.emit(this.newUser);
          } else if (result.toString() === 'CreateAlias') {
            this.notExistAlias = true;
            this.newUser.notExistAlias = true;
            this.onSubmit.emit(this.newUser);
          }
        },
        error: _err => {
          if (_err.status === 400) {
            if (_err.message === 'invalid_captcha') {
              this.globalService.danger('Alerta: ', 'El texto introducido no coincide con la imagen');
            } else {
              this.globalService.danger('Alerta: ', _err.message);
            }
          } else {
            this.globalService.danger(
              'Error: ',
              'Si el error persiste, por favor comuníquese con el Administrador del Sistema'
            );
          }
          this.globalService.showLoader(false);
        }
      });
    });
  }

  showHidePassword() {
    this.visiblePass = !this.visiblePass;
  }

  showHideConfirmPassword() {
    this.visibleConfirmPass = !this.visibleConfirmPass;
  }

  handleVerifyStrength(raw: any) {
    this.lastStrengthRaw = raw;
    this.updatePasswordStatus();
  }

  /* onPasswordsChange() {
    this.updatePasswordStatus();
  } */

  private updatePasswordStatus() {
    const pwd = this.newUser?.newPassword || '';
    const conf = this.newUser?.confirmPassword || '';
    const ambos = pwd.length > 0 && conf.length > 0;

    if (ambos && pwd !== conf) {
      this.passwordStatus = 'mal';
      this.passwordMessage = 'Las contraseñas no coinciden';
      return;
    }

    const s = this.normalizeStrength(this.lastStrengthRaw);
    switch (s) {
      case 'mal':
        this.passwordStatus = 'mal';
        this.passwordMessage = 'La contraseña no cumple con los requisitos';
        break;
      case 'debil':
        this.passwordStatus = 'debil';
        this.passwordMessage = 'Contraseña débil';
        break;
      case 'normal':
        this.passwordStatus = 'normal';
        this.passwordMessage = 'Contraseña aceptable';
        break;
      case 'muybien':
        this.passwordStatus = 'muybien';
        this.passwordMessage = 'Contraseña fuerte';
        break;
      default:
        this.passwordStatus = 'normal';
        this.passwordMessage = 'Escribe tu contraseña…';
    }
  }

  private normalizeStrength(raw: any): 'mal' | 'debil' | 'normal' | 'muybien' | null {
    if (raw == null) return null;
    if (typeof raw === 'number') {
      if (raw <= 1) return 'debil';
      if (raw === 2) return 'normal';
      if (raw >= 3) return 'muybien';
    }
    if (typeof raw === 'string') {
      const s = raw.toLowerCase().trim();
      if (['too short', 'invalid', 'muy débil', 'muy debil', 'demasiado corta'].includes(s)) return 'mal';
      if (['weak', 'débil', 'debil'].includes(s)) return 'debil';
      if (['medium', 'medio', 'normal', 'aceptable'].includes(s)) return 'normal';
      if (['strong', 'fuerte', 'muy bien', 'muybien'].includes(s)) return 'muybien';
    }
    return null;
  }
// En tu componente TS
get isPasswordValid(): boolean {
  const pwd = this.newUser.newPassword || '';
  const conf = this.newUser.confirmPassword || '';
  const validLengthNew = pwd.length >= 8 && pwd.length <= 14;
  const validLengthConf = conf.length >= 8 && conf.length <= 21;
  const passwordsMatch = pwd === conf;
  return validLengthNew && validLengthConf && passwordsMatch;
}


 onPasswordsChange() {
  const pwd = this.newUser.newPassword || '';
  const conf = this.newUser.confirmPassword || '';
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
}
