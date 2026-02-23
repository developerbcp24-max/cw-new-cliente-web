import { ChangeDetectorRef, Component, HostListener, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../../../Services/users/authentication.service';
import { Router } from '@angular/router';
import { AppConfig } from '../../../app.config';
import { GlobalService } from '../../../Services/shared/global.service';
import { UserService } from '../../../Services/users/user.service';
import { EncryptDecryptService } from '../../../Services/encrypt-decrypt/encrypt-decrypt.service';
import { IpAddresService } from '../../../Services/users/ip-addres.service';
import { MatDialog } from '@angular/material/dialog';
import { GetDatesDto } from '../../../Services/OTP/models/get-dates-dto';
import { DialogElementsComponent } from '../../shared/cw-components/dialog-elements/dialog-elements.component';
import { OtpService } from '../../../Services/OTP/otp.service';
import { AuthData } from '../../../Services/users/models/AuthData';
import { DialogService } from '../../../Services/dialog/dialog.service';
import { SlideCheckDialogComponent } from '../components/slide-check-dialog/slide-check-dialog.component';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  providers: [UserService, OtpService],
})
export class LoginComponent implements OnInit, OnDestroy {
  loading = false;
  error = '';
  isVisibleKeyboard = false;
  isVisibleInitialMessage = false;
  validateCaptcha = true;
  recaptchaValue!: string;
  recaptchaValueVerify!: string;
  timeout: any;
  url!: string;
  time!: number;
  visiblePass = false;
  visibleUss = false;
  typePassword: any;
  isNumberAcces: boolean = true;
  isDesktopOrTablet: boolean = false;
  isLoggingIn: boolean = false;

  isRecaptcha = false;
  encryptUserPass: string = '';
  useEnc: string = '';
  passEnc: string = '';
  ipClient: string = '';
  maxLength!: number;
  isEncrypt!: boolean;

  isValidateIP = false;

  dataRedirect: AuthData = new AuthData();

  getDatesDto: GetDatesDto = new GetDatesDto();
  getDatesValidateDto: GetDatesDto = new GetDatesDto();

  isAccountNumber: boolean = true;
  formLogin!: FormGroup;
  keyboardOnPass: boolean = true;
  newGuidSession: string = '';
  authUrlSession: string = '';
  slideChecked: boolean = false;

  // NUEVAS PROPIEDADES PARA RECAPTCHA
  isRecaptchaValid = false;
  isRecaptchaLoading = true;
  recaptchaError = '';
  recaptchaInitAttempts = 0;
  maxRecaptchaAttempts = 3;

