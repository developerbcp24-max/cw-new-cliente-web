import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BalancesAndMovementsService } from '../../../../Services/balances-and-movements/balances-and-movements.service';
import { AccountResult } from '../../../../Services/balances-and-movements/models/account-result';
import { DataService } from '../../../../Services/shared/data.service';

@Component({
  selector: 'app-balances-list',
  standalone: false,
  templateUrl: './balances-list.component.html',
  styleUrls: ['./balances-list.component.css'],
  providers: [BalancesAndMovementsService]
})
export class BalancesListComponent implements OnInit, OnChanges {

  @Input() accounts!: AccountResult[];
  @Input() isMosaic = true;
  style = 'home__layout__mosaic';
  columnSize = 6;

  errorMessageGettingAccountInformation = 'No se pudo obtener informacion de esta cuenta';

  constructor(private router: Router, private dataService: DataService) { }

  ngOnInit(): void {
    // This is intentional
  }

  ngOnChanges(): void {
    this.style = this.isMosaic ? 'home__layout__mosaic' : 'home__layout__list';
    this.columnSize = this.isMosaic ? 6 : 12;
  }

  handleShowDetails(accountId: number) {
    console.log(accountId);
    this.dataService.serviceData = accountId;
    this.router.navigate(['/movements']);
  }
}
