import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-register-buttons',
  standalone: false,
  templateUrl: './register-buttons.component.html',
  styleUrl: './register-buttons.component.css'
})
export class RegisterButtonsComponent {
  @Input() nextDisabled?: boolean = false;
  @Input() showBack?: boolean = true;
  @Output() onNextEvent: EventEmitter<void> = new EventEmitter<void>();
  @Output() onBackEvent: EventEmitter<void> = new EventEmitter<void>();

  onNextClick() {
    this.onNextEvent.emit();
  }

  onBackClick() {
    this.onBackEvent.emit();
  }
}
