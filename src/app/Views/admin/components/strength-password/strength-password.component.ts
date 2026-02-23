import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-strength-password',
  standalone: false,
  templateUrl: './strength-password.component.html',
  styleUrl: './strength-password.component.css'
})
export class StrengthPasswordComponent implements OnInit {
  @Input() passwordToVerify = "";
  @Input() minLength = 3;
  @Input() maxLength = 20;

  @Output() onVerifyStrength = new EventEmitter();
  levelSecurity: number = 0;
  message: string = "";
  score: number = 0;
  colorProgress: string = "";
  constructor() { // This is intentional
  }

  ngOnInit(): void {
    // This is intentional
  }

  ngOnChanges() {
    this.handleVerifyPassword();
  }

  handleVerifyPassword() {
    let verify = this.password_strength2();
    this.onVerifyStrength.emit(verify);
  }

  password_strength2() {
    const { minLength, maxLength } = this;
    let result = false;
    //Mensajes
    let malo = 'Insegura';
    let bueno = 'Regular';
    let muybueno = 'Segura';
    let fuerte = 'Muy Segura';
    let colorMalo = "#F52B02";
    let colorBueno = "#2176FF";
    let colorMuyBueno = "#68C95F";
    let colorFuerte = "#298221";
    this.score = 0;
    let { passwordToVerify } = this;
    if (passwordToVerify.length === 0) {
      this.score = 0;
      this.colorProgress = colorMalo;
      this.message = "Muy Corto";
    } else if (passwordToVerify.length > 0 && passwordToVerify.length < minLength) {
      this.message = "Muy Corto";
      this.score = 5;
      this.colorProgress = colorMalo;
    } else if (passwordToVerify.length > maxLength) {
      this.message = "Muy Largo";
      this.colorProgress = colorMalo;
      this.score = 100;
    }
    else {
      result = true;
      this.score += passwordToVerify.length * 4
      this.score += (this.checkRepetition(1, passwordToVerify).length - passwordToVerify.length) * 1
      this.score += (this.checkRepetition(2, passwordToVerify).length - passwordToVerify.length) * 1
      this.score += (this.checkRepetition(3, passwordToVerify).length - passwordToVerify.length) * 1
      this.score += (this.checkRepetition(4, passwordToVerify).length - passwordToVerify.length) * 1

      //Letras Mayusculas
      if (passwordToVerify.match(/(.*[A-Z])/)) {
        this.score += 5;
      }

      //Letras en Minusculas
      if (passwordToVerify.match(/([a-z])/)) {
        this.score += 1;
      }

      //Numeros
      if (passwordToVerify.match(/(.*[0-9])/)) {
        this.score += 3;
      }

      //3 Numeros
      if (passwordToVerify.match(/(.*[0-9].*[0-9].*[0-9])/)) {
        this.score += 5
      }

      //combo mayusculas y minusculas
      if (passwordToVerify.match(/([a-z].*[A-Z])|([A-Z].*[a-z])/)) {
        this.score += 5;
      }

      //combo Números y Letras
      if (passwordToVerify.match(/([a-zA-Z])/) && passwordToVerify.match(/([0-9])/)) {
        this.score += 5;
      }

      let { score } = this;

      if (score > 0 && score < 34) {
        this.message = malo;
        this.colorProgress = colorMalo;
      }

      if (score > 34 && score < 68) {
        this.message = bueno;
        this.colorProgress = colorBueno;
      }

      if (score > 68 && score < 100) {
        this.message = muybueno;
        this.colorProgress = colorMuyBueno;
      }

      if (score >= 100) {
        this.message = fuerte;
        this.colorProgress = colorFuerte;
      }
    }
    return result;
  }

  checkRepetition(pLen: any, str: any) {
    let res = ""
    for (let i = 0; i < str.length; i++) {
      let repeated = true;
      let j;
      for (j = 0; j < pLen && (j + i + pLen) < str.length; j++) {
        repeated = repeated && (str.charAt(j + i) == str.charAt(j + i + pLen));
      }
      if (j < pLen) {
        repeated = false;
      }
      if (repeated) {
        i += pLen - 1;
        repeated = false;
      }
      else {
        res += str.charAt(i);
      }
    }
    return res;
  }
}
