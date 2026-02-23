import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { Constants } from '../../../../Services/shared/enums/constants';
import { NgForm } from '@angular/forms';
import { GlobalService } from '../../../../Services/shared/global.service';
import { SendBill } from '../../../../Services/service-payments/models/send-bill';

@Component({
  selector: 'app-send-bill',
  standalone: false,
  templateUrl: './send-bill.component.html',
  styleUrls: ['./send-bill.component.css']
})
export class SendBillComponent implements OnInit {

  constants: Constants;
  data: SendBill;
  @Input() visible!: boolean;
  @Input() isEntel = false;
  @Input() disabled!: boolean;
  @Output() onChange: EventEmitter<SendBill>;
  @ViewChild('sendBillForm') form!: NgForm;

  constructor(private globalService: GlobalService) {
    this.constants = new Constants();
    this.data = new SendBill();
    this.onChange = new EventEmitter();
  }

  ngOnInit() {
    this.data.city = this.constants.cities[0];
    this.data.streetType = this.constants.streetTypes[0];
  }

  handleValidate() {
    if(!this.visible){
      return true;
    }
    this.globalService.validateAllFormFields(this.form.form);
    this.data.isSendBill = true;
    this.onChange.emit(this.data);
    return this.form.valid;
  }

  cleanForm() {
    this.data = new SendBill();
    this.data.isSendBill = false;
    this.onChange.emit(this.data);
  }

}
