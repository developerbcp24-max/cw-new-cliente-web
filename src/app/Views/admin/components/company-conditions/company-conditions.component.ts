import { Component, EventEmitter, Input, Output } from '@angular/core';
import { GetAccountsResponse } from '../../../../Services/AffiliationRegCw/Models/GetAccountsResponse';
import { GetSignaturesResponse } from '../../../../Services/AffiliationRegCw/Models/GetSignaturesResponse';
import { AffiliationRegCwService } from '../../../../Services/AffiliationRegCw/affiliation-reg-cw.service';
import { MatDialog } from '@angular/material/dialog';
import { openNotificationDialog } from '../../../../Helpers/notification-dialog.helper';
import { CwRolesDialogComponent } from '../cw-roles-dialog/cw-roles-dialog.component';
import { TermsConditionsDialogComponent } from '../terms-conditions-dialog/terms-conditions-dialog.component';
import { GetFirmantesRequest } from '../../../../Services/AffiliationRegCw/Models/GetFirmantesRequest';
import { ConsultClientResponse } from '../../../../Services/AffiliationRegCw/Models/ConsultClientResponse';

@Component({
  selector: 'app-company-conditions',
  standalone: false,
  templateUrl: './company-conditions.component.html',
  styleUrl: './company-conditions.component.css'
})
export class CompanyConditionsComponent {
  @Input() affCompanyId: string = "";
  @Input() accountNumber: string = '';
  @Input() idc: string = '';
  @Input() typeIdc: string = '';
  @Input() extensionIdc: string = '';
  @Input() complementIdc: string = '';
  @Input() Nit: string = '';
  @Input() consultClient: ConsultClientResponse = new ConsultClientResponse();
  @Output() setSelectedAccountsEvent: EventEmitter<GetAccountsResponse[]> =
    new EventEmitter<GetAccountsResponse[]>();
  @Output() setSignaturesEvent: EventEmitter<GetSignaturesResponse[]> =
    new EventEmitter<GetSignaturesResponse[]>();
  @Output() changeStepEvent: EventEmitter<number> = new EventEmitter<number>();

  stepOptions = [
    { value: 1, viewValue: 'PA', selected: true },
    { value: 2, viewValue: 'ACW', selected: false },
    { value: 3, viewValue: 'HCWW', selected: false },
  ];

  accounts: {
    account: GetAccountsResponse;
    selected: boolean;
  }[] = [];
  selectedAccounts: GetAccountsResponse[] = [];
  canGetAccounts: boolean = false;

  constructor(
    private _affiliationService: AffiliationRegCwService,
    private dialog: MatDialog
  ) {}

  fullAccessItems = [
    'Extractos bancarios',
    'Pagos masivos a proveedores de otros bancos',
    'Transferencias entre cuentas propias',
    'QR',
    'Transferencias a cuentas de otros bancos',
    'Pagos de RUAT, Impuestos Nacionales y Gestora',
    'Transferencias a cuentas del BCP',
    'Pagos masivos en efectivo',
    'Transferencias al exterior',
    'Pagos de servicios básicos',
    'Pagos masivos a planillas de sueldo',
    'Comprobantes y facturas electrónicas',
    'Pagos masivos a proveedores del BCP',
    'Boletas de garantía',
  ];

  changePage(page: number) {
    for (let item of this.stepOptions) {
      item.selected = item.value === page;
    }
  }

  getAccountsToShow(): {
    account: GetAccountsResponse;
    selected: boolean;
  }[] {
    return this.accounts.filter(
      (account) => account.account.noAccount !== this.accountNumber
    );
  }


  openRoles() {
    this.dialog.open(CwRolesDialogComponent, {
      panelClass: 'roles-dialog',
    });
  }