  deviceInfo: any;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private config: AppConfig,
    private messageService: GlobalService,
    private userService: UserService,
    private encryptDecryptService: EncryptDecryptService,
    private ipEnc: IpAddresService,
    public dialog: MatDialog,
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef,
    private dialogService: DialogService
  ) {
    this.maxLength = config.getConfig('maxLength');
    this.checkScreenSize();
    this.authUrlSession = config.getConfig('AuthUrlSession');
  }

  ngOnInit() {
    if (sessionStorage.getItem('userActual')) {
      this.authenticationService.logout();
    }
    this.isVisibleInitialMessage = this.config.getConfig('showMessageInitial');
    this.validateCaptcha = this.config.getConfig('validateCaptcha');
    this.isRecaptcha = this.config.getConfig('isRecaptcha');
    this.maxLength = this.config.getConfig('maxLength');
    this.encryptUserPass = this.config.getConfig('EncryptKey');
    this.isEncrypt = this.config.getConfig('isEncrypt');
    this.isValidateIP = this.config.getConfig('isValidateIP');

    this.getIpAdd();

    this.formLogin = this.formBuilder.group({
      username: ['90000100000', [Validators.required, Validators.minLength(8)]],
      password: ['', [Validators.required]],
    });

    // Mostrar errores automáticamente al modificar valores
    /* this.formLogin.get('username')?.valueChanges.subscribe(() => {
      this.formLogin.get('username')?.markAsTouched();
    });

    this.formLogin.get('password')?.valueChanges.subscribe(() => {
      this.formLogin.get('password')?.markAsTouched();
    }); */
    this.formLogin = this.formBuilder.group({
    username: ['9000010000130760', [Validators.required, Validators.minLength(8)]],
    password: ['pato123AB', [Validators.required]],
  });

    this.checkScreenSize();

    // INICIALIZAR RECAPTCHA
    if (this.isRecaptcha) {
      this.initializeRecaptcha();
    } else {
      this.isRecaptchaValid = true;
      this.isRecaptchaLoading = false;
    }
  }

  // NUEVO MÉTODO: Inicializar y validar reCAPTCHA
  private async initializeRecaptcha() {
    this.recaptchaInitAttempts++;

    try {
      ////console.log(`🔄 Intento ${this.recaptchaInitAttempts}/${this.maxRecaptchaAttempts} - Inicializando reCAPTCHA...`);

      // Validar que la clave esté configurada
      const siteKey = this.config.getConfig('publicKeyRecaptcha');
      if (!siteKey || siteKey.length === 0) {
        throw new Error('La clave del sitio de reCAPTCHA no está configurada');
      }

      // Esperar a que reCAPTCHA esté disponible
      await this.waitForRecaptcha(15000); // 15 segundos timeout

      // Generar token de prueba para validar que funciona
      const testToken = await this.userService.getNewRecaptcha('page_load');

      if (testToken && testToken.length > 20) {
        this.isRecaptchaValid = true;
        this.recaptchaError = '';
        this.isRecaptchaLoading = false;
        ////console.log('reCAPTCHA inicializado correctamente');
        this.cdr.detectChanges();
      } else {
        throw new Error('Token de reCAPTCHA inválido o vacío');
      }

    } catch (error: any) {
      //console.error('Error al inicializar reCAPTCHA:', error);
      this.isRecaptchaValid = false;
      this.isRecaptchaLoading = false;

      // Determinar el mensaje de error apropiado
      if (error.message?.includes('Timeout')) {
        this.recaptchaError = 'No se pudo cargar la protección reCAPTCHA. Verifica tu conexión a internet.';
      } else if (error.message?.includes('clave')) {
        this.recaptchaError = 'Error de configuración de reCAPTCHA. Contacta al administrador.';
      } else {
        this.recaptchaError = 'Error al cargar la protección reCAPTCHA.';
      }

      // Reintentar automáticamente si no se alcanzó el límite
      if (this.recaptchaInitAttempts < this.maxRecaptchaAttempts) {
        setTimeout(() => this.initializeRecaptcha(), 3000);
      } else {
        this.recaptchaError += ' Por favor, recarga la página o contacta a soporte.';
        this.messageService.danger(
          'Error de Seguridad',
          this.recaptchaError
        );
      }

      this.cdr.detectChanges();
    }
  }

  // NUEVO MÉTODO: Esperar a que reCAPTCHA esté disponible
  private waitForRecaptcha(timeoutMs: number = 10000): Promise<void> {
    return new Promise((resolve, reject) => {
      // Si ya está disponible
      if (window.grecaptcha?.ready) {
        ////console.log('window.grecaptcha ya está disponible');
        window.grecaptcha.ready(() => resolve());
        return;
      }

      ////console.log(' Esperando a que window.grecaptcha esté disponible...');

      let attempts = 0;
      const maxAttempts = timeoutMs / 100;

      const checkInterval = setInterval(() => {
        attempts++;

        if (window.grecaptcha?.ready) {
          clearInterval(checkInterval);
          ////console.log('window.grecaptcha disponible después de', attempts * 100, 'ms');
          window.grecaptcha.ready(() => resolve());
        } else if (attempts >= maxAttempts) {
          clearInterval(checkInterval);
          //console.error('Timeout: reCAPTCHA no disponible después de', timeoutMs, 'ms');
          reject(new Error(`Timeout: reCAPTCHA no disponible después de ${timeoutMs}ms`));
        }
      }, 100);
    });
  }

  // NUEVO MÉTODO: Reintentar manualmente reCAPTCHA
  retryRecaptcha() {
    this.recaptchaInitAttempts = 0;
    this.isRecaptchaLoading = true;
    this.recaptchaError = '';
    this.initializeRecaptcha();
  }

  // MODIFICADO: Validar si el formulario puede ser enviado
  canSubmit(): boolean {
    const isFormValid = this.formLogin.valid;
    const isNotLoading = !this.loading && !this.isLoggingIn;
    const isRecaptchaReady = !this.isRecaptcha || this.isRecaptchaValid;

    return isFormValid && isNotLoading && isRecaptchaReady;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    this.checkScreenSize();
  }

  /* activateAccountNumber() {
    this.isAccountNumber = true;
    this.formLogin.reset();
    this.changeToggle('AN');
  }

  activateAlias() {
    this.isAccountNumber = false;
    this.formLogin.reset();
    this.changeToggle('A');
  } */
 activateAccountNumber() {
  this.isAccountNumber = true;

  // Resetea completamente el campo username
  const usernameControl = this.formLogin.get('username');
  usernameControl?.setValue('90000100000');
  usernameControl?.markAsUntouched();
  usernameControl?.markAsPristine();
  usernameControl?.setErrors(null);

  this.changeToggle('AN');
}

