import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { CreditCardsService } from '../../../../Services/credit-cards/credit-cards.service';
import { AccountDto } from '../../../../Services/accounts/models/account-dto';
import { CreditCardsAccountResult } from '../../../../Services/credit-cards/models/credit-cards-account-result';
import { GlobalService } from '../../../../Services/shared/global.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search-credit-cards',
  standalone: false,
  templateUrl: './search-credit-cards.component.html',
  styleUrls: ['./search-credit-cards.component.css'],
  providers: [CreditCardsService]
})
export class SearchCreditCardsComponent implements OnInit {
  @Input() request!: AccountDto;
  @Output() onEvent = new EventEmitter();
  Response: CreditCardsAccountResult[] = [];
  responsePerPage: CreditCardsAccountResult[] = [];
  isVisible: boolean;
  pageSize = 10;
  currentPage = 0;
  rowsPerPage: number[] = [10, 15, 20, 25];
  swMessage: boolean;

  constructor(private creditCardsService: CreditCardsService,
    private messageService: GlobalService, private router: Router,
    private cdRef: ChangeDetectorRef) {
    this.isVisible = false;
    this.swMessage = false;
  }

  ngOnInit() {
    this.swMessage = false;
    this.creditCardsService
      .getAccountsCreditCards(this.request)
      .subscribe({next: (resp: CreditCardsAccountResult[]) => {
        this.Response = resp;
        this.isVisible = this.Response.length > 0;
        this.swMessage = this.Response.length == 0;
      }, error: _err => {
        console.error('No se encontraron cuentas: ', _err.message);
        this.isVisible = false;
        this.swMessage = true;
      }})

  }

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }

  handleChangePage($event: any) {
    this.responsePerPage = this.Response.slice((($event - 1) * this.pageSize), this.pageSize * $event);
  }

  handleShowDetails(accountId: number) {
    this.router.navigate(['/queries/creditCardsMovements'], { queryParams: { accountId: accountId }, skipLocationChange: true });
  }
  handleViewRows($event: string) {
    this.pageSize = +$event;
    this.handleChangePage(0);
  }
}
