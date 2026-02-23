import { Component, Input } from '@angular/core';

@Component({
	selector: 'app-step-register',
	standalone: false,
	templateUrl: './step-register.component.html',
	styleUrl: './step-register.component.css'
})
export class StepRegisterComponent {
  @Input() title: string = '';
	@Input() active = false;
	@Input() currentSelected = false;
}
