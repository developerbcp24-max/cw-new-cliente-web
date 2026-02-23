import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSliderChange } from '@angular/material/slider';

@Component({
  selector: 'app-slide-check-dialog',
  standalone: false,
  templateUrl: './slide-check-dialog.component.html',
  styleUrl: './slide-check-dialog.component.css'
})
export class SlideCheckDialogComponent {
ngOnInit(): void {

  }
  @Output() validationComplete = new EventEmitter<boolean>();
  @Output() validationCancelled = new EventEmitter<void>();

  sliderValue: number = 0;
  isVerifying: boolean = false;
  isVerified: boolean = false;
  verificationFailed: boolean = false;
  verificationStatus: string = '';

  private verificationStartTime: number = 0;
  private minimumInteractionTime: number = 2000;

  /* onSliderChange(event: any): void {
    this.sliderValue = event.value;
    this.verificationFailed = false;
    if (this.isVerified && this.sliderValue < 100) {
      this.isVerified = false;
      this.verificationStatus = '';
    }
  }

  onSliderComplete(event: MatSliderChange): void {
    if (event.value === 100) {
      this.startVerification();
    }
  } */
 onSliderChange(event: Event): void {
  const input = event.target as HTMLInputElement;
  this.sliderValue = Number(input.value);
  this.verificationFailed = false;

  if (this.isVerified && this.sliderValue < 100) {
    this.isVerified = false;
    this.verificationStatus = '';
  }
}

onSliderComplete(event: Event): void {
  const input = event.target as HTMLInputElement;
  if (Number(input.value) === 100) {
    this.startVerification();
  }
}


  private startVerification(): void {
    this.verificationStartTime = Date.now();
    this.isVerifying = true;
    this.verificationStatus = 'verifying';
    this.performSecurityChecks();
  }

  private async performSecurityChecks(): Promise<void> {
    try {
      await this.delay(1000);
      const interactionTime = Date.now() - this.verificationStartTime;
      const isValidInteraction = interactionTime >= this.minimumInteractionTime ||
        this.hasValidMovementPattern();
      await this.delay(500);

      if (isValidInteraction && this.performAdditionalChecks()) {
        this.completeVerification(true);
      } else {
        this.completeVerification(false);
      }

    } catch (error) {
      //console.error('Error en verificación de seguridad:', error);
      this.completeVerification(false);
    }
  }

  private hasValidMovementPattern(): boolean {
    return true;
  }

  private performAdditionalChecks(): boolean {
    const userAgent = navigator.userAgent;
    const hasValidUserAgent = !userAgent.includes('bot') &&
      !userAgent.includes('crawler') &&
      !userAgent.includes('spider');
    return hasValidUserAgent;
  }

  private completeVerification(success: boolean): void {
    this.isVerifying = false;

    if (success) {
      this.isVerified = true;
      this.verificationStatus = 'verified';
      this.verificationFailed = false;
      setTimeout(() => {
        this.validationComplete.emit(true);
      }, 1000);
    } else {
      this.isVerified = false;
      this.verificationStatus = 'failed';
      this.verificationFailed = true;
      this.sliderValue = 0;
      setTimeout(() => {
        this.verificationFailed = false;
        this.verificationStatus = '';
      }, 3000);
    }
  }

  onCancel(): void {
    this.validationCancelled.emit();
  }

  onContinue(): void {
    if (this.isVerified) {
      this.validationComplete.emit(true);
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Método para resetear el componente
  resetValidation(): void {
    this.sliderValue = 0;
    this.isVerifying = false;
    this.isVerified = false;
    this.verificationFailed = false;
    this.verificationStatus = '';
  }

  get canContinue(): boolean {
    return this.isVerified && !this.isVerifying;
  }
  ngAfterViewInit() {
    const sliderElements = document.querySelectorAll('.security-slider .mdc-slider__track--active_fill');
    sliderElements.forEach(el => {
      (el as HTMLElement).style.backgroundColor = '#f26e29';
    });
  }
}
