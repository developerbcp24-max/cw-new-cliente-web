import { Component, OnInit, ViewChild, Output, EventEmitter, Input } from '@angular/core';
import { GlobalService } from '../../../../Services/shared/global.service';
import { NgForm } from '@angular/forms';
import { DestinationBankResult } from '../../../../Services/transfers-abroad/models/destination-bank-result';
import { BanksSearcherComponent } from '../banks-searcher/banks-searcher.component';
import { IntermediaryBank } from '../../../../Services/transfers-abroad/models/intermediary-bank';

@Component({
  selector: 'app-intermediary-bank-form-abroad',
  standalone: false,
  templateUrl: './intermediary-bank-form-abroad.component.html',
  styleUrls: ['./intermediary-bank-form-abroad.component.css']
})
export class IntermediaryBankFormAbroadComponent implements OnInit {

  selectBank!: boolean;
  @Input() bankIntermediary: IntermediaryBank = new IntermediaryBank();
  @Input() sourceAccount!: string;
  @Input() disabled = false;
  @ViewChild('formIsIntermediary') form!: NgForm;
  @ViewChild('accountIntermediaryForm') accountIntermediaryform!: NgForm;

  @ViewChild(BanksSearcherComponent) bankSearcher!: BanksSearcherComponent;
  @Output() onChange = new EventEmitter();
  bankSelected!: DestinationBankResult;

  constructor(private globalService: GlobalService) {
  }

  ngOnInit() {
    /*This is intentional*/
  }

  handleChangeBank($event: DestinationBankResult) {
    this.bankSelected = $event;
    this.bankIntermediary.destinationBankResult = this.bankSelected;
    this.onChange.emit(this.bankIntermediary);
  }

  handleAccountChange() {
    this.onChange.emit(this.bankIntermediary);
  }

  handleValidate() {
    const { bankSearcher, globalService, form, accountIntermediaryform, bankIntermediary } = this;
    if (bankIntermediary.isBankIntermediary) {
      globalService.validateAllFormFields(accountIntermediaryform.form);
      globalService.validateAllFormFields(form.form);
      if (bankIntermediary.isBankIntermediary && !bankSearcher.handleValidate()) {
        return false;
      }
      return form.valid && accountIntermediaryform.form.valid;
    } else {
      return true;
    }
  }

  handleBankIntermediary($event: boolean) {
    this.bankIntermediary.isBankIntermediary = $event;
  }
}
