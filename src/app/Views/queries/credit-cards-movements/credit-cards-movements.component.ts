import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { SearchCreditCardsMovementsPerMonthComponent } from '../components/search-credit-cards-movements-per-month/search-credit-cards-movements-per-month.component';
import { CreditCardsService } from '../../../Services/credit-cards/credit-cards.service';
import { CreditCardsAccountByIdDto } from '../../../Services/credit-cards/models/credit-cards-by-id-dto';
import { Router } from '@angular/router';

@Component({
  selector: 'app-credit-cards-movements',
  standalone: false,
  templateUrl: './credit-cards-movements.component.html',
  styleUrls: ['./credit-cards-movements.component.css']
})


export class CreditCardsMovementsComponent implements OnInit {
  accountId!: number;
  request!: CreditCardsAccountByIdDto;

  constructor(private router: Router) { }

  ngOnInit() {
    this.accountId = +this.router.parseUrl(this.router.url).queryParams['accountId'];
    this.request = {accountId : this.accountId};
  }
}
