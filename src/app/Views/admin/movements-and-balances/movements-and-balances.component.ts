import { Component, ElementRef, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { BalancesAndMovementsService } from '../../../Services/balances-and-movements/balances-and-movements.service';
import { GlobalService } from '../../../Services/shared/global.service';
import { AccountTypes } from '../../../Services/shared/enums/account-types';
import { AccountUse } from '../../../Services/shared/enums/account-use';
import { OperationType } from '../../../Services/shared/enums/operation-type';
import { Roles } from '../../../Services/shared/enums/roles';
import { BalancesDto } from '../../../Services/balances-and-movements/models/balances-dto';
import { BalancesResult } from '../../../Services/balances-and-movements/models/balances-result';
import { AccountResult } from '../../../Services/balances-and-movements/models/account-result';
import { AccountBalancesResult } from '../../../Services/balances-and-movements/models/account-balances-result';
import { Router } from '@angular/router';
import { ParametersService } from '../../../Services/parameters/parameters.service';
import { CredifondoResult } from '../../../Services/balances-and-movements/models/credifondo-result';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-movements-and-balances',
  standalone: false,
  templateUrl: './movements-and-balances.component.html',
  styleUrls: ['./movements-and-balances.component.css'],
  providers: [BalancesAndMovementsService, ParametersService],
})
export class MovementsAndBalancesComponent implements OnInit, OnDestroy {
  isMosaic = true;
  balancesDto!: BalancesDto;
  totalBalances: BalancesResult[] = [];
  accounts: AccountResult[] = [];
  typeView: AccountResult = new AccountResult();
  isLoadComplete = false;
  passwordExpiryDate!: Date;
  timeRemaining!: number;
  messageValid: string = '';
  showDetailForm: boolean = false;
  @ViewChild('myModal', { static: false }) myModal!: ElementRef;
  elm!: HTMLElement;

  private bootstrapLink: HTMLLinkElement | null = null;

  constructor(
    private balancesAndMovementsService: BalancesAndMovementsService,
    private globalService: GlobalService,
    private router: Router,
    private parametersService: ParametersService
  ) {
    // Cargar Bootstrap solo para este componente
    this.bootstrapLink = document.createElement('link');
    this.bootstrapLink.rel = 'stylesheet';
    this.bootstrapLink.href = 'assets/css/bootstrap-ops.css'; // tu archivo CSS con bootstrap
    document.head.appendChild(this.bootstrapLink);
  }

  ngOnInit() {
    this.balancesDto = {
      operationTypeId: [OperationType.consultarCuentas],
      roleId: Roles.consultant,
      accountUse: String.fromCharCode(AccountUse.debit),
      types: [String.fromCharCode(AccountTypes.passive)],
    };

    // console.log(this.balancesDto)

    //* esto es para mostar consulta estado cuentas *//
    // this.balancesAndMovementsService.getBalances(this.balancesDto).subscribe({
    //   next: (resp: AccountBalancesResult) => {
    //     console.log(resp)
    //     // this.accounts = resp.accounts;
    //     this.accounts.push(...resp.accounts);
    //     this.totalBalances = resp.totalBalances;
    //     this.isLoadComplete = true;
    //   },
    //   error: (_err) => {
    //     this.globalService.info('Saldos y Movimientos: ', _err.message);
    //   },
    // });

    //TODO: ESTO ES PARA CREDIFONDO
    // this.balancesAndMovementsService.getBalancesCedifondo().subscribe({
    //   next: (resp: CredifondoResult[]) => {
    //     this.accounts.push(...resp);
    //     this.totalBalances.push(...resp);
    //     this.isLoadComplete = true;
    //   },
    //   error: (_err) => {
    //     this.globalService.info('Saldos y Movimientos: ', _err.message);
    //   },
    // });

    //TODO: RESUMIDO FINAL
    forkJoin({
      balances: this.balancesAndMovementsService.getBalances(this.balancesDto),
      credifondo: this.balancesAndMovementsService.getBalancesCedifondo()
    }).subscribe({
      next: ({ balances, credifondo }) => {

        console.log(balances)
        console.log(credifondo)

        this.accounts = [...balances.accounts, ...credifondo];
        this.totalBalances = balances.totalBalances;
        this.isLoadComplete = true;
      },
      error: (err) => {
        this.globalService.info('Saldos y Movimientos: ', err.message);
      }
    });
    this.getInfoPass();
  }

  handleRates() {
    window.open('/assets/pdf/tarifario.pdf', '_blank');
  }

  cereateNewPass() {
    this.showDetailForm = false;
    this.router.navigate(['/login/changePassword']);
  }

  getInfoPass() {
    this.parametersService.getInfoPass().subscribe({
      next: (response) => {
        if (response.infoPasswors.includes('¡Alerta!')) {
          this.messageValid = response.infoPasswors;
          this.open();
        }
      },
    });
  }

  getRenewPass() {
    this.parametersService.getRenewPass().subscribe({
      next: (response) => {
        this.globalService.success('Información: ', response.message)
      },
    });
  }

  ngAfterViewInit(): void {
    this.elm = this.myModal.nativeElement as HTMLElement;
  }

  close(): void {
    this.elm.classList.remove('show');
    setTimeout(() => {
      this.elm.style.width = '0';
    }, 75);
    this.getRenewPass();
  }

  open(): void {
    this.elm.classList.add('show');
    this.elm.style.width = '100vw';
  }

  ngOnDestroy(): void {
    // Remover Bootstrap al destruir el componente
    if (this.bootstrapLink) {
      document.head.removeChild(this.bootstrapLink);
    }
  }
}
