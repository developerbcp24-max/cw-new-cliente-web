import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BalancesAndMovementsService } from '../../../Services/balances-and-movements/balances-and-movements.service';
import { AccountIdDto } from '../../../Services/balances-and-movements/models/account-id-dto';
import { AccountModel, MovementsModel } from '../../../Services/balances-and-movements/models/movements-result';
import { DataService } from '../../../Services/shared/data.service';
import { GlobalService } from '../../../Services/shared/global.service';
import { UtilsService } from '../../../Services/shared/utils.service';

@Component({
  selector: 'app-movements-list',
  standalone: false,
  templateUrl: './movements-list.component.html',
  styleUrls: ['./movements-list.component.css'],
  providers: [BalancesAndMovementsService, UtilsService]
})
export class MovementsListComponent implements OnInit {
  account: AccountModel | null = null; // Cambiado a nullable
  movements: MovementsModel[] = [];
  movementsList: MovementsModel[] = [];
  isLoadComplete = false;
  voucherType = 'pdf';
  rowsPerPage: number[] = [10, 15, 20, 25];
  pageItems: number = 20;
  totalItems = 0;

  constructor(
    private balancesAndMovementsService: BalancesAndMovementsService,
    private utilsService: UtilsService,
    private globalService: GlobalService,
    private dataService: DataService,
    private router: Router,
    private cdRef: ChangeDetectorRef
  ) { }

  ngOnInit() {
    if (this.dataService.serviceData) {

      console.log(this.dataService.serviceData)

      this.balancesAndMovementsService.getMovements(
        // new AccountIdDto({ accountId: this.dataService.serviceData }))
        new AccountIdDto({ accountId: 6068985 }))
        .subscribe({
          next: response => {
            // Verificar que la respuesta y account existan
            if (response && response.account) {

              console.log(response)

              this.account = response.account;
              this.movements = response.movements || [];
              this.movementsList = response.movements || [];
              this.totalItems = this.movements.length;
            } else {
              // Manejar el caso donde account es null
              this.account = null;
              this.movements = [];
              this.movementsList = [];
              this.globalService.warning('Saldos y movimientos', 'No se encontró información de la cuenta');
            }
            this.isLoadComplete = true;
          },
          error: err => {
            //console.error('Error al obtener movimientos:', err);
            this.globalService.warning('Saldos y movimientos', err.message || 'Error al cargar los movimientos');
            this.isLoadComplete = true;
          }
        });
    } else {
      this.router.navigate(['queries/balances']);
    }
  }

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }

  handlePageChanged($event: number) {
    if (this.movements.length === 0) return;

    const startIndex = ($event - 1) * this.pageItems;
    const endIndex = startIndex + this.pageItems;
    this.movementsList = this.movements.slice(startIndex, endIndex);
  }

  handleViewRows($event: string) {
    this.pageItems = +$event;
    this.handlePageChanged(1); // Cambiado a 1 para primera página
  }

  getReport() {
    if (!this.dataService.serviceData) {
      this.globalService.warning('Saldos y movimientos', 'No hay datos para generar el reporte');
      return;
    }

    this.balancesAndMovementsService.getReport(
      new AccountIdDto({
        accountId: this.dataService.serviceData,
        reportType: this.voucherType
      })
    )
      .subscribe({
        next: (resp: Blob) => {
          this.utilsService.donwloadReport('MovimientoCuenta.' + this.voucherType, resp);
        },
        error: err => {
          //console.error('Error al obtener reporte:', err);
          this.globalService.warning('Saldos y movimientos', err.message || 'Error al generar el reporte')
        }
      });
  }
}
