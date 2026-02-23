import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-register-mobile-tabs',
  standalone: false,
  templateUrl: './register-mobile-tabs.component.html',
  styleUrl: './register-mobile-tabs.component.css',
})
export class RegisterMobileTabsComponent {
  @Input() currentStep: number = 1;
}