  openTermsAndConditionsDialog() {
    this.dialog.open(TermsConditionsDialogComponent, {
      panelClass: 'terms-conditions-dialog-class',
      autoFocus: false,
    });
  }


// 1. Actualiza el método getAccounts() para inicializar correctamente
getAccounts() {
 /// //console.log("Consult cliente -", this.consultClient);
  this._affiliationService
    .getAccounts({
      affCompanyId: this.affCompanyId,
      numeroCuenta: this.accountNumber,
      cic: '',
      idcNit: this.Nit,
      isRepresentative: true,
    })
    .subscribe({
      next: (data: GetAccountsResponse[]) => {
        ////console.log("Cuentas -", data);
        this.accounts = data.map((value) => {
          const isMainAccount = value.noAccount === this.accountNumber;
          const isSelected = value.noAccount === this.accountNumber;

          return {
            account: {
              ...value,
              isSelectAff: isSelected,
              isMainAccount: isMainAccount
            },
            selected: isSelected,
          };
        });
        this.changePage(2);
      },
      error: (_) => {
        openNotificationDialog(
          'Error interno, favor comunicarse con Soporte Help Desk a la Linea gratuita 800-10-2244',
          'La solicitud no pudo ser procesada',
          'incorrect',
          'Intentar nuevamente',
          this.dialog
        );
      },
    });
}

onAccountSelectionChange(accountNumber: string, isSelected: boolean) {
  const accountIndex = this.accounts.findIndex(acc => acc.account.noAccount === accountNumber);

  if (accountIndex !== -1) {

    this.accounts[accountIndex].selected = isSelected;
    this.accounts[accountIndex].account.isSelectAff = isSelected;
  }
}


getSignatures() {
  const request: GetFirmantesRequest = {
    affCompanyId: this.affCompanyId,
    nroCuenta: this.accountNumber,
    idc: this.idc,
    typeIdc: this.typeIdc,
    extensionIdc: this.extensionIdc,
    complementIdc: this.complementIdc,
    isRepresentative: true
  }

  this._affiliationService.getSignatures(request).subscribe({
    next: (data: GetSignaturesResponse[]) => {
      this.selectedAccounts = this.accounts.map(accWrapper => {
        const acc = accWrapper.account;

        return {
          /* ...acc,
          isSelectAff: acc.isSelectAff,
          isMainAccount: acc.isMainAccount,
          userRols: acc.userRols && acc.userRols.length > 0
            ? acc.userRols
            : [{
                isAuthorizer: true,
                isController: true,
                isPreparer: true,
                isConsultant: true,
                noAccount: acc.noAccount
              }]
        }; */
         ...acc,
          isSelectAff: acc.isSelectAff,
          isMainAccount: acc.isMainAccount,
          userRols: acc.isSelectAff
            ? [{
                noAccount: acc.noAccount,
                isAuthorizer: true,
                isConsultant: true,
                isController: true,
                isPreparer: true
              }]
            : (acc.userRols && acc.userRols.length > 0
                ? acc.userRols.map(role => ({ ...role })) // 👈 Copiar roles
                : [])
        };

      });
      /* const onlySelectedAccounts = this.selectedAccounts.filter(acc => acc.isSelectAff);
      this.setSelectedAccountsEvent.emit(onlySelectedAccounts);
      this.setSignaturesEvent.emit(data);
      this.changeStepEvent.emit(1); */

      // Hacer copia profunda antes de emitir
      const onlySelectedAccounts = this.selectedAccounts
        .filter(acc => acc.isSelectAff)
        .map(acc => ({
          ...acc,
          userRols: acc.userRols
            ? acc.userRols.map(role => ({ ...role }))
            : []
        }));

      this.setSelectedAccountsEvent.emit(onlySelectedAccounts);
      this.setSignaturesEvent.emit(data);
      this.changeStepEvent.emit(1);

    },
    error: (_) => {
      openNotificationDialog(
        'Error interno, favor comunicarse con Soporte Help Desk a la Linea gratuita 800-10-2244',
        'La solicitud no pudo ser procesada',
        'incorrect',
        'Intentar nuevamente',
        this.dialog
      );
    },
  });
}


}

