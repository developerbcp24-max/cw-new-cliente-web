import { Component, OnInit, Output, EventEmitter, Input, ViewChild } from '@angular/core';
import { EmailInputModel } from '../../../../Services/shared/models/email-input-model';
import { GlobalService } from '../../../../Services/shared/global.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-depecrated-emails-input',
  standalone: false,
  templateUrl: './depecrated-emails-input.component.html',
  styleUrls: ['./depecrated-emails-input.component.css']
})
export class DepecratedEmailsInputComponent implements OnInit {

  emailInput: EmailInputModel = new EmailInputModel();
  email!: string;
  @Output() onChange = new EventEmitter<EmailInputModel>();
  @Input() disabled: boolean;
  @ViewChild('formEmail') form!: NgForm;

  constructor(private globalService: GlobalService) {
    this.disabled = false;
  }

  ngOnInit() {
    this.emailInput.emails = '';
    this.emailInput.isEmailInputSelected = false;
  }

  handleEmailsChanged() {
    this.emailInput.emails = this.email;
    this.onChange.emit(this.emailInput);
  }

  handleChangeChecked($event: any) {
    if (!$event) {
      this.emailInput = new EmailInputModel();
      this.onChange.emit(this.emailInput);
    }
  }

  handleValidate() {
    if (this.emailInput.isEmailInputSelected) {
      this.globalService.validateAllFormFields(this.form.form);
      if (this.emailInput.emails.length === 0) {
        return false;
      }
      else {
        return this.form.valid;
      }
    }
    return true;
  }
}
