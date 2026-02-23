import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { NewUserAlias } from '../../../../Services/users/models/NewUserAlias';
import { UserService } from '../../../../Services/users/user.service';
import { GlobalService } from '../../../../Services/shared/global.service';
import { IpAddresService } from '../../../../Services/users/ip-addres.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-validate-user',
  standalone: false,
  templateUrl: './validate-user.component.html',
  styleUrl: './validate-user.component.css'
})
export class ValidateUserComponent implements OnInit, OnChanges {
  radioSelected = 'new';
  visiblePass = false;
  visibleConfirmPass = false;
  isVisibleKeyboard: boolean = false;

  @Input() accessNumber = '';
  @Input() readOnlyAccessNumber = false;

  @ViewChild('txtPassword') txtPassword!: ElementRef;
  @ViewChild('txtAlias') txtAlias!: ElementRef;
  @Output() onSubmit = new EventEmitter<NewUserAlias>();

  newUserAlias = new NewUserAlias();
  constructor(private userService: UserService, private globalService: GlobalService, private ipEnc: IpAddresService,

     private http: HttpClient, private router: Router) { }
  ngOnInit(): void {
    // This is intentional
  }

  ngOnChanges() {
    this.newUserAlias.accessNumber = this.accessNumber;
  }
  handleRadio($event: any) {
    this.radioSelected = $event;
    if (this.radioSelected == 'confirmPass') {
        this.txtPassword.nativeElement.focus();
    }
  }
  async getIpClient() {
    try {
      const ip = await this.ipEnc.getClientIp();
      this.newUserAlias.ipClient  = ip;
    } catch (error) {
      //console.error('Error al obtener la IP del cliente:', error);
      this.newUserAlias.ipClient = 'NOT_IP';
    }
    /* this.http.get<{ ip: string }>('/jsonip')
      .subscribe({
        next: data => {
          this.newUserAlias.ipClient = data.ip;
        }, error: _err => this.newUserAlias.ipClient = 'NOT_IP'
      }); */

  }
  handleShowKeyboard() {
    this.isVisibleKeyboard = !this.isVisibleKeyboard;
  }
  handleKeyChange($event: any) {
    switch (this.radioSelected) {
      case 'new':
        if ($event === 'back') {
          this.newUserAlias.passwordAccess = this.newUserAlias.passwordAccess.substring(0, this.newUserAlias.passwordAccess.length - 1);
        } else {
          this.newUserAlias.passwordAccess = this.newUserAlias.passwordAccess + $event;
        }
        this.txtPassword.nativeElement.focus();
        break;
      case 'alias':
        if ($event === 'back') {
          this.newUserAlias.userAlias = this.newUserAlias.userAlias.substring(0, this.newUserAlias.userAlias.length - 1);
        } else {
          this.newUserAlias.userAlias = this.newUserAlias.userAlias + $event;
        }
        this.txtAlias.nativeElement.focus();
        break;
    }
  }

  handleVerifyStrength(_$event: any){
    // This is intentional
      }

  register() {
    this.globalService.showLoader(true);
    this.userService.getNewRecaptcha()
      .then(res => {
        this.newUserAlias.captchaValue = res;
        this.newUserAlias.captchaValueToVerify = res;
        this.userService
          .validateNewAlias(this.newUserAlias)
          .subscribe({
            next: result => {
              this.globalService.showLoader(false);
              if(result.toString()==="Exitoso"){
                this.onSubmit.emit(this.newUserAlias);
              }else if(result.toString()==="Contraseña Incorrecta"){
                this.globalService.warning('Alerta: ', 'Contraseña Incorrecta');
              }else if(result.toString()==="El Acceso ya tiene un Alias registrado"){
                this.globalService.warning('Aviso:', result.toString())
                this.router.navigate(['/login']);
              }

            }, error: _err => {
              if (_err.status === 400) {
                const errorTemp = _err;
                if (errorTemp.message === 'invalid_captcha') {
                  this.globalService.danger('Alerta: ', 'El texto introducido no coincide con la imagen');
                } else {
                  this.globalService.danger('Alerta: ', errorTemp.message);
                }
              } else {
                //console.error('error en el servicio validacion pin');
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

  showHideConfirmPassword() {
    this.visibleConfirmPass = !this.visibleConfirmPass;
  }

}
