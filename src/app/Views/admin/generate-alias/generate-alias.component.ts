import { Component, OnInit } from '@angular/core';
import { NewUserAlias } from '../../../Services/users/models/NewUserAlias';
import { UserService } from '../../../Services/users/user.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { GlobalService } from '../../../Services/shared/global.service';
import { IpAddresService } from '../../../Services/users/ip-addres.service';

@Component({
  selector: 'app-generate-alias',
  standalone: false,
  templateUrl: './generate-alias.component.html',
  styleUrl: './generate-alias.component.css'
})
export class GenerateAliasComponent implements OnInit {

  currentStep!: number;
  accessNumber: string;
  newUserAlias: NewUserAlias = new NewUserAlias();
  _newUseralias: NewUserAlias = new NewUserAlias();
  constructor(private userService: UserService
    , private router: Router, private http: HttpClient
    , private globalService: GlobalService,
    private ipEnc: IpAddresService) {
    this.accessNumber = '90000100000';
  }

  ngOnInit(): void {
    this.currentStep = 1;
  }

  handleSubmitStep1($event: any){
    if ($event.isOk) {
      this.newUserAlias.accessNumber = $event.numberAccess;
      this.newUserAlias.pin = $event.pin;
      this.newUserAlias.card = $event.card;
      this.currentStep = 2;
    }
  }

  handleSubmitStep2($event: any){
    if ($event !== null) {
      this.newUserAlias.captchaValue = $event.captchaValue;
      this.newUserAlias.captchaValueToVerify = $event.captchaValueToVerify;
      this.newUserAlias.accessNumber = $event.accessNumber;
      this.newUserAlias.userAlias = $event.userAlias;
      this.newUserAlias.passwordAccess = $event.passwordAccess;

      this.currentStep = 3;
    }
  }

  handleSubmitStep3($event: NewUserAlias) {
    if ($event !== null) {
      this.newUserAlias.captchaValue = $event.captchaValue;
      this.newUserAlias.captchaValueToVerify = $event.captchaValueToVerify;
      this.newUserAlias.accessNumber = $event.accessNumber;
      this.newUserAlias.userAlias = $event.userAlias;
      this.save();
    }
  }



  save() {
    this.userService.getNewRecaptcha()
      .then(response => {
        this.newUserAlias.captchaValue = response;
        this.newUserAlias.captchaValueToVerify = response;
        this.userService.createAlias(this.newUserAlias)
          .subscribe({
            next: (res: any) => {
              this.globalService.success('Mensaje', res, false, true);
             this.router.navigate(['/login']);

            }, error: _err => {
              const errorTemp = _err;
              if (_err.status === 401 || _err.status === 500) {
                this.router.navigate(['/login']);
                this.globalService.danger('Alerta: ', errorTemp.message);
              } else {
                ////console.log('error servicio generar password');
              }
            }
          });
      });
  }
}
