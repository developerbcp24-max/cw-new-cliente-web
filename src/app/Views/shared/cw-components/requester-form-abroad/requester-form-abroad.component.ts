import { Component, OnInit, Input, OnChanges, ViewChild, forwardRef, AfterViewInit } from '@angular/core';
import { ParameterCurrencyResult } from '../../../../Services/transfers-abroad/models/parameter-currency-result';
import { UserService } from '../../../../Services/users/user.service';
import { CurrentUser } from '../../../../Services/users/models/current-user';
import { ParameterChargeResult } from '../../../../Services/transfers-abroad/models/parameter-charge-result';
import { RequesterAbroadData } from '../../../../Services/transfers-abroad/models/requester-abroad-data';
import { GlobalService } from '../../../../Services/shared/global.service';
import { NgForm, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-requester-form-abroad',
  standalone: false,
  templateUrl: './requester-form-abroad.component.html',
  styleUrls: ['./requester-form-abroad.component.css'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => RequesterFormAbroadComponent),
    multi: true
  }]
})
export class RequesterFormAbroadComponent implements OnInit, OnChanges, ControlValueAccessor, AfterViewInit {

  requester: RequesterAbroadData = new RequesterAbroadData();
  @Input() charges: ParameterChargeResult[] = [];
  @Input() disabled = false;
  @ViewChild('formRequester')form!: NgForm;

  isVisibleInfoModal = false;

  currentUser!: CurrentUser;
  ticketTransfer!: string;
  constructor(private userService: UserService, private globalService: GlobalService) {
  }

  ngOnInit() {
    this.currentUser = this.userService.getUserToken();
  }

  ngAfterViewInit(): void {
    if (this.form && this.form.valueChanges) {
      this.form.valueChanges.subscribe(() => {
        this.propagateChange(this.requester);
      });
    }
  }
  ngOnChanges() {
  }

  handleValidate() {
    this.globalService.validateAllFormFields(this.form.form);
    return (this.form.valid);
  }

  writeValue(obj: any): void {
    if (obj) {
      this.requester = obj;
    }
  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {
  }

  propagateChange = (_: any) => { };
}
