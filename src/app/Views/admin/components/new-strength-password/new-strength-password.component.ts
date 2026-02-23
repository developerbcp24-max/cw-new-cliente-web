import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
export interface PasswordStrengthResult {
  isValid: boolean;
  score: number;
  level: 'mal' | 'debil' | 'normal' | 'muybien';
  message: string;
  color: string;
}
@Component({
  selector: 'app-new-strength-password',
  standalone: false,
  templateUrl: './new-strength-password.component.html',
  styleUrl: './new-strength-password.component.css'
})

export class NewStrengthPasswordComponent implements OnInit {
  @Input() passwordToVerify = "";
  @Input() minLength = 8;
  @Input() maxLength = 20;
  @Input() showProgress = true;
  @Input() showMessage = true;

  @Output() onVerifyStrength = new EventEmitter<PasswordStrengthResult>();

  levelSecurity: number = 0;
  message: string = "";
  score: number = 0;
  colorProgress: string = "";

  constructor() {}

  ngOnInit(): void {}

  ngOnChanges() {
    this.handleVerifyPassword();
  }

  handleVerifyPassword() {
    const result = this.calculatePasswordStrength();
    this.onVerifyStrength.emit(result);
  }

  calculatePasswordStrength(): PasswordStrengthResult {
    const { minLength, maxLength, passwordToVerify } = this;

    // Colores y mensajes
    const levels = {
      mal: { message: 'Insegura', color: '#F52B02' },
      debil: { message: 'Regular', color: '#2176FF' },
      normal: { message: 'Segura', color: '#68C95F' },
      muybien: { message: 'Muy Segura', color: '#298221' }
    };

    // Validaciones iniciales
    if (!passwordToVerify || passwordToVerify.length === 0) {
      this.updateDisplay(0, levels.mal.color, "Ingresa una contraseña");
      return {
        isValid: false,
        score: 0,
        level: 'mal',
        message: "Ingresa una contraseña",
        color: levels.mal.color
      };
    }

    if (passwordToVerify.length < minLength) {
      this.updateDisplay(5, levels.mal.color, "Muy Corta (mín. 8 caracteres)");
      return {
        isValid: false,
        score: 5,
        level: 'mal',
        message: "Muy Corta (mín. 8 caracteres)",
        color: levels.mal.color
      };
    }

    if (passwordToVerify.length > maxLength) {
      this.updateDisplay(100, levels.mal.color, "Muy Larga (máx. 20 caracteres)");
      return {
        isValid: false,
        score: 100,
        level: 'mal',
        message: "Muy Larga (máx. 20 caracteres)",
        color: levels.mal.color
      };
    }

    // Contadores de caracteres
    const uppercaseCount = (passwordToVerify.match(/[A-Z]/g) || []).length;
    const lowercaseCount = (passwordToVerify.match(/[a-z]/g) || []).length;
    const numberCount = (passwordToVerify.match(/[0-9]/g) || []).length;

    // Validar solo números y letras (no caracteres especiales)
    const onlyAlphanumeric = /^[A-Za-z0-9]+$/.test(passwordToVerify);

    // Validaciones específicas de requisitos
    const hasMinUppercase = uppercaseCount >= 2;
    const hasMinLowercase = lowercaseCount >= 2;
    const hasMinNumbers = numberCount >= 2;
    const hasValidLength = passwordToVerify.length >= 8 && passwordToVerify.length <= 20;

    // Determinar mensaje de error específico
    if (!onlyAlphanumeric) {
      this.updateDisplay(0, levels.mal.color, "Solo números y letras permitidos");
      return {
        isValid: false,
        score: 0,
        level: 'mal',
        message: "Solo números y letras permitidos",
        color: levels.mal.color
      };
    }

    if (!hasMinUppercase) {
      this.updateDisplay(10, levels.mal.color, "Necesita mínimo 2 mayúsculas");
      return {
        isValid: false,
        score: 10,
        level: 'mal',
        message: "Necesita mínimo 2 mayúsculas",
        color: levels.mal.color
      };
    }

    if (!hasMinLowercase) {
      this.updateDisplay(15, levels.mal.color, "Necesita mínimo 2 minúsculas");
      return {
        isValid: false,
        score: 15,
        level: 'mal',
        message: "Necesita mínimo 2 minúsculas",
        color: levels.mal.color
      };
    }

    if (!hasMinNumbers) {
      this.updateDisplay(20, levels.mal.color, "Necesita mínimo 2 números");
      return {
        isValid: false,
        score: 20,
        level: 'mal',
        message: "Necesita mínimo 2 números",
        color: levels.mal.color
      };
    }

    // Si cumple todos los requisitos básicos, calcular puntaje de fuerza
    let score = 0;

    // Puntos base por longitud
    score += passwordToVerify.length * 4;

    // Puntos adicionales por variedad de caracteres
    score += uppercaseCount * 5;
    score += lowercaseCount * 3;
    score += numberCount * 4;

    // Penalizar repeticiones
    score += (this.checkRepetition(1, passwordToVerify).length - passwordToVerify.length) * 1;
    score += (this.checkRepetition(2, passwordToVerify).length - passwordToVerify.length) * 1;
    score += (this.checkRepetition(3, passwordToVerify).length - passwordToVerify.length) * 1;

    // Bonificaciones por combinaciones
    if (uppercaseCount >= 2 && lowercaseCount >= 2) {
      score += 10;
    }

    if (numberCount >= 3) {
      score += 5;
    }

    if (passwordToVerify.length >= 12) {
      score += 10; // Bonificación por longitud buena
    }

    // Determinar nivel final
    let level: 'mal' | 'debil' | 'normal' | 'muybien';
    let message: string;
    let color: string;

    if (score < 40) {
      level = 'debil';
      message = 'Contraseña débil pero válida';
      color = levels.debil.color;
    } else if (score < 70) {
      level = 'normal';
      message = 'Contraseña segura';
      color = levels.normal.color;
    } else {
      level = 'muybien';
      message = 'Contraseña muy segura';
      color = levels.muybien.color;
    }

    this.updateDisplay(score, color, message);

    const isValid = hasMinUppercase && hasMinLowercase && hasMinNumbers && hasValidLength && onlyAlphanumeric;

    return {
      isValid,
      score,
      level,
      message,
      color
    };
  }

  private updateDisplay(score: number, color: string, message: string) {
    this.score = score;
    this.colorProgress = color;
    this.message = message;
  }

  checkRepetition(pLen: number, str: string): string {
    let res = "";
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
      } else {
        res += str.charAt(i);
      }
    }
    return res;
  }
}