activateAlias() {
  this.isAccountNumber = false;

  // Resetea completamente el campo username
  const usernameControl = this.formLogin.get('username');
  usernameControl?.setValue('');
  usernameControl?.markAsUntouched();
  usernameControl?.markAsPristine();
  usernameControl?.setErrors(null);

  this.changeToggle('A');
}

  checkScreenSize(): void {
    this.isDesktopOrTablet = window.innerWidth >= 576.5;
  }

  async getIpAdd() {
    try {
      const ip = await this.ipEnc.getClientIp();
      this.ipClient = ip;
    } catch (error) {
      //console.error('Error al obtener la IP del cliente:', error);
      this.ipClient = 'NOT_IP';
    }
  }

  addingTimeout(): void {
    const url = this.config.getConfig('redirectionUrl');
    const time = this.config.getConfig('redirectionMinutes');
    this.timeout = setTimeout(() => {
      this.authenticationService.logout();
      sessionStorage.removeItem('userActual');
      sessionStorage.clear();
      window.location.href = url;
    }, this.convertMiliseconds(time));
  }

  convertMiliseconds(minutes: number): number {
    return minutes * 60 * 1000;
  }

  // MODIFICADO: Método login con validación de reCAPTCHA
  async login() {
    // Validación previa
    if (!this.canSubmit()) {
      //console.warn(' No se puede enviar el formulario');

      if (!this.formLogin.valid) {
        this.messageService.warning('Formulario Incompleto', 'Por favor completa todos los campos requeridos.');
      } else if (this.isRecaptcha && !this.isRecaptchaValid) {
        this.messageService.danger('Error de Seguridad', this.recaptchaError || 'La protección reCAPTCHA no está activa.');
      }

      return;
    }

    this.loading = true;
    this.isLoggingIn = true;
    this.messageService.showLoader(true);

    try {
      if (this.isRecaptcha) {
        // Generar nuevo token para el login
        ////console.log(' Generando token reCAPTCHA para login...');

        try {
          const token = await this.userService.getNewRecaptcha('login');

          if (!token || token.length < 20) {
            throw new Error('Token de reCAPTCHA inválido');
          }

          ////console.log('Token generado:', token.substring(0, 20) + '...');
          this.recaptchaValue = this.recaptchaValueVerify = token;

        } catch (recaptchaError: any) {
          //console.error('Error generando token:', recaptchaError);

          this.messageService.danger(
            'Error de Seguridad',
            'No se pudo generar el token de reCAPTCHA. Por favor, recarga la página.'
          );

          this.cleanLogin();

          // Reintentar inicializar reCAPTCHA
          this.isRecaptchaValid = false;
          this.retryRecaptcha();

          return;
        }
      } else {
        this.recaptchaValue = this.recaptchaValueVerify = '';
      }

      // Proceder con la autenticación
      this.autenticate(
        this.isAccountNumber ? this.formLogin.value['username'] : null,
        this.formLogin.value['password'],
        this.recaptchaValue,
        this.recaptchaValueVerify,
        !this.isAccountNumber,
        !this.isAccountNumber ? this.formLogin.value['username'] : null
      );

    } catch (error: any) {
      //console.error('Error en login:', error);
      this.messageService.danger(
        'Error',
        'Ocurrió un error inesperado. Por favor, intenta nuevamente.'
      );
      this.cleanLogin();
    }
  }

  encryptUserPassword(origin: string, keys: string): string {
    let key = CryptoJS.enc.Utf8.parse(keys);
    let iv = CryptoJS.enc.Utf8.parse(keys);
    let encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(origin), key, {
      keySize: 256 / 8,
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });
    return encrypted.toString();
  }

  routerLinkGo() {
    this.router.navigate(['/login/generateKey']);
  }

  autenticate(
    username: string,
    password: string,
    captchaValue: string,
    captchaValueToVerify: string,
    isAlias?: boolean,
    userAlias?: string,
    _ip?: string,
    slideChecked?: boolean,
    newGuidSession?: string
  ) {
    const messageErrorIncorrect =
      'Número de Acceso/Clave de Internet incorrectos, por favor verifique sus datos. ';
    let newIp = this.ipClient;

    if (this.isEncrypt) {
      this.useEnc = this.encryptDecryptService.encryptAES(username);
      this.passEnc = this.encryptDecryptService.encryptAES(password);
      this.newGuidSession = this.encryptDecryptService.encryptAES(this.newGuidSession);
    } else {
      this.useEnc = username;
      this.passEnc = password;
    }

    this.handleValidateLogin(
      captchaValue,
      captchaValueToVerify,
      isAlias!,
      userAlias!,
      newIp,
      slideChecked = this.slideChecked,
      newGuidSession = this.newGuidSession,
      messageErrorIncorrect
    );
  }

  handleValidateLogin(
    captchaValue: string,
    captchaValueToVerify: string,
    isAlias: boolean,
    userAlias: string,
    ip: string,
    slideChecked: boolean,
    newGuidSession: string,
    messageErrorIncorrect: string
  ) {
    this.authenticationService
      .login(
        this.useEnc,
        this.passEnc,
        captchaValue,
        captchaValueToVerify,
        '',
        isAlias,
        userAlias,
        ip,
        slideChecked = this.slideChecked,
        newGuidSession = this.newGuidSession
      )
      .subscribe({
        next: (result: any) => {
          if (result) {
            this.messageService.showLoader(false);
            clearTimeout(this.timeout);
            this.router.navigate(['/']);
            window.sessionStorage['is_validbatchtoken'] =
              this.userService.getUserToken().is_validbatchtoken;
          } else {
            this.messageService.danger(
              'Control de Seguridad: ',
              messageErrorIncorrect
            );
            this.error = 'Usuario o contraseña incorrectos';
            this.cleanLogin();
          }
        },
        error: (_err) => {
          if (_err.status === 400 || _err.status === 401) {
            this.handleError(_err, messageErrorIncorrect);
          } else {
            this.messageService.danger(
              'Error en la autentificacion: ',
              'Si el error persiste, por favor comuníquese con el Administrador del Sistema'
            );
            this.loading = false;
            this.messageService.showLoader(false);
            this.error = _err && _err.json ? _err.error_description : '';
            this.resetCaptcha();
            this.formLogin.controls['password'].reset();
          }
        },
      });
  }

  private cleanLogin() {
    this.loading = false;
    this.isLoggingIn = false;
    this.messageService.showLoader(false);
    this.resetCaptcha();
    this.formLogin.controls['password'].reset();
  }

  urlSecure(): void {
    window.open('https://www.globalsign.com/es/ssl/secure-site-seal', '_blank');
  }

  openDialogoCaptcha() {
    const dialogRef = this.dialogService.open(SlideCheckDialogComponent, {
      width: '480px',
      height: '550px',
      disableClose: true,
      panelClass: 'custom-dialog-rounded'
    });

    dialogRef.componentInstance.validationComplete.subscribe((accepted: boolean) => {
      if (accepted) {
        this.messageService.info(
          'Control de Seguridad:',
          'El captcha ha sido validado correctamente. Por favor, intente nuevamente el proceso de inicio de sesión.'
        );
        this.slideChecked = accepted;
        this.validCaptchaLogin(this.slideChecked);
      }
      dialogRef.close();
    });

    dialogRef.componentInstance.validationCancelled.subscribe(() => {
      dialogRef.close();
      this.validCaptchaLogin(this.slideChecked);
    });
  }

  private validCaptchaLogin(isvalidateCaptcha: boolean) {
    this.loading = false;
    this.messageService.showLoader(false);
    this.resetCaptcha();
    this.formLogin.controls['password'].reset();
    this.slideChecked = isvalidateCaptcha;
  }

  private handleError(_err: any, messageErrorIncorrect: string) {
    const errorTemp = _err.error;

    if (typeof errorTemp.error === 'string' && errorTemp.error.includes('No se pudo validar el captcha,')) {
      this.messageService.danger('Control de Seguridad: ', errorTemp.error);
      this.newGuidSession = errorTemp.codeError;
      this.openDialogoCaptcha();
       this.isLoggingIn = false;
      return;
    } else if (typeof errorTemp.error === 'string' && errorTemp.error.includes('Recaptcha inválido o expirado.')) {
      this.messageService.danger(
        'Error de Seguridad',
        'El token de reCAPTCHA ha expirado. La página se recargará.'
      );
      setTimeout(() => {
        this.authenticationService.newReload(false);
      }, 1000);
      return;
    }

    if (errorTemp.error === 'invalid_captcha') {
      this.messageService.danger('Control de Seguridad: ', errorTemp.error_description);
    } else if (errorTemp.error === 'invalid_grant') {
      this.messageService.danger('Control de Seguridad: ', errorTemp.error_description);
    } else if (errorTemp.error === 'changePasswordRequire') {
      this.messageService.danger('Control de Seguridad: ', errorTemp.error_description, false, true);
      this.router.navigate(['/login/changePassword']);
    } else if (errorTemp.error === 'generatePasswordRequire') {
      this.messageService.danger('Control de Seguridad: ', errorTemp.error_description, false, true);
      this.router.navigate(['/login/generateKey']);
    } else if (errorTemp.error === 'Error.') {
      this.messageService.danger('Control de Seguridad: ', errorTemp.error_description);
    } else {
      this.messageService.danger(
        'Control de Seguridad: ',
        _err.status === 400 ? messageErrorIncorrect : errorTemp.error ?? messageErrorIncorrect
      );
    }

    this.error = 'Usuario o contraseña incorrectos';
    this.cleanLogin();
  }

  resetCaptcha() {
    if (!this.isRecaptcha) {
      // captcha tradicional
    } else {
      clearTimeout(this.timeout);
      this.addingTimeout();

      // Generar nuevo token de reCAPTCHA
      this.userService.getNewRecaptcha('reset').then((res) => {
        this.recaptchaValue = this.recaptchaValueVerify = res;
        ////console.log(' Token reCAPTCHA regenerado');
      }).catch((error) => {
        //console.error('❌ Error regenerando token:', error);
        this.isRecaptchaValid = false;
        this.retryRecaptcha();
      });
    }
  }

  handleShowKeyboard() {
    this.isVisibleKeyboard = !this.isVisibleKeyboard;
  }

  openDialog() {
    this.dialog.open(DialogElementsComponent, {
      width: '500px',
      height: '225px',
    });
  }

  newRegister() {
    this.router.navigate(['/login/register']);
  }

  handleKeyboard($event: any) {
    const field = this.keyboardOnPass ? 'password' : 'username';
    if ($event === 'back') {
      this.formLogin
        .get(field)
        ?.setValue(
          this.formLogin.value[field].substring(
            0,
            this.formLogin.value[field].length - 1
          )
        );
    } else if (
      field === 'password' &&
      this.formLogin.value[field]?.length >= this.maxLength
    ) {
      return;
    } else {
      this.formLogin
        .get(field)
        ?.setValue(
          this.formLogin.value[field] !== null
            ? this.formLogin.value[field] + $event
            : $event
        );
    }
  }

  /* changeToggle(selected: string) {
    this.formLogin
      .get('username')
      ?.setValue(selected === 'AN' ? '90000100000' : '');
    this.isAccountNumber = selected === 'AN';
    this.cdr.detectChanges();
  } */
 changeToggle(selected: string) {
  this.isAccountNumber = selected === 'AN';
  this.cdr.detectChanges();
}

  ngOnDestroy() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  }
}
