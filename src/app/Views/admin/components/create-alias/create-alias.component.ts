import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { NewUserPassword } from '../../../../Services/users/models/new-password-model';
import { NewUserAlias } from '../../../../Services/users/models/NewUserAlias';
import { UserService } from '../../../../Services/users/user.service';
import { GlobalService } from '../../../../Services/shared/global.service';
import { IpAddresService } from '../../../../Services/users/ip-addres.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
	selector: 'app-create-alias',
	standalone: false,
	templateUrl: './create-alias.component.html',
	styleUrl: './create-alias.component.css'
})
export class CreateAliasComponent implements OnInit, OnChanges {
	radioSelected = 'new';
	visiblePass = false;
	visibleConfirmPass = false;
	isVisibleKeyboard: boolean = false;

	@Input() accessNumber = '';
	@Input() readOnlyAccessNumber = false;
	@Input() newUser = new NewUserPassword();
	@Input() newAliasUser = new NewUserAlias();
	newUserAliasPass= new NewUserPassword();
	_newAliasUser = new NewUserAlias();

	currentUrl: boolean=false

	@ViewChild('txtPassword') txtPassword!: ElementRef;
	@ViewChild('txtAlias') txtAlias!: ElementRef;
	@Output() onSubmit = new EventEmitter<NewUserAlias>();
	@Output() onSubmit1 = new EventEmitter<NewUserPassword>();


	newUserAlias = new NewUserAlias();
	notExistAlias: boolean=false;
	constructor(private userService: UserService, private globalService: GlobalService, private ipEnc: IpAddresService,
		private http: HttpClient, private router: Router) {}

	ngOnInit(): void {
		const currentUrls=this.router.url
		if(currentUrls.match('/generateKey')){
			this.currentUrl=true;
			this.newUserAliasPass=this.newUser;
		}else{
			this.newUserAlias.passwordAccess=this.newAliasUser.passwordAccess;
		}

	}

	ngOnChanges() {
		this.newUserAlias.accessNumber = this.accessNumber;
	}
	handleRadio($event: any) {
		this.radioSelected = $event;
		switch (this.radioSelected) {
			case 'confirmPass':
				this.txtPassword.nativeElement.focus();
				break;
			case 'alias':
				this.txtAlias.nativeElement.focus();
				break;
		}
	}

	async getIpClient() {
		try {
			const ip = await this.ipEnc.getClientIp();
			this.newUserAlias.ipClient = ip;
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
				if(this.currentUrl){
					this.newUser.captchaValue = res;
				this.newUser.captchaValueToVerify = res;
				this.userService
					.validateNewPassword(this.newUser)
					.subscribe({
						next: result => {
							this.globalService.showLoader(false);
							if(result==null){
								this.onSubmit1.emit(this.newUser);
							}else if(result.toString()==='CreateAlias'){
								this.notExistAlias=true;
								this.newUser.notExistAlias=this.notExistAlias;
								this.onSubmit1.emit(this.newUser);
							}

						}, error: _err => {
							this.handleShowErro(_err);
						}
					});
				}else{
				this.newUserAlias.captchaValue = res;
				this.newUserAlias.captchaValueToVerify = res;
				this.newUserAlias.passwordAccess=this.newAliasUser.passwordAccess;
				this.userService
					.validateNewAlias(this.newUserAlias)
					.subscribe({
						next: _result => {
							this.globalService.showLoader(false);
							this.onSubmit.emit(this.newUserAlias);
						}, error: _err => {
							this.handleShowErro(_err);
						}
					});
				}

			});
	}

	handleShowErro(_err: any){
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

	showHidePassword() {
		this.visiblePass = !this.visiblePass;
	}

	showHideConfirmPassword() {
		this.visibleConfirmPass = !this.visibleConfirmPass;
	}
}
