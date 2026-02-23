import { Component, OnInit } from '@angular/core';
import { NewUserPassword } from '../../../Services/users/models/new-password-model';
import { UserService } from '../../../Services/users/user.service';
import { HttpClient } from '@angular/common/http';
import { GlobalService } from '../../../Services/shared/global.service';
import { Router } from '@angular/router';
import { IpAddresService } from '../../../Services/users/ip-addres.service';

@Component({
  selector: 'app-generate-key',
  standalone: false,
  templateUrl: './generate-key.component.html',
  styleUrl: './generate-key.component.css'
})
export class GenerateKeyComponent implements OnInit {

  currentStep!: number;
  accessNumber: string;
  newUserPassword: NewUserPassword = new NewUserPassword();
  constructor(private userService: UserService
    , private router: Router, private http: HttpClient
    , private globalService: GlobalService,
    private ipEnc: IpAddresService) {
    this.accessNumber = '90000100000';
    this.newUserPassword.ipClient = 'NOT_IP';
    this.getIpClient();
  }

  ngOnInit() {
  this.currentStep = 1;
  }

  handleSubmitStep1($event: any) {
    if ($event.isOk) {
      this.newUserPassword.accessNumber = $event.numberAccess;
      this.newUserPassword.pin = $event.pin;
      this.newUserPassword.card = $event.card;
      this.currentStep = 2;
    }
  }

  async getIpClient(){
    try {
      const ip = await this.ipEnc.getClientIp();
      this.newUserPassword.ipClient  = ip;
    } catch (error) {
      //console.error('Error al obtener la IP del cliente:', error);
      this.newUserPassword.ipClient = 'NOT_IP';
    }
    /* this.ipEnc.getIpClient().pipe(

      catchError(_err => this.ipEnc.getIpAddress())
    ).subscribe({next: response => {
      this.newUserPassword.ipClient = response.ip;
    }, error: _err => {
      this.newUserPassword.ipClient ='NOT_IP';
    }}); */


  }

  handleSubmitStep2($event: NewUserPassword) {
    if ($event !== null) {
      this.newUserPassword.captchaValue = $event.captchaValue;
      this.newUserPassword.captchaValueToVerify = $event.captchaValueToVerify;
      this.newUserPassword.newPassword = $event.newPassword;
      this.newUserPassword.confirmPassword = $event.confirmPassword;
      this.newUserPassword.userAlias=$event.userAlias;
      if($event.notExistAlias){
        this.currentStep = 3;
      }else{
        this.save();
      }


    }
  }
  handleSubmitStep3($event: any) {
    if ($event !== null) {
      this.newUserPassword.captchaValue = $event.captchaValue;
      this.newUserPassword.captchaValueToVerify = $event.captchaValueToVerify;
      this.newUserPassword.newPassword = $event.newPassword;
      this.newUserPassword.confirmPassword = $event.confirmPassword;
      this.newUserPassword.userAlias=$event.userAlias;
      this.save();
    }
  }

  save() {
    this.userService.getNewRecaptcha()
      .then(response => {
        this.newUserPassword.captchaValue = response;
        this.newUserPassword.captchaValueToVerify = response;
        this.userService.createPassword(this.newUserPassword)
          .subscribe({
            next: res => {
              if(res.toString().match('Lo siento, pero el alias con el nombre')){
                this.globalService.danger('Mensaje:', res.toString(), false, true);
              }else{
                this.globalService.success('Mensaje:', res.toString(), false, true);
                this.router.navigate(['/login']);
              }
            }, error: _err => {
              const errorTemp = _err;
              if (_err.status === 401 || _err.status === 500) {
                this.router.navigate(['/login']);
                this.globalService.danger('Alerta: ', errorTemp.error);
              } else {
                ////console.log('error servicio generar password');
                this.router.navigate(['/login']);
                this.globalService.danger('Alerta: ', errorTemp.message);
              }
              this.globalService.showLoader(false);
            }
          });
      });
  }
}
