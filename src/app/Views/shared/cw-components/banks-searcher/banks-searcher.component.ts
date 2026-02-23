import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { DestinationBankResult } from '../../../../Services/transfers-abroad/models/destination-bank-result';
import { DestinationBanksDto } from '../../../../Services/transfers-abroad/models/destination-banks-dto';
import { TransfersAbroadService } from '../../../../Services/transfers-abroad/transfer-abroad.service';
import { GlobalService } from '../../../../Services/shared/global.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-banks-searcher',
  standalone: false,
  templateUrl: './banks-searcher.component.html',
  styleUrls: ['./banks-searcher.component.css']
})
export class BanksSearcherComponent implements OnInit {
  searchType: string;
  searchText = '';
  searchTextSelected = '';
  isFirstTime = true;
  @Input() sourceAccount!: string;
  @Output() onChange = new EventEmitter();
  @Input() disabled = false;
  destinationBanks: DestinationBankResult[] = [];
  filterBanks: DestinationBankResult[] = [];
  bankSelected!: DestinationBankResult;
  @Input() bankSelectedDetail: DestinationBankResult = new DestinationBankResult();
  @ViewChild('formSearchBank')
  form!: NgForm;
  @ViewChild('formDetailBank')
  formDetail!: NgForm;
  existBanks = false;

  constructor(private transfersAbroadService: TransfersAbroadService,
    private globalService: GlobalService) {
    this.searchType = 'swift';
  }

  ngOnInit() {
    /*This is intentional*/
  }

  getBanks() {
    const destinationBankDto: DestinationBanksDto = new DestinationBanksDto();
    destinationBankDto.numberAccount = this.sourceAccount;
    destinationBankDto.name = this.searchText;
    destinationBankDto.code = this.searchType;
    this.bankSelectedDetail = new DestinationBankResult();
    this.destinationBanks = [];
    this.existBanks = false;
    this.transfersAbroadService.getDestinationBanks(destinationBankDto)
      .subscribe({next:(response: DestinationBankResult[]) => {
        this.destinationBanks = response;
        this.existBanks = this.destinationBanks.length > 0 ? true : false;
        if (this.existBanks) {
          this.filterBanks = this.destinationBanks;
          this.bankSelected = this.filterBanks[0];
          this.bankSelectedDetail = this.bankSelected;
          this.onChange.emit(this.bankSelectedDetail);
        } else {
          this.bankSelected = null!;
          this.bankSelectedDetail = new DestinationBankResult();
          this.onChange.emit(this.bankSelectedDetail);
        }
      }, error: _err => {
        this.destinationBanks = [];
        this.filterBanks = [];
        this.existBanks = false;
        this.onChange.emit(this.bankSelectedDetail);
      }});
  }

  handleSearchBanks() {
    if (this.searchText.trim().length >= 3) {
      this.isFirstTime = false;
      this.getBanks();
    }
  }

  handleSelectBank() {
    this.bankSelectedDetail = this.bankSelected ? this.bankSelected : new DestinationBankResult();
    this.onChange.emit(this.bankSelectedDetail);
  }

  handleValidate() {
    if (this.bankSelectedDetail.code) {
      return true;
    }
    this.globalService.validateAllFormFields(this.form.form);
    this.globalService.validateAllFormFields(this.formDetail.form);
    return this.form.valid && this.formDetail.form.valid;
  }
}
